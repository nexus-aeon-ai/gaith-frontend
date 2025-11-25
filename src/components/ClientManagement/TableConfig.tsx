"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

const useTableColumns = () => {
  const router = useRouter();
  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
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
                  {client?.clientName
                    ? client.clientName
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                    : ""}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {client.clientName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
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
          <span
            className={cn(
              "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
              status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : status === "Inactive"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            )}
          >
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
      accessorKey: "industrySector",
      header: "Industry Sector",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">{row.original.industrySector}</span>
      ),
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => {
        const services = row.original.services;
        return services && services !== "N/A" ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-wrap gap-1 justify-start max-w-[300px] mx-auto">
                  {services.split(", ").slice(0, 2).map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {service}
                    </Badge>
                  ))}
                  {services.split(", ").length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    >
                      +{services.split(", ").length - 2}
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              {services.split(", ").length > 2 && (
                <TooltipContent className="max-w-[300px]">
                  <div className="flex flex-wrap gap-1">
                    {services.split(", ").map((service) => (
                      <Badge
                        key={service}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "contactInfo",
      header: "Contact Info",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">{row.original.contactInfo}</span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        console.log("row original", row.original);
        const assignedTo = row.original.assignedTo;
        return (
          <div className="flex -space-x-3">
            {assignedTo.map((person) => (
              <div
                key={person.name}
                className={cn(
                  "w-8 h-8 rounded-full capitalize flex items-center justify-center text-sm font-medium text-white border-2 border-white dark:border-gray-800",
                )}
                style={{
                  backgroundColor: person.color,
                }}
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
      cell: ({ row, table }) => {
        const client = row.original;
        const onDelete = (table.options.meta as { onDelete?: (client: Client) => void })?.onDelete;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" color="#687192" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push(`/client-management/${client.id}`)}
              >
                <Eye className="h-4 w-4 text-blue-500" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push(`/client-management/${client.id}/edit`)}
              >
                <Edit className="h-4 w-4 text-green-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => onDelete?.(client)}
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
