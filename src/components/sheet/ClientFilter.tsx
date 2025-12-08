"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import RightArrowIcon from "@/components/ui/icons/options/right-arrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getClients } from "@/lib/api/client/client";
import { getUsers } from "@/lib/api/user";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  assignees: string[];
  statuses: string[];
  sources: string[];
  clients: string[];
}

export default function ClientFilterSheet({
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

  const [users, setUsers] = useState<Array<{ id: string; fullName: string }>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [clients, setClients] = useState<Array<{ id: string; clientName: string }>>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const { theme } = useTheme();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await getUsers();
        if (response?.data) {
          const userList = Array.isArray(response.data)
            ? response.data.map(user => ({ id: user.id, fullName: user.fullName }))
            : [];
          setUsers(userList);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClientList = async () => {
      setIsLoadingClients(true);
      try {
        const response = await getClients();
        if (response?.data) {
          const clientList = Array.isArray(response.data)
            ? response.data.map(client => ({ id: client.id, clientName: client.clientName || "Unnamed" }))
            : [];
          setClients(clientList);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClientList();
  }, []);

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
    options: Array<{ id: string; fullName?: string; clientName?: string }> | string[],
  ) => {
    // Handle both user/client objects and string arrays
    const optionIds = options.map(opt => (typeof opt === "string" ? opt : opt.id));
    const allSelected = optionIds.every(id => filters[category].includes(id));
    setFilters(prev => ({
      ...prev,
      [category]: allSelected ? [] : optionIds,
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
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:p-4 sm:pt-0 p-2">
          {/* Added Date Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Agreement Period</Label>
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
                  checked={users.length > 0 && users.every(user => filters.assignees.includes(user.id))}
                  onCheckedChange={() => handleSelectAll("assignees", users)}
                />
                <Label htmlFor="select-all-assignees" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {isLoadingUsers ? (
                <p className="text-xs text-muted-foreground">Loading users...</p>
              ) : users.length > 0 ? (
                users.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <CheckboxSquare
                      id={`assignee-${user.id}`}
                      checked={filters.assignees.includes(user.id)}
                      onCheckedChange={checked =>
                        handleCheckboxChange("assignees", user.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`assignee-${user.id}`} className="text-sm">
                      {user.fullName}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No users available</p>
              )}
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Client</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-clients"
                  checked={clients.length > 0 && clients.every(client => filters.clients.includes(client.id))}
                  onCheckedChange={() => handleSelectAll("clients", clients)}
                />
                <Label htmlFor="select-all-clients" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {isLoadingClients ? (
                <p className="text-xs text-muted-foreground">Loading clients...</p>
              ) : clients.length > 0 ? (
                clients.map(client => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <CheckboxSquare
                      id={`client-${client.id}`}
                      checked={filters.clients.includes(client.id)}
                      onCheckedChange={checked =>
                        handleCheckboxChange("clients", client.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`client-${client.id}`} className="text-sm">
                      {client.clientName}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No clients available</p>
              )}
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
