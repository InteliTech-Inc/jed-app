"use client";

import React from "react";
import {
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/spinner";
import { z } from "zod";
import { categorySchema } from "@/validations/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { toast } from "sonner";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEventStore } from "@/lib/stores/event-store";

type Props = {
  id: number;
  defaultName: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditEventCategories({
  defaultName,
  id,
  setOpen,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const { id: event_id } = useParams();
  const queryClient = useQueryClient();
  const { updateCategory, revertCategory, categories } = useEventStore();
  const { updateCategory: updateCategoryAPI } = QUERY_FUNCTIONS;

  const { mutate: updateExistingCategory, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS, event_id],
    mutationFn: async (data: z.infer<typeof categorySchema>) => {
      return updateCategoryAPI(data, String(id));
    },
    onMutate: async (newCategory) => {
      const previousCategory = categories.find(
        (category) => category.id === id,
      );
      if (previousCategory) {
        revertCategory(id, previousCategory.name);
        updateCategory(id, newCategory.name);
      }

      setOpen(false);
      return { previousCategory, newCategory };
    },
    onError: (error, newCategory, context) => {
      if (context?.previousCategory) {
        revertCategory(id, context.previousCategory.name);
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong while updating the category.");
      }
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS, event_id],
      });
    },
  });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    updateExistingCategory({ name: data.name });
  };

  return (
    <DrawerContent className="border-none px-0">
      <div className="flex flex-col gap-4 overflow-y-auto text-sm">
        <div className="p-4">
          <h2 className="mb-2 text-xl font-semibold text-neutral-700">
            Edit Categories
          </h2>
          <p className="text-neutral-600">
            Update the name of the category. This will be reflected in all
            nominees under this category.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-4"
        >
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
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
