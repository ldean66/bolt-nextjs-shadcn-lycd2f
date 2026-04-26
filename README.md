# More Than Conquerors

Next.js site for More Than Conquerors with a production-hardened PayPal donation flow for Vercel.

## PayPal Go-Live Setup

This repo now expects durable Postgres storage for payment records and event history. The app will create the required tables automatically on first use.

Recommended Vercel setup:

1. Add a Neon Postgres database through the Vercel Marketplace.
2. Set sandbox PayPal credentials in `Development` and `Preview`.
3. Set live PayPal credentials only in `Production`.
4. Add a Resend integration or API key for donor receipts and admin alerts.

## Required Environment Variables

Core PayPal:

- `PAYPAL_ENVIRONMENT`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_WEBHOOK_ID`
- `NEXT_PUBLIC_PAYPAL_ENABLE_MONTHLY`

Database:

- `DATABASE_URL` or `POSTGRES_URL`
- or the Vercel/Neon-prefixed vars such as `neonDB_DATABASE_URL`

Site:

- `NEXT_PUBLIC_SITE_URL`

Email notifications:

- `RESEND_API_KEY`
- `PAYPAL_EMAIL_FROM`
- `PAYPAL_ADMIN_ALERT_EMAILS`
  Use one owner email for the simplest setup, or a comma-separated list if more than one person should receive alerts.

Optional:

- `PAYPAL_MONTHLY_PLAN_ID`
- `NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID`
- `PAYPAL_REPLY_TO_EMAIL`
- `PAYPAL_DEBUG_ERRORS`
- `PAYPAL_BASE_URL`

## Production Defaults

- One-time donations are the intended live scope.
- Monthly giving is hidden in production unless `NEXT_PUBLIC_PAYPAL_ENABLE_MONTHLY=true`.
- Preview and local environments default to allowing monthly giving when that flag is omitted.

## Vercel Deployment Notes

- Production webhook URL: `https://<your-domain>/api/paypal/webhook`
- Keep sandbox and live PayPal apps, webhook IDs, and plan IDs fully separate.
- Subscribe live webhooks at minimum to:
  - `PAYMENT.CAPTURE.COMPLETED`
  - `PAYMENT.CAPTURE.DENIED`
  - `PAYMENT.CAPTURE.REFUNDED`
  - `PAYMENT.CAPTURE.REVERSED`
- Keep Vercel Runtime Logs enabled for go-live monitoring.

## Verification Checklist

Preview:

1. Create a sandbox order.
2. Approve and capture it successfully.
3. Confirm a row exists in `payments`.
4. Confirm related rows exist in `payment_events`.
5. Confirm the donor receipt and admin alerts send exactly once.

Production:

1. Deploy with live env vars.
2. Run a single real $1 donation.
3. Confirm PayPal, Postgres, email notifications, and Vercel logs all agree before broader launch.

## Preflight Command

Use the local preflight check before testing or launching:

- `npm run paypal:preflight`
- `npm run paypal:preflight -- --strict-live`

The default mode checks your current local configuration and database connectivity.
The `--strict-live` mode treats live-only requirements such as webhook and email notification env vars as blockers.
