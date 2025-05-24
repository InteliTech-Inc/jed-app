"use client";

import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditEventDetails from "./edit-event-details";
import {
  IconDotsVertical,
  IconEdit,
  IconAdjustmentsAlt,
  IconTrash,
  IconEye,
  IconLivePhoto,
  IconEyeOff,
  IconLivePhotoOff,
} from "@tabler/icons-react";
import { EventResponse } from "@/interfaces/event";
import { ModalWrapper } from "@/components/modal";
import { toast } from "sonner";
import Link from "next/link";
import { formatJedError, transformToLowerCase } from "@/lib/utils";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAllEventsStore } from "@/lib/stores/all-events-store";
import { AxiosError } from "axios";

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function RowActions({ item }: Readonly<{ item: EventResponse }>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { deleteEvent } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  /* 
  Using internal state to control the dropdown menu to avoid the issue of 
  the dropdown menu not closing when the submit button is clicked.
  */
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { removeEvent, setAllEvents } = useAllEventsStore();

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  const { mutate: deleteSingleEvent, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: (id: string) => deleteEvent(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.EVENTS] });

      removeEvent(id);
      setOpen(false);
      closeDropdown();

      const previousEvents = queryClient.getQueryData<{
        data: { events: EventResponse[] };
      }>([QUERY_KEYS.EVENTS]);

      return { previousEvents };
    },
    onError(error, _, context) {
      if (context?.previousEvents) {
        setAllEvents(context.previousEvents.data.events);
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });

  const handleDelete = async () => {
    const id = String(item.id);
    deleteSingleEvent(id);
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      await delay(3000);
      toast.success(
        `Event ${item.is_published ? "unpublished" : "published"} successfully`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllowDisplayResults = async () => {
    setIsLoading(true);
    try {
      await delay(3000);
      toast.success(
        `Results ${item.display_results ? "hidden" : "displayed"} successfully`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to allow display results");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="bg-muted text-muted-foreground my-2 flex size-8 hover:bg-gray-100"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DrawerTrigger asChild>
            <DropdownMenuItem className="hover:bg-gray-50">
              <IconEdit />
              Quick edit
            </DropdownMenuItem>
          </DrawerTrigger>
          <DropdownMenuItem className="hover:bg-gray-50">
            <Link
              href={`/e/${item.id}/`}
              className="flex w-full items-center gap-2"
            >
              <IconAdjustmentsAlt />
              Manage
            </Link>
          </DropdownMenuItem>
          {transformToLowerCase(item.approval_status) === "approved" && (
            <>
              <DropdownMenuSeparator />
              <ModalWrapper
                title="Publish Event"
                description={`Make the event visible to the public?`}
                trigger={
                  <DropdownMenuItem
                    disabled={
                      transformToLowerCase(item.approval_status) !== "approved"
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {item.is_published ? (
                      <IconLivePhotoOff />
                    ) : (
                      <IconLivePhoto />
                    )}
                    {item.is_published ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                }
                onSubmit={handlePublish}
                cancelText="Cancel"
                submitText={item.is_published ? "Unpublish" : "Publish"}
                isLoading={isLoading}
                onSubmitEnd={closeDropdown}
              >
                <div className="py-2">
                  <p className="">
                    Are you sure you want to{" "}
                    {item.is_published ? "unpublish" : "publish"} the{" "}
                    {item.name} event? This will make the event{" "}
                    {item.is_published ? "hidden" : "visible"} on the events
                    page.
                  </p>
                </div>
              </ModalWrapper>
              <ModalWrapper
                title={`${item.display_results ? "Hide" : "Display "} Results`}
                description={`Make the results of the event visible to the public?`}
                trigger={
                  <DropdownMenuItem
                    disabled={!item.is_published}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {item.display_results ? <IconEyeOff /> : <IconEye />}
                    {item.display_results ? "Hide" : "Display "} results
                  </DropdownMenuItem>
                }
                onSubmit={handleAllowDisplayResults}
                cancelText="Cancel"
                submitText={item.display_results ? "Hide" : "Display "}
                isLoading={isLoading}
                onSubmitEnd={closeDropdown}
              >
                <div className="py-2">
                  <p className="">
                    Are you sure you want to{" "}
                    {item.display_results ? "hide" : "display"} the results of
                    the {item.name} event?{" "}
                    {item.display_results
                      ? "This will make the results of the event hidden from the public."
                      : "This will make the results of the event visible to the public."}
                  </p>
                </div>
              </ModalWrapper>
            </>
          )}
          <DropdownMenuSeparator />
          <ModalWrapper
            title="Delete Event"
            description={`Permanently delete event and all associated data?`}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                variant="destructive"
              >
                <IconTrash />
                Delete
              </DropdownMenuItem>
            }
            onSubmit={handleDelete}
            cancelText="Cancel"
            submitText="Yes, delete"
            isLoading={isPending}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to delete the <strong>{item.name}</strong>{" "}
                event? This will permanently remove the event and all associated
                data. This action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditEventDetails data={item} drawerState={setOpen} />
    </Drawer>
  );
}
