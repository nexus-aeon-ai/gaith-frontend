import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/lib/types";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    onDelete?: (employee: TData) => void;
  }
}

const useTableColumns = (
  onViewDetails?: (employee: Employee) => void,
  onEditEmployeeToggle?: (arg: boolean) => void,
) => {
  const columns: ColumnDef<Employee>[] = useMemo(() => [
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
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Employee
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">
                  {employee.fullName
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {employee.fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{employee.employeeId}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const dept = row.original.department;
        return (
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</div>
            {dept.subTeam && (
              <div className="text-sm text-gray-500 dark:text-gray-400">{dept.subTeam}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{role.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{role.level}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "contactInfo",
      header: "Contact Info",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div>
            <div className="text-sm text-gray-900 dark:text-white">{employee.email}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{employee.phone}</div>
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
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const performance = row.original.performance;
        const getPerformanceColor = (perf: number) => {
          if (perf >= 80) return "bg-green-500";
          if (perf >= 50) return "bg-yellow-500";
          return "bg-red-500";
        };
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", getPerformanceColor(performance))}
                style={{ width: `${performance}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
              {performance}%
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => {
        const employee = row.original;
        const onDelete = table.options.meta?.onDelete;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onViewDetails?.(employee)}
              >
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  onViewDetails?.(employee);
                  onEditEmployeeToggle?.(true);
                }}
              >
                <Edit className="h-4 w-4 text-green-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => onDelete?.(employee)}
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
  ], [onViewDetails, onEditEmployeeToggle]);

  return columns;
};

export default useTableColumns;

