'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DonationAmountProps {
  onAmountSelect: (amount: string) => void;
  selectedAmount: string;
}

export default function DonationAmount({ onAmountSelect, selectedAmount }: DonationAmountProps) {
  const [customAmount, setCustomAmount] = useState('');
  const presetAmounts = ['5', '10', '25', '50', '100'];

  // Sync the custom amount with selectedAmount when preset is chosen
  useEffect(() => {
    if (presetAmounts.includes(selectedAmount)) {
      setCustomAmount(''); // Clear custom amount when preset is selected
    }
  }, [selectedAmount]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, ''); // Strip non-numeric characters
    const decimalCount = (value.match(/\./g) || []).length;

    // Ensure only one decimal point is allowed
    if (decimalCount > 1) {
      value = value.slice(0, value.lastIndexOf('.'));
    }

    setCustomAmount(value);
    onAmountSelect(value); // Pass custom value to parent
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {presetAmounts.map((amount) => (
          <Button
            key={amount}
            variant={selectedAmount === amount ? 'default' : 'outline'}
            className={cn(
              'h-12 text-lg font-semibold',
              selectedAmount === amount && 'ring-2 ring-blue-500'
            )}
            onClick={() => {
              setCustomAmount('');
              onAmountSelect(amount); // Pass preset value to parent
            }}
          >
            ${amount}
          </Button>
        ))}
      </div>
      <div className="relative">
        <Input
          type="text"
          value={customAmount}
          onChange={handleCustomAmountChange}
          className="pl-8 h-12 text-lg"
          placeholder="Custom amount"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
      </div>
    </div>
  );
}
