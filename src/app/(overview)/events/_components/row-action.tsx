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
import { EventResponse, UpdateEventPayload } from "@/interfaces/event";
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
  const { deleteEvent, updateEvent } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  /* 
  Using internal state to control the dropdown menu to avoid the issue of 
  the dropdown menu not closing when the submit button is clicked.
  */
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { removeEvent, setAllEvents, allEvents } = useAllEventsStore();

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

  const { mutateAsync: togglePublish, isPending: isPublishing } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: (id: string) => {
      const newIsPublished = !item.is_published;
      const payload = {
        is_published: newIsPublished,
      };
      return updateEvent(payload as UpdateEventPayload, id);
    },
    onMutate: async (id: string) => {
      const previousEvent = allEvents.find((event) => event.id === id);

      if (previousEvent) {
        const updatedEvent = {
          ...previousEvent,
          is_published: !previousEvent.is_published,
        };
        setAllEvents(
          allEvents.map((event) => (event.id === id ? updatedEvent : event)),
        );
      }
      setOpen(false);
      closeDropdown();

      return { previousEvent };
    },
    onError: (error, _, context) => {
      if (context?.previousEvent) {
        setAllEvents(
          allEvents
            .map((event) =>
              event.id === context.previousEvent!.id
                ? context.previousEvent
                : event,
            )
            .filter((e): e is EventResponse => e !== undefined),
        );
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error(
          `Something went wrong while toggling ${item.is_published ? "un publishing" : "publishing"} the event.`,
        );
      }
    },
    onSuccess: () => {
      toast.success(
        `Event ${item.is_published ? "unpublished" : "published"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] }),
  });

  const handlePublish = async () => {
    const id = String(item.id);
    await togglePublish(id);
  };

  const { mutateAsync: allowDisplayResults, isPending: isAllowingDisplay } =
    useMutation({
      mutationKey: [QUERY_KEYS.EVENTS],
      mutationFn: (id: string) => {
        const newDisplayResults = !item.display_results;
        const payload = {
          display_results: newDisplayResults,
        };
        return updateEvent(payload as UpdateEventPayload, id);
      },
      onMutate: async (id: string) => {
        const previousEvent = allEvents.find((event) => event.id === id);

        if (previousEvent) {
          const updatedEvent = {
            ...previousEvent,
            display_results: !previousEvent.display_results,
          };
          setAllEvents(
            allEvents.map((event) => (event.id === id ? updatedEvent : event)),
          );
        }
        setOpen(false);
        closeDropdown();

        return { previousEvent };
      },
      onError: (error, _, context) => {
        if (context?.previousEvent) {
          setAllEvents(
            allEvents
              .map((event) =>
                event.id === context.previousEvent!.id
                  ? context.previousEvent
                  : event,
              )
              .filter((e): e is EventResponse => e !== undefined),
          );
        }
        if (error instanceof AxiosError) {
          toast.error(formatJedError(error));
        } else {
          toast.error(
            `Something went wrong while toggling ${item.display_results ? "hiding" : "displaying"} the results.`,
          );
        }
      },
      onSuccess: () => {
        toast.success(
          `Results ${item.display_results ? "hidden" : "displayed"} successfully`,
        );
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      },
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] }),
    });

  const handleAllowDisplayResults = async () => {
    const id = String(item.id);
    await allowDisplayResults(id);
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
                isLoading={isPublishing}
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
                isLoading={isAllowingDisplay}
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
