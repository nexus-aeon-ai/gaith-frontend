"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import RightArrowIcon from "@/components/ui/icons/options/right-arrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TasksCalendarFilters, getAllClients, getAllEmployees } from "@/lib/api/tasks";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  assignees: string[]; // store IDs
  statuses: string[];
  sources: string[];
  clients: string[]; // store IDs
}

const statusOptions = ["New", "Lost", "In Progress"];
const sourceOptions = ["Website", "Social Media", "Campaign", "Referral"];

export default function FilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: TasksCalendarFilters;
  onApply?: (filters: TasksCalendarFilters) => void;
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
  const { data: employees } = useQuery({ queryKey: ["employees"], queryFn: getAllEmployees });
  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: getAllClients });

  const assigneeOptions = useMemo(
    () => (Array.isArray(employees) ? employees.map(e => ({ 
      id: e.id, label: e.user?.fullName || "", 
    })) : []),
    [employees],
  );
  const clientOptions = useMemo(
    () => (Array.isArray(clients) ? clients.map(c => ({ id: c.id, label: c.fullName })) : []),
    [clients],
  );

  // Sync internal state with external value when sheet opens or value changes
  useEffect(() => {
    if (!open) return;
    setFilters(prev => ({
      ...prev,
      dateFrom: value?.startDate ? new Date(value.startDate).toISOString().slice(0, 10) : "",
      dateTo: value?.endDate ? new Date(value.endDate).toISOString().slice(0, 10) : "",
      assignees: value?.assignedTo ? [value.assignedTo] : [],
      clients: value?.accountId ? [value.accountId] : [],
    }));
  }, [open, value?.startDate, value?.endDate, value?.assignedTo, value?.accountId]);

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
    options: string[] | { id: string; label: string }[],
  ) => {
    const ids = (options as any[]).map(o => (typeof o === "string" ? o : o.id));
    const allSelected = ids.every(option => filters[category].includes(option));
    setFilters(prev => ({
      ...prev,
      [category]: allSelected ? [] : ids,
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

    const backendFilters: TasksCalendarFilters = {
      ...(value || {}),
      startDate: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : undefined,
      endDate: filters.dateTo ? new Date(filters.dateTo).toISOString() : undefined,
      // comma separated lists for multi-select
      assignedTo:
        filters.assignees.length > 0
          ? filters.assignees
            .map(a => {
              const found = Array.isArray(employees)
                ? employees.find(e => e.id === a || e.user?.fullName === a)
                : undefined;
              return found?.id || a;
            })
            .filter(Boolean)
            .join(",")
          : undefined,
      accountId:
        filters.clients.length > 0
          ? filters.clients
            .map(c => {
              const found = Array.isArray(clients)
                ? clients.find(x => x.id === c || x.fullName === c)
                : undefined;
              return found?.id || c;
            })
            .filter(Boolean)
            .join(",")
          : undefined,
      // NOTE: The current UI uses checkbox labels; integrate IDs here when the sheet supplies them
    };
    onApply?.(backendFilters);
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
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-4">
          {/* Added Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Added Date</Label>
            <div className="flex flex-row justify-between gap-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Start date</Label>
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
                  End date
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

          {/* Assignee Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Assignee</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-assignees"
                  checked={assigneeOptions.every(option => filters.assignees.includes(option.id))}
                  onCheckedChange={() => handleSelectAll("assignees", assigneeOptions)}
                />
                <Label htmlFor="select-all-assignees" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {assigneeOptions.map(assignee => (
                <div key={assignee.id} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`assignee-${assignee.id}`}
                    checked={filters.assignees.includes(assignee.id)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("assignees", assignee.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`assignee-${assignee.id}`} className="text-sm">
                    {assignee.label}
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

          {/* Source Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Source</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-sources"
                  checked={sourceOptions.every(option => filters.sources.includes(option))}
                  onCheckedChange={() => handleSelectAll("sources", sourceOptions)}
                />
                <Label htmlFor="select-all-sources" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {sourceOptions.map(source => (
                <div key={source} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`source-${source}`}
                    checked={filters.sources.includes(source)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("sources", source, checked as boolean)
                    }
                  />
                  <Label htmlFor={`source-${source}`} className="text-sm">
                    {source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Client</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-clients"
                  checked={clientOptions.every(option => filters.clients.includes(option.id))}
                  onCheckedChange={() => handleSelectAll("clients", clientOptions)}
                />
                <Label htmlFor="select-all-clients" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {clientOptions.map(client => (
                <div key={client.id} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`client-${client.id}`}
                    checked={filters.clients.includes(client.id)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("clients", client.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`client-${client.id}`} className="text-sm">
                    {client.label}
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
