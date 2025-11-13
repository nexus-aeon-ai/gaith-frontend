"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import RightArrowIcon from "@/components/ui/icons/options/right-arrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  assignees: string[];
  statuses: string[];
  sources: string[];
  clients: string[];
}
const statusOptions = ["Scheduled", "Published", "Draft", "Failed"];
const platformOptions = ["Facebook", "Instagram", "Linkedin", "Google", "X"];

export default function AllPostsFilter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    assignees: [],
    statuses: [],
    sources: [],
    clients: [],
  });

  const { theme } = useTheme();

  const handleCheckboxChange = (
    category: keyof Pick<FilterState, "assignees" | "statuses" | "sources" | "clients">,
    value: string,
    checked: boolean,
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value),
    }));
  };

  const handleSelectAll = (
    category: keyof Pick<FilterState, "assignees" | "statuses" | "sources" | "clients">,
    options: string[],
  ) => {
    const allSelected = options.every(option => filters[category].includes(option));
    setFilters(prev => ({
      ...prev,
      [category]: allSelected ? [] : options,
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      assignees: [],
      statuses: [],
      sources: [],
      clients: [],
    });
  };

  const applyFilters = () => {
    onOpenChange(false);
  };

  const handleDateFromClick = () => {
    const input = document.getElementById("date-from") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleDateToClick = () => {
    const input = document.getElementById("date-to") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:p-4 sm:pt-0 p-2">
          {/* Added Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="flex flex-row justify-between gap-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">From</Label>
                <div className="relative w-full">
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
          pr-10
          [&::-webkit-calendar-picker-indicator]:opacity-0 
          [&::-webkit-calendar-picker-indicator]:absolute 
          [&::-webkit-calendar-picker-indicator]:w-full 
          [&::-webkit-calendar-picker-indicator]:h-full
        "
                  />

                  <button
                    type="button"
                    onClick={handleDateFromClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                  To
                </Label>

                <div className="relative">
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6

            pr-10
            [&::-webkit-calendar-picker-indicator]:opacity-0 
            [&::-webkit-calendar-picker-indicator]:absolute 
            [&::-webkit-calendar-picker-indicator]:w-full 
            [&::-webkit-calendar-picker-indicator]:h-full
          "
                  />

                  <button
                    type="button"
                    onClick={handleDateToClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-assignees"
                  checked={statusOptions.every(option => filters.assignees.includes(option))}
                  onCheckedChange={() => handleSelectAll("statuses", statusOptions)}
                />
                <Label htmlFor="select-all-assignees" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`assignee-${status}`}
                    checked={filters.assignees.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("assignees", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`assignee-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* platform Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Platforms</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-clients"
                  checked={platformOptions.every(option => filters.clients.includes(option))}
                  onCheckedChange={() => handleSelectAll("clients", platformOptions)}
                />
                <Label htmlFor="select-all-clients" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {platformOptions.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`client-${platform}`}
                    checked={filters.clients.includes(platform)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("clients", platform, checked as boolean)
                    }
                  />
                  <Label htmlFor={`client-${platform}`} className="text-sm">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
          <Button variant="ghost" onClick={clearFilters} className="flex-1  py-6">
            Clear Filters
          </Button>
          <Button
            onClick={applyFilters}
            className="flex items-center flex-1 py-6 bg-[#3072C0] text-white rounded-[16px] text-[16px] font-medium"
          >
            <p>Apply Filter</p>
            <RightArrowIcon color={theme === "dark" ? "#F6FBFE" : "#303444"} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
