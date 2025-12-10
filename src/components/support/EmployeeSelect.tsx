"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllUsers } from "@/lib/api/tasks";

interface EmployeeSelectProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const EmployeeSelect = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select employee",
}: EmployeeSelectProps) => {
  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getAllUsers();
    },
  });

  const employees = users || [];

  const handleValueChange = (newValue: string) => {
    if (newValue === "none") {
      onValueChange(null);
    } else {
      onValueChange(newValue);
    }
  };

  if (isLoading) {
    return (
      <div className="h-12 w-full flex items-center justify-center rounded-xl bg-muted/40">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Select
      value={value || "none"}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="h-12 rounded-xl bg-muted/40 dark:bg-[#0F1B29]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {employees.map(employee => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EmployeeSelect;

