"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IconCreditCard, IconWallet } from "@tabler/icons-react";
import { Withdrawal } from "./data-table";
import { WithdrawalsRowActions } from "./row-actions";
export const columns: ColumnDef<Withdrawal>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <div>
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-medium">
        GHS {row.original.amount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.method === "Bank Transfer" ? (
          <IconCreditCard className="mr-2 h-4 w-4 text-blue-500" />
        ) : (
          <IconWallet className="mr-2 h-4 w-4 text-green-500" />
        )}
        <span>{row.original.method}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "outline"
                : "destructive"
          }
          className={
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reference",
    header: "Reference ID",
    cell: ({ row }) => <div className="py-2">{row.original.reference}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <WithdrawalsRowActions item={row.original} />,
  },
];
