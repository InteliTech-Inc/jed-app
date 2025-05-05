"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IconCreditCard, IconWallet } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { delay } from "@/app/(event)/e/[id]/nominations/_components/row-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentMethodDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PaymentMethodDrawer({
  isOpen,
  onClose,
}: PaymentMethodDrawerProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("bank");
  const [bank, setBank] = useState({
    name: "",
    accountNumber: "",
    accountName: "",
  });

  const [mobile, setMobile] = useState({
    provider: "",
    phoneNumber: "",
    accountName: "",
  });

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await delay(1000);
      toast.success("Bank account added successfully");
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add bank account");
    }
  };

  const handleMobileMoneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await delay(1000);
      toast.success("Mobile money account added successfully");
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add mobile money account");
    }
  };

  const resetForm = () => {
    setBank({
      name: "",
      accountNumber: "",
      accountName: "",
    });
    setMobile({
      provider: "",
      phoneNumber: "",
      accountName: "",
    });
    setActiveTab("bank");
  };

  const renderContent = () => (
    <>
      <div className="">
        <Tabs
          defaultValue="bank"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <IconCreditCard className="h-4 w-4" />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <IconWallet className="h-4 w-4" />
              Mobile Money
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank">
            <form onSubmit={handleBankSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  value={bank.name}
                  onChange={(e) => setBank({ ...bank, name: e.target.value })}
                  placeholder="e.g. GTBank"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  value={bank.accountNumber}
                  onChange={(e) =>
                    setBank({ ...bank, accountNumber: e.target.value })
                  }
                  placeholder="Enter account number"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  value={bank.accountName}
                  onChange={(e) =>
                    setBank({ ...bank, accountName: e.target.value })
                  }
                  placeholder="Enter account holder name"
                  required
                  className="h-10"
                />
              </div>

              {isMobile ? (
                <DrawerFooter className="px-0">
                  <Button type="submit">Save Bank Account</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              ) : (
                <DialogFooter className="px-0">
                  <Button type="submit">Save Bank Account</Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </DialogFooter>
              )}
            </form>
          </TabsContent>

          <TabsContent value="mobile">
            <form onSubmit={handleMobileMoneySubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  defaultValue="mtn"
                  value={mobile.provider}
                  onValueChange={(value) =>
                    setMobile({ ...mobile, provider: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                    <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={mobile.phoneNumber}
                  onChange={(e) =>
                    setMobile({ ...mobile, phoneNumber: e.target.value })
                  }
                  placeholder="e.g. 0241234567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  value={mobile.accountName}
                  onChange={(e) =>
                    setMobile({ ...mobile, accountName: e.target.value })
                  }
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              {isMobile ? (
                <DrawerFooter className="px-0">
                  <Button type="submit">Save Mobile Money</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              ) : (
                <DialogFooter className="px-0">
                  <Button type="submit">Save Mobile Money</Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </DialogFooter>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add Payment Method</DrawerTitle>
            <DrawerDescription>
              Add a new payment method to receive your withdrawals
            </DrawerDescription>
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to receive your withdrawals
            </DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }
}
