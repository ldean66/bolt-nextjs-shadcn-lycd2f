const environment = (process.env.PAYPAL_ENVIRONMENT ?? '').trim().toLowerCase();
const isLiveEnvironment =
  environment === 'live' || environment === 'production' || environment === 'prod';

const PAYPAL_API_BASE =
  process.env.PAYPAL_BASE_URL?.trim() ??
  (isLiveEnvironment ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

type PayPalErrorResponse = {
  name?: string;
  message?: string;
  debug_id?: string;
  details?: Array<{ issue?: string; description?: string }>;
  error?: string;
  error_description?: string;
};

function formatPayPalError(prefix: string, status: number, raw: string): string {
  let parsed: PayPalErrorResponse | null = null;

  try {
    parsed = JSON.parse(raw) as PayPalErrorResponse;
  } catch {
    parsed = null;
  }

  if (!parsed) {
    return `${prefix} (${status}): ${raw}`;
  }

  const issueSummary =
    parsed.details
      ?.map((item) => [item.issue, item.description].filter(Boolean).join(': '))
      .filter(Boolean)
      .join(' | ') ?? '';

  const parts = [
    parsed.name || parsed.error,
    parsed.message || parsed.error_description,
    issueSummary,
    parsed.debug_id ? `debug_id=${parsed.debug_id}` : '',
  ].filter(Boolean);

  if (parts.length === 0) {
    return `${prefix} (${status}): ${raw}`;
  }

  return `${prefix} (${status}): ${parts.join(' | ')}`;
}

function getRequiredEnv(name: 'PAYPAL_CLIENT_ID' | 'PAYPAL_CLIENT_SECRET'): string {
  if (name === 'PAYPAL_CLIENT_ID') {
    const serverClientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();

    if (!serverClientId) {
      throw new Error('Missing required environment variable: PAYPAL_CLIENT_ID');
    }

    if (publicClientId && publicClientId !== serverClientId) {
      throw new Error(
        'PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID do not match. This causes invalid_client.'
      );
    }

    return serverClientId;
  }

  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!secret) {
    throw new Error('Missing required environment variable: PAYPAL_CLIENT_SECRET');
  }

  return secret;
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = getRequiredEnv('PAYPAL_CLIENT_ID');
  const clientSecret = getRequiredEnv('PAYPAL_CLIENT_SECRET');
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      formatPayPalError(
        `Failed to get PayPal access token from ${PAYPAL_API_BASE}`,
        response.status,
        details
      )
    );
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('PayPal access token was not returned by OAuth endpoint.');
  }

  return data.access_token;
}

export async function paypalRequest<TResponse>(
  path: string,
  method: 'POST' | 'GET',
  accessToken: string,
  body?: unknown
): Promise<TResponse> {
  const response = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(formatPayPalError('PayPal API request failed', response.status, details));
  }

  return (await response.json()) as TResponse;
}

export function normalizeAmount(rawAmount: string): string {
  const numeric = Number(rawAmount);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error('Amount must be a positive number.');
  }

  const rounded = Math.round(numeric * 100) / 100;
  return rounded.toFixed(2);
}
