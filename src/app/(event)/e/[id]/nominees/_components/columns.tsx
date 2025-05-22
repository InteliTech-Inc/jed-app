import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { IconGripVertical } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { NomineeActions } from "./nominee-actions";
import { Media } from "@/interfaces/event";

export type Nominee = {
  id: string;
  full_name: string;
  category: string;
  category_id: string;
  media: Media[];
  code: string;
  total_votes?: number;
  img_public_id: string;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData?: (updatedNominee: Nominee) => void;
    deleteData?: (id: string) => void;
  }
}

function DragHandle({ id }: { readonly id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export const columns: ColumnDef<Nominee>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
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
          <AvatarImage
            src={nominee.media[0]?.url}
            alt={nominee.full_name}
            className="aspect-square object-cover"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
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
    header: "Category",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1">
        {row.original.code}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const nominee = row.original;
      return <NomineeActions nominee={nominee} />;
    },
  },
];
