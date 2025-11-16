"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { createTicket, listTickets } from "@/lib/api/support/support";
import type { SubmitTicketForm as SubmitTicketFormType, SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

import FilterSheet from "./FilterSheet";
import HeaderSection from "./HeaderSection";
import SearchAndActionsSection from "./SearchAndActionsSection";
import SubmitTicketForm from "./SubmitTicketForm";
import useTableColumns from "./TableConfig";
import TicketDetailsPage from "./TicketDetailsPage";
import TicketTableSection from "./TicketTableSection";

type TicketViewMode = "view" | "reply";

const Support = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [ticketViewMode, setTicketViewMode] = useState<TicketViewMode>("view");

  // Build filter params from URL
  const filterParams = useMemo(() => {
    type Status = "Open" | "In Progress" | "Closed" | "Resolved";
    type Priority = "Low" | "Medium" | "High" | "Critical";
    type OrderBy = "subject" | "status" | "priority" | "createdAt" | "updatedAt";
    type OrderDirection = "asc" | "desc";

    return {
      searchTerm: searchParams.get("searchTerm") || undefined,
      status: (searchParams.get("status") as Status | undefined) || undefined,
      priority: (searchParams.get("priority") as Priority | undefined) || undefined,
      isDraft: searchParams.get("isDraft") === "true" ? true : undefined,
      issueCategoryId: searchParams.get("issueCategoryId") || undefined,
      userId: searchParams.get("userId") || undefined,
      fromDate: searchParams.get("fromDate") || undefined,
      toDate: searchParams.get("toDate") || undefined,
      skip: parseInt(searchParams.get("skip") || "0", 10),
      take: parseInt(searchParams.get("take") || "10", 10),
      orderBy: (searchParams.get("orderBy") as OrderBy | undefined) || "createdAt",
      orderDirection: (searchParams.get("orderDirection") as OrderDirection | undefined) || "desc",
    };
  }, [searchParams]);

  // Fetch tickets with React Query
  const {
    data: ticketsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["support-tickets", filterParams],
    queryFn: async () => {
      const response = await listTickets(filterParams);
      return response.data;
    },
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: SubmitTicketFormType) => {
      // Upload attachments first if any (would need to implement file upload API)
      const attachmentUrls: string[] = [];
      // TODO: Upload files and get URLs

      return createTicket({
        issueCategoryId: data.issueCategoryId,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        attachments: attachmentUrls,
        isDraft: data.isDraft,
        status: "Open",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setShowSubmitForm(false);
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
      // TODO: Show error toast
    },
  });

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
    setTicketViewMode("view");
  };

  const handleReply = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
    setTicketViewMode("reply");
  };

  const handleClose = (_ticket: SupportTicket) => {
    setShowTicketDetails(false);
    setSelectedTicket(null);
  };

  const handleSubmitTicket = (data: SubmitTicketFormType) => {
    createTicketMutation.mutate(data);
  };

  const handleSaveDraft = (data: SubmitTicketFormType) => {
    createTicketMutation.mutate({ ...data, isDraft: true });
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Export Excel");
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF");
  };

  const columns = useTableColumns(handleView, handleReply, handleClose);

  const tickets = ticketsData?.data || [];
  const totalCount = ticketsData?.total || 0;

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / (filterParams.take || 10)),
  });

  // If ticket details view is shown
  if (showTicketDetails && selectedTicket) {
    return (
      <TicketDetailsPage
        ticket={selectedTicket}
        onBack={() => {
          setShowTicketDetails(false);
          setSelectedTicket(null);
          setTicketViewMode("view");
        }}
        onClose={handleClose}
        mode={ticketViewMode}
      />
    );
  }

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

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-background")}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading tickets...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-background")}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error loading tickets. Please try again.
          </div>
        </div>
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
        searchTerm={filterParams.searchTerm || ""}
        onSearchChange={() => {
          // Search is now handled by filter sheet
        }}
        onFilterClick={() => setShowFilterSheet(true)}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      <TicketTableSection table={table} columns={columns} totalCount={totalCount} />

      <FilterSheet open={showFilterSheet} onOpenChange={setShowFilterSheet} />
    </div>
  );
};

export default Support;
