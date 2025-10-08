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
import Image from "next/image";

interface Assignee {
  id: number;
  name: string;
  department?: string;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  assignees: Assignee[];
  statuses: string[];
  sources: string[];
  clients: string[];
}

const assigneeOptions: Assignee[] = [
  { id: 1, name: "Sarah Anderson", department: "Marketing" },
  { id: 2, name: "John Doe", department: "Engineering" },
  { id: 3, name: "Jane Smith", department: "Sales" },
  { id: 4, name: "Ali Khan", department: "Support" },
];

const priorityOptions = ["High Priority", "Medium Priority", "Low Priority"];
const statusOptions = ["Not Start", "In Progress", "Completed", "Overdue"];

const departments = ["Marketing", "Engineering", "Data Management", "Sales"];

export default function FilterSheet({
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
    category: "assignees" | "statuses" | "sources" | "clients",
    option: Assignee | string,
    checked: boolean,
  ) => {
    if (category === "assignees") {
      const assignee = option as Assignee;
      setFilters(prev => {
        const exists = prev.assignees.some(a => a.id === assignee.id);

        return {
          ...prev,
          assignees: checked
            ? exists
              ? prev.assignees
              : [...prev.assignees, assignee]
            : prev.assignees.filter(a => a.id !== assignee.id),
        };
      });
    } else {
      const value = option as string;
      setFilters(prev => {
        const arr = (prev as any)[category] as string[];
        const exists = arr.includes(value);

        return {
          ...prev,
          [category]: checked ? (exists ? arr : [...arr, value]) : arr.filter(v => v !== value),
        } as unknown as FilterState;
      });
    }
  };

  const handleSelectAll = (
    category: "assignees" | "statuses" | "sources" | "clients",
    options: Assignee[] | string[],
  ) => {
    if (category === "assignees") {
      const opts = options as Assignee[];
      const allSelected =
        opts.length > 0 && opts.every(opt => filters.assignees.some(a => a.id === opt.id));

      setFilters(prev => ({
        ...prev,
        assignees: allSelected ? [] : opts,
      }));
    } else {
      const opts = options as string[];
      const cur = (filters as any)[category] as string[]; // narrow to string[] for runtime check
      const allSelected = opts.length > 0 && opts.every(opt => cur.includes(opt));

      setFilters(
        prev =>
          ({
            ...prev,
            [category]: allSelected ? [] : opts,
          } as unknown as FilterState),
      );
    }
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
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4">
          {/* Added Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Due Date</Label>
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
              <Label className="text-sm font-medium">Priority</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-statuses"
                  checked={priorityOptions.every(option => filters.statuses.includes(option))}
                  onCheckedChange={() => handleSelectAll("statuses", priorityOptions)}
                />
                <Label htmlFor="select-all-statuses" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {priorityOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("statuses", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
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
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Assignee Section */}
          {/* Assignee Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Assignee</label>

              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-assignees"
                  checked={
                    assigneeOptions.length > 0 &&
                    assigneeOptions.every(option => filters.assignees.some(a => a.id === option.id))
                  }
                  onCheckedChange={() => handleSelectAll("assignees", assigneeOptions)}
                />
                <label htmlFor="select-all-assignees" className="text-sm text-muted-foreground">
                  Select All
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {assigneeOptions.map(assignee => (
                <div key={assignee.id} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`assignee-${assignee.id}`}
                    checked={filters.assignees.some(a => a.id === assignee.id)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("assignees", assignee, Boolean(checked))
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Image
                      src={"/images/girl-pfp.jpg"}
                      alt={assignee.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <p className="font-medium">{assignee.name}</p>
                    <p className="text-sm font-light">{assignee.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Departments</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-sources"
                  checked={departments.every(option => filters.sources.includes(option))}
                  onCheckedChange={() => handleSelectAll("sources", departments)}
                />
                <Label htmlFor="select-all-sources" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`source-${dept}`}
                    checked={filters.sources.includes(dept)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("sources", dept, checked as boolean)
                    }
                  />
                  <Label htmlFor={`source-${dept}`} className="text-sm">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t">
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
