import { neon } from '@neondatabase/serverless';
import { logInfo } from '@/lib/server-logger';

let sqlClient: ReturnType<typeof neon> | null = null;
let schemaPromise: Promise<void> | null = null;
let hasLoggedReady = false;

function getDatabaseUrl(): string {
  const databaseUrl =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.neonDB_DATABASE_URL?.trim() ||
    process.env.neonDB_POSTGRES_URL?.trim() ||
    process.env.neonDB_POSTGRES_URL_NON_POOLING?.trim() ||
    process.env.neonDB_POSTGRES_PRISMA_URL?.trim();

  if (!databaseUrl) {
    throw new Error(
      'Missing required environment variable: DATABASE_URL, POSTGRES_URL, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, neonDB_DATABASE_URL, neonDB_POSTGRES_URL, neonDB_POSTGRES_URL_NON_POOLING, or neonDB_POSTGRES_PRISMA_URL'
    );
  }

  return databaseUrl;
}

export function getSql() {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl());
  }

  return sqlClient;
}

export async function ensurePaymentSchema() {
  if (schemaPromise) {
    return schemaPromise;
  }

  const sql = getSql();

  schemaPromise = (async () => {
    await sql.transaction([
      sql`
        CREATE TABLE IF NOT EXISTS payments (
          id text PRIMARY KEY,
          mode text NOT NULL,
          status text NOT NULL,
          amount numeric(12, 2),
          currency text,
          description text,
          recurring_plan_id text,
          paypal_order_id text,
          paypal_order_status text,
          paypal_capture_id text,
          paypal_capture_status text,
          paypal_subscription_id text,
          paypal_subscription_status text,
          payer_email text,
          payer_id text,
          payer_given_name text,
          payer_surname text,
          last_error text,
          environment text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS payment_events (
          id bigserial PRIMARY KEY,
          payment_id text REFERENCES payments(id) ON DELETE SET NULL,
          source text NOT NULL,
          event_type text NOT NULL,
          summary text,
          raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
          provider_event_id text,
          notification_key text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `,
      sql`
        CREATE UNIQUE INDEX IF NOT EXISTS payments_paypal_order_id_unique
        ON payments (paypal_order_id)
        WHERE paypal_order_id IS NOT NULL
      `,
      sql`
        CREATE UNIQUE INDEX IF NOT EXISTS payments_paypal_capture_id_unique
        ON payments (paypal_capture_id)
        WHERE paypal_capture_id IS NOT NULL
      `,
      sql`
        CREATE UNIQUE INDEX IF NOT EXISTS payments_paypal_subscription_id_unique
        ON payments (paypal_subscription_id)
        WHERE paypal_subscription_id IS NOT NULL
      `,
      sql`
        CREATE UNIQUE INDEX IF NOT EXISTS payment_events_provider_event_id_unique
        ON payment_events (provider_event_id)
        WHERE provider_event_id IS NOT NULL
      `,
      sql`
        CREATE UNIQUE INDEX IF NOT EXISTS payment_events_notification_key_unique
        ON payment_events (notification_key)
        WHERE notification_key IS NOT NULL
      `,
      sql`
        CREATE INDEX IF NOT EXISTS payment_events_payment_id_created_at_idx
        ON payment_events (payment_id, created_at DESC)
      `,
    ]);

    if (!hasLoggedReady) {
      hasLoggedReady = true;
      logInfo('payments.storage.database_ready', {
        storage: 'neon_postgres',
      });
    }
  })();

  try {
    await schemaPromise;
  } catch (error) {
    schemaPromise = null;
    throw error;
  }
}
