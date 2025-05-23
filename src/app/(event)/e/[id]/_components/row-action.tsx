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
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { ModalWrapper } from "@/components/modal";
import { toast } from "sonner";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CategoryType } from "./columns";
import EditEventCategories from "./edit-categories";
import { useParams } from "next/navigation";
import { useEventStore } from "@/lib/stores/event-store";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";

export function RowActions({ item }: Readonly<{ item: CategoryType }>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const { id: event_id } = useParams();

  const { removeCategory, addCategories, categories } = useEventStore();
  const { deleteCategory } = QUERY_FUNCTIONS;
  const queryClient = useQueryClient();

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  const { mutateAsync: deleteSingleCategory, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS],
    mutationFn: async (categoryId: number) => {
      return deleteCategory(String(categoryId));
    },
    onMutate: async (categoryId: number) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.EVENTS, event_id],
      });

      const categoryToDelete = categories.find(
        (category) => category.id === categoryId,
      );

      removeCategory(categoryId);
      setOpen(false);
      closeDropdown();

      return { categoryToDelete };
    },
    onError: (error, categoryId, context) => {
      if (context?.categoryToDelete) {
        addCategories([context.categoryToDelete]);
      }

      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong while deleting the category.");
      }
    },
    onSuccess: async () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS, event_id],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS, event_id],
      });
    },
  });

  const handleDelete = async () => {
    await deleteSingleCategory(item.id);
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
          <DropdownMenuSeparator />
          <ModalWrapper
            title="Delete Category"
            description={`Permanently delete category and all associated data?`}
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
              <p>
                Are you sure you want to delete the <strong>{item.name}</strong>{" "}
                category? This will permanently remove the event and all
                associated data. This action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditEventCategories
        setOpen={setOpen}
        id={item.id}
        defaultName={item.name}
      />
    </Drawer>
  );
}
