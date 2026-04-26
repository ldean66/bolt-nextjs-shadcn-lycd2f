import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';

const cwd = process.cwd();
const strictLive = process.argv.includes('--strict-live');

function loadEnvFile(filename) {
  const filePath = path.join(cwd, filename);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getFirstEnv(names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }

  return '';
}

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes((value ?? '').trim().toLowerCase());
}

function printSection(title) {
  console.log(`\n${title}`);
}

function printLine(status, label, details = '') {
  const suffix = details ? `: ${details}` : '';
  console.log(`${status} ${label}${suffix}`);
}

loadEnvFile('.env.local');

const errors = [];
const warnings = [];

const paypalEnvironment = (process.env.PAYPAL_ENVIRONMENT ?? 'sandbox').trim().toLowerCase();
const isLive = ['live', 'production', 'prod'].includes(paypalEnvironment);
const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ?? '';
const serverClientId = process.env.PAYPAL_CLIENT_ID?.trim() ?? '';
const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim() ?? '';
const monthlyEnabled = isTruthy(process.env.NEXT_PUBLIC_PAYPAL_ENABLE_MONTHLY);
const monthlyPlanId =
  process.env.PAYPAL_MONTHLY_PLAN_ID?.trim() ??
  process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID?.trim() ??
  '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';
const databaseUrl = getFirstEnv([
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
  'neonDB_DATABASE_URL',
  'neonDB_POSTGRES_URL',
  'neonDB_POSTGRES_URL_NON_POOLING',
  'neonDB_POSTGRES_PRISMA_URL',
]);

printSection('PayPal preflight');
printLine('info', 'mode', strictLive ? 'strict-live' : 'default');
printLine('info', 'paypal environment', isLive ? 'live' : paypalEnvironment || 'sandbox');

if (!serverClientId) {
  errors.push('Missing PAYPAL_CLIENT_ID.');
}

if (!process.env.PAYPAL_CLIENT_SECRET?.trim()) {
  errors.push('Missing PAYPAL_CLIENT_SECRET.');
}

if (!publicClientId) {
  errors.push('Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID.');
}

if (publicClientId && serverClientId && publicClientId !== serverClientId) {
  errors.push('PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID do not match.');
}

if (!siteUrl) {
  errors.push('Missing NEXT_PUBLIC_SITE_URL.');
} else if ((strictLive || isLive) && !siteUrl.startsWith('https://')) {
  errors.push('NEXT_PUBLIC_SITE_URL must use https:// for live readiness.');
}

if (!databaseUrl) {
  errors.push('Missing a database connection string for Neon/Postgres.');
}

if (!webhookId) {
  const message = 'Missing PAYPAL_WEBHOOK_ID. Webhook verification will fail until this is set.';
  if (strictLive) {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

if (strictLive && !isLive) {
  errors.push('PAYPAL_ENVIRONMENT must be live for a go-live check.');
}

if (monthlyEnabled && !monthlyPlanId) {
  errors.push(
    'Monthly giving is enabled, but PAYPAL_MONTHLY_PLAN_ID / NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID is missing.'
  );
}

if (!monthlyEnabled) {
  warnings.push('Monthly giving is disabled. This is expected for the current one-time-only launch.');
}

if (!process.env.RESEND_API_KEY?.trim()) {
  const message = 'Missing RESEND_API_KEY. Donor receipts and admin alerts will not send.';
  if (strictLive) {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

if (!process.env.PAYPAL_EMAIL_FROM?.trim()) {
  const message = 'Missing PAYPAL_EMAIL_FROM. Resend emails cannot be sent.';
  if (strictLive) {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

if (!process.env.PAYPAL_ADMIN_ALERT_EMAILS?.trim()) {
  const message = 'Missing PAYPAL_ADMIN_ALERT_EMAILS. Admin alerts have no recipients.';
  if (strictLive) {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

async function verifyDatabase() {
  if (!databaseUrl) {
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT
        to_regclass('public.payments')::text AS payments_table,
        to_regclass('public.payment_events')::text AS payment_events_table
    `;
    const row = rows[0] ?? {};

    if (row.payments_table !== 'payments') {
      errors.push('Database is reachable, but the payments table is missing.');
    }

    if (row.payment_events_table !== 'payment_events') {
      errors.push('Database is reachable, but the payment_events table is missing.');
    }
  } catch (error) {
    errors.push(
      `Database connection check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

await verifyDatabase();

printSection('Checks');
printLine(serverClientId ? 'ok' : 'error', 'server PayPal client id');
printLine(process.env.PAYPAL_CLIENT_SECRET?.trim() ? 'ok' : 'error', 'server PayPal secret');
printLine(publicClientId ? 'ok' : 'error', 'public PayPal client id');
printLine(
  publicClientId && serverClientId && publicClientId !== serverClientId ? 'error' : 'ok',
  'client id parity'
);
printLine(siteUrl ? 'ok' : 'error', 'site url', siteUrl || 'missing');
printLine(databaseUrl ? 'ok' : 'error', 'database connection string');
printLine(webhookId ? 'ok' : strictLive ? 'error' : 'warn', 'webhook id');
printLine(monthlyEnabled ? 'info' : 'ok', 'monthly giving', monthlyEnabled ? 'enabled' : 'disabled');
printLine(process.env.RESEND_API_KEY?.trim() ? 'ok' : strictLive ? 'error' : 'warn', 'Resend API key');
printLine(
  process.env.PAYPAL_EMAIL_FROM?.trim() ? 'ok' : strictLive ? 'error' : 'warn',
  'email from address'
);
printLine(
  process.env.PAYPAL_ADMIN_ALERT_EMAILS?.trim() ? 'ok' : strictLive ? 'error' : 'warn',
  'admin alert recipients'
);

if (warnings.length > 0) {
  printSection('Warnings');
  for (const warning of warnings) {
    printLine('warn', warning);
  }
}

if (errors.length > 0) {
  printSection('Errors');
  for (const error of errors) {
    printLine('error', error);
  }
  process.exitCode = 1;
} else {
  printSection('Result');
  printLine('ok', 'Preflight passed');
}
