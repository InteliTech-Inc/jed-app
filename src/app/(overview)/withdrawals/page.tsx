import * as React from "react";
import { WithdrawalDataTable, Withdrawal } from "./_components/data-table";
import { SectionCards } from "@/components/section-cards";
import PaymentDetailsDrawer from "./_components/payment-details-drawer";

// Mock data for withdrawals
const withdrawalData: Withdrawal[] = [
  {
    id: "w123",
    date: "2023-09-15T10:30:00Z",
    amount: 500,
    method: "Bank Transfer",
    status: "completed",
    reference: "WTH-2023-09-15-001",
    bank: "GTBank",
    accountNumber: "1234567890",
    accountName: "John Doe",
    paymentMethodId: "pm_1",
  },
  {
    id: "w124",
    date: "2023-10-02T14:45:00Z",
    amount: 750,
    method: "Mobile Money",
    status: "pending",
    reference: "WTH-2023-10-02-002",
    provider: "MTN",
    phoneNumber: "0241234567",
    paymentMethodId: "pm_2",
  },
  {
    id: "w125",
    date: "2023-10-10T09:15:00Z",
    amount: 300,
    method: "Bank Transfer",
    status: "completed",
    reference: "WTH-2023-10-10-003",
    bank: "GTBank",
    accountNumber: "1234567890",
    accountName: "John Doe",
    paymentMethodId: "pm_1",
  },
  {
    id: "w126",
    date: "2023-11-05T16:30:00Z",
    amount: 1200,
    method: "Mobile Money",
    status: "failed",
    reference: "WTH-2023-11-05-004",
    provider: "Vodafone",
    phoneNumber: "0551234567",
    paymentMethodId: "pm_3",
  },
  {
    id: "w127",
    date: "2023-11-20T11:45:00Z",
    amount: 850,
    method: "Bank Transfer",
    status: "completed",
    reference: "WTH-2023-11-20-005",
    bank: "Access Bank",
    accountNumber: "9876543210",
    accountName: "Jane Smith",
    paymentMethodId: "pm_4",
  },
];

// Statistical cards data
const cardsData = [
  {
    title: "Total Withdrawn",
    value: "GHS 2,400.00",
    description: "Lifetime withdrawals",
  },
  {
    title: "Pending",
    value: "GHS 750.00",
    description: "In-process withdrawals",
  },
  {
    title: "Available Balance",
    value: "GHS 950.00",
    description: "Ready to withdraw",
  },
];

const paymentMethods = [
  {
    id: "pm_1",
    type: "Bank Transfer",
    account_number: "78902038471828",
    account_name: "John Doe",
    provider: "GTBank",
    status: "active",
  },
  {
    id: "pm_2",
    type: "Mobile Money",
    account_number: "0245505340",
    account_name: "John Doe",
    provider: "MTN",
    status: "active",
  },
  {
    id: "pm_3",
    type: "Bank Transfer",
    account_number: "9876543210",
    account_name: "John Doe",
    provider: "Consolidated Bank Ghana Limited  ",
    status: "inactive",
  },
];

export default function WithdrawalsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <section className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                Withdrawals
              </h1>
              <p className="max-w-md text-gray-500">
                Manage your earnings and withdraw funds to your preferred
                payment method.
              </p>
            </div>
            <PaymentDetailsDrawer paymentMethods={paymentMethods} />
          </section>
          <SectionCards data={cardsData} />
          <WithdrawalDataTable data={withdrawalData} />
        </div>
      </div>
    </div>
  );
}
