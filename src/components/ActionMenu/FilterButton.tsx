import { useTheme } from "next-themes";
import React from "react";

import FilterIcon from "@/components/ui/icons/options/filter-icon";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const FilterButton = ({
  setIsFilterSheetOpen,
}: {
  setIsFilterSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { theme: themeNext } = useTheme();

  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        "bg-card border-border text-xs h-8 sm:h-10",
        "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
        "hover:bg-card hover:border-blue-500",
      )}
      onClick={() => setIsFilterSheetOpen(true)}
    >
      <FilterIcon color={themeNext === "dark" ? "#CCCFDB" : "#303444"} />
      <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
    </Button>
  );
};

export default FilterButton;
