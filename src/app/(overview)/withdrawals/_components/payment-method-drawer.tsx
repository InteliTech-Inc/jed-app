"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IconCreditCard, IconWallet } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AccountPayload,
  Channel,
  PaymentIssuer,
  PaymentMethod,
} from "@/types/payment-method";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useAccountNameFetcher } from "@/hooks/use-debounce-effect";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { QUERY_KEYS } from "@/constants/query-keys";
import { Spinner } from "@/components/spinner";
import { useUniqueBanks } from "@/hooks/use-unique-banks";

type PaymentMethodDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type PayIssuer = {
  code: string;
  name: string;
};

export function PaymentMethodDrawer({
  isOpen,
  onClose,
}: Readonly<PaymentMethodDrawerProps>) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PaymentIssuer>(
    PaymentIssuer.bank_account,
  );
  const [bankAccount, setBankAccount] = useState<PayIssuer[]>([]);
  const [mobileMoney, setMobileMoney] = useState<PayIssuer[]>([]);
  const [isLoadingBankName, setIsLoadingBankName] = useState(false);
  const [isLoadingMobileName, setIsLoadingMobileName] = useState(false);

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

  const { addPaymentMethod, getBankAccountName, getPaymentIssuers } =
    QUERY_FUNCTIONS;

  const { mutateAsync: addNewPaymentMethod, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.WITHDRAWALS],
    mutationFn: async (payload: PaymentMethod) =>
      await addPaymentMethod(payload),
    onSuccess: () => {
      toast.success("Successfully added account details to JED");
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add account details to JED");
    },
  });

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBank = bankAccount.find(
      (bankItem) => bankItem.code === bank.name,
    );
    const bankName = selectedBank?.name ?? "";
    const payload: PaymentMethod = {
      bank_code: bank.name,
      channel: Channel.BANK,
      provider: bankName,
      account_number: bank.accountNumber,
      account_name: bank.accountName,
    };
    await addNewPaymentMethod(payload);
  };

  const { data: paymentIssuers } = useQuery({
    queryKey: [QUERY_KEYS.WITHDRAWALS, activeTab],
    queryFn: async () => await getPaymentIssuers(activeTab),
  });

  const uniqueBanks = useUniqueBanks(
    activeTab,
    PaymentIssuer.bank_account,
    paymentIssuers?.data,
  );

  useEffect(() => {
    if (uniqueBanks.length > 0) {
      setBankAccount(uniqueBanks);
    }
  }, [uniqueBanks]);

  useEffect(() => {
    if (activeTab === PaymentIssuer.mobile_money && paymentIssuers?.data) {
      setMobileMoney(paymentIssuers.data);
    }
  }, [activeTab, paymentIssuers?.data]);

  const { mutateAsync: getAccountName } = useMutation({
    mutationKey: [QUERY_KEYS.WITHDRAWALS],
    mutationFn: async (payload: AccountPayload) =>
      await getBankAccountName(payload),
  });

  const fetchBankAccountName = async (
    accountNumber: string,
    bankCode: string,
  ) => {
    if (!accountNumber || !bankCode || accountNumber.length < 10) return;

    try {
      setIsLoadingBankName(true);
      const response = await getAccountName({
        account_number: accountNumber,
        bank_code: bankCode,
      });

      if (response?.data?.account_name) {
        setBank((prev) => ({
          ...prev,
          accountName: response.data.account_name,
        }));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
      toast.error("Failed to fetch bank account name");
    } finally {
      setIsLoadingBankName(false);
    }
  };

  const fetchMobileAccountName = async (
    phoneNumber: string,
    providerCode: string,
  ) => {
    if (!phoneNumber || !providerCode || phoneNumber.length < 10) return;

    try {
      setIsLoadingMobileName(true);
      const response = await getAccountName({
        account_number: phoneNumber,
        bank_code: providerCode,
      });

      if (response?.data?.account_name) {
        setMobile((prev) => ({
          ...prev,
          accountName: response.data.account_name,
        }));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
      toast.error("Failed to fetch mobile account name");
    } finally {
      setIsLoadingMobileName(false);
    }
  };

  useAccountNameFetcher(fetchBankAccountName, bank.accountNumber, bank.name);
  useAccountNameFetcher(
    fetchMobileAccountName,
    mobile.phoneNumber,
    mobile.provider,
  );

  const handleMobileMoneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProvider = mobileMoney.find(
      (provider) => provider.code === mobile.provider,
    );
    const providerName = selectedProvider?.name ?? "";
    const payload: PaymentMethod = {
      bank_code: providerName,
      channel: Channel.MOBILE_MONEY,
      provider: providerName,
      account_number: mobile.phoneNumber,
      account_name: mobile.accountName,
    };
    await addNewPaymentMethod(payload);
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
    setActiveTab(PaymentIssuer.bank_account);
    setIsLoadingBankName(false);
    setIsLoadingMobileName(false);
  };

  const renderContent = () => (
    <div className="">
      <Tabs
        defaultValue={PaymentIssuer.bank_account}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PaymentIssuer)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value={PaymentIssuer.bank_account}
            className="flex items-center gap-2"
            disabled={isPending}
          >
            <IconCreditCard className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
          <TabsTrigger
            value={PaymentIssuer.mobile_money}
            className="flex items-center gap-2"
            disabled={isPending}
          >
            <IconWallet className="h-4 w-4" />
            Mobile Money
          </TabsTrigger>
        </TabsList>

        <TabsContent value={PaymentIssuer.bank_account}>
          <form onSubmit={handleBankSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select
                defaultValue="access"
                value={bank.name}
                onValueChange={(value) => setBank({ ...bank, name: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccount.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={isLoadingBankName}
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
                placeholder={
                  isLoadingBankName
                    ? "Fetching account name..."
                    : "Enter account holder name"
                }
                required
                className="h-10"
                disabled
                readOnly
              />
            </div>

            {isMobile ? (
              <DrawerFooter className="px-0">
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Save Bank Account"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" type="button" disabled={isPending}>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            ) : (
              <DialogFooter className="px-0">
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Save Bank Account"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </form>
        </TabsContent>

        <TabsContent value={PaymentIssuer.mobile_money}>
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
                  {mobileMoney.map((provider) => (
                    <SelectItem key={provider.code} value={provider.code}>
                      {provider.name}
                    </SelectItem>
                  ))}
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
                disabled={isLoadingMobileName}
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
                placeholder={
                  isLoadingMobileName
                    ? "Fetching account name..."
                    : "Enter account holder name"
                }
                required
                disabled
                readOnly
              />
            </div>

            {isMobile ? (
              <DrawerFooter className="px-0">
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Save Mobile Money"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" disabled={isPending} type="button">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            ) : (
              <DialogFooter className="px-0">
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Save Mobile Money"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </form>
        </TabsContent>
      </Tabs>
    </div>
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
