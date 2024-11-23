'use client';
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const PayPalButton = () => {
  const [amount, setAmount] = useState("10.00");
  const [currency, setCurrency] = useState("USD");

  // PayPal initialization options
  const initialOptions = {
    "client-id": "AaUsTOJv00TrCwWJitCCjcSpCj6kJLTbkOHAjTUXLgRdCb76w8GNK4hC8C4QOxmNYgeFYV31nkTv1-eN",
    currency: currency,
    intent: "capture",
  };

  // Function to handle approved payment
  const handleApproval = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      const payerName = details.payer.name.given_name;
      alert(`Thank you for your donation, ${payerName}!`);
    } catch (error) {
      console.error("Payment capture failed: ", error);
      alert("There was an error processing your payment. Please try again.");
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: initialOptions["client-id"], ...initialOptions }}>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
          Donation Amount (USD):
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
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
        onApprove={handleApproval}
        onError={(err) => {
          console.error("PayPal Buttons Error: ", err);
          alert("There was an issue with the PayPal payment. Please try again later.");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
