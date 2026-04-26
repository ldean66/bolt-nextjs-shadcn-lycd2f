import { NextResponse } from 'next/server';
import {
  getPayPalAccessToken,
  getPayPalWebhookId,
  paypalRequest,
} from '@/lib/paypal';
import { sendWebhookVerificationFailureAlertIfNeeded } from '@/lib/paypal-notifications';
import {
  findPaymentRecordBy,
  recordPaymentEvent,
  updatePaymentRecord,
  type PaymentStatus,
} from '@/lib/payment-store';
import { logError, logInfo, logWarn } from '@/lib/server-logger';

export const runtime = 'nodejs';

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  summary?: string;
  resource?: Record<string, unknown>;
};

type VerifyWebhookResponse = {
  verification_status?: 'SUCCESS' | 'FAILURE';
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getNestedRecord(value: unknown, keys: string[]): Record<string, unknown> | null {
  let current: unknown = value;

  for (const key of keys) {
    if (!isRecord(current)) {
      return null;
    }

    current = current[key];
  }

  return isRecord(current) ? current : null;
}

function getNestedString(value: unknown, keys: string[]): string | undefined {
  let current: unknown = value;

  for (const key of keys) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[key];
  }

  return typeof current === 'string' ? current : undefined;
}

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

function mapWebhookEventToStatus(eventType?: string, resourceStatus?: string): PaymentStatus | null {
  switch (eventType) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      return 'capture_completed';
    case 'PAYMENT.CAPTURE.DENIED':
      return 'capture_denied';
    case 'PAYMENT.CAPTURE.REFUNDED':
    case 'PAYMENT.CAPTURE.REVERSED':
      return 'capture_reversed';
    case 'BILLING.SUBSCRIPTION.CREATED':
      return 'subscription_created';
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      return 'subscription_active';
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      return 'subscription_cancelled';
    case 'BILLING.SUBSCRIPTION.SUSPENDED':
      return 'subscription_suspended';
    case 'BILLING.SUBSCRIPTION.EXPIRED':
      return 'subscription_expired';
    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
      return 'subscription_payment_failed';
    case 'PAYMENT.SALE.COMPLETED':
      return 'subscription_payment_completed';
    case 'PAYMENT.SALE.DENIED':
      return 'subscription_payment_failed';
    case 'PAYMENT.SALE.REFUNDED':
    case 'PAYMENT.SALE.REVERSED':
      return 'subscription_reversed';
    default:
      return resourceStatus ? mapSubscriptionStatus(resourceStatus) : null;
  }
}

function requireHeader(request: Request, name: string): string {
  const value = request.headers.get(name);
  if (!value) {
    throw new Error(`Missing PayPal webhook header: ${name}`);
  }

  return value;
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? crypto.randomUUID();
  let responseStatus = 500;

  try {
    const rawBody = await request.text();
    const webhookEvent = JSON.parse(rawBody) as PayPalWebhookEvent;
    const webhookId = getPayPalWebhookId();

    const transmissionId = requireHeader(request, 'paypal-transmission-id');
    const transmissionTime = requireHeader(request, 'paypal-transmission-time');
    const transmissionSig = requireHeader(request, 'paypal-transmission-sig');
    const authAlgo = requireHeader(request, 'paypal-auth-algo');
    const certUrl = requireHeader(request, 'paypal-cert-url');
    const webhookHeaders = {
      'paypal-transmission-id': transmissionId,
      'paypal-transmission-time': transmissionTime,
      'paypal-transmission-sig': transmissionSig,
      'paypal-auth-algo': authAlgo,
      'paypal-cert-url': certUrl,
    };

    const accessToken = await getPayPalAccessToken();
    const verification = await paypalRequest<VerifyWebhookResponse>(
      '/v1/notifications/verify-webhook-signature',
      'POST',
      accessToken,
      {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }
    );

    if (verification.verification_status !== 'SUCCESS') {
      await recordPaymentEvent({
        source: 'system',
        type: 'paypal_webhook_verification_failed',
        summary: 'Rejected PayPal webhook because signature verification failed.',
        providerEventId: webhookEvent.id,
        payload: {
          headers: webhookHeaders,
          webhookEvent,
          rawBody,
        },
      });

      logError('paypal.webhook.verification_failed', {
        route: '/api/paypal/webhook',
        requestId,
        eventType: webhookEvent.event_type,
        paypalWebhookEventId: webhookEvent.id,
        durationMs: Date.now() - startedAt,
      });

      await sendWebhookVerificationFailureAlertIfNeeded({
        transmissionId,
        eventType: webhookEvent.event_type,
        paypalWebhookEventId: webhookEvent.id,
        error: 'Webhook verification failed.',
        requestId,
      });

      return NextResponse.json({ error: 'Webhook verification failed.' }, { status: 400 });
    }

    const resource = isRecord(webhookEvent.resource) ? webhookEvent.resource : {};
    const donationId = getNestedString(resource, ['custom_id']);
    const resourceId = getNestedString(resource, ['id']);
    const orderId =
      getNestedString(resource, ['supplementary_data', 'related_ids', 'order_id']) ??
      getNestedString(resource, ['invoice_id']);
    const subscriptionId =
      getNestedString(resource, ['billing_agreement_id']) ??
      getNestedString(resource, ['supplementary_data', 'related_ids', 'subscription_id']) ??
      (webhookEvent.event_type?.startsWith('BILLING.SUBSCRIPTION') ? resourceId : undefined);
    const resourceStatus = getNestedString(resource, ['status']);
    const mappedStatus = mapWebhookEventToStatus(webhookEvent.event_type, resourceStatus);
    const paymentRecord =
      (donationId ? await findPaymentRecordBy({ id: donationId }) : null) ??
      (orderId ? await findPaymentRecordBy({ paypalOrderId: orderId }) : null) ??
      (subscriptionId ? await findPaymentRecordBy({ paypalSubscriptionId: subscriptionId }) : null);

    await recordPaymentEvent({
      paymentId: paymentRecord?.id ?? null,
      source: 'webhook',
      type: webhookEvent.event_type ?? 'paypal_webhook_received',
      summary: webhookEvent.summary ?? 'Processed PayPal webhook event.',
      providerEventId: webhookEvent.id,
      payload: {
        headers: webhookHeaders,
        webhookEvent,
        donationId,
        paypalOrderId: orderId,
        paypalSubscriptionId: subscriptionId,
        paypalResourceId: resourceId,
        resourceStatus,
      },
    });

    if (!paymentRecord) {
      logWarn('paypal.webhook.unmatched', {
        route: '/api/paypal/webhook',
        requestId,
        eventType: webhookEvent.event_type,
        paypalWebhookEventId: webhookEvent.id,
        donationId,
        paypalOrderId: orderId,
        paypalSubscriptionId: subscriptionId,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({ received: true });
    }

    const payerInfo = getNestedRecord(resource, ['subscriber']);

    const updatedRecord = await updatePaymentRecord(paymentRecord.id, {
      status: mappedStatus ?? paymentRecord.status,
      paypalOrderId: orderId ?? paymentRecord.paypalOrderId,
      paypalCaptureId:
        webhookEvent.event_type?.startsWith('PAYMENT.CAPTURE') === true
          ? resourceId ?? paymentRecord.paypalCaptureId
          : paymentRecord.paypalCaptureId,
      paypalCaptureStatus:
        webhookEvent.event_type?.startsWith('PAYMENT.CAPTURE') === true
          ? resourceStatus ?? paymentRecord.paypalCaptureStatus
          : paymentRecord.paypalCaptureStatus,
      paypalSubscriptionId: subscriptionId ?? paymentRecord.paypalSubscriptionId,
      paypalSubscriptionStatus:
        subscriptionId && webhookEvent.event_type?.startsWith('BILLING.SUBSCRIPTION')
          ? resourceStatus ?? paymentRecord.paypalSubscriptionStatus
          : paymentRecord.paypalSubscriptionStatus,
      payer: payerInfo
        ? {
            email: getNestedString(payerInfo, ['email_address']),
            payerId: getNestedString(payerInfo, ['payer_id']),
            givenName: getNestedString(payerInfo, ['name', 'given_name']),
            surname: getNestedString(payerInfo, ['name', 'surname']),
          }
        : paymentRecord.payer,
    });

    if (!updatedRecord) {
      throw new Error('Donation record disappeared before the webhook update could be saved.');
    }

    logInfo('paypal.webhook.processed', {
      route: '/api/paypal/webhook',
      requestId,
      donationId: updatedRecord.id,
      eventType: webhookEvent.event_type,
      paypalWebhookEventId: webhookEvent.id,
      paypalOrderId: orderId,
      paypalSubscriptionId: subscriptionId,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';
    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message.startsWith('Missing PayPal webhook header'))
    ) {
      responseStatus = 400;
    }

    logError('paypal.webhook.failed', {
      route: '/api/paypal/webhook',
      requestId,
      error: details,
      durationMs: Date.now() - startedAt,
    });

    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';

    return NextResponse.json(
      {
        error: 'Unable to process PayPal webhook.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: responseStatus }
    );
  }
}
