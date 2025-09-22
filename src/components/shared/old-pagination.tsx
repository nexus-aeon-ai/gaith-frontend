"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type TPaginationProps = {
  paginationProps: {
    count: number;
    next: string | null;
    previous: string | null;
  };
};

export default function Pagination({ paginationProps }: TPaginationProps) {
  const { count, next, previous } = paginationProps;
  const router = useRouter();
  const pathName = usePathname();
  const { lang } = useParams();
  const searchParams = useSearchParams();
  const page_size = Number(searchParams.get("page_size") || PAGE_SIZE);
  const currentPage = Number(searchParams.get("page") || "1");
  const totalPages = Math.ceil(count / page_size);
  const handlePageClick = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathName}?${params.toString()}`);
  };

  const renderPageItem = (page: number) => (
    <div
      className={cn(
        "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border border-[#b5b5b5] bg-white",
        currentPage === page && "border-primary-500 bg-primary-500/20 text-primary-500"
      )}
      onClick={() => handlePageClick(page)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          handlePageClick(page);
        }
      }}
      role="button"
      tabIndex={0}
      key={page ?? "page"}
    >
      {page}
    </div>
  );

  const generatePageItems = () => {
    const pageItems = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(renderPageItem(i));
      }
    } else if (currentPage <= 0) {
      for (let i = 1; i <= 3; i++) {
        pageItems.push(renderPageItem(i));
      }
      pageItems.push(
        <p key="dots" className="text-slate-500">
          ...
        </p>
      );
      pageItems.push(renderPageItem(totalPages));
    } else if (currentPage >= totalPages - 2) {
      pageItems.push(renderPageItem(1));
      pageItems.push(
        <p key="dots" className="text-slate-500">
          ...
        </p>
      );
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pageItems.push(renderPageItem(i));
      }
    } else {
      pageItems.push(renderPageItem(1));
      pageItems.push(
        <p key="dots" className="text-slate-500">
          ...
        </p>
      );
      for (let i = currentPage + 1; i <= currentPage + 2; i++) {
        pageItems.push(renderPageItem(i));
      }
      pageItems.push(
        <p key="dots2" className="text-slate-500">
          ...
        </p>
      );
      pageItems.push(renderPageItem(totalPages));
    }
    return pageItems;
  };

  return (
    <div
      className={cn(
        "flex h-12 w-fit justify-between max-sm:mb-2 max-sm:mt-8 max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:gap-4"
      )}
    >
      <div className="flex h-full items-center gap-4">
        {previous && (
          <Button
            type="button"
            className={cn(
              "dark:bg-dark-secondary flex h-10 min-w-10 select-none items-center justify-center rounded-md border border-[#b5b5b5]",
              currentPage === 0 && "bg-white",
              lang === "ar" && "rotate-180"
            )}
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}
        {generatePageItems()}
        {next && (
          <Button
            type="button"
            className={cn(
              "dark:bg-dark-secondary flex h-10 min-w-10 select-none items-center justify-center rounded-md border border-[#b5b5b5]",
              currentPage < totalPages - 1 && "bg-white",
              lang === "ar" && "rotate-180"
            )}
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
