"use client";
import { ChevronLeft, ChevronRight, CirclePlus, Download, EllipsisVertical, FileText, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  source: string;
  status: "Active" | "Inactive" | "Pending";
  agreementPeriod: {
    start: string;
    end: string;
  };
  marketRegion: string;
  services: string;
  contactInfo: string;
  assignedTo: {
    name: string;
    initial: string;
    color: string;
  }[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Website",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "2",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Website",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "3",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Social Media",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "4",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Referral",
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

      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "5",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Website",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "6",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Campaign",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "7",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Social Media",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "8",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Socila Media",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "9",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Social Media",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "10",
    name: "Michael Anderson",
    email: "anderson@email.com",
    source: "Social Media",
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
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
];

const LeadsPage = () => {
  const leads = mockClients;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(leads.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const filteredClients = leads.filter(
    client =>
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
    const pages = [];
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

  return (
    <div
      className={cn(
        "min-h-fit w-full p-2 sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0",
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
              "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Leads Management
          </h1>
          <p className={cn("text-xs sm:text-sm md:text-base", "text-gray-600 dark:text-gray-300")}>
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
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Lead</span>
          <span className="sm:hidden">Add Client</span>
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
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
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
                "bg-card border-border text-xs h-8 sm:h-10",
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
                "bg-card border-border text-xs h-8 sm:h-10",
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
                "bg-card border-border text-xs h-8 sm:h-10",
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

      {/* Table Section */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    className="!rounded-[8px]"
                    checked={selectedClients.length === leads.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
              {currentClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <Checkbox
                      className="!rounded-[8px]"
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={checked => handleSelectClient(client.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {client.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        client.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : client.status === "Inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      )}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        client.source === "Website"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : client.source === "Social Media"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : client.source === "Campaign"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                      )}
                    >
                      {client.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                    {client.services}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                    {client.contactInfo}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex -space-x-3 justify-center">
                      {client.assignedTo.map(person => (
                        <div
                          key={client.id}
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
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {getVisiblePages().map((page) => (
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
    </div>
  );
};

export default LeadsPage;
