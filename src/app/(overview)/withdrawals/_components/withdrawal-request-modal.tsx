"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { delay } from "@/app/(event)/e/[id]/nominations/_components/row-action";
import { Spinner } from "@/components/spinner";

const paymentMethods = [
  {
    id: "pm_1",
    method: "Bank Transfer",
    details: "GTBank - ****1234",
  },
  {
    id: "pm_2",
    method: "Mobile Money",
    details: "MTN - ****5678",
  },
];

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawalRequestModal({
  isOpen,
  onClose,
}: WithdrawalRequestModalProps) {
  const [request, setRequest] = useState({
    amount: "",
    paymentMethodId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await delay(1000);
      resetForm();
      onClose();
      toast.success("Withdrawal request submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to request withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRequest({
      amount: "",
      paymentMethodId: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              placeholder="0.00"
              className="h-10"
              type="number"
              step="0.01"
              min="50"
              value={request.amount}
              onChange={(e) =>
                setRequest({ ...request, amount: e.target.value })
              }
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={request.paymentMethodId}
              onValueChange={(value) =>
                setRequest({ ...request, paymentMethodId: value })
              }
            >
              <SelectTrigger id="payment-method" className="!h-10 w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.method} - {method.details}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
