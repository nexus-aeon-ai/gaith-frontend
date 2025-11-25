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

interface Assignee {
  id: number;
  name: string;
  department?: string;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  statuses: string[];
  priorities: string[];
  levels: string[];
}

const statusOptions = ["ACTIVE", "ON_LEAVE", "INACTIVE"];
const levelOptions = [
  "Senior Level",
  "Mid Level",
  "Junior Level",
  "Entry Level",
  "Associate Level",
];

export default function FilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (filters: FilterState) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    statuses: [],
    priorities: [],
    levels: [],
  });

  const { theme } = useTheme();

  const handleCheckboxChange = (
    category: "statuses" | "levels" | "priorities",
    option: Assignee | string,
    checked: boolean,
  ) => {
    const value = option as string;
    setFilters(prev => {
      const arr = (prev as any)[category] as string[];
      const exists = arr.includes(value);

      return {
        ...prev,
        [category]: checked ? (exists ? arr : [...arr, value]) : arr.filter(v => v !== value),
      } as unknown as FilterState;
    });
  };

  const handleSelectAll = (category: "statuses" | "priorities" | "levels", options: string[]) => {
    const opts = options as string[];
    const cur = (filters as any)[category] as string[]; // narrow to string[] for runtime check
    const allSelected = opts.length > 0 && opts.every(opt => cur.includes(opt));

    setFilters(
      prev =>
        ({
          ...prev,
          [category]: allSelected ? [] : opts,
        }) as unknown as FilterState,
    );
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      statuses: [],
      priorities: [],
      levels: [],
    });
  };

  const applyFilters = () => {
    if (onApplyFilters) onApplyFilters(filters);
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
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4">
          {/* Added Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Hiring Date</Label>
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

          {/* Priority Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-statuses"
                  checked={statusOptions.every(option => filters.statuses.includes(option))}
                  onCheckedChange={() => handleSelectAll("statuses", statusOptions)}
                />
                <Label htmlFor="select-all-statuses" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("statuses", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm capitalize font-normal">
                    {status.replace("_", " ").toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Level Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Level</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-statuses"
                  checked={levelOptions.every(option => filters.levels.includes(option))}
                  onCheckedChange={() => handleSelectAll("levels", levelOptions)}
                />
                <Label htmlFor="select-all-statuses" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {levelOptions.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`level-${level}`}
                    checked={filters.levels.includes(level)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("levels", level, checked as boolean)
                    }
                  />
                  <Label htmlFor={`level-${level}`} className="text-sm font-normal">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t absolute bottom-0 left-0 right-0 bg-card">
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
