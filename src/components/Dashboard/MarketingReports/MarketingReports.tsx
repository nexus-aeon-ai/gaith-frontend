"use client";

import { type SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import DataTable from "@/components/ui/data-table";
import { CampaignAnalyticsIcon } from "@/components/ui/icons/marketingreports/campaignAnalytics";
import { SocialAnalyticsIcon } from "@/components/ui/icons/marketingreports/socialAnalytics";

import useTableColumns, { TMarketingReport } from "./TableConfig";

// Mock paginated response type
interface TGenericPaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

// Mock data
const reports: TMarketingReport[] = [
  {
    name: "Social Media Analytics",
    type: "PDF",
    date: "June 24, 2025",
    status: "In Review",
    icon: <SocialAnalyticsIcon className=" text-blue-500" />,
  },
  {
    name: "Campaign ROI Analysis",
    type: "PDF",
    date: "June 24, 2025",
    status: "Completed",
    icon: <CampaignAnalyticsIcon className=" text-green-500" />,
  },
  {
    name: "Social Media Analytics",
    type: "PDF",
    date: "June 24, 2025",
    status: "Completed",
    icon: <SocialAnalyticsIcon className=" text-purple-500" />,
  },
];

const data: TGenericPaginatedResponse<TMarketingReport> = {
  results: reports,
  count: 3,
  next: null,
  previous: null,
};

const MarketingReports = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useTableColumns();
  const table = useReactTable({
    data: data.results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    manualPagination: true,
  });

  return (
    <div className="bg-card rounded-lg shadow-md p-4 flex-1">
      <h2 className="font-semibold text-lg mb-2">Marketing Reports</h2>
      <DataTable table={table} colSpan={columns.length} dataPagination={data} />
    </div>
  );
};

export default MarketingReports;
