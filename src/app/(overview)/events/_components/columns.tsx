import { RowActions } from "./row-action";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import {
  IconCircleCheckFilled,
  IconGripVertical,
  IconLoader,
  IconClockHour1,
} from "@tabler/icons-react";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import { AllEvents } from "../page";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function DragHandle({ id }: { id: number }) {
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

export const columns: ColumnDef<AllEvents>[] = [
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
    accessorKey: "name",
    header: "Event Name",
    enableHiding: false,
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      return (
        <div className="w-32">
          <Badge
            variant="outline"
            className={` ${
              status === "pending"
                ? "border-amber-800 bg-amber-50 text-amber-800"
                : status === "approved"
                  ? "border-green-800 bg-green-50 text-green-800"
                  : "border-red-500 bg-red-50 text-red-500"
            } px-1.5 capitalize`}
          >
            {row.original.approvalStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "eventProgress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.original.eventProgress;
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {progress === "completed" ? (
            <IconCircleCheckFilled className="fill-green-500" />
          ) : progress === "not started" ? (
            <IconClockHour1 className="fill-purple-200" />
          ) : (
            <IconLoader className="stroke-amber-600" />
          )}
          {row.original.eventProgress}
        </Badge>
      );
    },
  },
  {
    accessorKey: "categories",
    header: () => <div className="text-center">Categories</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.categories}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <RowActions item={row.original} />;
    },
  },
];
