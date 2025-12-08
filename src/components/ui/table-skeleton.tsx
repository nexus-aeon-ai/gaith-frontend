import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columns: {
    header: string;
    width: string;
  }[];
  rows?: number;
  className?: string;
}

const TableSkeleton = ({ columns, rows = 7, className = "" }: TableSkeletonProps) => {
  return (
    <div
      className={cn("w-full overflow-auto rounded-md border border-gray-300 bg-white dark:bg-card", className)}
    >
      <Table>
        <TableHeader className="text-left">
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={`header-${column.header}`}
                className={cn(column.width, column.header === "Actions" && "text-center")}
              >
                <span>{column.header}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => i + 1).map(el => (
            <TableRow key={`row-${el}`}>
              {columns.map(column => (
                <TableCell key={`cell-${column.header}-${el}`} className={column.width}>
                  <Skeleton
                    className={cn(
                      column.width,
                      "h-8 w-full",
                      column.header === "Actions" && "mx-auto w-16"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
