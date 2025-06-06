"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { IconCreditCard } from "@tabler/icons-react";
import { PaymentDetails, PaymentMethod } from "./payment-method-details";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  paymentMethods: PaymentMethod[];
};

export default function PaymentDetailsDrawer({
  paymentMethods,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <IconCreditCard className="size-4" />
          View Payment Methods
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-none px-0">
        <DrawerTitle className="sr-only">Payment Methods</DrawerTitle>
        <div className="p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-neutral-700">
            Your Payment Methods
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            These are the payment methods currently linked to your account.
          </p>
          <PaymentDetails paymentMethods={paymentMethods} />
        </div>
        <DrawerFooter className="ml-auto flex flex-row gap-2">
          <DrawerClose asChild>
            <Button variant="outline" className="h-10">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
