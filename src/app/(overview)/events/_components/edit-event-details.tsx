import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormValues } from "@/validations/event";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { UpdateEventPayload, EventResponse } from "@/interfaces/event";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { Spinner } from "@/components/spinner";
import { formatJedError } from "@/lib/utils";
import Image from "next/image";
import { AxiosError } from "axios";
import { ImageIcon, X } from "lucide-react";

export default function EditEventDetails({
  data,
  drawerState,
}: Readonly<{
  data: EventResponse;
  drawerState: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [imageData, setImageData] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.media?.[0]?.url ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateEvent, uploadImage } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      voting_start_period: data.schedule?.voting_start_period
        ? new Date(data.schedule.voting_start_period)
        : new Date(),
      voting_end_period: data.schedule?.voting_end_period
        ? new Date(data.schedule.voting_end_period)
        : new Date(),
      nomination_start_period: data.schedule?.nomination_start_period
        ? new Date(data.schedule.nomination_start_period)
        : new Date(),
      nomination_end_period: data.schedule?.nomination_end_period
        ? new Date(data.schedule.nomination_end_period)
        : new Date(),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const { mutateAsync: updateExistingEvent, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: async (payload: { id: string; data: UpdateEventPayload }) => {
      return updateEvent(payload.data, payload.id);
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      if (!imageData) {
        drawerState(false);
      }
    },
    onError: (error: AxiosError) => {
      if (error instanceof Error) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while updating the event.");
      }
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setImageData(selectedFile);
      setPhotoPreview(fileUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: EventFormValues) => {
    const payload = {
      id: String(data.id),
      data: {
        ...data,
        name: values.name,
        description: values.description,
        voting_period: {
          start_date: values.voting_start_period?.toISOString(),
          end_date: values.voting_end_period?.toISOString(),
        },
        nomination_period: {
          start_date: values.nomination_start_period?.toISOString(),
          end_date: values.nomination_end_period?.toISOString(),
        },
      },
    };

    await updateExistingEvent(payload);

    if (imageData) {
      try {
        setIsUploading(true);
        const uploadedImage = await uploadImage({
          file: imageData,
          event_id: data.id,
        });
        if (uploadedImage) {
          toast.success("Image uploaded successfully.");
          drawerState(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(formatJedError(error));
        } else {
          toast.error("Image upload failed.");
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <DrawerContent className="border-none px-0">
      <div className="flex flex-col gap-4 overflow-y-auto text-sm">
        <button
          type="button"
          className="relative flex max-h-[20rem] min-h-[15rem] w-full items-center justify-center overflow-hidden border border-dashed border-gray-300 bg-gray-50"
          onClick={handleImageClick}
        >
          {photoPreview ? (
            <>
              <Image
                src={photoPreview}
                alt="Event image"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageData(null);
                  setPhotoPreview(null);
                }}
                className="absolute top-2 right-2 z-10 rounded-full bg-white p-1 shadow-md transition hover:bg-red-100"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Spinner />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-8 w-8" />
              <span className="mt-1 text-sm">Click to add image</span>
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-4"
        >
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.tools.voting && (
              <>
                <div className="flex flex-col gap-3">
                  <Label>Voting start</Label>
                  <DatePicker
                    value={watch("voting_start_period")}
                    onChange={(date) => setValue("voting_start_period", date)}
                  />
                  {errors.voting_start_period && (
                    <span className="text-red-500">
                      {errors.voting_start_period.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Voting end</Label>
                  <DatePicker
                    value={watch("voting_end_period")}
                    onChange={(date) => setValue("voting_end_period", date)}
                  />
                  {errors.voting_end_period && (
                    <span className="text-red-500">
                      {errors.voting_end_period.message}
                    </span>
                  )}
                </div>
              </>
            )}

            {data.tools.nominations && (
              <>
                <div className="flex flex-col gap-3">
                  <Label>Nomination start</Label>
                  <DatePicker
                    value={watch("nomination_start_period")}
                    onChange={(date) =>
                      setValue("nomination_start_period", date)
                    }
                  />
                  {errors.nomination_start_period && (
                    <span className="text-red-500">
                      {errors.nomination_start_period.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Nomination end</Label>
                  <DatePicker
                    value={watch("nomination_end_period")}
                    onChange={(date) => setValue("nomination_end_period", date)}
                  />
                  {errors.nomination_end_period && (
                    <span className="text-red-500">
                      {errors.nomination_end_period.message}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <DrawerFooter className="mt-auto ml-auto flex flex-row gap-2">
            <Button
              className="h-10"
              type="submit"
              disabled={isPending || isUploading}
            >
              {isPending || isUploading ? <Spinner /> : "Save"}
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
