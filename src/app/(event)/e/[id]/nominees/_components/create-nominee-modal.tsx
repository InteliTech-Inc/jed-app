"use client";

import React, { useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCamera, IconPlus } from "@tabler/icons-react";
import { formatJedError } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QUERY_FUNCTIONS from "@/lib/functions/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NomineeFormData, nomineeSchema } from "@/validations/nominee";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useParams } from "next/navigation";
import { useNomineeStore } from "@/lib/stores/nominee-store";

export interface CategoryResponse {
  id: string;
  name: string;
  event_id: string;
}

type LocalNominee = {
  id: string;
  full_name: string;
  category_id: string;
  name: string;
  category: string;
  media: {
    url: string;
    public_id: string;
  };
  code: string;
  img_public_id: string;
};

export function CreateNomineeModal() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("/placeholder-avatar.png");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { id: event_id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<NomineeFormData>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      full_name: "",
      category: "",
    },
  });

  const { fetchCategories, createNominee, uploadImage } = QUERY_FUNCTIONS;
  const { addNominees, removeNominee } = useNomineeStore();

  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategories,
  });

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const fileUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPhotoPreview(fileUrl);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINEES],
    mutationFn: createNominee,
    onMutate: async (newNominee) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.NOMINEES],
      });

      const selectedCategory = categories?.data.categories.find(
        (cat: CategoryResponse) => cat.id === newNominee.category_id,
      );

      const tempNominee = {
        id: `temp_${Date.now()}_${Math.random()}`,
        full_name: newNominee.full_name,
        category: selectedCategory.name ?? "Unknown Category",
      };

      addNominees(tempNominee as LocalNominee);

      setIsOpen(false);

      return { tempNominee };
    },
    onError: (error, _, context) => {
      if (context?.tempNominee) {
        removeNominee(context.tempNominee.id);
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
    },
  });

  const onSubmit = async (data: NomineeFormData) => {
    const { full_name, category } = data;

    const nomineePayload = {
      full_name,
      category_id: category,
      event_id: String(event_id),
    };

    try {
      const response = await mutateAsync(nomineePayload);

      if (response.data) {
        setIsUploading(true);
        const uploadedImage = await uploadImage({
          file: file!,
          nominee_id: response.data.id,
        });

        if (uploadedImage) {
          toast.success("Image uploaded successfully.");
          setPhotoPreview("");
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.NOMINEES],
          });
        }
      }
      setIsOpen(false);
      reset();
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
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-1">
          <IconPlus className="size-4" />
          Add Nominee
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Create Nominee</DrawerTitle>
        <div className="p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-neutral-700">
            Create Nominee
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            Add a new nominee to your event. Fill in all the required
            information below.
          </p>

          <form
            id="create-nominee-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarImage src={photoPreview} alt="Nominee photo" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 absolute -bottom-2 -left-2 size-8 rounded-full shadow-md"
                  onClick={triggerFileInput}
                >
                  <IconCamera className="size-4" />
                  <span className="sr-only">Upload photo</span>
                </Button>
                <Input
                  ref={fileInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...register("full_name")}
                placeholder="John Doe"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.data.categories
                    ?.filter(
                      (category: CategoryResponse) =>
                        category.event_id === event_id,
                    )
                    .map((category: CategoryResponse) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button
            form="create-nominee-form"
            type="submit"
            className="h-10"
            disabled={isPending || isUploading}
          >
            {isPending || isUploading ? <Spinner /> : "Create Nominee"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="h-10">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
