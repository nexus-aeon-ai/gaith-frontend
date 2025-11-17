"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { getIssueCategories } from "@/lib/api/support/issue-categories";

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void;
};

const statusOptions = [
  { label: "Open", value: "Open" as const },
  { label: "In Progress", value: "In Progress" as const },
  { label: "Closed", value: "Closed" as const },
  { label: "Resolved", value: "Resolved" as const },
];

const priorityOptions = [
  { label: "Low", value: "Low" as const },
  { label: "Medium", value: "Medium" as const },
  { label: "High", value: "High" as const },
  { label: "Critical", value: "Critical" as const },
];

const filterSchema = z.object({
  fromDate: z.string().default(""),
  toDate: z.string().default(""),
  statuses: z.array(z.enum(["Open", "In Progress", "Closed", "Resolved"])).default([]),
  priorities: z.array(z.enum(["Low", "Medium", "High", "Critical"])).default([]),
  issueCategoryId: z.string().default(""),
  isDraft: z.boolean().optional(),
});

type FilterFormInput = z.input<typeof filterSchema>;
type FilterFormValues = z.output<typeof filterSchema>;

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterSheet = ({ open, onOpenChange }: FilterSheetProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dateFromRef = useRef<DateInputElement | null>(null);
  const dateToRef = useRef<DateInputElement | null>(null);

  // Fetch issue categories
  const { data: categoriesData } = useQuery({
    queryKey: ["issue-categories"],
    queryFn: async () => {
      const response = await getIssueCategories();
      return response.data ?? [];
    },
  });

  // Initialize form with current URL params
  const form = useForm<FilterFormInput, unknown, FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
      statuses: searchParams.get("status")
        ? [
          searchParams.get("status") as "Open" | "In Progress" | "Closed" | "Resolved",
        ]
        : [],
      priorities: searchParams.get("priority")
        ? [searchParams.get("priority") as "Low" | "Medium" | "High" | "Critical"]
        : [],
      issueCategoryId: searchParams.get("issueCategoryId") || "",
      isDraft: searchParams.get("isDraft") === "true" ? true : undefined,
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  const selectedStatuses = watch("statuses") ?? [];
  const selectedPriorities = watch("priorities") ?? [];
  const isAllStatusSelected = selectedStatuses.length === statusOptions.length;
  const isAllPrioritySelected = selectedPriorities.length === priorityOptions.length;

  const handleApply = handleSubmit(values => {
    const params = new URLSearchParams(searchParams.toString());

    // Update URL params with filter values
    if (values.fromDate) params.set("fromDate", values.fromDate);
    else params.delete("fromDate");

    if (values.toDate) params.set("toDate", values.toDate);
    else params.delete("toDate");

    if (values.statuses.length > 0) {
      // For simplicity, use first status. For multiple, would need to serialize differently
      params.set("status", values.statuses[0]);
    } else {
      params.delete("status");
    }

    if (values.priorities.length > 0) {
      params.set("priority", values.priorities[0]);
    } else {
      params.delete("priority");
    }

    if (values.issueCategoryId) params.set("issueCategoryId", values.issueCategoryId);
    else params.delete("issueCategoryId");

    if (values.isDraft !== undefined) params.set("isDraft", String(values.isDraft));
    else params.delete("isDraft");

    // Reset pagination
    params.set("skip", "0");

    router.push(`${pathname}?${params.toString()}`);
    onOpenChange(false);
  });

  const handleReset = () => {
    reset(filterSchema.parse({}));
    // Clear URL params
    router.push(pathname);
    onOpenChange(false);
  };

  const toggleAllStatuses = (checked: boolean) => {
    setValue("statuses", checked ? statusOptions.map(option => option.value) : [], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const toggleStatus = (status: (typeof statusOptions)[number]["value"], checked: boolean) => {
    const nextStatuses = checked
      ? Array.from(new Set([...selectedStatuses, status]))
      : selectedStatuses.filter(item => item !== status);

    setValue("statuses", nextStatuses, { shouldDirty: true, shouldTouch: true });
  };

  const toggleAllPriorities = (checked: boolean) => {
    setValue("priorities", checked ? priorityOptions.map(option => option.value) : [], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const togglePriority = (
    priority: (typeof priorityOptions)[number]["value"],
    checked: boolean,
  ) => {
    const nextPriorities = checked
      ? Array.from(new Set([...selectedPriorities, priority]))
      : selectedPriorities.filter(item => item !== priority);

    setValue("priorities", nextPriorities, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full rounded-l-[16px] bg-card p-0 shadow-lg overflow-y-auto">
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="text-xl font-semibold text-foreground">Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 px-6 pb-6">
            {/* Date Range */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground">Due Date</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      From
                    </Label>
                    <div className="relative">
                      <Controller
                        name="fromDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            ref={node => {
                              field.ref(node);
                              dateFromRef.current = node;
                            }}
                            type="date"
                            value={field.value ?? ""}
                            className="h-12 rounded-xl bg-muted/40 pr-12 text-sm text-foreground"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => dateFromRef.current?.showPicker?.()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      To
                    </Label>
                    <div className="relative">
                      <Controller
                        name="toDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            ref={node => {
                              field.ref(node);
                              dateToRef.current = node;
                            }}
                            type="date"
                            value={field.value ?? ""}
                            className="h-12 rounded-xl bg-muted/40 pr-12 text-sm text-foreground"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => dateToRef.current?.showPicker?.()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Category */}
            {categoriesData && categoriesData.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-semibold text-foreground">Issue Category</Label>
                <Controller
                  name="issueCategoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={value => field.onChange(value || "")}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/40">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Status */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Status</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-muted bg-muted/20 px-3 py-3">
                  <Checkbox
                    id="status-all"
                    checked={isAllStatusSelected}
                    onCheckedChange={checked => toggleAllStatuses(checked === true)}
                  />
                  <Label htmlFor="status-all" className="text-sm font-medium text-foreground">
                    All status
                  </Label>
                </div>
                {statusOptions.map(option => {
                  const checked = selectedStatuses.includes(option.value);
                  const checkboxId = `status-${option.value.toLowerCase().replace(/\s+/g, "-")}`;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-xl border border-muted bg-muted/10 px-3 py-3"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={value => toggleStatus(option.value, value === true)}
                      />
                      <Label htmlFor={checkboxId} className="text-sm font-medium text-foreground">
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Priority</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-muted bg-muted/20 px-3 py-3">
                  <Checkbox
                    id="priority-all"
                    checked={isAllPrioritySelected}
                    onCheckedChange={checked => toggleAllPriorities(checked === true)}
                  />
                  <Label htmlFor="priority-all" className="text-sm font-medium text-foreground">
                    All priorities
                  </Label>
                </div>
                {priorityOptions.map(option => {
                  const checked = selectedPriorities.includes(option.value);
                  const checkboxId = `priority-${option.value.toLowerCase()}`;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-xl border border-muted bg-muted/10 px-3 py-3"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={value => togglePriority(option.value, value === true)}
                      />
                      <Label htmlFor={checkboxId} className="text-sm font-medium text-foreground">
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Draft Status */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-foreground">Draft Status</Label>
              <Controller
                name="isDraft"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="is-draft"
                      checked={field.value === true}
                      onCheckedChange={checked =>
                        field.onChange(checked === true ? true : undefined)
                      }
                    />
                    <Label htmlFor="is-draft" className="text-sm font-medium text-foreground">
                      Show only drafts
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t px-6 py-5">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl border border-transparent bg-transparent text-base font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              onClick={handleReset}
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-xl bg-[#508CD3] py-5 text-base font-semibold text-white shadow hover:bg-blue-600"
              onClick={handleApply}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
