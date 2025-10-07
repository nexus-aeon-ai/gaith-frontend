"use client";
import { useTheme } from "next-themes";
import { useState } from "react";

import DotMenu from "@/components/ActionMenu/DotMenu";
import ExportButton from "@/components/ActionMenu/ExportButton";
import FilterButton from "@/components/ActionMenu/FilterButton";
import SearchBar from "@/components/ActionMenu/SearchBar";
import FilterSheet from "@/components/sheet/Filter";
import { columns } from "@/components/Tabels/columns";
import { DataTable } from "@/components/Tabels/data-table";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
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

interface LeadsClientWrapperProps {
  clients: Client[];
}

const LeadsClientWrapper = ({ clients }: LeadsClientWrapperProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const { theme } = useTheme();

  const DeleteLead = () => {
    // Handle delete action here
  };

  const menuOptions = [
    {
      label: "Delete",
      action: () => DeleteLead(),
      icon: <DeleteIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />,
    },
  ];

  const filteredClients = searchTerm
    ? clients.filter(
      client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : clients;

  return (
    <>
      {/* Search and Actions Section */}
      <div
        className={cn("items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between",
            "gap-2 sm:gap-3",
          )}
        >
          <SearchBar searchTerm={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="flex gap-1 sm:gap-2 md:gap-3 self-end sm:self-auto">
            <DotMenu options={menuOptions} />
            <FilterButton setIsFilterSheetOpen={setIsFilterSheetOpen} />
            <ExportButton fileType="excel" />
            <ExportButton fileType="pdf" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <DataTable columns={columns} data={filteredClients} />
      <FilterSheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} />
    </>
  );
};

export default LeadsClientWrapper;
