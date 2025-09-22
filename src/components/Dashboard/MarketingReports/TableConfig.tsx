import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Download } from "lucide-react";
import React from "react";

// Replace with your actual type for a marketing report
export type TMarketingReport = {
  name: string;
  type: string;
  date: string;
  status: string;
  icon: React.ReactNode;
};

const useTableColumns = () => {
  const columns: ColumnDef<TMarketingReport>[] = [
    {
      header: "Report Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.icon}
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        let borderColor = "bg-[#2BAE8214]";
        if (status === "Completed") borderColor = "bg-[#2BAE8214] text-[#175E46]";
        else if (status === "In Review") borderColor = "bg-[#ECA33814] text-[#F7C649]";
        return (
          <span className={`px-3 py-1 rounded-full  font-semibold text-xs ${borderColor}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => (
        <div className="flex gap-2 items-center">
          <Eye className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" />
          <Download className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-800" />
        </div>
      ),
    },
  ];
  return columns;
};

export default useTableColumns;
