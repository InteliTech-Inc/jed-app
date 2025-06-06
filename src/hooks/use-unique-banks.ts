import { BankIssuer, filterUniqueBanks, PaymentIssuer } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useUniqueBanks(
  activeTab: string,
  currentTab: string,
  paymentIssuers?: PaymentIssuer[],
): BankIssuer[] {
  const [uniqueBanks, setUniqueBanks] = useState<BankIssuer[]>([]);

  useEffect(() => {
    if (activeTab === currentTab && paymentIssuers) {
      setUniqueBanks(filterUniqueBanks(paymentIssuers));
    }
  }, [activeTab, currentTab, paymentIssuers]);

  return uniqueBanks;
}
