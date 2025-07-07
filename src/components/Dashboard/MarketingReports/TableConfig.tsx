import type { ColumnDef } from "@tanstack/react-table";

// Replace with your actual type for a marketing report
export type TMarketingReport = {
  name: string;
  type: string;
  date: string;
  status: string;
};

const useTableColumns = () => {
  const columns: ColumnDef<TMarketingReport>[] = [
    {
      header: "Report Name",
      accessorKey: "name",
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
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => <button className="text-blue-600 hover:underline text-xs">View</button>,
    },
  ];
  return columns;
};

export default useTableColumns; 