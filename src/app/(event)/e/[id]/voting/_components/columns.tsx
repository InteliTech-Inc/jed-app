import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingDataResponse } from "../page";

export const columns: ColumnDef<VotingDataResponse>[] = [
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
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const nominee = row.original;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={nominee.photo} alt={nominee.full_name} />
          <AvatarFallback>{nominee.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: () => <div className="">Category</div>,
    cell: ({ row }) => <div className="my-3">{row.original.category}</div>,
  },
  {
    accessorKey: "votes",
    header: ({ column }) => (
      <Button
        variant="link"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full text-center"
      >
        Votes
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-secondary text-center font-semibold">
        {row.original.votes}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="text-left">
        <Badge variant="outline">{row.original.code}</Badge>
      </div>
    ),
  },
];
