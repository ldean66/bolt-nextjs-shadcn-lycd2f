import { ensurePaymentSchema, getSql } from '@/lib/database';
import { getPayPalEnvironmentName } from '@/lib/paypal';

export type PaymentMode = 'one_time' | 'monthly';

export type PaymentStatus =
  | 'draft'
  | 'order_created'
  | 'checkout_cancelled'
  | 'capture_completed'
  | 'capture_denied'
  | 'capture_reversed'
  | 'create_failed'
  | 'capture_failed'
  | 'subscription_created'
  | 'subscription_active'
  | 'subscription_cancelled'
  | 'subscription_suspended'
  | 'subscription_expired'
  | 'subscription_payment_completed'
  | 'subscription_payment_failed'
  | 'subscription_reversed'
  | 'webhook_received'
  | 'verification_failed';

export type PaymentEvent = {
  type: string;
  at: string;
  source: 'api' | 'webhook' | 'system';
  summary?: string;
  payload?: Record<string, unknown>;
};

export type PaymentRecord = {
  id: string;
  mode: PaymentMode;
  status: PaymentStatus;
  amount?: string;
  currency?: string;
  description?: string;
  recurringPlanId?: string;
  paypalOrderId?: string;
  paypalOrderStatus?: string;
  paypalCaptureId?: string;
  paypalCaptureStatus?: string;
  paypalSubscriptionId?: string;
  paypalSubscriptionStatus?: string;
  payer?: {
    email?: string;
    payerId?: string;
    givenName?: string;
    surname?: string;
  };
  lastError?: string;
  environment: 'sandbox' | 'live';
  createdAt: string;
  updatedAt: string;
  events: PaymentEvent[];
};

type CreatePaymentRecordInput = {
  id: string;
  mode: PaymentMode;
  status: PaymentStatus;
  amount?: string;
  currency?: string;
  description?: string;
  recurringPlanId?: string;
  paypalOrderId?: string;
  paypalOrderStatus?: string;
  paypalSubscriptionId?: string;
  paypalSubscriptionStatus?: string;
  payer?: PaymentRecord['payer'];
  lastError?: string;
  initialEvent?: Omit<PaymentEvent, 'at'>;
};

type UpdatePaymentRecordInput = Partial<
  Omit<PaymentRecord, 'id' | 'mode' | 'createdAt' | 'updatedAt' | 'environment' | 'events'>
> & {
  event?: Omit<PaymentEvent, 'at'>;
};

type PaymentRecordRow = {
  id: string;
  mode: PaymentMode;
  status: PaymentStatus;
  amount: string | null;
  currency: string | null;
  description: string | null;
  recurringPlanId: string | null;
  paypalOrderId: string | null;
  paypalOrderStatus: string | null;
  paypalCaptureId: string | null;
  paypalCaptureStatus: string | null;
  paypalSubscriptionId: string | null;
  paypalSubscriptionStatus: string | null;
  payerEmail: string | null;
  payerId: string | null;
  payerGivenName: string | null;
  payerSurname: string | null;
  lastError: string | null;
  environment: string;
  createdAt: string;
  updatedAt: string;
};

type PaymentEventRow = {
  type: string;
  at: string;
  source: PaymentEvent['source'];
  summary: string | null;
  payload: unknown;
};

type RecordPaymentEventInput = {
  paymentId?: string | null;
  source: PaymentEvent['source'];
  type: string;
  summary?: string;
  payload?: Record<string, unknown>;
  providerEventId?: string;
  notificationKey?: string;
  at?: string;
};

function serializePayload(payload?: Record<string, unknown>) {
  return JSON.stringify(payload ?? {});
}

function parsePayload(raw: unknown): Record<string, unknown> | undefined {
  if (!raw) {
    return undefined;
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : undefined;
    } catch {
      return undefined;
    }
  }

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }

  return undefined;
}

function mapPaymentEvent(row: PaymentEventRow): PaymentEvent {
  return {
    type: row.type,
    at: row.at,
    source: row.source,
    summary: row.summary ?? undefined,
    payload: parsePayload(row.payload),
  };
}

function mapPaymentRecord(row: PaymentRecordRow, events: PaymentEvent[]): PaymentRecord {
  const payer = [row.payerEmail, row.payerId, row.payerGivenName, row.payerSurname].some(Boolean)
    ? {
        email: row.payerEmail ?? undefined,
        payerId: row.payerId ?? undefined,
        givenName: row.payerGivenName ?? undefined,
        surname: row.payerSurname ?? undefined,
      }
    : undefined;

  return {
    id: row.id,
    mode: row.mode,
    status: row.status,
    amount: row.amount ?? undefined,
    currency: row.currency ?? undefined,
    description: row.description ?? undefined,
    recurringPlanId: row.recurringPlanId ?? undefined,
    paypalOrderId: row.paypalOrderId ?? undefined,
    paypalOrderStatus: row.paypalOrderStatus ?? undefined,
    paypalCaptureId: row.paypalCaptureId ?? undefined,
    paypalCaptureStatus: row.paypalCaptureStatus ?? undefined,
    paypalSubscriptionId: row.paypalSubscriptionId ?? undefined,
    paypalSubscriptionStatus: row.paypalSubscriptionStatus ?? undefined,
    payer,
    lastError: row.lastError ?? undefined,
    environment: row.environment === 'live' ? 'live' : 'sandbox',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    events,
  };
}

async function getPaymentEvents(paymentId: string) {
  await ensurePaymentSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      event_type AS "type",
      created_at::text AS "at",
      source,
      summary,
      raw_payload AS "payload"
    FROM payment_events
    WHERE payment_id = ${paymentId}
    ORDER BY created_at ASC, id ASC
  `) as PaymentEventRow[];

  return rows.map(mapPaymentEvent);
}

async function getPaymentRecordFromQuery(query: Promise<unknown>) {
  await ensurePaymentSchema();
  const rows = (await query) as PaymentRecordRow[];
  const row = rows[0];

  if (!row) {
    return null;
  }

  const events = await getPaymentEvents(row.id);
  return mapPaymentRecord(row, events);
}

function buildEventInsertQuery(input: RecordPaymentEventInput) {
  const sql = getSql();
  const payload = serializePayload(input.payload);
  const createdAt = input.at ?? new Date().toISOString();

  if (input.providerEventId) {
    return sql`
      INSERT INTO payment_events (
        payment_id,
        source,
        event_type,
        summary,
        raw_payload,
        provider_event_id,
        notification_key,
        created_at
      )
      VALUES (
        ${input.paymentId ?? null},
        ${input.source},
        ${input.type},
        ${input.summary ?? null},
        ${payload}::jsonb,
        ${input.providerEventId},
        ${input.notificationKey ?? null},
        ${createdAt}
      )
      ON CONFLICT (provider_event_id) DO UPDATE
      SET
        payment_id = COALESCE(payment_events.payment_id, EXCLUDED.payment_id),
        source = EXCLUDED.source,
        event_type = EXCLUDED.event_type,
        summary = COALESCE(EXCLUDED.summary, payment_events.summary),
        raw_payload = EXCLUDED.raw_payload,
        notification_key = COALESCE(payment_events.notification_key, EXCLUDED.notification_key)
    `;
  }

  if (input.notificationKey) {
    return sql`
      INSERT INTO payment_events (
        payment_id,
        source,
        event_type,
        summary,
        raw_payload,
        provider_event_id,
        notification_key,
        created_at
      )
      VALUES (
        ${input.paymentId ?? null},
        ${input.source},
        ${input.type},
        ${input.summary ?? null},
        ${payload}::jsonb,
        ${input.providerEventId ?? null},
        ${input.notificationKey},
        ${createdAt}
      )
      ON CONFLICT (notification_key) DO NOTHING
    `;
  }

  return sql`
    INSERT INTO payment_events (
      payment_id,
      source,
      event_type,
      summary,
      raw_payload,
      provider_event_id,
      notification_key,
      created_at
    )
    VALUES (
      ${input.paymentId ?? null},
      ${input.source},
      ${input.type},
      ${input.summary ?? null},
      ${payload}::jsonb,
      ${input.providerEventId ?? null},
      ${input.notificationKey ?? null},
      ${createdAt}
    )
  `;
}

export async function createPaymentRecord(input: CreatePaymentRecordInput): Promise<PaymentRecord> {
  await ensurePaymentSchema();
  const sql = getSql();
  const now = new Date().toISOString();
  const environment = getPayPalEnvironmentName();
  const record: PaymentRecord = {
    id: input.id,
    mode: input.mode,
    status: input.status,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    recurringPlanId: input.recurringPlanId,
    paypalOrderId: input.paypalOrderId,
    paypalOrderStatus: input.paypalOrderStatus,
    paypalSubscriptionId: input.paypalSubscriptionId,
    paypalSubscriptionStatus: input.paypalSubscriptionStatus,
    payer: input.payer,
    lastError: input.lastError,
    environment,
    createdAt: now,
    updatedAt: now,
    events: input.initialEvent
      ? [
          {
            ...input.initialEvent,
            at: now,
          },
        ]
      : [],
  };

  const queries = [
    sql`
      INSERT INTO payments (
        id,
        mode,
        status,
        amount,
        currency,
        description,
        recurring_plan_id,
        paypal_order_id,
        paypal_order_status,
        paypal_subscription_id,
        paypal_subscription_status,
        payer_email,
        payer_id,
        payer_given_name,
        payer_surname,
        last_error,
        environment,
        created_at,
        updated_at
      )
      VALUES (
        ${record.id},
        ${record.mode},
        ${record.status},
        ${record.amount ?? null},
        ${record.currency ?? null},
        ${record.description ?? null},
        ${record.recurringPlanId ?? null},
        ${record.paypalOrderId ?? null},
        ${record.paypalOrderStatus ?? null},
        ${record.paypalSubscriptionId ?? null},
        ${record.paypalSubscriptionStatus ?? null},
        ${record.payer?.email ?? null},
        ${record.payer?.payerId ?? null},
        ${record.payer?.givenName ?? null},
        ${record.payer?.surname ?? null},
        ${record.lastError ?? null},
        ${record.environment},
        ${record.createdAt},
        ${record.updatedAt}
      )
    `,
  ];

  if (input.initialEvent) {
    queries.push(
      buildEventInsertQuery({
        paymentId: record.id,
        source: input.initialEvent.source,
        type: input.initialEvent.type,
        summary: input.initialEvent.summary,
        payload: input.initialEvent.payload,
        at: now,
      })
    );
  }

  await sql.transaction(queries);
  return record;
}

export async function getPaymentRecord(id: string): Promise<PaymentRecord | null> {
  await ensurePaymentSchema();
  const sql = getSql();
  return getPaymentRecordFromQuery(sql`
    SELECT
      id,
      mode,
      status,
      amount::text AS "amount",
      currency,
      description,
      recurring_plan_id AS "recurringPlanId",
      paypal_order_id AS "paypalOrderId",
      paypal_order_status AS "paypalOrderStatus",
      paypal_capture_id AS "paypalCaptureId",
      paypal_capture_status AS "paypalCaptureStatus",
      paypal_subscription_id AS "paypalSubscriptionId",
      paypal_subscription_status AS "paypalSubscriptionStatus",
      payer_email AS "payerEmail",
      payer_id AS "payerId",
      payer_given_name AS "payerGivenName",
      payer_surname AS "payerSurname",
      last_error AS "lastError",
      environment,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM payments
    WHERE id = ${id}
    LIMIT 1
  `);
}

export async function updatePaymentRecord(
  id: string,
  update: UpdatePaymentRecordInput
): Promise<PaymentRecord | null> {
  await ensurePaymentSchema();
  const existing = await getPaymentRecord(id);
  if (!existing) {
    return null;
  }

  const { event, ...paymentUpdate } = update;
  const now = new Date().toISOString();
  const next: PaymentRecord = {
    ...existing,
    ...paymentUpdate,
    payer: paymentUpdate.payer ? { ...existing.payer, ...paymentUpdate.payer } : existing.payer,
    updatedAt: now,
    events: event
      ? [
          ...existing.events,
          {
            ...event,
            at: now,
          },
        ]
      : existing.events,
  };

  const sql = getSql();
  const queries = [
    sql`
      UPDATE payments
      SET
        status = ${next.status},
        amount = ${next.amount ?? null},
        currency = ${next.currency ?? null},
        description = ${next.description ?? null},
        recurring_plan_id = ${next.recurringPlanId ?? null},
        paypal_order_id = ${next.paypalOrderId ?? null},
        paypal_order_status = ${next.paypalOrderStatus ?? null},
        paypal_capture_id = ${next.paypalCaptureId ?? null},
        paypal_capture_status = ${next.paypalCaptureStatus ?? null},
        paypal_subscription_id = ${next.paypalSubscriptionId ?? null},
        paypal_subscription_status = ${next.paypalSubscriptionStatus ?? null},
        payer_email = ${next.payer?.email ?? null},
        payer_id = ${next.payer?.payerId ?? null},
        payer_given_name = ${next.payer?.givenName ?? null},
        payer_surname = ${next.payer?.surname ?? null},
        last_error = ${next.lastError ?? null},
        updated_at = ${next.updatedAt}
      WHERE id = ${id}
    `,
  ];

  if (event) {
    queries.push(
      buildEventInsertQuery({
        paymentId: id,
        source: event.source,
        type: event.type,
        summary: event.summary,
        payload: event.payload,
        at: now,
      })
    );
  }

  await sql.transaction(queries);
  return next;
}

export async function findPaymentRecordBy(fields: {
  id?: string;
  paypalOrderId?: string;
  paypalSubscriptionId?: string;
  paypalCaptureId?: string;
}): Promise<PaymentRecord | null> {
  await ensurePaymentSchema();

  if (fields.id) {
    return getPaymentRecord(fields.id);
  }

  const sql = getSql();

  if (fields.paypalOrderId) {
    return getPaymentRecordFromQuery(sql`
      SELECT
        id,
        mode,
        status,
        amount::text AS "amount",
        currency,
        description,
        recurring_plan_id AS "recurringPlanId",
        paypal_order_id AS "paypalOrderId",
        paypal_order_status AS "paypalOrderStatus",
        paypal_capture_id AS "paypalCaptureId",
        paypal_capture_status AS "paypalCaptureStatus",
        paypal_subscription_id AS "paypalSubscriptionId",
        paypal_subscription_status AS "paypalSubscriptionStatus",
        payer_email AS "payerEmail",
        payer_id AS "payerId",
        payer_given_name AS "payerGivenName",
        payer_surname AS "payerSurname",
        last_error AS "lastError",
        environment,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM payments
      WHERE paypal_order_id = ${fields.paypalOrderId}
      LIMIT 1
    `);
  }

  if (fields.paypalSubscriptionId) {
    return getPaymentRecordFromQuery(sql`
      SELECT
        id,
        mode,
        status,
        amount::text AS "amount",
        currency,
        description,
        recurring_plan_id AS "recurringPlanId",
        paypal_order_id AS "paypalOrderId",
        paypal_order_status AS "paypalOrderStatus",
        paypal_capture_id AS "paypalCaptureId",
        paypal_capture_status AS "paypalCaptureStatus",
        paypal_subscription_id AS "paypalSubscriptionId",
        paypal_subscription_status AS "paypalSubscriptionStatus",
        payer_email AS "payerEmail",
        payer_id AS "payerId",
        payer_given_name AS "payerGivenName",
        payer_surname AS "payerSurname",
        last_error AS "lastError",
        environment,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM payments
      WHERE paypal_subscription_id = ${fields.paypalSubscriptionId}
      LIMIT 1
    `);
  }

  if (fields.paypalCaptureId) {
    return getPaymentRecordFromQuery(sql`
      SELECT
        id,
        mode,
        status,
        amount::text AS "amount",
        currency,
        description,
        recurring_plan_id AS "recurringPlanId",
        paypal_order_id AS "paypalOrderId",
        paypal_order_status AS "paypalOrderStatus",
        paypal_capture_id AS "paypalCaptureId",
        paypal_capture_status AS "paypalCaptureStatus",
        paypal_subscription_id AS "paypalSubscriptionId",
        paypal_subscription_status AS "paypalSubscriptionStatus",
        payer_email AS "payerEmail",
        payer_id AS "payerId",
        payer_given_name AS "payerGivenName",
        payer_surname AS "payerSurname",
        last_error AS "lastError",
        environment,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM payments
      WHERE paypal_capture_id = ${fields.paypalCaptureId}
      LIMIT 1
    `);
  }

  return null;
}

export async function recordPaymentEvent(input: RecordPaymentEventInput) {
  await ensurePaymentSchema();
  const sql = getSql();
  await sql.transaction([buildEventInsertQuery(input)]);
}

export async function hasPaymentEventWithNotificationKey(notificationKey: string) {
  await ensurePaymentSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT EXISTS(
      SELECT 1
      FROM payment_events
      WHERE notification_key = ${notificationKey}
    ) AS "exists"
  `) as Array<{ exists: boolean }>;

  return rows[0]?.exists ?? false;
}
