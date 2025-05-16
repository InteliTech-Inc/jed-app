import { RowActions } from "./row-action";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import {
  IconCircleCheckFilled,
  IconGripVertical,
  IconLoader,
  IconClockHour1,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { EventResponse } from "@/interfaces/event";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { transformToLowerCase } from "@/lib/utils";

function DragHandle({ id }: Readonly<{ id: number }>) {
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

export const columns: ColumnDef<EventResponse>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
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
    header: "Event Name",
    enableHiding: false,
  },
  {
    accessorKey: "approval_status",
    header: "Approval Status",
    cell: ({ row }) => {
      const status = transformToLowerCase(row.original.approval_status);
      let statusColor;

      switch (status) {
        case "pending":
          statusColor = "border-amber-800 bg-amber-50 text-amber-800";
          break;
        case "approved":
          statusColor = "border-green-800 bg-green-50 text-green-800";
          break;
        default:
          statusColor = "border-red-500 bg-red-50 text-red-500";
          break;
      }
      return (
        <div className="w-32">
          <Badge
            variant="outline"
            className={`${statusColor} px-1.5 capitalize`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "event_progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = transformToLowerCase(row.original.event_progress);
      let progressIcon;
      switch (progress) {
        case "completed":
          progressIcon = <IconCircleCheckFilled className="fill-green-500" />;
          break;
        case "pending":
          progressIcon = <IconClockHour1 className="fill-purple-200" />;
          break;
        default:
          progressIcon = <IconLoader className="stroke-amber-600" />;
          break;
      }

      return (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {progressIcon}
          {progress}
        </Badge>
      );
    },
  },
  {
    accessorKey: "categories",
    header: () => <div className="text-center">Categories</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.categories?.length}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <RowActions item={row.original} />;
    },
  },
];
