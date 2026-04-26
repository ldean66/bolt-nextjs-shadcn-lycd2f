import { NextResponse } from 'next/server';
import { getPayPalAccessToken, paypalRequest } from '@/lib/paypal';
import { isMonthlyGivingEnabled } from '@/lib/paypal-config';
import { findPaymentRecordBy, updatePaymentRecord, type PaymentStatus } from '@/lib/payment-store';
import { logError, logInfo } from '@/lib/server-logger';

export const runtime = 'nodejs';

type FinalizeSubscriptionRequest = {
  donationId?: string;
  subscriptionID: string;
};

type SubscriptionDetailsResponse = {
  id?: string;
  status?: string;
  plan_id?: string;
  subscriber?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
};

function mapSubscriptionStatus(status?: string): PaymentStatus {
  switch (status) {
    case 'ACTIVE':
      return 'subscription_active';
    case 'APPROVAL_PENDING':
    case 'APPROVED':
      return 'subscription_created';
    case 'SUSPENDED':
      return 'subscription_suspended';
    case 'CANCELLED':
      return 'subscription_cancelled';
    case 'EXPIRED':
      return 'subscription_expired';
    default:
      return 'subscription_created';
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();
  let paymentRecordId: string | null = null;
  let responseStatus = 500;

  try {
    if (!isMonthlyGivingEnabled()) {
      return NextResponse.json(
        {
          error: 'Monthly giving is currently unavailable.',
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as FinalizeSubscriptionRequest;
    if (!body.subscriptionID) {
      return NextResponse.json({ error: 'subscriptionID is required.' }, { status: 400 });
    }

    const paymentRecord =
      (body.donationId ? await findPaymentRecordBy({ id: body.donationId }) : null) ??
      (await findPaymentRecordBy({ paypalSubscriptionId: body.subscriptionID }));
    paymentRecordId = paymentRecord?.id ?? body.donationId ?? null;

    if (!paymentRecord) {
      responseStatus = 409;
      throw new Error(
        'Donation record not found for this PayPal subscription. Finalization was not attempted.'
      );
    }

    if (
      paymentRecord.paypalSubscriptionId &&
      paymentRecord.paypalSubscriptionId !== body.subscriptionID
    ) {
      responseStatus = 409;
      throw new Error('PayPal subscription ID does not match the existing donation record.');
    }

    const accessToken = await getPayPalAccessToken();
    const subscription = await paypalRequest<SubscriptionDetailsResponse>(
      `/v1/billing/subscriptions/${body.subscriptionID}`,
      'GET',
      accessToken
    );

    const nextStatus = mapSubscriptionStatus(subscription.status);

    const updatedRecord = await updatePaymentRecord(paymentRecord.id, {
      status: nextStatus,
      recurringPlanId: subscription.plan_id ?? paymentRecord.recurringPlanId,
      paypalSubscriptionId: subscription.id ?? body.subscriptionID,
      paypalSubscriptionStatus: subscription.status,
      payer: {
        email: subscription.subscriber?.email_address,
        payerId: subscription.subscriber?.payer_id,
        givenName: subscription.subscriber?.name?.given_name,
        surname: subscription.subscriber?.name?.surname,
      },
      event: {
        type: 'paypal_subscription_finalized',
        source: 'api',
        summary: 'Fetched subscription details after buyer approval.',
        payload: {
          paypalSubscriptionId: subscription.id ?? body.subscriptionID,
          paypalSubscriptionStatus: subscription.status,
          recurringPlanId: subscription.plan_id,
        },
      },
    });

    if (!updatedRecord) {
      throw new Error(
        'Donation record disappeared before the subscription result could be saved.'
      );
    }

    logInfo('paypal.finalize_subscription.success', {
      route: '/api/paypal/finalize-subscription',
      requestId,
      donationId: updatedRecord.id,
      paypalSubscriptionId: subscription.id ?? body.subscriptionID,
      paypalSubscriptionStatus: subscription.status,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(subscription);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';

    if (paymentRecordId) {
      await updatePaymentRecord(paymentRecordId, {
        lastError: details,
        event: {
          type: 'paypal_subscription_finalize_failed',
          source: 'api',
          summary: 'Fetching PayPal subscription details failed after approval.',
          payload: {
            error: details,
          },
        },
      });
    }

    logError('paypal.finalize_subscription.failed', {
      route: '/api/paypal/finalize-subscription',
      requestId,
      donationId: paymentRecordId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';

    return NextResponse.json(
      {
        error: 'Unable to finalize PayPal subscription. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: responseStatus }
    );
  }
}
