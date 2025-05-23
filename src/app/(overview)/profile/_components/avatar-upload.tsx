"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { formatJedError } from "@/lib/utils";
import { AxiosError } from "axios";
import { Spinner } from "@/components/spinner";

interface AvatarUploadProps {
  currentAvatar: string;
  userName: string;
  onAvatarChange: (avatar: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
}: Readonly<AvatarUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { uploadImage } = QUERY_FUNCTIONS;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const { mutateAsync: uploadImageAsync, isPending: isUploading } = useMutation(
    {
      mutationKey: [QUERY_KEYS.USER],
      mutationFn: async (payload: { data: File; user_id: string }) =>
        uploadImage({ file: payload.data, user_id: payload.user_id }),
      onSuccess: () => {
        toast.success("Profile picture updated successfully");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(formatJedError(error));
        } else {
          toast.error("An error occurred while updating the profile.");
        }
      },
    },
  );

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

    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const newAvatarUrl = event.target.result as string;
        onAvatarChange(newAvatarUrl);
        await uploadImageAsync({ data: file, user_id: user?.id! });
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
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
          {isUploading ? <Spinner /> : "Change"}
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
