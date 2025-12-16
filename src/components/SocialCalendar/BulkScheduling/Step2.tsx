import { useTheme } from "next-themes";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepFormProps } from "@/lib/types";

/* Step 2: Target Audience Settings */
function StepConfiguration({ form }: StepFormProps) {
  const { control } = form;
  const { theme } = useTheme();

  const handleStartDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };
  const handleEndDateClick = () => {
    const input = document.getElementById("date-end") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <div className="flex flex-col gap-5 font-inter">
      <div className="sm:col-span-3 font-medium text-md flex flex-col gap-0">
        <p>Schedule Configuration</p>
        <p className="text-sm text-muted-foreground mb-4">
          Set up date ranges and posting frequency for your bulk posts
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="publishStartDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      id="date-start"
                      type="date"
                      value={value instanceof Date ? value.toISOString().split("T")[0] : ""}
                      onChange={e => {
                        const val = e.target.value;
                        if (val) {
                          const date = new Date(val);
                          if (!isNaN(date.getTime())) {
                            onChange(date);
                          }
                        }
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
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
            control={control}
            name="publishEndDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      id="date-start"
                      type="date"
                      value={value instanceof Date ? value.toISOString().split("T")[0] : ""}
                      onChange={e => {
                        const val = e.target.value;
                        if (val) {
                          const date = new Date(val);
                          if (!isNaN(date.getTime())) {
                            onChange(date);
                          }
                        }
                      }}
                      min={
                        form.getValues().publishStartDate instanceof Date
                          ? form.getValues().publishStartDate.toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      {...field}
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
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-md font-medium">Posting Frequency</p>
        <FormField
          control={control}
          name="postingFrequency"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => field.onChange("daily")}
                    className={`border cursor rounded-[16px] flex flex-col items-center gap-3 py-4 ${
                      field.value === "daily"
                        ? "border-[#3072C0] border-2 bg-[#3072C014]"
                        : "bg-card"
                    }`}
                    onClick={() => field.onChange("daily")}
                  >
                    <CalendarIcon
                      color={
                        field.value === "daily"
                          ? "#265B99"
                          : theme === "dark"
                            ? "#CCCFDB"
                            : "#303444"
                      }
                    />
                    <p
                      className={`text-sm font-medium ${field.value === "daily" ? "text-[#265B99]" : ""}`}
                    >
                      Daily
                    </p>
                  </div>
                  <div
                    role="button"
                    tabIndex={-1}
                    onKeyDown={() => field.onChange("every-other-day")}
                    className={`border cursor rounded-[16px] flex flex-col items-center gap-3 py-4 ${
                      field.value === "every-other-day"
                        ? "border-[#3072C0] border-2 bg-[#3072C014]"
                        : "bg-card"
                    }`}
                    onClick={() => field.onChange("every-other-day")}
                  >
                    <CalendarIcon
                      color={
                        field.value === "every-other-day"
                          ? "#265B99"
                          : theme === "dark"
                            ? "#CCCFDB"
                            : "#303444"
                      }
                    />
                    <p
                      className={`text-sm font-medium ${field.value === "every-other-day" ? "text-[#265B99]" : ""}`}
                    >
                      Every Other Day
                    </p>
                  </div>
                  <div
                    role="button"
                    tabIndex={-2}
                    onKeyDown={() => field.onChange("weekdays-only")}
                    className={`border cursor rounded-[16px] flex flex-col items-center gap-3 py-4 ${
                      field.value === "weekdays-only"
                        ? "border-[#3072C0] border-2 bg-[#3072C014]"
                        : "bg-card"
                    }`}
                    onClick={() => field.onChange("weekdays-only")}
                  >
                    <CalendarIcon
                      color={
                        field.value === "weekdays-only"
                          ? "#265B99"
                          : theme === "dark"
                            ? "#CCCFDB"
                            : "#303444"
                      }
                    />
                    <p
                      className={`text-sm font-medium ${field.value === "weekdays-only" ? "text-[#265B99]" : ""}`}
                    >
                      Weekdays Only
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <p className="text-md font-medium">Preferred Time Slots</p>
        <FormField
          control={control}
          name="preferredTimeSlots"
          render={({ field }) => {
            const timeSlots = [
              { value: "09:00", label: "9:00 AM" },
              { value: "12:00", label: "12:00 PM" },
              { value: "15:00", label: "3:00 PM" },
              { value: "18:00", label: "6:00 PM" },
              { value: "21:00", label: "9:00 PM" },
            ];
            const selectedSlots = (field.value as string[]) || [];
            return (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 gap-3">
                    {timeSlots.map(slot => (
                      <div
                        key={slot.value}
                        className={`border cursor rounded-[16px] flex flex-col items-center gap-3 py-4 ${
                          selectedSlots.includes(slot.value)
                            ? "border-[#3072C0] bg-[#3072C014] border-2"
                            : "bg-card"
                        }`}
                        onClick={() => {  
                          const newSlots = selectedSlots.includes(slot.value)
                            ? selectedSlots.filter(s => s !== slot.value)
                            : [...selectedSlots, slot.value];
                          field.onChange(newSlots);
                        }}
                        role="button"
                        tabIndex={-1}
                        onKeyDown={() => {
                          const newSlots = selectedSlots.includes(slot.value)
                            ? selectedSlots.filter(s => s !== slot.value)
                            : [...selectedSlots, slot.value];
                          field.onChange(newSlots);
                        }}
                      >
                        <p
                          className={`text-sm font-medium ${
                            selectedSlots.includes(slot.value) ? "text-[#265B99]" : ""
                          }`}
                        >
                          {slot.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="font-medium text-md ">
        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Select defaultValue="EST" value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                    <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default StepConfiguration;
