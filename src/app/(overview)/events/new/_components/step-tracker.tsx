"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/lib/stores/create-event-store";
import {
  IconInfoCircle,
  IconTools,
  IconCash,
  IconClipboardList,
} from "@tabler/icons-react";

const steps = [
  {
    id: 1,
    name: "Basic Info",
    icon: IconInfoCircle,
  },
  {
    id: 2,
    name: "Event Tools",
    icon: IconTools,
  },
  {
    id: 3,
    name: "Pricing",
    icon: IconCash,
  },
  {
    id: 4,
    name: "Summary",
    icon: IconClipboardList,
  },
];

interface StepTrackerProps {
  currentStep: number;
}

export function StepTracker({ currentStep }: StepTrackerProps) {
  const setStep = useCreateEventStore((state) => state.setStep);

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-4 z-10 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 bg-gray-200" />
      <div
        className="bg-secondary/40 absolute top-1/2 left-4 z-10 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 transition-all duration-300"
        style={{
          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
        }}
      />

      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isClickable = step.id < currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2 bg-white",
                isClickable && "cursor-pointer",
              )}
              onClick={() => isClickable && setStep(step.id)}
            >
              <div
                className={cn(
                  "mx-2 flex aspect-square w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isActive
                    ? "border-secondary text-accent bg-secondary"
                    : "border-gray-200 bg-white",
                  { "bg-neutral-50": !isActive },
                )}
              >
                <Icon
                  className={`${isActive ? "text-accent" : "text-neutral-300"} size-5`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
