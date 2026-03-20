import { NextResponse } from 'next/server';
import { getPayPalAccessToken, paypalRequest } from '@/lib/paypal';

export const runtime = 'nodejs';

type CaptureOrderRequest = {
  orderID: string;
};

type CaptureOrderResponse = {
  id?: string;
  status?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptureOrderRequest;

    if (!body.orderID) {
      return NextResponse.json({ error: 'orderID is required.' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const capture = await paypalRequest<CaptureOrderResponse>(
      `/v2/checkout/orders/${body.orderID}/capture`,
      'POST',
      accessToken
    );

    return NextResponse.json(capture);
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    const exposeDetails =
      process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG_ERRORS === 'true';
    return NextResponse.json(
      {
        error: 'Unable to capture PayPal payment. Please try again.',
        ...(exposeDetails ? { details } : {}),
      },
      { status: 500 }
    );
  }
}
