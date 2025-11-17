"use client";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchAndActionsSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

const SearchAndActionsSection = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onExportExcel,
  onExportPDF,
}: SearchAndActionsSectionProps) => {
  const { theme } = useTheme();

  return (
    <div className={cn("items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}>
      <div
        className={cn(
          "flex flex-col lg:flex-row items-start lg:items-center justify-between",
          "gap-2 sm:gap-3",
        )}
      >
        <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
          <Search />
          <Input
            placeholder="Search subject or description..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="border-none shadow-none focus:outline-none h-12 xl:min-w-md md:min-w-[250px] min-w-[100px]"
          />
        </div>
        <div className="flex gap-1 sm:gap-2 md:gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-auto",
              "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
              "hover:bg-card hover:border-blue-500 rounded-[16px]",
            )}
            onClick={onFilterClick}
          >
            <FilterIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
            <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-auto",
              "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
            )}
            onClick={onExportExcel}
          >
            <ExcelIcon />
            <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
            <span className="dark:text-white text-gray-900">Excel</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-auto",
              "hover:bg-card hover:border-blue-500 rounded-[16px]",
            )}
            onClick={onExportPDF}
          >
            <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
            <span className="dark:text-white text-gray-900">PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActionsSection;

