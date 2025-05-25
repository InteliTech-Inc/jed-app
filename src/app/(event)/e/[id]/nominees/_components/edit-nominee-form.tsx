"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Nominee } from "./columns";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { IconCamera } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { CategoryResponse } from "./create-nominee-modal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/spinner";
import { useParams } from "next/navigation";
import { useNomineeStore } from "@/lib/stores/nominee-store";

interface EditNomineeFormProps {
  nominee: Nominee;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  id: string;
  full_name: string;
  category: string;
  category_id: string;
  code: string;
  img_url: string | null;
  img_public_id: string;
}

export function EditNomineeForm({
  nominee,
  setOpen,
}: Readonly<EditNomineeFormProps>) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    nominee.media?.url ?? null,
  );
  const [formData, setFormData] = useState<FormData>({
    id: nominee.id,
    full_name: nominee.full_name,
    category: nominee.category ?? "",
    category_id: nominee.category_id ?? "",
    code: nominee.code,
    img_url: nominee.media?.url ?? null,
    img_public_id: nominee.img_public_id ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    fetchCategories,
    updateNominee: updateNomineeAPI,
    uploadImage,
  } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategories,
  });

  const { id: event_id } = useParams();
  const { updateNominee, nominees } = useNomineeStore();

  const getCategoryName = (categoryId: string) => {
    const category = categories?.data.categories?.find(
      (cat: CategoryResponse) => cat.id === categoryId,
    );

    return category?.name ?? "Select a category";
  };

  useEffect(() => {
    const initialData: FormData = {
      id: nominee.id,
      full_name: nominee.full_name,
      category: nominee.category ?? "",
      category_id: nominee.category_id ?? "",
      code: nominee.code,
      img_url: nominee.media?.url ?? null,
      img_public_id: nominee.img_public_id ?? "",
    };
    setFormData(initialData);
    setPhotoPreview(nominee.media?.url ?? null);
    setFile(null);
  }, [nominee.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPhotoPreview(fileUrl);
    }
  };

  const handleCategoryChange = (value: string) => {
    const catName =
      categories?.data.categories?.find(
        (cat: CategoryResponse) => cat.id === value,
      )?.name ?? "";

    setFormData((prev) => ({
      ...prev,
      category_id: value,
      category: catName,
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const { mutateAsync: updateExistingNominee, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINEES, nominee.id],
    mutationFn: async (payload: { data: FormData; id: string }) => {
      const dataToSend = {
        ...payload.data,
      };
      return updateNomineeAPI(dataToSend, payload.id);
    },
    onMutate: async (payload) => {
      const previousNominee = nominees.find(
        (nominee) => nominee.id === payload.id,
      );

      if (previousNominee) {
        const updatedNominee = { ...previousNominee, ...payload.data };
        updateNominee(payload.id, updatedNominee);
      }
      setOpen(false);
      return { previousNominee };
    },
    onError: (error, _, context) => {
      if (context?.previousNominee) {
        updateNominee(
          context.previousNominee.id,
          context.previousNominee as any,
        );
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong while updating nominee.");
      }
    },
    onSuccess: () => {
      toast.success("Nominee updated successfully");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOMINEES],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOMINEES],
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      await updateExistingNominee({ data: formData, id: nominee.id });

      if (file) {
        const uploaded = await uploadImage({
          file,
          nominee_id: nominee.id,
        });

        if (uploaded) {
          setFormData((prev) => ({
            ...prev,
            img_url: uploaded.url,
            img_public_id: uploaded.public_id,
          }));
          toast.success("Image uploaded successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINEES] });
        }
      }
      setOpen(false);
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
    <form
      id="edit-nominee-form"
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-end"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage
                src={photoPreview ?? ""}
                alt={formData.full_name}
                className="aspect-square object-cover"
              />
              <AvatarFallback>
                {formData.full_name?.charAt(0) || "N"}
              </AvatarFallback>
            </Avatar>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-500 opacity-50">
                <Spinner />
              </div>
            )}
            <Button
              type="button"
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90 absolute -bottom-2 -left-2 size-8 rounded-full shadow-md"
              onClick={triggerFileInput}
              disabled={isUploading}
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
            name="full_name"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={handleCategoryChange}
            disabled={categoriesLoading}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category">
                {categoriesLoading
                  ? "Loading categories..."
                  : getCategoryName(formData.category_id)}
              </SelectValue>
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
        </div>
      </div>

      <div className="h-10" />

      <DrawerFooter className="mt-auto ml-auto flex flex-row gap-2">
        <Button
          type="submit"
          className="h-10"
          disabled={isPending || categoriesLoading || isUploading}
        >
          {isPending || isUploading ? <Spinner /> : "Save changes"}
        </Button>
        <DrawerClose asChild>
          <Button variant="outline" className="h-10">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
}
