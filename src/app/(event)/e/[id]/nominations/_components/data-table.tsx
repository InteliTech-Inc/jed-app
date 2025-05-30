"use client";

import * as React from "react";

import { columns } from "./columns";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { NominationsResponse } from "../page";
import { LinkButton } from "./link-button";
import { useQuery } from "@tanstack/react-query";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useParams } from "next/navigation";
import { CategoryResponse } from "../../nominees/_components/create-nominee-modal";
import { Spinner } from "@/components/spinner";
import { NoNominations } from "./no-nominations";
import { useNominationStore } from "@/lib/stores/nomination-store";

export function NominationsTable() {
  const [data, setData] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { fetchNominations, fetchCategories } = QUERY_FUNCTIONS;
  const { id: event_id } = useParams();
  const { nominations, setNominations } = useNominationStore();

  const { data: records, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOMINATIONS],
    queryFn: fetchNominations,
  });

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: fetchCategories,
  });

  React.useEffect(() => {
    if (!records || !categories || !event_id) return;

    const nominations = records.data?.nominations ?? [];
    const categoryList = categories.data?.categories ?? [];

    const filteredNominations = nominations.filter(
      (nomination: NominationsResponse) => nomination.event_id === event_id,
    );

    const filteredCategories = categoryList.filter(
      (category: CategoryResponse) => category.event_id === event_id,
    );

    const categoryMap = new Map(
      filteredCategories.map((category: CategoryResponse) => [
        category.id,
        category,
      ]),
    );

    const nominationsWithCategory = filteredNominations.map(
      (nomination: NominationsResponse) => ({
        ...nomination,
        category: categoryMap.get(nomination.category_id) ?? null,
      }),
    );

    setNominations(nominationsWithCategory);
    setData(nominationsWithCategory);
  }, [records, categories, event_id]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    data.forEach((item: { category: CategoryResponse }) => {
      if (item.category) {
        categories.add(item.category.name);
      }
    });

    return Array.from(categories);
  }, [data]);

  const table = useReactTable({
    data: nominations,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const filterValue =
    (table.getColumn("full_name")?.getFilterValue() as string) ?? "";

  const handleCategoryChange = (value: string) => {
    table.setPageIndex(0);

    if (value === "all") {
      const newFilters = columnFilters.filter(
        (filter) => filter.id !== "categories",
      );
      setColumnFilters(newFilters);
    } else {
      const categoryFilterIndex = columnFilters.findIndex(
        (filter) => filter.id === "categories",
      );

      if (categoryFilterIndex !== -1) {
        const newFilters = [...columnFilters];
        newFilters[categoryFilterIndex] = { id: "categories", value };
        setColumnFilters(newFilters);
      } else {
        setColumnFilters([...columnFilters, { id: "categories", value }]);
      }
    }
  };

  const selectedCategory = React.useMemo(() => {
    const categoryFilter = columnFilters.find(
      (filter) => filter.id === "categories",
    );
    return categoryFilter ? (categoryFilter.value as string) : "all";
  }, [columnFilters]);

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

    if (nominations && nominations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <NoNominations />
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
        <div>
          <LinkButton id={event_id} results={data} />
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
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
              {table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : renderEmptyStateRow()}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
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
