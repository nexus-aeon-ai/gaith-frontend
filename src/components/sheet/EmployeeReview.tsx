"use client";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createEmployeeReview, getReviewFocusAreas, getReviewTypes } from "@/lib/api/reviews";
import { useAuthStore } from "@/lib/store/authStore";

// Corrected interface
interface EmailFormState {
  detailedChanges: string;
  statusOptions: string[];
  priorityLevel: string;
  assignTo: string;
  dueDate: string;
  urgent: boolean;
}

export default function EmployeeReviewSheet({
  open,
  onOpenChange,
  employeeId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId?: string | null;
}) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // review-types and focus areas from API
  const { data: reviewTypesData } = useQuery({
    queryKey: ["review-types"],
    queryFn: async () => {
      const res = await getReviewTypes();
      return res.status === 200 && res.data ? res.data : [];
    },
  });

  const { data: focusAreasData } = useQuery({
    queryKey: ["review-focus-areas"],
    queryFn: async () => {
      const res = await getReviewFocusAreas();
      return res.status === 200 && res.data ? res.data : [];
    },
  });

  const [emailForm, setEmailForm] = useState<
    EmailFormState & {
      reviewTypeId?: string;
      reviewerEmployeeId?: string;
      meetingFormat?: string;
      scheduledDate?: string;
      scheduledTime?: string;
      reviewPeriodStart?: string;
      reviewPeriodEnd?: string;
      locationOrLink?: string;
      focusAreaIds?: string[];
      notes?: string;
    }
  >({
    detailedChanges: "",
    statusOptions: [],
    priorityLevel: "",
    assignTo: "",
    dueDate: "",
    urgent: false,
    reviewTypeId: undefined,
    reviewerEmployeeId: "",
    meetingFormat: "InPerson",
    scheduledDate: "",
    scheduledTime: "",
    reviewPeriodStart: "",
    reviewPeriodEnd: "",
    locationOrLink: "",
    focusAreaIds: [],
    notes: "",
  });

  const clearForm = () => {
    setEmailForm({
      detailedChanges: "",
      statusOptions: [],
      priorityLevel: "",
      assignTo: "",
      dueDate: "",
      urgent: false,
      reviewTypeId: undefined,
      reviewerEmployeeId: "",
      meetingFormat: "InPerson",
      scheduledDate: "",
      scheduledTime: "",
      reviewPeriodStart: "",
      reviewPeriodEnd: "",
      locationOrLink: "",
      focusAreaIds: [],
      notes: "",
    });
    onOpenChange(false);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!employeeId) throw new Error("Missing employeeId");
      const res = await createEmployeeReview(employeeId, payload);
      if (res.status !== 200 && res.status !== 201) throw new Error("Failed to create review");
      return res;
    },
    onSuccess: () => {
      toast.success("Review scheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["employees", employeeId, "reviews"] });
      onOpenChange(false);
      clearForm();
    },
    onError: err => {
      console.error(err);
      toast.error("Failed to schedule review");
    },
  });

  const handleSend = async () => {
    // basic validation
    if (!employeeId) {
      toast.error("Missing employee selected");
      return;
    }
    if (!emailForm.reviewTypeId) {
      toast.error("Please select a review type");
      return;
    }
    if (!emailForm.reviewerEmployeeId) {
      toast.error("Please provide reviewer employee id");
      return;
    }

    const payload = {
      reviewTypeId: emailForm.reviewTypeId!,
      reviewerEmployeeId: emailForm.reviewerEmployeeId!,
      meetingFormat: emailForm.meetingFormat || "InPerson",
      scheduledDate: emailForm.scheduledDate || "",
      scheduledTime: emailForm.scheduledTime || "",
      reviewPeriodStart: emailForm.reviewPeriodStart || "",
      reviewPeriodEnd: emailForm.reviewPeriodEnd || "",
      locationOrLink: emailForm.locationOrLink || "",
      focusAreaIds: emailForm.focusAreaIds || [],
      notes: emailForm.notes || "",
    };

    await createMutation.mutateAsync(payload);
  };

  const handleDueDateClick = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-screen sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Schedule Performance Review</SheetTitle>
        </SheetHeader>

        <div className="space-y-3 sm:p-4 sm:pt-0 p-2">
          <div className="space-y-2">
            <Label className="text-sm">Review Type</Label>
            <Select
              value={emailForm.reviewTypeId}
              onValueChange={value => setEmailForm(prev => ({ ...prev, reviewTypeId: value }))}
            >
              <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6">
                <SelectValue placeholder="Select Review Type" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(reviewTypesData) && reviewTypesData.length > 0 ? (
                  reviewTypesData.map(rt => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="none" value="no-types" disabled>
                    No types
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2 ">
              <Label className="text-sm">Review Date</Label>
              <div className="relative">
                <Input
                  id="scheduled-date"
                  type="date"
                  value={emailForm.scheduledDate || ""}
                  onChange={e => setEmailForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6 pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 
                  [&::-webkit-calendar-picker-indicator]:absolute 
                  [&::-webkit-calendar-picker-indicator]:w-full 
                  [&::-webkit-calendar-picker-indicator]:h-full"
                />

                <button
                  type="button"
                  onClick={() => handleDueDateClick("scheduled-date")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Select from date"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>
            <div className="space-y-2 ">
              <Label className="text-sm">Review Time</Label>
              <div className="relative">
                <Input
                  id="scheduled-time"
                  type="time"
                  value={emailForm.scheduledTime || ""}
                  onChange={e => setEmailForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6 pr-10"
                />

                <button
                  type="button"
                  onClick={() => document.getElementById("scheduled-time")?.focus()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Select time"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Reviewer (employee id)</Label>
            <Input
              id="reviewer-employee-id"
              value={emailForm.reviewerEmployeeId}
              onChange={e =>
                setEmailForm(prev => ({ ...prev, reviewerEmployeeId: e.target.value }))
              }
              placeholder="Enter reviewer employee id"
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6"
            />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <div className="space-y-2 ">
              <Label className="text-sm">Review Period Start</Label>
              <div className="relative">
                <Input
                  id="review-period-start"
                  type="date"
                  value={emailForm.reviewPeriodStart || ""}
                  onChange={e =>
                    setEmailForm(prev => ({ ...prev, reviewPeriodStart: e.target.value }))
                  }
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6 pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 
                  [&::-webkit-calendar-picker-indicator]:absolute 
                  [&::-webkit-calendar-picker-indicator]:w-full 
                  [&::-webkit-calendar-picker-indicator]:h-full"
                />

                <button
                  type="button"
                  onClick={() => handleDueDateClick("review-period-start")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Select from date"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>
            <div className="space-y-2 ">
              <Label className="text-sm">Review Period End</Label>
              <div className="relative">
                <Input
                  id="review-period-end"
                  type="date"
                  value={emailForm.reviewPeriodEnd || ""}
                  onChange={e =>
                    setEmailForm(prev => ({ ...prev, reviewPeriodEnd: e.target.value }))
                  }
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6 pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 
                  [&::-webkit-calendar-picker-indicator]:absolute 
                  [&::-webkit-calendar-picker-indicator]:w-full 
                  [&::-webkit-calendar-picker-indicator]:h-full"
                />

                <button
                  type="button"
                  onClick={() => handleDueDateClick("review-period-end")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Select from date"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>
          </div>

          <Separator />
          <div>
            <Label className="mb-2">Meeting Format</Label>
            <div className="grid md:grid-cols-2 grid-cols-1 space-y-2 pt-1">
              <RadioGroup
                value={emailForm.meetingFormat}
                onValueChange={value => setEmailForm(prev => ({ ...prev, meetingFormat: value }))}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="in-person" value="InPerson" />
                  <Label htmlFor="in-person" className="capitalize">
                    In-Person
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="virtual" value="Virtual" />
                  <Label htmlFor="virtual" className="capitalize">
                    Virtual Meeting
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Location/Meeting Link</Label>
            <Input
              value={emailForm.locationOrLink}
              onChange={e => setEmailForm(prev => ({ ...prev, locationOrLink: e.target.value }))}
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-6"
            />
          </div>

          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Review Focus Areas</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-statuses"
                  checked={
                    Array.isArray(focusAreasData) && focusAreasData.length > 0
                      ? (focusAreasData as any[]).every(f => emailForm.focusAreaIds?.includes(f.id))
                      : false
                  }
                  onCheckedChange={checked => {
                    if (checked) {
                      setEmailForm(prev => ({
                        ...prev,
                        focusAreaIds: Array.isArray(focusAreasData)
                          ? focusAreasData.map(f => f.id)
                          : [],
                      }));
                    } else {
                      setEmailForm(prev => ({ ...prev, focusAreaIds: [] }));
                    }
                  }}
                />
                <Label htmlFor="select-all-statuses" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {Array.isArray(focusAreasData) &&
                focusAreasData.length > 0 &&
                focusAreasData.map(area => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <CheckboxSquare
                      id={`focus-${area.id}`}
                      checked={emailForm.focusAreaIds?.includes(area.id)}
                      onCheckedChange={checked => {
                        setEmailForm(prev => {
                          const prevIds = prev.focusAreaIds || [];
                          if (checked) return { ...prev, focusAreaIds: [...prevIds, area.id] };
                          return { ...prev, focusAreaIds: prevIds.filter(id => id !== area.id) };
                        });
                      }}
                    />
                    <Label htmlFor={`focus-${area.id}`} className="text-sm font-normal">
                      {area.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <Separator />
          <div>
            <Label className="mb-2 font-medium">Additional Notes</Label>
            <Textarea
              value={emailForm.notes}
              onChange={e => setEmailForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes  to discuss..."
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] p-3 py-2"
              rows={2}
            />
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
