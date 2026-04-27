import { NextResponse } from 'next/server';
import { findPaymentRecordBy, updatePaymentRecord } from '@/lib/payment-store';
import { logInfo, logWarn } from '@/lib/server-logger';

export const runtime = 'nodejs';

type CancelCheckoutRequest = {
  donationId?: string;
  orderID?: string;
  subscriptionID?: string;
  mode?: 'one_time' | 'monthly';
  reason?: 'paypal_cancelled' | 'user_dismissed';
};

const COMPLETED_STATUSES = new Set([
  'capture_completed',
  'subscription_active',
  'subscription_payment_completed',
]);

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();

  try {
    const body = (await request.json()) as CancelCheckoutRequest;
    const reason = body.reason ?? 'paypal_cancelled';
    const paymentRecord =
      (body.donationId ? await findPaymentRecordBy({ id: body.donationId }) : null) ??
      (body.orderID ? await findPaymentRecordBy({ paypalOrderId: body.orderID }) : null) ??
      (body.subscriptionID
        ? await findPaymentRecordBy({ paypalSubscriptionId: body.subscriptionID })
        : null);

    if (!paymentRecord) {
      logWarn('paypal.cancel_checkout.missing_record', {
        route: '/api/paypal/cancel-checkout',
        requestId,
        donationId: body.donationId ?? null,
        paypalOrderId: body.orderID ?? null,
        paypalSubscriptionId: body.subscriptionID ?? null,
        reason,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({ cancelled: false, ignored: true }, { status: 404 });
    }

    if (COMPLETED_STATUSES.has(paymentRecord.status)) {
      logInfo('paypal.cancel_checkout.ignored_completed', {
        route: '/api/paypal/cancel-checkout',
        requestId,
        donationId: paymentRecord.id,
        status: paymentRecord.status,
        reason,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({ cancelled: false, ignored: true });
    }

    const updatedRecord = await updatePaymentRecord(paymentRecord.id, {
      status: 'checkout_cancelled',
      paypalOrderId: body.orderID ?? paymentRecord.paypalOrderId,
      paypalSubscriptionId: body.subscriptionID ?? paymentRecord.paypalSubscriptionId,
      paypalOrderStatus:
        body.mode === 'one_time' || paymentRecord.mode === 'one_time'
          ? 'CANCELLED'
          : paymentRecord.paypalOrderStatus,
      paypalSubscriptionStatus:
        body.mode === 'monthly' || paymentRecord.mode === 'monthly'
          ? 'CANCELLED'
          : paymentRecord.paypalSubscriptionStatus,
      event: {
        type: 'paypal_checkout_cancelled',
        source: 'api',
        summary:
          reason === 'user_dismissed'
            ? 'User dismissed the donation checkout before completion.'
            : 'Buyer cancelled the PayPal checkout before completion.',
        payload: {
          reason,
          paypalOrderId: body.orderID ?? paymentRecord.paypalOrderId ?? null,
          paypalSubscriptionId:
            body.subscriptionID ?? paymentRecord.paypalSubscriptionId ?? null,
        },
      },
    });

    logInfo('paypal.cancel_checkout.recorded', {
      route: '/api/paypal/cancel-checkout',
      requestId,
      donationId: updatedRecord?.id ?? paymentRecord.id,
      status: updatedRecord?.status ?? paymentRecord.status,
      reason,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ cancelled: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';

    logWarn('paypal.cancel_checkout.failed', {
      route: '/api/paypal/cancel-checkout',
      requestId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';

    return NextResponse.json(
      {
        error: 'Unable to record PayPal checkout cancellation.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: 500 }
    );
  }
}
