const trueValues = new Set(['1', 'true', 'yes', 'on']);
const falseValues = new Set(['0', 'false', 'no', 'off']);

export function parseBooleanEnv(value?: string | null): boolean | null {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (trueValues.has(normalized)) {
    return true;
  }

  if (falseValues.has(normalized)) {
    return false;
  }

  return null;
}

export function isMonthlyGivingEnabled(): boolean {
  const explicitValue = parseBooleanEnv(process.env.NEXT_PUBLIC_PAYPAL_ENABLE_MONTHLY);
  if (explicitValue !== null) {
    return explicitValue;
  }

  return process.env.NODE_ENV !== 'production';
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://morethan-conquerors.com';
}
