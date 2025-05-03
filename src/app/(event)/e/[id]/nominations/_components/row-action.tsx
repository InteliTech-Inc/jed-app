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
import NominationDetailsPanel from "./details-panel";
import {
  IconDotsVertical,
  IconTrash,
  IconEye,
  IconPlus,
  IconSend,
  IconClipboard,
} from "@tabler/icons-react";
import { NominationsResponse } from "../page";
import { ModalWrapper } from "@/components/modal";
import { toast } from "sonner";

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function RowActions({ item }: { item: NominationsResponse }) {
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
      toast.success("Nomination deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete nomination");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNominee = async () => {
    try {
      setIsLoading(true);
      await delay(3000);
      toast.success("Nominee added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add nominee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setIsLoading(true);
      await delay(3000);
      toast.success("Email sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (label: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.info(`Copied ${label} to clipboard`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy to clipboard");
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
              <IconEye />
              View details
            </DropdownMenuItem>
          </DrawerTrigger>
          <DropdownMenuItem
            onClick={() => handleCopyToClipboard("email", item.email)}
            className="hover:bg-gray-50"
          >
            <IconClipboard />
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleCopyToClipboard("phone", item.phone)}
            className="hover:bg-gray-50"
          >
            <IconClipboard />
            Copy Phone
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <ModalWrapper
            title="Add as nominee"
            trigger={
              <DropdownMenuItem
                // disabled={item.approvalStatus !== "approved"}
                onSelect={(e) => e.preventDefault()}
              >
                <IconPlus />
                Add as nominee
              </DropdownMenuItem>
            }
            onSubmit={handleAddNominee}
            cancelText="Cancel"
            submitText={"Add"}
            isLoading={isLoading}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to add this person as a nominee to the{" "}
                {item.categories.name} category?
              </p>
            </div>
          </ModalWrapper>
          <ModalWrapper
            title="Send email"
            trigger={
              <DropdownMenuItem
                // disabled={item.approvalStatus !== "approved"}
                onSelect={(e) => e.preventDefault()}
              >
                <IconSend />
                Send email
              </DropdownMenuItem>
            }
            onSubmit={handleSendEmail}
            cancelText="Cancel"
            submitText={"Send"}
            isLoading={isLoading}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to send a confirmation email to{" "}
                {item.full_name} that they have been added as final nominee to
                the {item.categories.name} category?
              </p>
            </div>
          </ModalWrapper>
          <DropdownMenuSeparator />
          <ModalWrapper
            title="Delete Nomination"
            description={`Permanently delete nomination and all associated data?`}
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
                Are you sure you want to delete the nomination? This will
                permanently remove the nomination and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Edit Nomination</DrawerTitle>
        <NominationDetailsPanel data={item} />
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
