"use client";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CheckboxSquare } from "../../ui/checkbox-square";
import { Textarea } from "../../ui/textarea";

// Corrected interface
interface EmailFormState {
  detailedChanges: string;
  statusOptions: string[];
  priorityLevel: string;
  assignTo: string;
  dueDate: string;
  urgent: boolean;
}

export default function RequestChangesSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme } = useTheme();
  const statusOptions = [
    "Budget Concerns",
    "Creative Updates",
    "Compliance Issues",
    "Targeting Adjustments",
    "Timeline Changes",
    "Content Quality",
  ];
  const priorityLevels = ["Low", "Medium", "High", "Critical"];
  const assignableUsers = ["John Doe", "Sarah Connor", "Michael Smith", "Emily Johnson"];

  const [emailForm, setEmailForm] = useState<EmailFormState>({
    detailedChanges: "",
    statusOptions: [],
    priorityLevel: "",
    assignTo: "",
    dueDate: "",
    urgent: false,
  });

  const clearForm = () => {
    setEmailForm({
      detailedChanges: "",
      statusOptions: [],
      priorityLevel: "",
      assignTo: "",
      dueDate: "",
      urgent: false,
    });
    onOpenChange(false);
  };

  const handleSend = () => {
    console.log("Form Data:", emailForm);
    onOpenChange(false);
  };

  const handleCheckboxChange = (
    category: keyof Pick<EmailFormState, "statusOptions">,
    value: string,
    checked: boolean,
  ) => {
    setEmailForm(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value),
    }));
  };

  const handleDueDateClick = () => {
    const input = document.getElementById("date-due") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-screen sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Request Changes</SheetTitle>
        </SheetHeader>

        <div className="space-y-3 sm:p-4 sm:pt-0 p-2">
          <h2 className="font-bold">Campaign: Holiday Season Sale 2025</h2>
          <div>
            <Label className="mb-2 ">Detailed Change Requests</Label>
            <Textarea
              value={emailForm.detailedChanges}
              onChange={e => setEmailForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
              placeholder="Please provide specific details about the changes needed..."
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] border-[#DCE0E4] p-2"
            />
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <Label className="text-sm">Priority Level</Label>
            <Select
              value={emailForm.priorityLevel}
              onValueChange={value => setEmailForm(prev => ({ ...prev, priorityLevel: value }))}
            >
              <SelectTrigger className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <Label className="text-sm">Assign To</Label>
            <Select
              value={emailForm.assignTo}
              onValueChange={value => setEmailForm(prev => ({ ...prev, assignTo: value }))}
            >
              <SelectTrigger className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {assignableUsers.map(user => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Method */}
          <div>
            <Label className="mb-2">Common Issues (Select all that apply)</Label>
            <div className="grid md:grid-cols-2 grid-cols-1 space-y-2 pt-1">
              {statusOptions.slice(0, 4).map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`status-${status}`}
                    checked={emailForm.statusOptions.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("statusOptions", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                    {status}
                  </Label>
                </div>
              ))}
              {statusOptions.slice(4, 8).map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`status-${status}`}
                    checked={emailForm.statusOptions.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("statusOptions", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Due Date</Label>
            <div className="relative w-full">
              <Input
                id="date-due"
                type="date"
                value={emailForm.dueDate || ""}
                onChange={e => setEmailForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6 pr-10
        [&::-webkit-calendar-picker-indicator]:opacity-0 
        [&::-webkit-calendar-picker-indicator]:absolute 
        [&::-webkit-calendar-picker-indicator]:w-full 
        [&::-webkit-calendar-picker-indicator]:h-full"
              />

              <button
                type="button"
                onClick={handleDueDateClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Select from date"
              >
                <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CheckboxSquare
              id="urgent"
              checked={emailForm.urgent}
              onCheckedChange={() => setEmailForm(prev => ({ ...prev, urgent: !prev.urgent }))}
              className="cursor-pointer"
            />
            <Label htmlFor="send-copy" className="text-[14px] cursor-pointer font-normal">
              Mark as urgent - Requires Immediate Attention
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky w-full flex bottom-0 gap-3 p-4 border-t bg-card">
          <Button
            variant="outline"
            onClick={clearForm}
            className="flex-1 rounded-[16px] py-6 bg-card text-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dark"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="flex items-center flex-1 py-6 sm:px-8 px-6 bg-[#3072C0] hover:bg-[#3072C0]/80 text-white rounded-[16px] text-[16px] font-medium"
          >
            <p>Send Request</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
