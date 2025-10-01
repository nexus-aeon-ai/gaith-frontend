import { CirclePlus } from "lucide-react";

import LeadsClientWrapper from "@/components/LeadsClientWrapper/LeadsClientWrapper";
import { Button } from "@/components/ui/button";
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
    name: "Afaq",
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
      { name: "Jason", initial: "J", color: "bg-yellow-500" },
    ],
  },
  {
    id: "2",
    name: "Ahmed",
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
      { name: "Smith", initial: "S", color: "bg-green-500" },
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
      { name: "Stacey", initial: "S", color: "bg-yellow-500" },
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
      { name: "Stacey", initial: "S", color: "bg-yellow-500" },
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
      { name: "Stacey", initial: "S", color: "bg-yellow-500" },
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
      { name: "Shabby", initial: "S", color: "bg-yellow-500" },
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
      { name: "Salt", initial: "S", color: "bg-green-500" },
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
  {
    id: "8",
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
      { name: "Smith", initial: "S", color: "bg-green-500" },
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
      { name: "Schnell", initial: "S", color: "bg-green-500" },
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
      { name: "Schneilberg", initial: "S", color: "bg-green-500" },
      { name: "Steve", initial: "S", color: "bg-yellow-500" },
    ],
  },
];

async function getLeads(): Promise<Client[]> {
  // const response = await fetch('your-api-endpoint', { cache: 'no-store' });
  // return response.json();
  return mockClients;
}

const LeadsPage = async () => {
  // Fetch data on the server
  const clients = await getLeads();

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
          "flex sm:flex-row pl-3 sm:pl-0 flex-row justify-between items-start",
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
          <p
            className={cn(
              "text-xs sm:text-sm md:w-full max-w-[80%]",
              "text-gray-600 dark:text-gray-300",
            )}
          >
            Track and manage sales prospects through the conversion pipeline.
          </p>
        </div>
        <Button
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#3072C0] rounded-[16px] w-fit sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Lead</span>
          <span className="sm:hidden">Add Lead</span>
        </Button>
      </div>

      {/* Client Wrapper with Interactive Components */}
      <LeadsClientWrapper clients={clients} />
    </div>
  );
};

export default LeadsPage;

