import { RowActions } from "./row-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { NominationsResponse } from "../page";

export const columns: ColumnDef<NominationsResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="link"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-2"
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "categories",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.category.name}</div>
    ),
    filterFn: (row, id, value) => {
      return row.original.category.name === value;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <RowActions item={row.original} />;
    },
  },
];
