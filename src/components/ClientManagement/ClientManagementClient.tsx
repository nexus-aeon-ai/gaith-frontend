"use client";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";

import { Client, TGenericPaginatedResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

import PopupModal from "../PopupModal/Modal";

import ClientDetailsView from "./ClientDetailsView";
import ClientTableSection from "./ClientTableSection";
import { mockClients } from "./data/mockClients";
import EditClient from "./EditClient";
import HeaderSection from "./HeaderSection";
import NewClient from "./NewClient";
import SearchAndActionsSection from "./SearchAndActionsSection";
import useTableColumns from "./TableConfig";

const ClientManagementClient = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editClientToggle, setEditClientToggle] = useState<boolean>(false);
  const [newClientToggle, setNewClientToggle] = useState<boolean>(false);
  const columns = useTableColumns(setSelectedClient, setEditClientToggle);
  const [deleteClientToggle, setDeleteClientToggle] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

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

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setDeleteClientToggle(true);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    console.log("Deleting client:", clientToDelete);
    // TODO: call API for deletion
    setDeleteClientToggle(false);
    setClientToDelete(null);
  };

  // If a client is selected, show the details view
  if (selectedClient && !editClientToggle) {
    return <ClientDetailsView client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }
  if (newClientToggle) {
    return <NewClient closeNewClientForm={() => setNewClientToggle(false)} />;
  }
  if (editClientToggle) {
    return (
      <EditClient client={selectedClient} closeEditClientForm={() => setEditClientToggle(false)} />
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-background overflow-x-hidden",
      )}
    >
      <HeaderSection setNewClientToggle={setNewClientToggle} />
      <SearchAndActionsSection globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <ClientTableSection
        table={table}
        columns={columns}
        dataPagination={data}
        onDelete={handleDeleteClient}
      />
      <PopupModal
        open={deleteClientToggle}
        onOpenChange={setDeleteClientToggle}
        title="Delete Client?"
        iconComponent={
          <X className="bg-red-200 rounded-full p-2" strokeWidth={3} size={40} color="#EA3B1F" />
        }
        description="Are you sure you want to Delete Client? This action cannot be undone."
        cancelButton={{
          label: "Yes, Delete",
          onClick: () => {
            setDeleteClientToggle(false);
            confirmDeleteClient();
          },
        }}
        confirmButton={{ label: "No, Keep", onClick: () => setDeleteClientToggle(false) }}
      />
    </div>
  );
};

export default ClientManagementClient;
