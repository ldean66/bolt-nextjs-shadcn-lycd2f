import { NextResponse } from 'next/server';
import { createPaymentRecord } from '@/lib/payment-store';
import { getPayPalMonthlyPlanId } from '@/lib/paypal';
import { isMonthlyGivingEnabled } from '@/lib/paypal-config';
import { logError, logInfo, logWarn } from '@/lib/server-logger';

export const runtime = 'nodejs';

type CreateSubscriptionResponse = {
  donationId: string;
  planId: string;
};

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();

  try {
    if (!isMonthlyGivingEnabled()) {
      logWarn('paypal.create_subscription.disabled', {
        route: '/api/paypal/create-subscription',
        requestId,
      });

      return NextResponse.json(
        {
          error: 'Monthly giving is currently unavailable.',
        },
        { status: 403 }
      );
    }

    const planId = getPayPalMonthlyPlanId();
    const donationId = crypto.randomUUID();

    await createPaymentRecord({
      id: donationId,
      mode: 'monthly',
      status: 'draft',
      recurringPlanId: planId,
      description: 'Monthly recurring donation',
      initialEvent: {
        type: 'subscription_draft_created',
        source: 'api',
        summary: 'Prepared recurring donation record before creating a PayPal subscription.',
        payload: {
          recurringPlanId: planId,
        },
      },
    });

    logInfo('paypal.create_subscription.start', {
      route: '/api/paypal/create-subscription',
      requestId,
      donationId,
      recurringPlanId: planId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      donationId,
      planId,
    } satisfies CreateSubscriptionResponse);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';

    logError('paypal.create_subscription.failed', {
      route: '/api/paypal/create-subscription',
      requestId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';

    return NextResponse.json(
      {
        error: 'Unable to prepare PayPal subscription. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: 500 }
    );
  }
}
