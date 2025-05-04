"use client";

import * as React from "react";
import { useCreateEventStore } from "@/lib/stores/create-event-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

export function PricingStep() {
  const { pricing, updatePricing } = useCreateEventStore();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (isNaN(amount) || amount < 0) return;

    updatePricing({
      ...pricing,
      amountPerVote: amount,
    });
  };

  const handleFeeChange = (value: string) => {
    updatePricing({
      ...pricing,
      serviceFeePercentage: parseInt(value) as 10 | 12,
    });
  };

  const calculateFeeAmount = (amount: number, percentage: number) => {
    return (amount * percentage) / 100;
  };

  const calculateTotalAmount = (amount: number, percentage: number) => {
    return amount + calculateFeeAmount(amount, percentage);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amountPerVote">Amount Per Vote (GHS)</Label>
        <div className="relative">
          <Input
            id="amountPerVote"
            type="number"
            min="0.1"
            step="0.1"
            className="h-12"
            value={pricing.amountPerVote}
            onChange={handleAmountChange}
          />
        </div>
        <p className="text-xs text-gray-500">
          *This is the amount that voters will be charged per vote.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Service Fee Percentage</Label>
        <RadioGroup
          value={pricing.serviceFeePercentage.toString()}
          onValueChange={handleFeeChange}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Card
            className={`cursor-pointer shadow-none transition-all ${
              pricing.serviceFeePercentage === 10
                ? "bg-accent border-accent"
                : ""
            }`}
          >
            <CardContent className="p-4 text-center">
              <RadioGroupItem value="10" id="fee-10" className="peer sr-only" />
              <Label
                htmlFor="fee-10"
                className="flex cursor-pointer flex-col space-y-1"
              >
                <span
                  className={`font-medium ${pricing.serviceFeePercentage === 10 ? "text-secondary" : ""}`}
                >
                  Standard Fee: 10%
                </span>
                <span
                  className={`text-xs ${pricing.serviceFeePercentage === 10 ? "text-secondary opacity-90" : "text-gray-500"}`}
                >
                  Recommended for most events
                </span>
              </Label>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer shadow-none transition-all ${
              pricing.serviceFeePercentage === 12
                ? "bg-accent border-accent"
                : ""
            }`}
          >
            <CardContent className="p-4 text-center">
              <RadioGroupItem value="12" id="fee-12" className="peer sr-only" />
              <Label
                htmlFor="fee-12"
                className="flex cursor-pointer flex-col space-y-1"
              >
                <span
                  className={`font-medium ${pricing.serviceFeePercentage === 12 ? "text-secondary" : ""}`}
                >
                  Premium Fee: 12%
                </span>
                <span
                  className={`text-xs ${pricing.serviceFeePercentage === 12 ? "text-secondary opacity-90" : "text-gray-500"}`}
                >
                  For high-demand events with additional support
                </span>
              </Label>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      <Card className="bg-neutral-50 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Pricing Summary</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount per vote:</span>
              <span className="text-sm">
                GHS {pricing.amountPerVote.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Service fee ({pricing.serviceFeePercentage}%):
              </span>
              <span className="text-sm">
                GHS{" "}
                {calculateFeeAmount(
                  pricing.amountPerVote,
                  pricing.serviceFeePercentage,
                ).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-sm">Total amount per vote:</span>
                <span className="text-sm font-bold">
                  GHS{" "}
                  {calculateTotalAmount(
                    pricing.amountPerVote,
                    pricing.serviceFeePercentage,
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
