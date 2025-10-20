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

import { Textarea } from "../../ui/textarea";

interface RejectFormState {
  reason: string;
  comments: string;
  priorityLevel: string;
  dueDate: string;
}

export default function RejectCampaignSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme } = useTheme();
  const priorityLevels = ["Low", "Medium", "High", "Critical"];

  const [formData, setFormData] = useState<RejectFormState>({
    reason: "",
    comments: "",
    priorityLevel: "",
    dueDate: "",
  });

  const clearForm = () => {
    setFormData({
      reason: "",
      comments: "",
      priorityLevel: "",
      dueDate: "",
    });
    onOpenChange(false);
  };

  const handleSend = () => {
    console.log("Reject Campaign Data:", formData);
    onOpenChange(false);
  };

  const handleDueDateClick = () => {
    const input = document.getElementById("reject-due-date") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-screen sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Reject Campaign</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 sm:p-4 h-full sm:pt-0 p-2">
          <h2 className="font-bold">Campaign: Holiday Season Sale 2025</h2>

          {/* Reason for Rejection */}
          <div>
            <Label className="mb-2">Reason for Rejection</Label>
            <Textarea
              value={formData.reason}
              onChange={e => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Explain why this campaign is being rejected..."
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] border-[#DCE0E4] p-2"
            />
          </div>

          {/* Additional Comments */}
          <div>
            <Label className="mb-2">Additional Comments</Label>
            <Textarea
              value={formData.comments}
              onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Add any further notes or context..."
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] border-[#DCE0E4] p-2"
            />
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <Label className="text-sm">Priority Level</Label>
            <Select
              value={formData.priorityLevel}
              onValueChange={value => setFormData(prev => ({ ...prev, priorityLevel: value }))}
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

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-sm">Due Date</Label>
            <div className="relative w-full">
              <Input
                id="reject-due-date"
                type="date"
                value={formData.dueDate || ""}
                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
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
            className="flex items-center justify-center flex-1 py-6 sm:px-8 px-6 bg-[#C03030] hover:bg-[#C03030]/80 text-white rounded-[16px] text-[16px] font-medium"
          >
            Reject Campaign
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
