"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { getSourceClasses, getStatusClasses } from "@/lib/functions/badge-classes";
import { cn } from "@/lib/utils";

import { ActionsCell } from "./actions-cell";

export type Lead = {
  id: string;
  name: string;
  email: string;
  source: string;
  status: "Active" | "Inactive" | "Pending";
  services: string;
  contactInfo: string;
  assignedTo: {
    name: string;
    initial: string;
    color: string;
  }[];
};

export const columns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="!rounded-[8px]"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="!rounded-[8px]"
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
    header: "Lead Name",
    cell: ({ row }) => {
      const lead = row.original;
      return (
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
            <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
            getStatusClasses(status),
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      return (
        <span
          className={cn(
            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
            getSourceClasses(source),
          )}
        >
          {source}
        </span>
      );
    },
  },
  {
    accessorKey: "services",
    header: "Services",
  },
  {
    accessorKey: "contactInfo",
    header: "Contact Info",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      return (
        <div className="flex -space-x-3 justify-center">
          {assignedTo.map(person => (
            <div
              key={`${row.id}-${person.name}-${person.initial}`}
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
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return <ActionsCell />;
    },
  },
];
