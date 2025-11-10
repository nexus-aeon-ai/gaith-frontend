import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const PaginationSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1 ">
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mx-auto flex w-full items-center justify-center gap-2 max-sm:order-3 sm:flex-1">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 md:mt-0">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </div>
  );
};

export default PaginationSkeleton;
