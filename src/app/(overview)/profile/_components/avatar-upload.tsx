"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar: string;
  userName: string;
  onAvatarChange: (avatar: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Here you would normally upload the file to your server or storage
      // For now, we'll create a local URL to simulate the upload
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          // In a real app, you'd send this file to your server and get back a URL
          const newAvatarUrl = event.target.result as string;
          onAvatarChange(newAvatarUrl);
          toast.success("Profile picture updated successfully");
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    // Set to default avatar or placeholder
    onAvatarChange("");
    toast.success("Profile picture removed");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={currentAvatar}
          alt={userName}
          className="object-cover object-center"
        />
        <AvatarFallback>
          {userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleFileSelect}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Change"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700"
          onClick={handleRemoveAvatar}
          disabled={isUploading || !currentAvatar}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
