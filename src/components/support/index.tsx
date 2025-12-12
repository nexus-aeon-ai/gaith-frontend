"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import { uploadMultiImages } from "@/lib/api/storage";
import {
  assignTicket,
  createTicket,
  deleteTicket,
  listTickets,
  updateTicket,
} from "@/lib/api/support/support";
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
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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

  const [searchValue, setSearchValue] = useState(filterParams.searchTerm || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchValue(filterParams.searchTerm || "");
  }, [filterParams.searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 500ms
    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("searchTerm", value.trim());
      } else {
        params.delete("searchTerm");
      }

      params.set("skip", "0");

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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

  // Fetch all users for assigned user lookup

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: SubmitTicketFormType) => {
      console.log("ticket data to create:", data);
      
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (data.attachments && data.attachments.length > 0) {
        try {
          const uploadResponse = await uploadMultiImages(data.attachments);
          if (uploadResponse.data) {
            attachmentUrls = uploadResponse.data.map(item => item.url);
            console.log("Uploaded attachment URLs:", attachmentUrls);
          }
        } catch (error) {
          console.error("Error uploading attachments:", error);
          throw new Error("Failed to upload attachments");
        }
      }

      const ticketResponse = await createTicket({
        issueCategoryId: data.issueCategoryId,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        attachments: attachmentUrls,
        isDraft: data.isDraft,
        status: "Open",
      });

      // If assignedToUserId is provided, assign the ticket
      if (ticketResponse.data && data.assignedToUserId) {
        await assignTicket(ticketResponse.data.id, {
          assignedToUserId: data.assignedToUserId,
        });
      }

      return ticketResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setShowSubmitForm(false);
    },
    onError: error => {
      console.error("Error creating ticket:", error);
      // TODO: Show error toast
    },
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: SubmitTicketFormType }) => {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (data.attachments && data.attachments.length > 0) {
        try {
          const uploadResponse = await uploadMultiImages(data.attachments);
          if (uploadResponse.data) {
            attachmentUrls = uploadResponse.data.map(item => item.url);
            console.log("Uploaded attachment URLs:", attachmentUrls);
          }
        } catch (error) {
          console.error("Error uploading attachments:", error);
          throw new Error("Failed to upload attachments");
        }
      }

      const ticketResponse = await updateTicket(ticketId, {
        issueCategoryId: data.issueCategoryId,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        attachments: attachmentUrls,
        isDraft: data.isDraft,
      });

      // Handle assignment change
      if (data.assignedToUserId !== undefined) {
        await assignTicket(ticketId, {
          assignedToUserId: data.assignedToUserId || undefined,
        });
      }

      return ticketResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      setShowEditForm(false);
      setSelectedTicket(null);
    },
    onError: error => {
      console.error("Error updating ticket:", error);
      // TODO: Show error toast
    },
  });

  // Delete ticket mutation
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      return await deleteTicket(ticketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      // TODO: Show success toast
    },
    onError: error => {
      console.error("Error deleting ticket:", error);
      // TODO: Show error toast
    },
  });

  const handleViewAndReply = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
    setTicketViewMode("reply");
  };

  const handleEdit = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowEditForm(true);
  };

  const handleClose = (_ticket: SupportTicket) => {
    setShowTicketDetails(false);
    setSelectedTicket(null);
  };

  const handleSubmitTicket = (data: SubmitTicketFormType) => {
    createTicketMutation.mutate(data);
  };

  const handleSaveDraft = (data: SubmitTicketFormType) => {
    if (showEditForm && selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        data: { ...data, isDraft: true },
      });
    } else {
      createTicketMutation.mutate({ ...data, isDraft: true });
    }
  };

  const handleUpdateTicket = (data: SubmitTicketFormType) => {
    if (selectedTicket) {
      updateTicketMutation.mutate({
        ticketId: selectedTicket.id,
        data,
      });
    }
  };

  const handleDelete = (ticket: SupportTicket) => {
    deleteTicketMutation.mutate(ticket.id);
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Export Excel");
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export PDF");
  };

  const columns = useTableColumns(handleViewAndReply, handleEdit, handleDelete);

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

  // If edit form is shown
  if (showEditForm && selectedTicket) {
    return (
      <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-background")}>
        <div className="mb-6">
          <button
            onClick={() => {
              setShowEditForm(false);
              setSelectedTicket(null);
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Tickets
          </button>
        </div>
        <SubmitTicketForm
          ticket={selectedTicket}
          onSubmit={handleUpdateTicket}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    );
  }

  // If submit form is shown
  if (showSubmitForm) {
    return (
      <div className="min-h-screen w-full p-2 sm:p-3 font-inter md:p-4 lg:p-6">
        <div className="mb-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">
                    <DashboardListIcon className="h-4 w-4 text-[#3072C0]" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/support"
                    onClick={() => setShowSubmitForm(false)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Support
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Submit a Support Ticket</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="text-[18px] font-semibold">Submit A Support Ticket</p>
          <p className="text-[12px] mt-1 mb-3 font-normal text-[#303444] dark:text-[#CCCFDB]">
            Get help, submit tickets, and access support resources
          </p>
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
    <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "overflow-x-hidden")}>
      <HeaderSection onSubmitTicket={() => setShowSubmitForm(true)} />
      <SearchAndActionsSection
        searchTerm={searchValue}
        onSearchChange={handleSearchChange}
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
