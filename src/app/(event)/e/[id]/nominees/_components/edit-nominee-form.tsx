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
import { generateCode } from "@/lib/utils";
import { IconRefresh, IconCamera } from "@tabler/icons-react";

interface EditNomineeFormProps {
  nominee: Nominee;
  categories?: string[]; // maybe the categories will be fetched from the parent component
  onFormChange?: (updatedNominee: Nominee) => void;
}

export function EditNomineeForm({
  nominee,
  categories = [],
  onFormChange,
}: EditNomineeFormProps) {
  const [photoPreview, setPhotoPreview] = useState(nominee.photo);
  const [formData, setFormData] = useState({
    id: nominee.id,
    fullName: nominee.fullName,
    category: nominee.category,
    code: nominee.code,
    photo: nominee.photo,
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "Best Actor",
    "Best Actress",
    "Best Supporting Actor",
    "Best Supporting Actress",
    "Best Director",
    "Best Screenplay",
  ]);

  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form id="edit-nominee-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="size-24">
            <AvatarImage src={photoPreview} alt={formData.fullName} />
            <AvatarFallback>{formData.fullName.charAt(0)}</AvatarFallback>
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
        <Select value={formData.category} onValueChange={handleCategoryChange}>
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

      {/* Add some bottom spacing */}
      <div className="h-10"></div>
    </form>
  );
}
