'use client';

import { useRef, useState } from 'react';
import {
  FUNDING,
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isMonthlyGivingEnabled } from '@/lib/paypal-config';
import { Heart } from 'lucide-react';
import DonationAmount from './DonationAmount';
import { toast } from '@/hooks/use-toast';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const monthlyPlanId = process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID;
const monthlyGivingEnabled = isMonthlyGivingEnabled();

interface PayPalButtonProps {
  onSuccess?: () => void;
}

export default function PayPalButton({ onSuccess }: PayPalButtonProps) {
  const [donationMode, setDonationMode] = useState<'one_time' | 'monthly'>('one_time');
  const [showPayPal, setShowPayPal] = useState(false);
  const [amount, setAmount] = useState('25');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentDonationIdRef = useRef<string | null>(null);
  const currency = 'USD';
  const amountNumber = Number(amount);
  const invalidOneTimeAmount = !Number.isFinite(amountNumber) || amountNumber <= 0;
  const isMonthlyMode = donationMode === 'monthly';
  const canShowMonthly = monthlyGivingEnabled;
  const canUseMonthly = canShowMonthly && Boolean(monthlyPlanId);

  const paypalOptions: ReactPayPalScriptOptions = isMonthlyMode
    ? {
        clientId: clientId ?? '',
        currency,
        intent: 'subscription',
        vault: true,
        disableFunding: ['card'],
        components: 'buttons',
      }
    : {
        clientId: clientId ?? '',
        currency,
        intent: 'capture',
        disableFunding: ['card'],
        components: 'buttons',
      };

  const checkoutDisabled =
    !clientId || (isMonthlyMode ? !canUseMonthly : invalidOneTimeAmount);

  const resetCheckoutState = () => {
    setErrorMessage(null);
    currentDonationIdRef.current = null;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!showPayPal ? (
        <div className="space-y-6">
          {canShowMonthly && (
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <Button
                type="button"
                variant={donationMode === 'one_time' ? 'default' : 'ghost'}
                className="w-full"
                onClick={() => {
                  setDonationMode('one_time');
                  resetCheckoutState();
                }}
              >
                One-Time
              </Button>
              <Button
                type="button"
                variant={isMonthlyMode ? 'default' : 'ghost'}
                className="w-full"
                onClick={() => {
                  setDonationMode('monthly');
                  resetCheckoutState();
                }}
              >
                Monthly
              </Button>
            </div>
          )}

          {!isMonthlyMode ? (
            <DonationAmount selectedAmount={amount} onAmountSelect={setAmount} />
          ) : (
            <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-pink-700">Monthly giving</p>
              <p className="mt-2">
                Start a recurring PayPal subscription for supporters who want to give every month.
              </p>
              {!canUseMonthly && (
                <p className="mt-2 text-red-600">
                  Monthly giving is not configured yet. Set `NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID`.
                </p>
              )}
            </div>
          )}

          <Button
            onClick={() => {
              setShowPayPal(true);
              setErrorMessage(null);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-12 text-lg"
            disabled={checkoutDisabled}
          >
            <Heart className="w-5 h-5" />
            {isMonthlyMode ? 'Start Monthly Giving' : `Donate $${amount}`}
          </Button>
          {!clientId && (
            <p className="text-sm text-red-600 text-center">
              PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID.
            </p>
          )}
        </div>
      ) : (
        <Card className="p-6">
          <PayPalScriptProvider key={`paypal-${donationMode}`} options={paypalOptions}>
            {!isMonthlyMode ? (
              <PayPalButtons
                fundingSource={FUNDING.PAYPAL}
                forceReRender={[amount, currency, donationMode]}
                disabled={invalidOneTimeAmount || isProcessing}
                style={{ layout: 'vertical', label: 'paypal' }}
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
                    donationId?: string;
                    id?: string;
                    error?: string;
                    details?: string;
                  };

                  if (!response.ok || !payload.id || !payload.donationId) {
                    throw new Error(
                      payload.details ?? payload.error ?? 'Unable to start PayPal checkout.'
                    );
                  }

                  currentDonationIdRef.current = payload.donationId;
                  return payload.id;
                }}
                onApprove={async (data) => {
                  if (!data.orderID) {
                    throw new Error('PayPal did not return an order ID.');
                  }

                  setIsProcessing(true);
                  setErrorMessage(null);
                  let paymentCaptured = false;

                  try {
                    const response = await fetch('/api/paypal/capture-order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        donationId: currentDonationIdRef.current,
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

                    paymentCaptured = true;
                    setShowPayPal(false);
                    resetCheckoutState();
                  } catch (error) {
                    console.error('Failed to capture PayPal order:', error);
                    setErrorMessage(
                      error instanceof Error
                        ? error.message
                        : 'Payment approval failed. Please try again.'
                    );
                  } finally {
                    setIsProcessing(false);
                  }

                  if (paymentCaptured) {
                    toast({
                      title: 'Thank you for your donation!',
                      description: 'Your PayPal payment was completed successfully.',
                    });
                    onSuccess?.();
                  }
                }}
                onError={(error) => {
                  console.error('PayPal checkout error:', error);
                  setErrorMessage(
                    error instanceof Error ? error.message : 'PayPal checkout failed. Please try again.'
                  );
                }}
              />
            ) : (
              <PayPalButtons
                fundingSource={FUNDING.PAYPAL}
                forceReRender={[donationMode, monthlyPlanId ?? '']}
                disabled={!canUseMonthly || isProcessing}
                style={{ layout: 'vertical', label: 'subscribe' }}
                createSubscription={async (_data, actions) => {
                  setErrorMessage(null);

                  const response = await fetch('/api/paypal/create-subscription', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });

                  const payload = (await response.json()) as {
                    donationId?: string;
                    planId?: string;
                    error?: string;
                    details?: string;
                  };

                  if (!response.ok || !payload.planId || !payload.donationId) {
                    throw new Error(
                      payload.details ?? payload.error ?? 'Monthly giving is currently unavailable.'
                    );
                  }

                  currentDonationIdRef.current = payload.donationId;

                  return actions.subscription.create({
                    plan_id: payload.planId,
                    custom_id: payload.donationId,
                  });
                }}
                onApprove={async (data) => {
                  if (!data.subscriptionID) {
                    throw new Error('PayPal did not return a subscription ID.');
                  }

                  setIsProcessing(true);
                  setErrorMessage(null);
                  let subscriptionActivated = false;

                  try {
                    const response = await fetch('/api/paypal/finalize-subscription', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        donationId: currentDonationIdRef.current,
                        subscriptionID: data.subscriptionID,
                      }),
                    });

                    const payload = (await response.json()) as {
                      error?: string;
                      details?: string;
                    };

                    if (!response.ok) {
                      throw new Error(
                        payload.details ??
                          payload.error ??
                          'Unable to finalize PayPal subscription.'
                      );
                    }

                    subscriptionActivated = true;
                    setShowPayPal(false);
                    resetCheckoutState();
                  } catch (error) {
                    console.error('Failed to finalize PayPal subscription:', error);
                    setErrorMessage(
                      error instanceof Error
                        ? error.message
                        : 'Monthly giving approval failed. Please try again.'
                    );
                  } finally {
                    setIsProcessing(false);
                  }

                  if (subscriptionActivated) {
                    toast({
                      title: 'Monthly giving started',
                      description: 'Your PayPal subscription is active.',
                    });
                    onSuccess?.();
                  }
                }}
                onError={(error) => {
                  console.error('PayPal subscription error:', error);
                  setErrorMessage(
                    error instanceof Error ? error.message : 'Monthly giving failed. Please try again.'
                  );
                }}
              />
            )}
            {errorMessage && (
              <p className="mt-3 text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </PayPalScriptProvider>
          <Button
            variant="outline"
            onClick={() => {
              setShowPayPal(false);
              resetCheckoutState();
            }}
            className="w-full mt-4"
          >
            {isMonthlyMode ? 'Back to Options' : 'Change Amount'}
          </Button>
        </Card>
      )}
    </div>
  );
}
