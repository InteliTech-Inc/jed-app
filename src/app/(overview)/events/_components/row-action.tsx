"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { AllEvents } from "../page";
import { ModalWrapper } from "@/components/modal";
import { toast } from "sonner";
import Link from "next/link";

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function RowActions({ item }: { item: AllEvents }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  /* 
  Using internal state to control the dropdown menu to avoid the issue of 
  the dropdown menu not closing when the submit button is clicked.
  */
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await delay(3000);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      await delay(3000);
      toast.success(
        `Event ${item.isPublished ? "unpublished" : "published"} successfully`,
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
        `Results ${item.displayResults ? "hidden" : "displayed"} successfully`,
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
          {item.approvalStatus === "approved" && (
            <>
              <DropdownMenuSeparator />
              <ModalWrapper
                title="Publish Event"
                description={`Make the event visible to the public?`}
                trigger={
                  <DropdownMenuItem
                    disabled={item.approvalStatus !== "approved"}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {item.isPublished ? (
                      <IconLivePhotoOff />
                    ) : (
                      <IconLivePhoto />
                    )}
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                }
                onSubmit={handlePublish}
                cancelText="Cancel"
                submitText={item.isPublished ? "Unpublish" : "Publish"}
                isLoading={isLoading}
                onSubmitEnd={closeDropdown}
              >
                <div className="py-2">
                  <p className="">
                    Are you sure you want to{" "}
                    {item.isPublished ? "unpublish" : "publish"} the {item.name}{" "}
                    event? This will make the event{" "}
                    {item.isPublished ? "hidden" : "visible"} on the events
                    page.
                  </p>
                </div>
              </ModalWrapper>
              <ModalWrapper
                title={`${item.displayResults ? "Hide" : "Display "} Results`}
                description={`Make the results of the event visible to the public?`}
                trigger={
                  <DropdownMenuItem
                    disabled={!item.isPublished}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {item.displayResults ? <IconEyeOff /> : <IconEye />}
                    {item.displayResults ? "Hide" : "Display "} results
                  </DropdownMenuItem>
                }
                onSubmit={handleAllowDisplayResults}
                cancelText="Cancel"
                submitText={item.displayResults ? "Hide" : "Display "}
                isLoading={isLoading}
                onSubmitEnd={closeDropdown}
              >
                <div className="py-2">
                  <p className="">
                    Are you sure you want to{" "}
                    {item.displayResults ? "hide" : "display"} the results of
                    the {item.name} event?{" "}
                    {item.displayResults
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
            isLoading={isLoading}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to delete the {item.name} event? This will
                permanently remove the event and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Edit Event</DrawerTitle>
        <EditEventDetails data={item} />
        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button className="h-10">Submit</Button>
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
