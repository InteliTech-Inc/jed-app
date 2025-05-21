import { RowActions } from "./row-action";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Nominee } from "@/interfaces/event";
import { format } from "date-fns";

export type CategoryType = {
  id: number;
  name: string;
  nominees: Nominee[];
  created_at: string;
};

export const columns: ColumnDef<CategoryType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex cursor-pointer items-center justify-center">
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
    accessorKey: "name",
    header: "Category Name",
    enableHiding: false,
  },
  {
    accessorKey: "nominees",
    header: "Total Nominees",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="border-emerald-300 bg-emerald-50 text-emerald-700"
        >
          {row.original.nominees?.length ?? 0}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {format(row.original.created_at, "MMM dd, yyyy")}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <RowActions item={row.original} />;
    },
  },
];
