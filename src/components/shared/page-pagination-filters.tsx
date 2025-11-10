"use client";

import { useSearchParams } from "next/navigation";

import { PageSizeFilter } from "./page-size-selector";
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
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Page Info */}
      <p className="flex-1 text-sm text-gray-500">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </p>

      {/* Pagination controls */}
      <div className="w-full max-sm:order-3 sm:flex-1">
        <PaginationControls
          totalPages={totalPages}
          paginationItemsToDisplay={paginationItemsToDisplay}
        />
      </div>

      {/* Page size selector */}
      <div className="flex flex-1 justify-end">
        <PageSizeFilter />
      </div>
    </div>
  );
}
