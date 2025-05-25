"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
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
import { copyToClipboard, formatJedError } from "@/lib/utils";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { AxiosError } from "axios";
import { Nominee } from "@/interfaces/event";
import { useNominationStore } from "@/lib/stores/nomination-store";

export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function RowActions({ item }: { readonly item: NominationsResponse }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [openDropdown, setOpenDropdown] = React.useState(false);

  const { createNominee, deleteNomination, sendNominationEmail } =
    QUERY_FUNCTIONS;
  const queryClient = useQueryClient();
  const { removeNomination, setNominations } = useNominationStore();

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  const {
    mutateAsync: deleteExistingNomination,
    isPending: isDeletingNomination,
  } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINATIONS],
    mutationFn: deleteNomination,
    onMutate: async (nominationId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.NOMINATIONS, nominationId],
      });

      removeNomination(nominationId);
      setOpen(false);
      closeDropdown();

      const previousNominations = queryClient.getQueryData<{
        data: { nominations: NominationsResponse[] };
      }>([QUERY_KEYS.NOMINATIONS]);

      const nominationToRemove = previousNominations?.data.nominations.find(
        (n) => n.id === nominationId,
      );
      return { previousNominations, nominationToRemove };
    },

    onError: (error, _, context) => {
      if (context?.previousNominations) {
        setNominations(context.previousNominations.data.nominations);
      }
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
    },
    onSuccess: () => {
      toast.success("Nomination deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINATIONS] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINATIONS] });
    },
  });

  const { mutateAsync: addNominee, isPending: isAddingNominee } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINEES],
    mutationFn: createNominee,
    onSuccess: () => {
      toast.success("Nominee added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINEES] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong.");
      }
    },
  });

  const handleAddNominee = async () => {
    const nomineePayload: Partial<Nominee> = {
      full_name: item.full_name,
      category_id: item.category_id!,
      event_id: item.event_id,
    };

    await addNominee(nomineePayload as Nominee);
  };

  const { mutateAsync: sendEmail, isPending: isSendingEmail } = useMutation({
    mutationKey: [QUERY_KEYS.NOMINATIONS],
    mutationFn: sendNominationEmail,
    onSuccess: () => {
      toast.success("Email sent successfully");
      setOpen(false);
      closeDropdown();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOMINATIONS] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong.");
      }
      closeDropdown();
    },
  });
  const handleSendEmail = async () => {
    const nomination = item;
    await sendEmail({ email: nomination.email, nomination_id: nomination.id });
  };

  const handleCopyToClipboard = (label: string, text: string) => {
    try {
      copyToClipboard(text);
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
            isLoading={isAddingNominee}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to add this person as a nominee to the{" "}
                <strong>{item.category.name}</strong> category?
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
            isLoading={isSendingEmail}
            onSubmitEnd={closeDropdown}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to send a confirmation email to{" "}
                <strong>{item.full_name}</strong> that they have been added as
                final nominee to the <strong>{item.category.name}</strong>{" "}
                category?
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
            onSubmit={async () => await deleteExistingNomination(item.id)}
            cancelText="Cancel"
            submitText="Yes, delete"
            isLoading={isDeletingNomination}
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
        <DrawerHeader>
          <DrawerTitle>
            <h2 className="text-xl font-bold">Edit Nomination</h2>
          </DrawerTitle>
          <DrawerDescription>
            <p className="text-muted-foreground text-sm">
              Edit the nomination details below. Some fields may not be editable
              as they are recorded by the system and cannot be changed.
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerTitle className="sr-only">Edit Nomination</DrawerTitle>
        <NominationDetailsPanel data={item} setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}
