"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients } from "@/lib/api/client/client";

const createCalendarFormSchema = (clientIdProvided: boolean) => z.object({
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  post_per_week: z.number().min(1, "Must be at least 1 post per week").max(7, "Maximum 7 posts per week"),
  clientId: clientIdProvided 
    ? z.string().optional() 
    : z.string().min(1, "Client is required"),
}).refine(data => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type CalendarFormData = z.infer<ReturnType<typeof createCalendarFormSchema>>;

interface CalendarGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CalendarFormData & { clientId?: string }) => void;
  initialData?: CalendarFormData;
  clientId?: string;
}

export default function CalendarGenerationModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  clientId: providedClientId,
}: CalendarGenerationModalProps) {
  const { theme } = useTheme();
  
  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    enabled: open,
  });

  const calendarFormSchema = createCalendarFormSchema(!!providedClientId);
  
  const form = useForm<CalendarFormData>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      start_date: initialData?.start_date || new Date(),
      end_date: initialData?.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      post_per_week: initialData?.post_per_week || 3,
      clientId: providedClientId || initialData?.clientId || undefined,
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        start_date: initialData?.start_date || new Date(),
        end_date: initialData?.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        post_per_week: initialData?.post_per_week || 3,
        clientId: providedClientId || initialData?.clientId || undefined,
      });
    }
  }, [open, initialData, providedClientId, form]);

  const handleSubmit = (data: CalendarFormData) => {
    onSubmit({ ...data, clientId: providedClientId || data.clientId });
    form.reset();
    onOpenChange(false);
  };

  const handleStartDateClick = () => {
    const input = document.getElementById("calendar-start-date") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleEndDateClick = () => {
    const input = document.getElementById("calendar-end-date") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-[#212945] bg-card font-inter rounded-[16px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generate Social Media Calendar</DialogTitle>
          <DialogDescription>
            Provide the date range and posting frequency for your calendar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        id="calendar-start-date"
                        type="date"
                        value={value ? new Date(value).toISOString().split("T")[0] : ""}
                        onChange={e => {
                          const date = new Date(e.target.value);
                          onChange(date);
                        }}
                        className="
                          dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                          pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0 
                          [&::-webkit-calendar-picker-indicator]:absolute 
                          [&::-webkit-calendar-picker-indicator]:w-full 
                          [&::-webkit-calendar-picker-indicator]:h-full
                        "
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <button
                        type="button"
                        onClick={handleStartDateClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        id="calendar-end-date"
                        type="date"
                        value={value ? new Date(value).toISOString().split("T")[0] : ""}
                        onChange={e => {
                          const date = new Date(e.target.value);
                          onChange(date);
                        }}
                        className="
                          dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                          pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0 
                          [&::-webkit-calendar-picker-indicator]:absolute 
                          [&::-webkit-calendar-picker-indicator]:w-full 
                          [&::-webkit-calendar-picker-indicator]:h-full
                        "
                        min={
                          form.getValues().start_date
                            ? new Date(form.getValues().start_date).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0]
                        }
                      />
                      <button
                        type="button"
                        onClick={handleEndDateClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="post_per_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posts Per Week</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3"
                      min="1"
                      max="7"
                      className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client {providedClientId ? "(Pre-selected)" : "*"}</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "__none__" ? undefined : value)} 
                    value={field.value || "__none__"}
                    disabled={!!providedClientId}
                  >
                    <FormControl>
                      <SelectTrigger 
                        className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6"
                        disabled={!!providedClientId}
                      >
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!providedClientId && <SelectItem value="__none__">None</SelectItem>}
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName || client.companyName || client.clientName || `Client ${client.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                Generate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

