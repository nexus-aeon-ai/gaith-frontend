"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Input } from "@/components/ui/input";
import type { EmployeeFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

import EmployeeFilterSheet from "../sheet/EmployeeFilter";


interface SearchAndActionsSectionProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
}

const SearchAndActionsSection = ({
  globalFilter: _globalFilter,
  setGlobalFilter: _setGlobalFilter,
  filters,
  setFilters,
}: SearchAndActionsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterSheet, setIsFilterSheetOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        searchTerm: searchTerm || undefined,
      });
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, setFilters, filters]);

  return (
    <div className={cn(" items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}>
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between ",
          "gap-2 sm:gap-3 ",
        )}
      >
        <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
          <Search />
          <Input
            placeholder="Search employees"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-none shadow-none focus:outline-none h-12 min-w-md"
          />
        </div>
        <div className="flex gap-1 sm:gap-2 md:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center gap-1 sm:gap-2",
                  "bg-card border-border text-xs h-8 sm:h-10",
                  "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                  "hover:bg-card hover:border-blue-500",
                )}
              >
                <MenuIcon className="text-[#CCCFDB] dark:text-[#CCCFDB]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  // Handle delete action here
                  // TODO: Implement delete functionality
                }}
              >
                <DeleteIcon className="text-[#CCCFDB] dark:text-[#CCCFDB]" />
                <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <FilterIcon className="text-[#CCCFDB] dark:text-[#CCCFDB]" />
            <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500",
            )}
          >
            <ExcelIcon />
            <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
            <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500",
            )}
          >
            <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
            <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
          </Button>
        </div>
      </div>
      <EmployeeFilterSheet 
        onOpenChange={setIsFilterSheetOpen} 
        open={showFilterSheet}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default SearchAndActionsSection;

