"use client";

import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconTrash,
  IconEye,
  IconClipboard,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ModalWrapper } from "@/components/modal";
import { useState } from "react";
import { Withdrawal } from "./data-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { WithdrawalsDetails } from "./withdrawals-details";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

export function WithdrawalsRowActions({ item }: { item: Withdrawal }) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    console.log("delete");
    setIsLoading(false);
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast.info("Reference ID copied to clipboard", {
      position: "bottom-right",
    });
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
            className="hover:bg-gray-50"
            onClick={() => handleCopy(item.reference)}
          >
            <IconClipboard />
            Copy reference ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <ModalWrapper
            title="Delete withdrawal record"
            description={`Permanently delete withdrawal and all associated data?`}
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
            onSubmitEnd={() => setOpenDropdown(false)}
          >
            <div className="py-2">
              <p className="">
                Are you sure you want to delete the {item.reference} withdrawal?
                This will permanently remove the withdrawal and all associated
                data. This action cannot be undone.
              </p>
            </div>
          </ModalWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Edit Event</DrawerTitle>
        <WithdrawalsDetails row={item} />
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
