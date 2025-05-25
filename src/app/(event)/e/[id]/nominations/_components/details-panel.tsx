"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NominationsResponse } from "../page";
import * as React from "react";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { updateNomineeSchema } from "@/validations/nominee";
import { useNominationStore } from "@/lib/stores/nomination-store";

export interface UpdateNominationVariables {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
}

export default function NominationDetailsPanel({
  data,
  setOpen,
}: Readonly<{
  data: NominationsResponse;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const { updateNomination: updateNominationAPI } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();
  const { updateNomination, nominations } = useNominationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateNomineeSchema>>({
    resolver: zodResolver(updateNomineeSchema),
    defaultValues: {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
    },
  });

  const { mutateAsync: updateNominationMutation, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINATIONS],
    mutationFn: async (payload: UpdateNominationVariables) => {
      return updateNominationAPI(payload, String(data.id));
    },
    onMutate: async (payload) => {
      const previousNominations = nominations.find(
        (nomination) => nomination.id === payload.id,
      );

      if (previousNominations) {
        const updatedNomination = { ...previousNominations, ...payload };
        updateNomination(payload.id!, updatedNomination);
      }

      setOpen(false);

      return { previousNominations };
    },
    onError: (error, _, context) => {
      if (context?.previousNominations) {
        updateNomination(
          context.previousNominations.id,
          context.previousNominations as any,
        );
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while updating the nomination.");
      }
    },
    onSuccess: () => {
      toast.success("Nomination updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINATIONS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINATIONS] });
    },
  });

  const onSubmit = async (payload: z.infer<typeof updateNomineeSchema>) => {
    await updateNominationMutation({ ...payload, id: String(data.id) });
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto text-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-screen flex-col justify-between gap-5 p-4"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={data.full_name}
              {...register("full_name")}
            />
            {errors.full_name && (
              <span className="text-red-500">{errors.full_name.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              defaultValue={data.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              defaultValue={data.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="limit">Reasons</Label>
            <p>{data.reasons}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="limit">Category</Label>
            <p>{data.category.name}</p>
          </div>
        </div>
        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button
            className="h-10"
            type="submit"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? <Spinner /> : "Submit"}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="h-10"
              type="button"
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </div>
  );
}
