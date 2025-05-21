"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useParams } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoriesPayload } from "@/interfaces/categories";
import { categoriesSchema, FormData } from "@/validations/category";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";

export function CreateEventCategoriesModal() {
  const isMobile = useIsMobile();
  const { id: event_id } = useParams();
  const queryClient = useQueryClient();
  const { createCategory } = QUERY_FUNCTIONS;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      categories: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.CATEGORIES],
    mutationFn: async (data: CategoriesPayload[]) => createCategory({ data }),
    onSuccess: () => {
      toast.success("Categories created successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
      toast.error("Failed to create categories.");
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload = data.categories.map((category) => ({
      name: category.name.trim(),
      event_id: String(event_id),
    }));
    await mutateAsync(payload);
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-1" variant="secondary">
          <IconPlus className="size-4" />
          Add Categories
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Create Categories</DrawerTitle>
        <div className="p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-neutral-700">
            Create Category
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            You can create up to 5 categories for this event.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor={`categories.${index}.name`}>
                    Category Name
                  </Label>
                  <Input
                    id={`categories.${index}.name`}
                    {...register(`categories.${index}.name`)}
                    placeholder="e.g. Best Actor"
                  />
                  {errors.categories?.[index]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.categories[index]?.name?.message}
                    </p>
                  )}
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-6 text-red-600"
                  >
                    <IconTrash size={18} />
                  </button>
                )}
              </div>
            ))}
            {fields.length < 5 && (
              <Button
                className="inline-flex items-center gap-0"
                type="button"
                variant="secondary"
                onClick={() => append({ name: "" })}
              >
                <PlusIcon />
                Add Field
              </Button>
            )}
          </form>
        </div>
        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button
            type="submit"
            form="create-categories-form"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Create Categories"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
