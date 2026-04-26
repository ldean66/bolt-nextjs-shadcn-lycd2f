import type { PaymentRecord } from '@/lib/payment-store';
import {
  hasPaymentEventWithNotificationKey,
  recordPaymentEvent,
} from '@/lib/payment-store';
import { getSiteUrl } from '@/lib/paypal-config';
import { logError, logInfo, logWarn } from '@/lib/server-logger';

type ResendSendResponse = {
  id?: string;
  error?: {
    message?: string;
  };
};

type AdminAlertInput = {
  notificationKey: string;
  subject: string;
  summary: string;
  paymentId?: string | null;
  payload: Record<string, unknown>;
};

type CaptureFailureAlertInput = {
  donationId?: string | null;
  paypalOrderId?: string | null;
  error: string;
  requestId: string;
};

type WebhookVerificationFailureAlertInput = {
  transmissionId: string;
  eventType?: string;
  paypalWebhookEventId?: string;
  error: string;
  requestId: string;
};

function formatPayerName(payment: PaymentRecord): string | null {
  const fullName = [payment.payer?.givenName?.trim(), payment.payer?.surname?.trim()]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatJson(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.PAYPAL_EMAIL_FROM?.trim();
  const replyTo = process.env.PAYPAL_REPLY_TO_EMAIL?.trim();

  if (!apiKey || !from) {
    return null;
  }

  return {
    apiKey,
    from,
    replyTo,
  };
}

function getAdminRecipients(): string[] {
  return (process.env.PAYPAL_ADMIN_ALERT_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}) {
  const config = getResendConfig();
  if (!config) {
    return null;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': input.idempotencyKey,
    },
    body: JSON.stringify({
      from: config.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(config.replyTo ? { reply_to: config.replyTo } : {}),
    }),
  });

  const payload = (await response.json()) as ResendSendResponse;
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || 'Resend email send failed.');
  }

  return payload.id ?? null;
}

function buildDonationReceipt(payment: PaymentRecord) {
  const siteUrl = getSiteUrl();
  const donorName =
    payment.payer?.givenName?.trim() ||
    payment.payer?.email?.trim() ||
    'supporter';
  const amountLabel = payment.amount ? `$${payment.amount}` : 'your donation';
  const captureId = payment.paypalCaptureId ?? 'Unavailable';

  return {
    subject: 'Thank you for supporting More Than Conquerors',
    text: [
      `Hi ${donorName},`,
      '',
      `Thank you for your donation of ${amountLabel} to More Than Conquerors.`,
      `PayPal confirmation: ${captureId}`,
      '',
      `You can learn more about our work at ${siteUrl}.`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h1 style="color: #be185d; font-size: 24px;">Thank you for your donation</h1>
        <p>Hi ${escapeHtml(donorName)},</p>
        <p>We received your donation of <strong>${escapeHtml(amountLabel)}</strong> to More Than Conquerors.</p>
        <p>Your PayPal confirmation ID is <strong>${escapeHtml(captureId)}</strong>.</p>
        <p>Your support helps us continue serving patients, survivors, caregivers, and families affected by breast cancer.</p>
        <p>
          <a href="${escapeHtml(siteUrl)}" style="color: #be185d;">Visit our site</a>
        </p>
      </div>
    `,
  };
}

async function sendAdminAlertIfNeeded(input: AdminAlertInput) {
  try {
    if (await hasPaymentEventWithNotificationKey(input.notificationKey)) {
      return false;
    }

    const recipients = getAdminRecipients();
    const config = getResendConfig();

    if (!config || recipients.length === 0) {
      logWarn('paypal.notifications.admin_alert_skipped', {
        notificationKey: input.notificationKey,
        hasResendConfig: Boolean(config),
        recipientCount: recipients.length,
      });
      return false;
    }

    const prettyPayload = formatJson(input.payload);
    const emailId = await sendResendEmail({
      to: recipients,
      subject: input.subject,
      idempotencyKey: input.notificationKey,
      text: `${input.summary}\n\n${prettyPayload}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h1 style="font-size: 22px; color: #991b1b;">${escapeHtml(input.subject)}</h1>
          <p>${escapeHtml(input.summary)}</p>
          <pre style="padding: 16px; background: #f3f4f6; border-radius: 8px; overflow: auto;">${escapeHtml(prettyPayload)}</pre>
        </div>
      `,
    });

    await recordPaymentEvent({
      paymentId: input.paymentId ?? null,
      source: 'system',
      type: 'admin_alert_sent',
      summary: input.summary,
      notificationKey: input.notificationKey,
      payload: {
        ...input.payload,
        emailId,
        subject: input.subject,
        recipients,
      },
    });

    logInfo('paypal.notifications.admin_alert_sent', {
      notificationKey: input.notificationKey,
      paymentId: input.paymentId ?? null,
      recipientCount: recipients.length,
    });

    return true;
  } catch (error) {
    logError('paypal.notifications.admin_alert_failed', {
      notificationKey: input.notificationKey,
      paymentId: input.paymentId ?? null,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

export async function sendDonationReceiptIfNeeded(payment: PaymentRecord) {
  try {
    if (payment.status !== 'capture_completed' || !payment.paypalCaptureId) {
      return false;
    }

    if (!payment.payer?.email) {
      logWarn('paypal.notifications.receipt_skipped_missing_email', {
        donationId: payment.id,
        paypalCaptureId: payment.paypalCaptureId,
      });
      return false;
    }

    const notificationKey = `donor-receipt:${payment.paypalCaptureId}`;
    if (await hasPaymentEventWithNotificationKey(notificationKey)) {
      return false;
    }

    const config = getResendConfig();
    if (!config) {
      logWarn('paypal.notifications.receipt_skipped_missing_resend_config', {
        donationId: payment.id,
        paypalCaptureId: payment.paypalCaptureId,
      });
      return false;
    }

    const receipt = buildDonationReceipt(payment);
    const emailId = await sendResendEmail({
      to: payment.payer.email,
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
      idempotencyKey: notificationKey,
    });

    await recordPaymentEvent({
      paymentId: payment.id,
      source: 'system',
      type: 'donor_receipt_sent',
      summary: 'Sent donor donation receipt email.',
      notificationKey,
      payload: {
        emailId,
        to: payment.payer.email,
        paypalCaptureId: payment.paypalCaptureId,
      },
    });

    logInfo('paypal.notifications.receipt_sent', {
      donationId: payment.id,
      paypalCaptureId: payment.paypalCaptureId,
      recipient: payment.payer.email,
    });

    return true;
  } catch (error) {
    logError('paypal.notifications.receipt_failed', {
      donationId: payment.id,
      paypalCaptureId: payment.paypalCaptureId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

export async function sendSuccessfulDonationAlertIfNeeded(payment: PaymentRecord) {
  if (payment.status !== 'capture_completed' || !payment.paypalCaptureId) {
    return false;
  }

  return sendAdminAlertIfNeeded({
    notificationKey: `admin-capture-success:${payment.paypalCaptureId}`,
    subject: 'PayPal donation received',
    summary: 'A PayPal donation was captured successfully.',
    paymentId: payment.id,
    payload: {
      donationId: payment.id,
      paypalOrderId: payment.paypalOrderId,
      paypalOrderStatus: payment.paypalOrderStatus,
      paypalCaptureId: payment.paypalCaptureId,
      paypalCaptureStatus: payment.paypalCaptureStatus,
      amount: payment.amount,
      currency: payment.currency,
      environment: payment.environment,
      payerEmail: payment.payer?.email ?? null,
      payerName: formatPayerName(payment),
      mode: payment.mode,
      description: payment.description,
      updatedAt: payment.updatedAt,
    },
  });
}

export async function sendCaptureFailureAlertIfNeeded(input: CaptureFailureAlertInput) {
  return sendAdminAlertIfNeeded({
    notificationKey: `admin-capture-failed:${input.paypalOrderId ?? input.donationId ?? input.requestId}`,
    subject: 'PayPal capture failure requires review',
    summary: 'Capturing an approved PayPal donation failed or was blocked before capture.',
    paymentId: input.donationId ?? null,
    payload: {
      donationId: input.donationId ?? null,
      paypalOrderId: input.paypalOrderId ?? null,
      error: input.error,
      requestId: input.requestId,
    },
  });
}

export async function sendWebhookVerificationFailureAlertIfNeeded(
  input: WebhookVerificationFailureAlertInput
) {
  return sendAdminAlertIfNeeded({
    notificationKey: `admin-webhook-verification-failed:${input.transmissionId}`,
    subject: 'PayPal webhook verification failed',
    summary: 'A PayPal webhook was rejected because signature verification failed.',
    payload: {
      transmissionId: input.transmissionId,
      eventType: input.eventType ?? null,
      paypalWebhookEventId: input.paypalWebhookEventId ?? null,
      error: input.error,
      requestId: input.requestId,
    },
  });
}
