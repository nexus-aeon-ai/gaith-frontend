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
import { useLeadSources, LeadsFilters } from "@/lib/api/leads";
import { getAllClients, getAllEmployees } from "@/lib/api/tasks";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  assignees: string[]; // store IDs
  statuses: string[]; // store status values like "NEW", "CONTACTED", etc.
  sources: string[]; // store source IDs
  clients: string[]; // store IDs
}

const statusOptions = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATING", "CONVERTING", "LOST"];

export default function FilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: LeadsFilters;
  onApply?: (filters: LeadsFilters) => void;
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
  const { data: leadSources = [], isLoading } = useLeadSources();

  const assigneeOptions = useMemo(
    () => (Array.isArray(employees) ? employees.map(e => ({ 
      id: e.id, label: e.user?.fullName || "", 
    })) : []),
    [employees],
  );
  const clientOptions = useMemo(
    () => (Array.isArray(clients) ? clients.map(c => ({ id: c.id, label: c.clientName })) : []),
    [clients],
  );

  // Sync internal state with external value when sheet opens or value changes
  useEffect(() => {
    if (!open) return;
    if (!value) return;
    setFilters(prev => ({
      ...prev,
      assignees: value.assignedToUserIds ? [...value.assignedToUserIds] : [],
      sources: value.leadSourceId ? [value.leadSourceId] : [],
      statuses: value.status ? [value.status] : [],
    }));
  }, [open, value]);

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
    options: string[] | { id: string; label?: string; name?: string }[],
  ) => {
    const typedOptions = options as (string | { id: string; label?: string; name?: string })[];
    const ids = typedOptions.map(o => (typeof o === "string" ? o : o.id));
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
    // Build filters for leads endpoint - only send status, assignedToUserIds, and leadSourceId
    const status = filters.statuses.length > 0 ? filters.statuses[0] : undefined;

    const assignedToUserIds =
      filters.assignees.length > 0 ? filters.assignees : undefined;

    const leadSourceId = filters.sources.length > 0 ? filters.sources[0] : undefined;

    const backendFilters: LeadsFilters = {
      status,
      assignedToUserIds,
      leadSourceId,
    };
    console.log("Applying filters:", backendFilters);
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

  if(isLoading){
    return null;
  }


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
                  End date
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
                  <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                    {status.replace("_", " ").toLowerCase()}
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
                  checked={(leadSources as Array<{ id: string; name: string }>).every(option => filters.sources.includes(option.id))}
                  onCheckedChange={() => handleSelectAll("sources", (leadSources as Array<{ id: string; name: string }>))}
                />
                <Label htmlFor="select-all-sources" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {(leadSources as Array<{ id: string; name: string }>)?.map(source => (
                <div key={source.id} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`source-${source.id}`}
                    checked={filters.sources.includes(source.id)}
                    onCheckedChange={checked => handleCheckboxChange("sources", source.id, checked as boolean)}
                  />
                  <Label htmlFor={`source-${source.id}`} className="text-sm">
                    {source.name}
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
