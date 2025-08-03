"use client";
import { CirclePlus, Download, FileText, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
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

const ClientManagementClient = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(clients.map(client => client.id));
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={cn(
      "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
      "bg-[#F9FBFA] dark:bg-[#0F1220] overflow-x-hidden",
    )}>
      {/* Header Section */}
      <div className={cn(
        "flex flex-col sm:flex-row justify-between items-start",
        "gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6",
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
            "bg-[#508CD3] rounded-3xl w-full sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
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
        "bg-card rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 lg:mb-6 shadow-sm",
      )}>
        <div className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between",
          "gap-2 sm:gap-3 mb-3 sm:mb-4",
        )}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input"
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
                    checked={selectedClients.length === clients.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agreement Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Region
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {client.name.split(" ").map(n => n[0]).join("")}
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
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      client.status === "Active" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : client.status === "Inactive"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                    )}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {client.agreementPeriod.start} - {client.agreementPeriod.end}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {client.marketRegion}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {client.services}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {client.contactInfo}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {client.assignedTo.map((person, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800",
                            person.color,
                          )}
                          title={person.name}
                        >
                          {person.initial}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManagementClient; 
