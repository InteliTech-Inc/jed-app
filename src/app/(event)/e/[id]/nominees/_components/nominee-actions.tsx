"use client";

import {
  Drawer,
  DrawerContent,
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
import { copyToClipboard, formatJedError } from "@/lib/utils";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { AxiosError } from "axios";

interface NomineeActionsProps {
  nominee: Nominee;
}

export function NomineeActions({ nominee }: Readonly<NomineeActionsProps>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const { deleteNominee } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINEES],
    mutationFn: deleteNominee,
    onSuccess: () => {
      toast.success("Nominee deleted successfully");
    },
    onError: (error: AxiosError) => {
      if (error instanceof Error) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while deleting the nominee.");
      }
    },
  });

  const handleDelete = async () => {
    await mutateAsync(nominee.id);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINEES] });
  };

  const handleCopyCode = () => {
    try {
      copyToClipboard(nominee.code);
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
            isLoading={isPending}
            onSubmitEnd={() => setOpenDropdown(false)}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to delete{" "}
                <strong>{nominee.full_name}</strong>? This will permanently
                remove the nominee and all associated data. This action cannot
                be undone.
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
          <EditNomineeForm
            key={nominee.id}
            nominee={nominee}
            setOpen={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
