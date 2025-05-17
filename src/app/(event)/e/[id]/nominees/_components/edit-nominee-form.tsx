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

interface EditNomineeFormProps {
  nominee: Nominee;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditNomineeForm({
  nominee,
  setOpen,
}: Readonly<EditNomineeFormProps>) {
  const [photoPreview, setPhotoPreview] = useState(nominee.photo);
  const [formData, setFormData] = useState({
    id: nominee.id,
    full_name: nominee.full_name,
    category: nominee.category,
    code: nominee.code,
    photo: nominee.photo,
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchCategories, updateNominee } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    setFormData({
      id: nominee.id,
      full_name: nominee.full_name,
      category: nominee.category,
      code: nominee.code,
      photo: nominee.photo,
    });
    setPhotoPreview(nominee.photo);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPhotoPreview(fileUrl);
      setFormData((prev) => ({ ...prev, photo: fileUrl }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const { mutate: updateExistingNominee, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINEES],
    mutationFn: async (payload: { data: any; id: string }) => {
      return await updateNominee(payload.data, payload.id);
    },
    onSuccess: () => {
      toast.success("Nominee updated successfully");
      setOpen(false);
    },
    onError: (error: AxiosError) => {
      if (error instanceof Error) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while creating the nominee.");
      }
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExistingNominee({ data: formData, id: nominee.id });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINEES] });
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
              <AvatarImage src={photoPreview} alt={formData.full_name} />
              <AvatarFallback>{formData.full_name.charAt(0)}</AvatarFallback>
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
            name="full_name"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData?.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category" className="w-full">
              {formData?.category || "Select a category"}
            </SelectTrigger>
            <SelectContent>
              {categories?.data.categories?.map(
                (category: CategoryResponse) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-10" />

      <DrawerFooter className="mt-auto ml-auto flex flex-row gap-2">
        <Button type="submit" className="h-10" disabled={isPending}>
          {isPending ? <Spinner /> : "Save changes"}
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
