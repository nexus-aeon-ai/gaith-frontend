"use client";

import { useSearchParams } from "next/navigation";

import PaginationControls from "./pagination-controls";

type PaginationProps = {
  totalPages: number;
  paginationItemsToDisplay?: number;
};

export default function PagePaginationFilters({
  totalPages,
  paginationItemsToDisplay = 5,
}: PaginationProps) {
  const params = useSearchParams();
  const startIndex = totalPages > 0 ? Number(params.get("page") ?? 1) : 0;
  const currentPage = startIndex;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 font-inter">
      {/* Page Info */}
      <p className="text-sm text-[#687192] font-medium">
        Showing {currentPage} of {totalPages}
      </p>

      {/* Pagination controls */}
      <div>
        <PaginationControls
          totalPages={totalPages}
          paginationItemsToDisplay={paginationItemsToDisplay}
        />
      </div>

      {/* Page size selector */}
      {/* <div className="flex flex-1 justify-end">
        <PageSizeFilter />
      </div> */}
    </div>
  );
}
