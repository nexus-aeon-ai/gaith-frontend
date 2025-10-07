import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

const useTableColumns = (onViewDetails?: (client: Client) => void) => {
  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Client Name",
      cell: ({ row }) => {
        const client = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={cn(
            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
            status === "Active" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === "Inactive"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          )}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "agreementPeriod",
      header: "Agreement Period",
      cell: ({ row }) => {
        const period = row.original.agreementPeriod;
        return (
          <span className="text-sm text-gray-900 dark:text-white">
            {period.start} - {period.end}
          </span>
        );
      },
    },
    {
      accessorKey: "marketRegion",
      header: "Market Region",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.original.marketRegion}
        </span>
      ),
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.original.services}
        </span>
      ),
    },
    {
      accessorKey: "contactInfo",
      header: "Contact Info",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.original.contactInfo}
        </span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = row.original.assignedTo;
        return (
          <div className="flex -space-x-2">
            {assignedTo.map((person, index) => (
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
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onViewDetails?.(client)}
              >
                <Eye className="h-4 w-4 text-blue-500" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => console.log("Edit client:", client.name)}
              >
                <Edit className="h-4 w-4 text-green-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => console.log("Delete client:", client.name)}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return columns;
};

export default useTableColumns;
