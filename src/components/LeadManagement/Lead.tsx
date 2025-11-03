"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CirclePlus, EllipsisVertical, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import LeadProfile from "@/components/LeadManagement/LeadProfile/LeadProfile";
import PopupModal from "@/components/PopupModal/PopupModal";
import FilterSheet from "@/components/sheet/Filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";
import { Input } from "@/components/ui/input";
import { deleteLead, getLeads } from "@/lib/api/leads";
import type { Lead } from "@/lib/types/lead";
import { cn } from "@/lib/utils";
import { CreateLeadFormData } from "@/lib/validations/lead";

import EditLead from "./EditLead";
import NewLead from "./NewLead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function leadToFormData(lead: Lead): CreateLeadFormData {
  return {
    fullName: lead.name || "",
    nationality: "", // not available in table Lead, set to blank
    email: lead.email || "",
    phoneNumber: lead.contactInfo || "",
    country: "", // not available, fallback
    region: "",
    area: "",
    fullAddress: "", // not available
    leadSource: lead.source || "",
    assignedTo: (lead.assignedTo && lead.assignedTo[0]?.name) || "",
    visionStatement: "",
    missionStatement: "",
    linkedinUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    additionalNotes: "",
    productServiceIds: [], // Not in table view
    teamRoleIds: [], // Not in table view
    companyLogo: undefined,
  };
}

const LeadsPage = () => {
  // Fetch leads from API
  const { data } = useQuery<{ status: number; data: { results: Lead[]; count: number } }, Error>({
    queryKey: ["leads"],
    queryFn: getLeads,
    initialData: { status: 200, data: { results: [], count: 0 } },
  });

  const leads: Lead[] = data?.data.results || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [showEditLeadForm, setShowEditLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<(CreateLeadFormData & { id: string }) | null>(
    null,
  );
  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();
  const [showLeadProfile, setShowLeadProfile] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      setDeletingLeadId(null);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      console.log("Lead deleted successfully!");
    },
    onError: error => {
      setDeletingLeadId(null);
      console.error("Failed to delete lead. See console for details.");
      console.error(error);
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map((client: Lead) => client.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, clientId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== clientId));
    }
  };

  const filteredClients = leads.filter(
    (client: Lead) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  if (showNewLeadForm) {
    return <NewLead closeNewLeadForm={() => setShowNewLeadForm(false)} />;
  }

  if (showEditLeadForm && selectedLead) {
    return (
      <EditLead
        initialData={selectedLead}
        leadId={currentClients.find(l => l.email === selectedLead.email)?.id || ""}
        closeEditLeadForm={() => setShowEditLeadForm(false)}
      />
    );
  }

  if (showLeadProfile && selectedLeadId) {
    return (
      <LeadProfile leadId={selectedLeadId} closeLeadProfile={() => setShowLeadProfile(false)} />
    );
  }

  const confirmDeleteLead = (id: string) => {
    if (!id) return;
    console.log("Deleting lead:", id);
    deleteMutation.mutate(id);
    setDeletingLeadId(null);
  };
  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0",
        "bg-background overflow-x-hidden",
      )}
    >
      {/* Header Section */}
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-start",
          "gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6",
        )}
      >
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Leads Management
          </h1>
          <p className={cn("text-xs sm:text-sm", "text-gray-600 dark:text-gray-300")}>
            Track and manage sales prospects through the conversion pipeline.
          </p>
        </div>

        <Button
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#3072C0] rounded-[16px] w-full sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
          onClick={() => setShowNewLeadForm(true)}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Lead</span>
          <span className="sm:hidden">Add Lead</span>
        </Button>
      </div>

      {/* Search and Actions Section */}
      <div
        className={cn(" items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between ",
            "gap-2 sm:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search leads"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 min-w-md"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card border-border text-xs h-8 sm:h-10",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500",
                  )}
                >
                  <MenuIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    // Handle delete action here
                    // TODO: Implement delete functionality
                  }}
                >
                  <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500",
              )}
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <FilterIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>

            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <ExcelIcon />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
              <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
              <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    className="!rounded-[8px]"
                    checked={selectedLeads.length === leads.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Lead Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Source</TableHead>
                <TableHead className="text-center">Services</TableHead>
                <TableHead className="text-center">Contact Info</TableHead>
                <TableHead className="text-center">Assigned To</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((lead: Lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      className="!rounded-[8px]"
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={checked => handleSelectLead(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {lead.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        lead.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : lead.status === "Inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      )}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        lead.source === "Website"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : lead.source === "Social Media"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : lead.source === "Campaign"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                      )}
                    >
                      {lead.source}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {lead.services}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {lead.contactInfo}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex -space-x-3 justify-center">
                      {lead.assignedTo.map(person => (
                        <div
                          key={`${lead.id}-assigned-to-${person.name}`}
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800",
                            person.color,
                          )}
                          title={person.name}
                        >
                          {person.initial}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedLeadId(lead.id);
                            setShowLeadProfile(true);
                          }}
                        >
                          <ViewIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            View
                          </span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedLead(leadToFormData(lead));
                            setShowEditLeadForm(true);
                          }}
                        >
                          <EditIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            Edit
                          </span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setDeletingLeadId(lead.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            Delete
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Page info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {currentPage} of {totalPages} ({filteredClients.length} total leads)
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getVisiblePages().map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 transition-all duration-200",
                    currentPage === page
                      ? cn(
                        "bg-[#3072C0] text-white border border-[#3072C0]",
                        "hover:bg-blue-700 hover:border-blue-700",
                        "dark:bg-blue-600 dark:border-blue-600",
                        "dark:hover:bg-blue-700 dark:hover:border-blue-700",
                      )
                      : cn(
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-gray-700 dark:hover:text-gray-200",
                      ),
                  )}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <PopupModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        closeOnAction
        title="Delete Lead?"
        iconComponent={
          <DeleteIcon
            style={{
              background: "#FDEEEE",
              borderRadius: 999,
              padding: 8,
              width: 40,
              height: 40,
            }}
          />
        }
        description="Are you sure you want to delete this lead? This action cannot be undone."
        cancelButton={{
          label: "Delete",
          disabled: deleteMutation.isPending,
          onClick: () => {
            setShowDeleteDialog(false);
            confirmDeleteLead(deletingLeadId as string);
          },
        }}
        confirmButton={{
          label: "Cancel",
          onClick: () => setShowDeleteDialog(false),
        }}
      />
      <FilterSheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} />
    </div>
  );
};

export default LeadsPage;
