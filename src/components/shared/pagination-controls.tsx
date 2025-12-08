"use client";

import { useSearchParams } from "next/navigation";

import { usePagination } from "@/hooks/use-pagination";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type PaginationProps = {
  totalPages: number;
  paginationItemsToDisplay?: number;
};

export default function PaginationControls({
  totalPages,
  paginationItemsToDisplay = 5,
}: PaginationProps) {
  const params = useSearchParams();
  const startIndex = totalPages > 0 ? Number(params.get("page") ?? 1) : 0;
  const currentPage = startIndex;

  const { pages, showLeftEllipsis, showRightEllipsis, previousPageHref, nextPageHref } =
    usePagination({
      currentPage,
      totalPages,
      paginationItemsToDisplay,
    });
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            className="aria-disabled:pointer-events-none border-none aria-disabled:opacity-50 bg-transparent shadow-none"
            href={previousPageHref}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
          />
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map(page => (
          <PaginationItem key={page.number}>
            <PaginationLink className=" border-none" href={page.href} isActive={page.number === currentPage}>
              {page.number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            className="aria-disabled:pointer-events-none border-none aria-disabled:opacity-50 bg-transparent shadow-none"
            href={nextPageHref}
            aria-label="Go to next page"
            disabled={currentPage === totalPages}
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "link" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
