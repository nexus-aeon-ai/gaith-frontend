"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import PopupModal from "@/components/PopupModal/Modal";
import DeleteIcon from "@/components/ui/icons/options/delete-icon-v2";
import { deleteClient, getClients, type ApiClient } from "@/lib/api/client/client";
import { Client, TGenericPaginatedResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

import ClientDetailsView from "./ClientDetailsView";
import ClientTableSection from "./ClientTableSection";
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
  const queryClient = useQueryClient();

  // Fetch clients from API
  const { data: apiClientsData, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    initialData: [],
  });


  // Delete client mutation
  const { mutate: deleteClientMutate } = useMutation({
    mutationKey: ["clients", "delete"],
    mutationFn: async (id: string) => {
      const res = await deleteClient(id);
      return res;
    },
    onSuccess: async data => {
      console.log("Delete successful:", data);
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    },
  });


  // Transform API data to UI Client format
  const clients: Client[] = useMemo(() => {
    return apiClientsData.map(
      (apiClient: ApiClient): Client => ({
        id: apiClient.id,
        name: apiClient.fullName || apiClient.companyName,
        email: apiClient.emailAddress || "",
        clientName: apiClient.clientName || "",
        status: apiClient.isActive ? "Active" : "Inactive",
        agreementPeriod: {
          start: apiClient.agreementStartDate
            ? new Date(apiClient.agreementStartDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            : "N/A",
          end: apiClient.agreementEndDate
            ? new Date(apiClient.agreementEndDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            : "N/A",
        },
        marketRegion: apiClient.country || "N/A",
        services: apiClient.industry || "N/A",
        contactInfo: apiClient.phoneNumber || "N/A",
        assignedTo: [],
      }),
    );
  }, [apiClientsData]);

  // Paginated data structure
  const data: TGenericPaginatedResponse<Client> = {
    results: clients,
    count: clients.length,
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
    deleteClientMutate(clientToDelete.id, {
      onSuccess: () => {
        setDeleteClientToggle(false);
        setClientToDelete(null);
      },
      onError: () => {
        // Keep modal open on error so user can see the error
      },
    });
  };

  if(isLoading) return <div>Loading...</div>;


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
        "overflow-x-hidden",
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
          <DeleteIcon  width={70} height={70} color="#EA3B1F" />
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
