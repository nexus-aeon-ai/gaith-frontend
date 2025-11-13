"use client";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { SupportTicket, SubmitTicketForm as SubmitTicketFormType } from "@/lib/types";
import { cn } from "@/lib/utils";

import FilterSheet from "./FilterSheet";
import HeaderSection from "./HeaderSection";
import SearchAndActionsSection from "./SearchAndActionsSection";
import SubmitTicketForm from "./SubmitTicketForm";
import useTableColumns from "./TableConfig";
import TicketTableSection from "./TicketTableSection";

// Mock data - replace with actual API call
const mockTickets: SupportTicket[] = [
  {
    id: "1",
    ticketId: "#SUP-2024-001",
    subject: "Unable To Access Dashboard After Login",
    description: "Getting 404 error when trying to access main da...",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    createdDate: "Dec 24, 2024",
    lastUpdated: "2 Hours Ago",
    createdBy: "John Doe",
  },
  {
    id: "2",
    ticketId: "#SUP-2024-002",
    subject: "Unable To Access Dashboard After Login",
    description: "Getting 404 error when trying to access main da...",
    category: "Technical",
    priority: "High",
    status: "Closed",
    createdDate: "Dec 24, 2024",
    lastUpdated: "2 Hours Ago",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    ticketId: "#SUP-2024-003",
    subject: "Unable To Access Dashboard After Login",
    description: "Getting 404 error when trying to access main da...",
    category: "Technical",
    priority: "Medium",
    status: "Resolved",
    createdDate: "Dec 24, 2024",
    lastUpdated: "2 Hours Ago",
    createdBy: "Bob Johnson",
  },
];

const Support = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // TODO: Replace with actual API call
  const tickets = mockTickets;

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    // TODO: API call to fetch ticket details and show in modal/sheet
    console.log("View ticket:", ticket);
  };

  const handleReply = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    // TODO: API call to open reply modal/sheet
    console.log("Reply to ticket:", ticket);
  };

  const handleClose = (ticket: SupportTicket) => {
    // TODO: API call to close ticket
    console.log("Close ticket:", ticket);
  };

  const handleSubmitTicket = (data: SubmitTicketFormType) => {
    // TODO: API call to submit new ticket
    console.log("Submit ticket:", data);
    setShowSubmitForm(false);
  };

  const handleSaveDraft = (data: SubmitTicketFormType) => {
    // TODO: API call to save draft
    console.log("Save draft:", data);
  };

  const handleExportExcel = () => {
    // TODO: API call to export Excel
    console.log("Export Excel");
  };

  const handleExportPDF = () => {
    // TODO: API call to export PDF
    console.log("Export PDF");
  };

  const columns = useTableColumns(handleView, handleReply, handleClose);

  const table = useReactTable({
    data: tickets,
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

  // If submit form is shown
  if (showSubmitForm) {
    return (
      <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-background")}>
        <div className="mb-6">
          <button
            onClick={() => setShowSubmitForm(false)}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Tickets
          </button>
        </div>
        <SubmitTicketForm onSubmit={handleSubmitTicket} onSaveDraft={handleSaveDraft} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-background overflow-x-hidden",
      )}
    >
      <HeaderSection onSubmitTicket={() => setShowSubmitForm(true)} />
      <SearchAndActionsSection
        searchTerm={globalFilter}
        onSearchChange={setGlobalFilter}
        onFilterClick={() => setShowFilterSheet(true)}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      <TicketTableSection table={table} columns={columns} totalCount={tickets.length} />

      <FilterSheet
        open={showFilterSheet}
        onOpenChange={setShowFilterSheet}
        onApplyFilters={filters => {
          // TODO: API call with filters
          console.log("Apply filters:", filters);
        }}
      />
    </div>
  );
};

export default Support;

