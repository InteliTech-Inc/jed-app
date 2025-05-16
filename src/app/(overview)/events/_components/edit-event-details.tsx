"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormValues } from "@/validations/event";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { EventResponse } from "@/interfaces/event";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { Spinner } from "@/components/spinner";
import { formatJedError } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { AxiosError } from "axios";

export default function EditEventDetails({
  data,
  drawerState,
}: Readonly<{
  data: EventResponse;
  drawerState: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const { updateEvent } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      voting_start_period: data.schedule?.voting_start_period
        ? new Date(data.schedule.voting_start_period)
        : new Date(),
      voting_end_period: data.schedule?.voting_end_period
        ? new Date(data.schedule.voting_end_period)
        : new Date(),
      nomination_start_period: data.schedule?.nomination_start_period
        ? new Date(data.schedule.nomination_start_period)
        : new Date(),
      nomination_end_period: data.schedule?.nomination_end_period
        ? new Date(data.schedule.nomination_end_period)
        : new Date(),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const { mutate: updateExistingEvent, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: async (payload: { id: string; data: EventResponse }) => {
      return updateEvent(payload.data, payload.id);
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      drawerState(false);
    },
    onError: (error: AxiosError) => {
      if (error instanceof Error) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while updating the event.");
      }
    },
  });

  const onSubmit = (values: EventFormValues) => {
    const payload = {
      id: String(data.id),
      data: {
        ...data,
        name: values.name,
        description: values.description,
        schedule: {
          voting_start_period: values.voting_start_period.toISOString(),
          voting_end_period: values.voting_end_period.toISOString(),
          nomination_start_period: values.nomination_start_period.toISOString(),
          nomination_end_period: values.nomination_end_period.toISOString(),
        },
      },
    };

    updateExistingEvent(payload);
  };

  return (
    <DrawerContent className="border-none px-0">
      <div className="flex flex-col gap-4 overflow-y-auto text-sm">
        <div className="max-h-[20rem] min-h-[15rem] w-full">
          <Image
            src={data.img_url}
            alt="equipment details"
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-4"
        >
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label>Voting start</Label>
              <DatePicker
                value={watch("voting_start_period")}
                onChange={(date) => setValue("voting_start_period", date!)}
              />
              {errors.voting_start_period && (
                <span className="text-red-500">
                  {errors.voting_start_period.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Voting end</Label>
              <DatePicker
                value={watch("voting_end_period")}
                onChange={(date) => setValue("voting_end_period", date!)}
              />
              {errors.voting_end_period && (
                <span className="text-red-500">
                  {errors.voting_end_period.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Nomination start</Label>
              <DatePicker
                value={watch("nomination_start_period")}
                onChange={(date) => setValue("nomination_start_period", date!)}
              />
              {errors.nomination_start_period && (
                <span className="text-red-500">
                  {errors.nomination_start_period.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Nomination end</Label>
              <DatePicker
                value={watch("nomination_end_period")}
                onChange={(date) => setValue("nomination_end_period", date!)}
              />
              {errors.nomination_end_period && (
                <span className="text-red-500">
                  {errors.nomination_end_period.message}
                </span>
              )}
            </div>
          </div>

          <DrawerFooter className="mt-auto ml-auto flex flex-row gap-2">
            <Button className="h-10" type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button" className="h-10">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </div>
    </DrawerContent>
  );
}
