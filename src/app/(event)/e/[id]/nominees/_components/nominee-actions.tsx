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
import { EditNomineeForm } from "./edit-nominee-form";
import {
  IconClipboard,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Nominee } from "./columns";
import { ModalWrapper } from "@/components/modal";
import { toast } from "sonner";

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface NomineeActionsProps {
  nominee: Nominee;
}

export function NomineeActions({ nominee }: NomineeActionsProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [formData, setFormData] = React.useState(nominee);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await delay(1000);

      toast.success("Nominee deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete nominee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await delay(1000);

      setOpen(false);
      toast.success("Nominee updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update nominee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(nominee.code);
      toast.info("Code copied to clipboard", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy code", {
        position: "bottom-right",
      });
    }
  };

  const handleFormUpdate = (updatedData: Nominee) => {
    setFormData(updatedData);
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
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DrawerTrigger>
          <DropdownMenuItem
            onClick={handleCopyCode}
            className="hover:bg-gray-50"
          >
            <IconClipboard className="mr-2 h-4 w-4" />
            Copy Code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ModalWrapper
            title="Delete Nominee"
            description={`Permanently delete nominee?`}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                variant="destructive"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            }
            onSubmit={handleDelete}
            cancelText="Cancel"
            submitText="Yes, delete"
            isLoading={isLoading}
            onSubmitEnd={() => setOpenDropdown(false)}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to delete {nominee.fullName}? This will
                permanently remove the nominee and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Edit Nominee</DrawerTitle>
        <div className="p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-neutral-700">
            Edit Nominee
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            Make changes to the nominee profile here. Click save when you're
            done.
          </p>
          <EditNomineeForm nominee={nominee} onFormChange={handleFormUpdate} />
        </div>
        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <Button
            type="button"
            onClick={handleSave}
            className="h-10"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save changes"}
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
