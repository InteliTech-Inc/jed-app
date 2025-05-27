"use client";

import * as React from "react";
import { useCreateEventStore } from "@/lib/stores/create-event-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BasicInfoStep } from "./step-1-basic-info";
import { EventToolsStep } from "./step-2-event-tools";
import { PricingStep } from "./step-3-pricing";
import { SummaryStep } from "./step-4-summary";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { StepTracker } from "./step-tracker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAllEventsStore } from "@/lib/stores/all-events-store";
import { EventResponse } from "@/interfaces/event";

export function CreateEventForm() {
  const { currentStep, nextStep, prevStep, isUploading, setIsUploading } =
    useCreateEventStore();
  const { createEvent, uploadImage } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addEvent, removeEvent } = useAllEventsStore();

  const canContinue = () => {
    const state = useCreateEventStore.getState();

    switch (currentStep) {
      case 1:
        return Boolean(state.name && state.description);
      case 2:
        return (
          state.tools.nominations || state.tools.voting || state.tools.ticketing
        );
      case 3:
        return state.pricing.amountPerVote > 0;
      default:
        return true;
    }
  };

  const currentStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <EventToolsStep />;
      case 3:
        return <PricingStep />;
      case 4:
        return <SummaryStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  const stepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Event Tools";
      case 3:
        return "Pricing";
      case 4:
        return "Summary";
      default:
        return "Create Event";
    }
  };

  const stepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Provide the basic details about your event.";
      case 2:
        return "Choose the tools you want to enable for your event.";
      case 3:
        return "Set pricing for votes and select your service fee.";
      case 4:
        return "Review all details before creating your event.";
      default:
        return "";
    }
  };

  const { mutateAsync: createNewEvent, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: createEvent,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.EVENTS] });

      const tempEvent: EventResponse = {
        ...newEvent,
        id: `temp_${Date.now()}_${Math.random()}`,
        is_published: false,
        display_results: false,
        event_progress: "not_started",
        approval_status: "pending",
        schedule: {
          nomination_end_period: "",
          nomination_start_period: "",
          voting_end_period: "",
          voting_start_period: "",
        },
        categories: [],
        tools: {
          nominations: false,
          voting: false,
          ticketing: false,
        },
        votes: [],
        service_percentage: 0,
        media: {
          public_id: "",
          url: "",
        },
      };

      addEvent(tempEvent);

      return { tempEvent };
    },
    onError: (error, _, context) => {
      removeEvent(context?.tempEvent?.id!);
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Failed to create event.");
      }
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
    retry(failureCount, error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        return failureCount < 3;
      }
      return false;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });

  const handleSubmit = async () => {
    const {
      image,
      name,
      description,
      tools,
      pricing: { amountPerVote, serviceFeePercentage },
    } = useCreateEventStore.getState();

    const payload = {
      name,
      description,
      tools,
      amount_per_vote: amountPerVote,
      service_percentage: serviceFeePercentage,
    };

    try {
      const response = await createNewEvent(payload);

      if (response.data) {
        setIsUploading(true);
        const uploadedImage = await uploadImage({
          file: image!,
          event_id: response.data.id,
        });
        if (uploadedImage) {
          toast.success("Image uploaded successfully.");
          router.push("/events");
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Image upload failed.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <StepTracker currentStep={currentStep} />
      </div>

      <Card className="border-none bg-neutral-50/40 shadow-none">
        <CardHeader className="mb-5 px-0">
          <CardTitle>{stepTitle()}</CardTitle>
          <CardDescription>{stepDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {currentStepContent()}

          <div className="mt-8 flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-1"
            >
              <IconArrowLeft className="size-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canContinue() || isUploading}
                className="gap-1"
              >
                Next
                <IconArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                className="gap-1"
                onClick={handleSubmit}
                disabled={isPending || isUploading}
              >
                {isPending || isUploading ? <Spinner /> : "Submit"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
