"use client";

import * as React from "react";
import { useState } from "react";
import { useCreateEventStore } from "@/lib/stores/create-event-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Spinner } from "@/components/spinner";

export function BasicInfoStep() {
  const { name, description, updateBasicInfo, isUploading, imageUrl } =
    useCreateEventStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    updateBasicInfo({ name, description, image: file, imageUrl });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    updateBasicInfo({ name, description, image: null, imageUrl: null });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          placeholder="Enter event name"
          value={name}
          className="h-12"
          onChange={(e) =>
            updateBasicInfo({
              name: e.target.value,
              description,
              image: null,
              imageUrl,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Event Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event"
          maxLength={200}
          rows={4}
          value={description}
          onChange={(e) =>
            updateBasicInfo({
              name,
              description: e.target.value,
              imageUrl,
              image: null,
            })
          }
        />
        <p className="text-xs text-gray-500">{description.length} / 200</p>
      </div>

      <div className="space-y-2">
        <Label>Event Image</Label>

        {!imagePreview ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-6">
            <IconUpload className="size-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
            <Button
              variant="outline"
              size={"sm"}
              className="text-xs"
              onClick={() => document.getElementById("event-image")?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Spinner size="sm" /> : "Select Image"}
            </Button>
            <Input
              id="event-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg">
            <div className="relative aspect-video w-full">
              <img
                src={imagePreview}
                alt="Event preview"
                className="h-full w-full object-cover object-top"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <Spinner />
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 size-8 rounded-full"
              onClick={removeImage}
            >
              <IconX className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
