import { NextResponse } from 'next/server';
import {
  createPayPalRequestId,
  getPayPalAccessToken,
  normalizeAmount,
  paypalRequest,
} from '@/lib/paypal';
import { createPaymentRecord, updatePaymentRecord } from '@/lib/payment-store';
import { logError, logInfo } from '@/lib/server-logger';

export const runtime = 'nodejs';

type CreateOrderRequest = {
  amount: string;
  currency?: string;
  description?: string;
};

type CreateOrderResponse = {
  id?: string;
  status?: string;
};

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();
  let donationId: string | null = null;

  try {
    const body = (await request.json()) as CreateOrderRequest;
    const amount = normalizeAmount(body.amount);
    const currency = (body.currency ?? 'USD').toUpperCase();
    const description = body.description ?? 'Donation to Support Our Cause';
    donationId = crypto.randomUUID();

    await createPaymentRecord({
      id: donationId,
      mode: 'one_time',
      status: 'draft',
      amount,
      currency,
      description,
      initialEvent: {
        type: 'one_time_draft_created',
        source: 'api',
        summary: 'Prepared one-time donation record before creating a PayPal order.',
        payload: {
          amount,
          currency,
        },
      },
    });

    logInfo('paypal.create_order.start', {
      route: '/api/paypal/create-order',
      requestId,
      donationId,
      amount,
      currency,
    });

    const accessToken = await getPayPalAccessToken();
    const order = await paypalRequest<CreateOrderResponse>(
      '/v2/checkout/orders',
      'POST',
      accessToken,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            custom_id: donationId,
            invoice_id: donationId,
            amount: {
              currency_code: currency,
              value: amount,
            },
            description,
          },
        ],
      },
      {
        requestId: createPayPalRequestId(`create-order-${donationId}`),
      }
    );

    if (!order.id) {
      throw new Error('PayPal order ID was not returned.');
    }

    await updatePaymentRecord(donationId, {
      status: 'order_created',
      paypalOrderId: order.id,
      paypalOrderStatus: order.status,
      event: {
        type: 'paypal_order_created',
        source: 'api',
        summary: 'Created PayPal order for one-time donation.',
        payload: {
          paypalOrderId: order.id,
          paypalOrderStatus: order.status,
        },
      },
    });

    logInfo('paypal.create_order.success', {
      route: '/api/paypal/create-order',
      requestId,
      donationId,
      paypalOrderId: order.id,
      paypalOrderStatus: order.status,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ id: order.id, donationId });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';
    if (donationId) {
      await updatePaymentRecord(donationId, {
        status: 'create_failed',
        lastError: details,
        event: {
          type: 'paypal_order_create_failed',
          source: 'api',
          summary: 'Creating the PayPal order failed.',
          payload: {
            error: details,
          },
        },
      });
    }

    logError('paypal.create_order.failed', {
      route: '/api/paypal/create-order',
      requestId,
      donationId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';
    return NextResponse.json(
      {
        error: 'Unable to create PayPal order. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: 500 }
    );
  }
}
