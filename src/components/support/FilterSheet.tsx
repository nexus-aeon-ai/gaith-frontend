"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { SupportTicket } from "@/lib/types";

type SupportStatus = SupportTicket["status"];

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void;
};

const statusOptions: Array<{ label: string; value: SupportStatus }> = [
  { label: "Inprogress", value: "In Progress" },
  { label: "Closed", value: "Closed" },
  { label: "Resolved", value: "Resolved" },
  { label: "Open", value: "Open" },
];

const filterSchema = z.object({
  dateFrom: z.string().default(""),
  dateTo: z.string().default(""),
  statuses: z.array(z.enum(["Open", "In Progress", "Closed", "Resolved"])).default([]),
});

type FilterFormInput = z.input<typeof filterSchema>;
type FilterFormValues = z.output<typeof filterSchema>;

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (filters: FilterFormValues) => void;
}

const FilterSheet = ({ open, onOpenChange, onApplyFilters }: FilterSheetProps) => {
  const { theme } = useTheme();
  const dateFromRef = useRef<DateInputElement | null>(null);
  const dateToRef = useRef<DateInputElement | null>(null);

  const form = useForm<FilterFormInput, unknown, FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: filterSchema.parse({}),
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  const selectedStatuses = watch("statuses") ?? [];
  const isAllStatusSelected = selectedStatuses.length === statusOptions.length;

  const handleApply = handleSubmit(values => {
    onApplyFilters?.({
      dateFrom: values.dateFrom ?? "",
      dateTo: values.dateTo ?? "",
      statuses: values.statuses ?? [],
    });
    onOpenChange(false);
  });

  const handleReset = () => {
    reset(filterSchema.parse({}));
  };

  const toggleAllStatuses = (checked: boolean) => {
    setValue("statuses", checked ? statusOptions.map(option => option.value) : [], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const toggleStatus = (status: SupportStatus, checked: boolean) => {
    const nextStatuses = checked
      ? Array.from(new Set([...selectedStatuses, status]))
      : selectedStatuses.filter(item => item !== status);

    setValue("statuses", nextStatuses, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full rounded-l-[16px] bg-card p-0 shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 px-6 py-6">
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
                        name="dateFrom"
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
                        name="dateTo"
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
                        <Label
                          htmlFor={checkboxId}
                          className="text-sm font-medium text-foreground"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
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

