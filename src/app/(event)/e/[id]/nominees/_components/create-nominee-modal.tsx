"use client";

import { useState, useRef } from "react";
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
import { IconCamera, IconRefresh, IconPlus } from "@tabler/icons-react";
import { generateCode } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/spinner";

export function CreateNomineeModal() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("/placeholder-avatar.png");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    code: "",
    photo: "/placeholder-avatar.png",
  });

  const availableCategories = [
    "Best Actor",
    "Best Actress",
    "Best Supporting Actor",
    "Best Supporting Actress",
    "Best Director",
    "Best Screenplay",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPhotoPreview(fileUrl);
      setFormData({ ...formData, photo: fileUrl });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleGenerateCode = () => {
    const newCode = generateCode();
    setFormData({ ...formData, code: newCode });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.category || !formData.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsOpen(false);
      toast.success("Nominee created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create nominee");
    } finally {
      setIsLoading(false);
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
            onSubmit={handleSubmit}
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  name="code"
                  placeholder="Click to generate"
                  value={formData.code}
                  onChange={handleInputChange}
                  readOnly
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGenerateCode}
                  size="sm"
                  className="h-9 flex-shrink-0 rounded-full text-sm"
                >
                  Generate
                  <IconRefresh className="ml-1 h-2 w-2" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button
            form="create-nominee-form"
            type="submit"
            className="h-10"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Create Nominee"}
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
