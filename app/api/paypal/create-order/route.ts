import { NextResponse } from 'next/server';
import { getPayPalAccessToken, normalizeAmount, paypalRequest } from '@/lib/paypal';

export const runtime = 'nodejs';

type CreateOrderRequest = {
  amount: string;
  currency?: string;
  description?: string;
};

type CreateOrderResponse = {
  id?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;
    const amount = normalizeAmount(body.amount);
    const currency = (body.currency ?? 'USD').toUpperCase();
    const description = body.description ?? 'Donation to Support Our Cause';

    const accessToken = await getPayPalAccessToken();
    const order = await paypalRequest<CreateOrderResponse>(
      '/v2/checkout/orders',
      'POST',
      accessToken,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description,
          },
        ],
      }
    );

    if (!order.id) {
      throw new Error('PayPal order ID was not returned.');
    }

    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error('Failed to create PayPal order:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';
    return NextResponse.json(
      {
        error: 'Unable to create PayPal order. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: 500 }
    );
  }
}
