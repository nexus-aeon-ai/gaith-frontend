import React from "react";

import FilterIcon from "@/components/ui/icons/options/filter-icon";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const FilterButton = ({
  setIsFilterSheetOpen,
}: {
  setIsFilterSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        "bg-card border-border text-xs h-12",
        "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
        "hover:bg-card hover:border-blue-500",
      )}
      onClick={() => setIsFilterSheetOpen(true)}
    >
      <FilterIcon style={{ color: "var(--icon-primary)" }} />
      <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
    </Button>
  );
};

export default FilterButton;
