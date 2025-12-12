"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, MessageSquare, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

const useTableColumns = (
  onViewAndReply?: (ticket: SupportTicket) => void,
  onEdit?: (ticket: SupportTicket) => void,
  onDelete?: (ticket: SupportTicket) => void,
) => {
  const columns: ColumnDef<SupportTicket>[] = [
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
      accessorKey: "ticketId",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Ticket ID</span>
            {isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm font-medium ">{row.original.ticketId}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <div className="max-w-[300px]">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {ticket.subject}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {ticket.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "issueCategory",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.original.issueCategory?.name || row.original.issueCategoryId}
        </span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.original.priority;
        return (
          <span
            className={cn(
              "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
              priority === "Critical"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : priority === "High"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  : priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            )}
          >
            {priority}
          </span>
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
              status === "Open"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : status === "In Progress"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : status === "Closed"
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const ticket = row.original;
        const assignedUser = ticket.assignedTo ? ticket.assignedTo.fullName :  null;
        return (
          <span className="text-sm text-gray-900 dark:text-white">
            {assignedUser || "Not assigned"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">{row.original.createdDate}</span>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">{row.original.lastUpdated}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ticket = row.original;
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
                onClick={() => onViewAndReply?.(ticket)}
              >
                <Eye className="h-4 w-4 text-blue-500" />
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span>View & Reply</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEdit?.(ticket)}
              >
                <Edit className="h-4 w-4 text-orange-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
                onClick={() => onDelete?.(ticket)}
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

