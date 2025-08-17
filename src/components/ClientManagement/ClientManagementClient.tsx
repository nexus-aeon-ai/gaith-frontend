"use client";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import { cn } from "@/lib/utils";

import ClientTableSection from "./ClientTableSection";
import { mockClients } from "./data/mockClients";
import HeaderSection from "./HeaderSection";
import SearchAndActionsSection from "./SearchAndActionsSection";
import useTableColumns, { Client } from "./TableConfig";
import { TGenericPaginatedResponse } from "./types";

const ClientManagementClient = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useTableColumns();

  // Mock paginated data
  const data: TGenericPaginatedResponse<Client> = {
    results: mockClients,
    count: mockClients.length,
    next: null,
    previous: null,
    page_count: 1,
  };

  const table = useReactTable({
    data: data.results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: { 
      sorting,
      globalFilter,
    },
    manualPagination: true,
  });

  return (
    <div className={cn(
      "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
      "bg-background overflow-x-hidden",
    )}>
      <HeaderSection />
      <SearchAndActionsSection 
        globalFilter={globalFilter} 
        setGlobalFilter={setGlobalFilter} 
      />
      <ClientTableSection 
        table={table} 
        columns={columns} 
        dataPagination={data} 
      />
    </div>
  );
};

export default ClientManagementClient; 
