"use client";

import * as React from "react";
import { useCreateEventStore } from "@/lib/stores/create-event-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function SummaryStep() {
  const { name, description, imageUrl, tools, pricing, setStep } =
    useCreateEventStore();

  const calculateFeeAmount = (amount: number, percentage: number) => {
    return (amount * percentage) / 100;
  };

  const calculateTotalAmount = (amount: number, percentage: number) => {
    return amount + calculateFeeAmount(amount, percentage);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border bg-neutral-50/20">
        <div className="bg-primary flex items-center justify-between p-3 text-white">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Button
            onClick={() => setStep(1)}
            variant="ghost"
            size="icon"
            className="bg-accent text-secondary hover:bg-accent/50 flex items-center gap-1 text-sm hover:underline"
          >
            <IconPencil className="size-3" />
          </Button>
        </div>

        <div className="space-y-4 p-3">
          <div>
            <span className="text-sm font-medium text-gray-500">
              Event Name:
            </span>
            <p>{name || "Not provided"}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">
              Description:
            </span>
            <p className="text-sm">{description || "Not provided"}</p>
          </div>

          {imageUrl && (
            <div>
              <span className="text-sm font-medium text-gray-500">
                Event Image:
              </span>
              <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg">
                <div className="relative h-full w-full">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-neutral-50/20">
        <div className="bg-primary mb-2 flex items-center justify-between p-3 text-white">
          <h3 className="text-lg font-medium">Event Tools</h3>
          <Button
            onClick={() => setStep(2)}
            variant="ghost"
            size="icon"
            className="bg-accent text-secondary hover:bg-accent/50 flex items-center gap-1 text-sm hover:underline"
          >
            <IconPencil className="size-3" />
          </Button>
        </div>

        <div className="space-y-2 p-3">
          <div className="flex items-center gap-2">
            {tools.nominations ? (
              <IconCheck className="size-5 text-green-500" />
            ) : (
              <IconX className="size-5 text-red-500" />
            )}
            <span>Nominations</span>
          </div>

          <div className="flex items-center gap-2">
            {tools.voting ? (
              <IconCheck className="size-5 text-green-500" />
            ) : (
              <IconX className="size-5 text-red-500" />
            )}
            <span>Voting</span>
          </div>

          {/* <div className="flex items-center gap-2">
            {tools.ticketing ? (
              <IconCheck className="size-5 text-green-500" />
            ) : (
              <IconX className="size-5 text-red-500" />
            )}
            <span>Ticketing</span>
          </div> */}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-neutral-50/20">
        <div className="bg-primary mb-2 flex items-center justify-between p-3 text-white">
          <h3 className="text-lg font-medium">Pricing</h3>
          <Button
            onClick={() => setStep(3)}
            variant="ghost"
            size="icon"
            className="bg-accent text-secondary hover:bg-accent/50 flex items-center gap-1 text-sm hover:underline"
          >
            <IconPencil className="size-3" />
          </Button>
        </div>

        <div className="space-y-4 p-3">
          <div className="flex items-center justify-between">
            <span>Amount per vote:</span>
            <span className="font-medium">
              GHS {pricing.amountPerVote.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Service fee:</span>
            <Badge variant="outline">{pricing.serviceFeePercentage}%</Badge>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-2">
            <span className="font-medium">Total charge per vote:</span>
            <span className="font-bold">
              GHS{" "}
              {calculateTotalAmount(
                pricing.amountPerVote,
                pricing.serviceFeePercentage,
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Card className="rounded-none border-0 border-l-3 border-l-green-500 bg-green-50 shadow-none">
        <CardContent className="p-4 text-green-800">
          <h3 className="mb-2 text-lg font-bold">Ready to Create</h3>
          <p className="text-sm">
            Your event is ready to be created. Review the information above and
            click the "Submit" button to proceed. Our team will review your
            event and get back to you with next steps. Kindly note that while
            your event awaits approval, you can edit it as needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
