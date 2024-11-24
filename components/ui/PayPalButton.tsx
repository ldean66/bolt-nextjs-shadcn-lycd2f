'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import DonationAmount from './DonationAmount';

const initialOptions = {
  "client-id": "YOUR_PAYPAL_CLIENT_ID",
  currency: "USD",
  intent: "capture",
};

export default function PayPalButton() {
  const [showPayPal, setShowPayPal] = useState(false);
  const [amount, setAmount] = useState('25');
  const currency = "USD";

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
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Heart className="w-5 h-5" />
            Donate ${amount}
          </Button>
        </div>
      ) : (
        <Card className="p-6">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: currency,
                        value: amount,
                      },
                      description: "Donation to Support Our Cause",
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  const details = await actions.order.capture();
                  alert("Thank you for your generous donation!");
                  setShowPayPal(false);
                }
              }}
            />
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