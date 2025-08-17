"use client";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { CirclePlus, Download, FileText, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import useTableColumns, { Client } from "./TableConfig";

const mockClients: Client[] = [
  {
    id: "1",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "2",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Alice", initial: "A", color: "bg-green-500" },
    ],
  },
  {
    id: "3",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "4",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "5",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "6",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "7",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "8",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "9",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
  {
    id: "10",
    name: "Michael Anderson",
    email: "anderson@email.com",
    status: "Active",
    agreementPeriod: {
      start: "Jul 9, 2025",
      end: "Jul 24, 2025",
    },
    marketRegion: "Europe",
    services: "Digital Marketing",
    contactInfo: "+9640000000",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-red-500" },
      { name: "Sarah", initial: "S", color: "bg-blue-500" },
      { name: "Steve", initial: "S", color: "bg-green-500" },
    ],
  },
];

// Mock paginated response type
interface TGenericPaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
  page_count: number;
}

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
      {/* Header Section */}
      <div className={cn(
        "flex flex-col sm:flex-row justify-between items-start",
        "gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-4 lg:mb-2",
      )}>
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
            "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
          )}>
            Client Management
          </h1>
          <p className={cn(
            "text-xs sm:text-sm md:text-base",
            "text-gray-600 dark:text-gray-300",
          )}>
            Manage client data and communication.
          </p>
        </div>
        <Button 
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#508CD3] rounded-2xl w-full sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-14  lg:w-60",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Client</span>
          <span className="sm:hidden">Add Client</span>
        </Button>
      </div>

      {/* Search and Actions Section */}
      <div className={cn(
        " items-center justify-center bg-card rounded-lg px-6 py-6 mb-3 shadow-sm",
      )}>
        <div className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between ",
          "gap-3 sm:gap-4 ",
        )}>
          <div className="relative flex-1 max-w-md">
            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            {/* Input Field */}
            <Input
              placeholder="Search clients"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 bg-card min-h-14 text-base rounded-xl"
            />
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-10 sm:h-12",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-[#508CD3]",
              )}
            >
              <div className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm ml-0.5" />
              </div>
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-10 sm:h-12",
                "hover:bg-[#508CD3]",
              )}
            >
              <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 border-l-2 border-t-2 border-gray-400 transform rotate-45" />
              </div>
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-10 sm:h-12",
                "hover:bg-[#508CD3]",
              )}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-10 sm:h-12",
                "hover:bg-[#508CD3]",
              )}
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <DataTable 
        table={table} 
        colSpan={columns.length} 
        dataPagination={data} 
      />
    </div>
  );
};

export default ClientManagementClient; 
