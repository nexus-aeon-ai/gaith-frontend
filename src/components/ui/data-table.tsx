import { flexRender } from "@tanstack/react-table";
import type { Table as TTable } from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TPagination } from "@/types/general";

import PagePaginationFilters from "../shared/page-pagination-filters";


interface DataTableProps {
  table: TTable<any>;
  colSpan: number;
  dataPagination: TPagination;
}

const DataTable: React.FC<DataTableProps> = ({ table, colSpan, dataPagination }) => {
  return (
    <div className="space-y-4">
      <div className="w-full overflow-auto rounded-md border border-gray-300 bg-card">
        <Table>
          <TableHeader className="text-left">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PagePaginationFilters totalPages={Number(dataPagination.page_count)} />
    </div>
  );
};

export default DataTable;
