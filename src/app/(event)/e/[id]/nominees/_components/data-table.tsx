"use client";

import * as React from "react";
import { columns, Nominee } from "./columns";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconFileArrowRight,
} from "@tabler/icons-react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableRow } from "@/components/draggable-row";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/utils";
import { CreateNomineeModal } from "./create-nominee-modal";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { NomineeResponse } from "@/interfaces/nominees";
import { Spinner } from "@/components/spinner";
import { useParams } from "next/navigation";

export function NomineesDataTable() {
  const [data, setData] = React.useState<Nominee[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { id: event_id } = useParams();

  const { fetchNominees } = QUERY_FUNCTIONS;

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) ?? [],
    [data],
  );

  const { data: nomineesData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOMINEES],
    queryFn: fetchNominees,
  });

  const flattenedData = React.useMemo(() => {
    return nomineesData?.data.nominees
      .map((nominee: NomineeResponse) => {
        return {
          ...nominee,
          category: nominee.catgeory.name,
          photo: nominee.img_url ?? "",
          total_votes: nominee.total_votes,
        };
      })
      .filter((nominee: NomineeResponse) => nominee.event_id === event_id);
  }, [nomineesData]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    flattenedData?.forEach((item: Nominee) => {
      categories.add(item.category);
    });
    return Array.from(categories);
  }, [flattenedData]);

  React.useEffect(() => {
    setData(flattenedData);
  }, [flattenedData]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
      toast.success("Nominee order updated");
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleDownloadData = () => {
    if (!data.length) {
      return toast.error("No data to download");
    }
    const payload = data.map((r) => {
      return {
        "Full Name": r.full_name,
        CATEGORY: r.category,
        CODE: r.code,
        "Total Votes": r.total_votes ?? 0,
      };
    });
    exportToCSV(payload, `Nominees_List`);
    toast.success("Nominees list exported successfully");
  };

  const filterValue =
    (table.getColumn("full_name")?.getFilterValue() as string) ?? "";

  const selectedCategory = React.useMemo(() => {
    const categoryFilter = columnFilters.find(
      (filter) => filter.id === "category",
    );
    return categoryFilter ? (categoryFilter.value as string) : "all";
  }, [columnFilters]);

  const handleCategoryChange = (value: string) => {
    table.setPageIndex(0);

    if (value === "all") {
      const newFilters = columnFilters.filter(
        (filter) => filter.id !== "category",
      );
      setColumnFilters(newFilters);
    } else {
      const categoryFilterIndex = columnFilters.findIndex(
        (filter) => filter.id === "category",
      );

      if (categoryFilterIndex !== -1) {
        const newFilters = [...columnFilters];
        newFilters[categoryFilterIndex] = { id: "category", value };
        setColumnFilters(newFilters);
      } else {
        setColumnFilters([...columnFilters, { id: "category", value }]);
      }
    }
  };

  const renderEmptyStateRow = () => {
    if (isLoading) {
      return (
        <TableRow className="h-24">
          <TableCell colSpan={columns.length} className="h-24 p-0 text-center">
            <div className="flex h-full w-full items-center justify-center">
              <Spinner />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (flattenedData && flattenedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            NO NOMINEES FOUND
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results for "{filterValue}".
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="mt-6 border-none pb-6 shadow-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-12 flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="!h-full min-w-[15rem]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by name..."
            value={filterValue}
            onChange={(event) => {
              table.getColumn("full_name")?.setFilterValue(event.target.value);
            }}
            className="h-full w-full min-w-[15rem]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadData}
            variant="outline"
            disabled={!data?.length}
            className="shadow-none"
          >
            Export Data
            <IconFileArrowRight />
          </Button>
          <div className="flex-shrink-0">
            <CreateNomineeModal />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className=""
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  renderEmptyStateRow()
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table?.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 pb-6 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
