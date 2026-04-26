import { NextResponse } from 'next/server';
import {
  createPayPalRequestId,
  getPayPalAccessToken,
  paypalRequest,
} from '@/lib/paypal';
import {
  sendCaptureFailureAlertIfNeeded,
  sendDonationReceiptIfNeeded,
  sendSuccessfulDonationAlertIfNeeded,
} from '@/lib/paypal-notifications';
import { findPaymentRecordBy, type PaymentRecord, updatePaymentRecord } from '@/lib/payment-store';
import { logError, logInfo } from '@/lib/server-logger';

export const runtime = 'nodejs';

type CaptureOrderRequest = {
  orderID: string;
  donationId?: string;
};

type CaptureOrderResponse = {
  id?: string;
  status?: string;
  payer?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
        amount?: {
          value?: string;
          currency_code?: string;
        };
      }>;
    };
  }>;
};

function buildStoredCaptureResponse(paymentRecord: PaymentRecord): CaptureOrderResponse {
  return {
    id: paymentRecord.paypalOrderId,
    status: paymentRecord.paypalOrderStatus ?? 'COMPLETED',
    payer: paymentRecord.payer
      ? {
          payer_id: paymentRecord.payer.payerId,
          email_address: paymentRecord.payer.email,
          name:
            paymentRecord.payer.givenName || paymentRecord.payer.surname
              ? {
                  given_name: paymentRecord.payer.givenName,
                  surname: paymentRecord.payer.surname,
                }
              : undefined,
        }
      : undefined,
    purchase_units: paymentRecord.paypalCaptureId
      ? [
          {
            payments: {
              captures: [
                {
                  id: paymentRecord.paypalCaptureId,
                  status: paymentRecord.paypalCaptureStatus ?? 'COMPLETED',
                  amount:
                    paymentRecord.amount && paymentRecord.currency
                      ? {
                          value: paymentRecord.amount,
                          currency_code: paymentRecord.currency,
                        }
                      : undefined,
                },
              ],
            },
          },
        ]
      : undefined,
  };
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();
  let paymentRecordId: string | null = null;
  let paypalOrderId: string | null = null;
  let responseStatus = 500;

  try {
    const body = (await request.json()) as CaptureOrderRequest;

    if (!body.orderID) {
      return NextResponse.json({ error: 'orderID is required.' }, { status: 400 });
    }

    paypalOrderId = body.orderID;
    const paymentRecord =
      (body.donationId ? await findPaymentRecordBy({ id: body.donationId }) : null) ??
      (await findPaymentRecordBy({ paypalOrderId: body.orderID }));
    paymentRecordId = paymentRecord?.id ?? body.donationId ?? null;

    if (!paymentRecord) {
      responseStatus = 409;
      throw new Error(
        'Donation record not found for the approved PayPal order. Capture was not attempted.'
      );
    }

    if (paymentRecord.paypalOrderId && paymentRecord.paypalOrderId !== body.orderID) {
      responseStatus = 409;
      throw new Error('PayPal order ID does not match the existing donation record.');
    }

    if (paymentRecord.status === 'capture_completed' && paymentRecord.paypalCaptureId) {
      await sendDonationReceiptIfNeeded(paymentRecord);
      await sendSuccessfulDonationAlertIfNeeded(paymentRecord);

      logInfo('paypal.capture_order.already_completed', {
        route: '/api/paypal/capture-order',
        requestId,
        donationId: paymentRecord.id,
        paypalOrderId: paymentRecord.paypalOrderId,
        paypalCaptureId: paymentRecord.paypalCaptureId,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json(buildStoredCaptureResponse(paymentRecord));
    }

    const accessToken = await getPayPalAccessToken();
    const capture = await paypalRequest<CaptureOrderResponse>(
      `/v2/checkout/orders/${body.orderID}/capture`,
      'POST',
      accessToken,
      undefined,
      {
        requestId: createPayPalRequestId(`capture-order-${paymentRecord?.id ?? body.orderID}`),
      }
    );

    const latestCapture = capture.purchase_units?.[0]?.payments?.captures?.[0];
    if (capture.status !== 'COMPLETED' || latestCapture?.status !== 'COMPLETED') {
      throw new Error(
        `Unexpected PayPal capture status. order_status=${capture.status ?? 'unknown'} capture_status=${latestCapture?.status ?? 'unknown'}`
      );
    }

    const updatedRecord = await updatePaymentRecord(paymentRecord.id, {
      status: 'capture_completed',
      paypalOrderId: body.orderID,
      paypalOrderStatus: capture.status,
      paypalCaptureId: latestCapture.id,
      paypalCaptureStatus: latestCapture.status,
      payer: {
        email: capture.payer?.email_address,
        payerId: capture.payer?.payer_id,
        givenName: capture.payer?.name?.given_name,
        surname: capture.payer?.name?.surname,
      },
      event: {
        type: 'paypal_order_captured',
        source: 'api',
        summary: 'Captured one-time donation after buyer approval.',
        payload: {
          paypalOrderId: body.orderID,
          paypalCaptureId: latestCapture.id,
          amount: latestCapture.amount?.value,
          currency: latestCapture.amount?.currency_code,
        },
      },
    });

    if (!updatedRecord) {
      throw new Error('Donation record disappeared before the capture result could be saved.');
    }

    await sendDonationReceiptIfNeeded(updatedRecord);
    await sendSuccessfulDonationAlertIfNeeded(updatedRecord);

    logInfo('paypal.capture_order.success', {
      route: '/api/paypal/capture-order',
      requestId,
      donationId: paymentRecord.id,
      paypalOrderId: body.orderID,
      paypalCaptureId: latestCapture.id,
      payerEmail: capture.payer?.email_address,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(capture);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';

    if (paymentRecordId) {
      await updatePaymentRecord(paymentRecordId, {
        status: 'capture_failed',
        lastError: details,
        event: {
          type: 'paypal_order_capture_failed',
          source: 'api',
          summary: 'Capturing the PayPal order failed.',
          payload: {
            error: details,
          },
        },
      });
    }

    logError('paypal.capture_order.failed', {
      route: '/api/paypal/capture-order',
      requestId,
      donationId: paymentRecordId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    await sendCaptureFailureAlertIfNeeded({
      donationId: paymentRecordId,
      paypalOrderId,
      error: details,
      requestId,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';
    return NextResponse.json(
      {
        error: 'Unable to capture PayPal payment. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: responseStatus }
    );
  }
}
