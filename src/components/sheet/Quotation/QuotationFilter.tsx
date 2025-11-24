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
  minAmount?: number;
  maxAmount?: number;
  assignees: string[];
  statuses: string[];
  sources: string[];
  clients: string[];
}

const statusOptions = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

export default function FilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (filters: {
    startDate?: string;
    endDate?: string;
    statuses?: string[];
    minAmount?: number;
    maxAmount?: number;
  }) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    minAmount: undefined,
    maxAmount: undefined,
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
      minAmount: undefined,
      maxAmount: undefined,
      assignees: [],
      statuses: [],
      sources: [],
      clients: [],
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.dateFrom !== "" ||
      filters.dateTo !== "" ||
      filters.minAmount !== undefined ||
      filters.maxAmount !== undefined ||
      filters.assignees.length > 0 ||
      filters.statuses.length > 0 ||
      filters.sources.length > 0 ||
      filters.clients.length > 0
    );
  };

  const applyFilters = () => {
    // Validate and auto-correct filters before applying
    setFilters(prev => {
      const corrected = { ...prev };

      // Validate date range
      if (corrected.dateFrom && corrected.dateTo && corrected.dateTo < corrected.dateFrom) {
        corrected.dateTo = corrected.dateFrom;
      }

      // Clear dateTo if dateFrom is not set
      if (!corrected.dateFrom && corrected.dateTo) {
        corrected.dateTo = "";
      }

      // Validate amount range
      if (corrected.minAmount !== undefined && corrected.maxAmount !== undefined) {
        if (corrected.maxAmount < corrected.minAmount) {
          corrected.maxAmount = corrected.minAmount;
        }
      }

      // Clear maxAmount if minAmount is not set
      if (corrected.minAmount === undefined && corrected.maxAmount !== undefined) {
        corrected.maxAmount = undefined;
      }

      return corrected;
    });

    // Close the sheet and apply filters
    // Close the sheet and apply filters
    const payload = {
      startDate: filters.dateFrom || undefined,
      endDate: filters.dateTo || undefined,
      statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
    };
    if (onApplyFilters) onApplyFilters(payload);
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
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:p-4 p-2 sm:pt-0">
          {/* Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Due Date</Label>
            <div className="flex flex-row justify-between gap-2">
              {/* From Date */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">From</Label>
                <div className="relative w-full">
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => {
                      const newFrom = e.target.value;
                      setFilters(prev => {
                        // if dateTo exists and is before new dateFrom → adjust it
                        if (prev.dateTo && newFrom > prev.dateTo) {
                          return { ...prev, dateFrom: newFrom, dateTo: newFrom };
                        }
                        return { ...prev, dateFrom: newFrom };
                      });
                    }}
                    className="
                      dark:bg-[#0F1B29] bg-[#DCE0E4] p-6
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
                    aria-label="Select from date"
                  >
                    <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  </button>
                </div>
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                  To
                </Label>

                <div className="relative">
                  <Input
                    id="date-to"
                    type="date"
                    disabled={!filters.dateFrom}
                    value={filters.dateTo}
                    onChange={e => {
                      const newTo = e.target.value;
                      setFilters(prev => ({ ...prev, dateTo: newTo }));
                    }}
                    onBlur={e => {
                      // Validate when user finishes
                      const newTo = e.target.value;
                      setFilters(prev => {
                        if (prev.dateFrom && newTo && newTo < prev.dateFrom) {
                          return { ...prev, dateTo: prev.dateFrom };
                        }
                        return prev;
                      });
                    }}
                    className={`
                      dark:bg-[#0F1B29] bg-[#DCE0E4] p-6 pr-10
                      ${!filters.dateFrom ? "opacity-50 cursor-not-allowed" : ""}
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    `}
                  />

                  <button
                    type="button"
                    onClick={handleDateToClick}
                    disabled={!filters.dateFrom}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      !filters.dateFrom
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="Select to date"
                  >
                    <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
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
                    {status.toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Range Section */}
          <div>
            <Label className="text-sm mb-2 font-medium">Amount Range</Label>
            <div className="space-y-3 grid grid-cols-2 gap-2">
              {/* Min Amount */}
              <div>
                <Label className="mb-1 font-normal">Min</Label>
                <Input
                  type="number"
                  min="0"
                  value={filters.minAmount ?? ""}
                  onChange={e => {
                    const value = e.target.value;
                    const newMin = value === "" ? undefined : Number(value);
                    setFilters(prev => {
                      // if maxAmount exists and is less than newMin → adjust it
                      if (
                        prev.maxAmount !== undefined &&
                        newMin !== undefined &&
                        newMin > prev.maxAmount
                      ) {
                        return { ...prev, minAmount: newMin, maxAmount: newMin };
                      }
                      return { ...prev, minAmount: newMin };
                    });
                  }}
                  className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6"
                />
              </div>

              {/* Max Amount */}
              <div>
                <Label className="mb-1 font-normal">Max</Label>
                <Input
                  type="number"
                  value={filters.maxAmount ?? ""}
                  onChange={e => {
                    // Allow any input during typing
                    const value = e.target.value;
                    setFilters(prev => ({
                      ...prev,
                      maxAmount: value === "" ? undefined : Number(value),
                    }));
                  }}
                  onBlur={e => {
                    // Validate only when user finishes (loses focus)
                    const value = e.target.value;
                    const newMax = value === "" ? undefined : Number(value);
                    setFilters(prev => {
                      if (
                        prev.minAmount !== undefined &&
                        newMax !== undefined &&
                        newMax < prev.minAmount
                      ) {
                        return { ...prev, maxAmount: prev.minAmount }; // Set to min if invalid
                      }
                      return prev;
                    });
                  }}
                  disabled={filters.minAmount === undefined}
                  className={`dark:bg-[#0F1B29] bg-[#DCE0E4] p-6 ${
                    filters.minAmount === undefined ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute w-full flex bottom-0 gap-3 p-4 border-t bg-card">
          <Button variant="ghost" onClick={clearFilters} className="flex-1 py-6">
            Clear Filters
          </Button>
          <Button
            onClick={applyFilters}
            disabled={!hasActiveFilters()}
            className="flex items-center flex-1 py-6 bg-[#3072C0] text-white rounded-[16px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p>Apply Filter</p>
            <RightArrowIcon color={theme === "dark" ? "#F6FBFE" : "#303444"} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
