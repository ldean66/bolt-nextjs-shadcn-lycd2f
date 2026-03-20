'use client';

import { useState } from 'react';
import {
  FUNDING,
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import DonationAmount from './DonationAmount';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const initialOptions: ReactPayPalScriptOptions = {
  clientId: clientId ?? '',
  currency: "USD",
  intent: "capture",
  disableFunding: ['card'],
  components: 'buttons',
};

export default function PayPalButton() {
  const [showPayPal, setShowPayPal] = useState(false);
  const [amount, setAmount] = useState('25');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currency = "USD";
  const amountNumber = Number(amount);
  const invalidAmount = !Number.isFinite(amountNumber) || amountNumber <= 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {!showPayPal ? (
        <div className="space-y-6">
          <DonationAmount
            selectedAmount={amount}
            onAmountSelect={setAmount}
          />
          <Button 
            onClick={() => setShowPayPal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-12 text-lg"
            disabled={invalidAmount || !clientId}
          >
            <Heart className="w-5 h-5" />
            Donate ${amount}
          </Button>
          {!clientId && (
            <p className="text-sm text-red-600 text-center">
              PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID.
            </p>
          )}
        </div>
      ) : (
        <Card className="p-6">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              fundingSource={FUNDING.PAYPAL}
              forceReRender={[amount, currency]}
              disabled={invalidAmount || isProcessing}
              style={{ layout: "vertical", label: "paypal" }}
              createOrder={async () => {
                setErrorMessage(null);

                const response = await fetch('/api/paypal/create-order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount,
                    currency,
                    description: 'Donation to Support Our Cause',
                  }),
                });

                const payload = (await response.json()) as {
                  id?: string;
                  error?: string;
                  details?: string;
                };

                if (!response.ok || !payload.id) {
                  throw new Error(
                    payload.details ?? payload.error ?? 'Unable to start PayPal checkout.'
                  );
                }

                return payload.id;
              }}
              onApprove={async (data) => {
                if (!data.orderID) {
                  throw new Error('PayPal did not return an order ID.');
                }

                setIsProcessing(true);
                setErrorMessage(null);

                try {
                  const response = await fetch('/api/paypal/capture-order', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      orderID: data.orderID,
                    }),
                  });

                  const payload = (await response.json()) as {
                    error?: string;
                    details?: string;
                  };
                  if (!response.ok) {
                    throw new Error(
                      payload.details ?? payload.error ?? 'Unable to capture PayPal payment.'
                    );
                  }

                  alert("Thank you for your generous donation!");
                  setShowPayPal(false);
                } catch (error) {
                  console.error('Failed to capture PayPal order:', error);
                  setErrorMessage(
                    error instanceof Error ? error.message : 'Payment approval failed. Please try again.'
                  );
                } finally {
                  setIsProcessing(false);
                }
              }}
              onError={(error) => {
                console.error('PayPal checkout error:', error);
                setErrorMessage(
                  error instanceof Error ? error.message : 'PayPal checkout failed. Please try again.'
                );
              }}
            />
            {errorMessage && (
              <p className="mt-3 text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </PayPalScriptProvider>
          <Button 
            variant="outline" 
            onClick={() => setShowPayPal(false)}
            className="w-full mt-4"
          >
            Change Amount
          </Button>
        </Card>
      )}
    </div>
  );
}
