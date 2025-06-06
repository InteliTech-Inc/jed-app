"use client";
import React, { useState } from "react";
import { maskAccountNumber } from "@/lib/utils";
import { Eye, EyeOff, CheckCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type PaymentMethod = {
  type: string;
  account_number: string;
  provider: string;
  status: string;
};

type Props = {
  paymentMethods: PaymentMethod[];
};

export function PaymentDetails({ paymentMethods }: Readonly<Props>) {
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(
    new Set(),
  );
  const [methods, setMethods] = useState(paymentMethods);

  const toggleReveal = (index: number) => {
    setRevealedIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const toggleStatus = (index: number) => {
    const newMethods = [...methods];
    const method = newMethods[index];

    method.status = method.status === "active" ? "inactive" : "active";
    setMethods(newMethods);
  };

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <p className="text-sm text-neutral-500">No payment methods found.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {methods.map((method, index) => {
        const isRevealed = revealedIndexes.has(index);
        const displayNumber = isRevealed
          ? method.account_number
          : maskAccountNumber(method.account_number);

        return (
          <li
            key={index + 1}
            className={`rounded-md border px-4 py-2 text-sm ${method.status === "active" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} flex items-start gap-4`}
          >
            <div className="w-full self-stretch">
              <p className="flex w-full flex-1 items-center self-stretch font-medium capitalize">
                <span className="flex-1">{method.type}</span>
                <Badge
                  className={`ml-auto ${method.status === "active" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
                >
                  {method.status}
                </Badge>
              </p>

              <span className="text-xs text-neutral-400">
                {method.provider}
              </span>
              <p className="mt-1 flex items-center gap-3 text-neutral-500">
                <span className="flex flex-1 items-center gap-2">
                  <span>{displayNumber}</span>
                  <button
                    type="button"
                    onClick={() => toggleReveal(index)}
                    className="text-green-500 hover:text-green-600"
                    title={
                      isRevealed
                        ? "Hide Account Number"
                        : "Reveal Account Number"
                    }
                  >
                    {isRevealed ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => toggleStatus(index)}
                  title={
                    method.status === "active"
                      ? "Deactivate payment method"
                      : "Activate payment method"
                  }
                >
                  {method.status === "active" ? (
                    <MinusCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </button>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
