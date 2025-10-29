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

  const interests = [
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion & Style" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "travel", label: "Travel & Adventure" },
    { value: "food", label: "Food & Dining" },
    { value: "entertainment", label: "Entertainment" },
    { value: "business", label: "Business & Finance" },
    { value: "education", label: "Education & Learning" },
  ];

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "in", label: "India" },
    { value: "jp", label: "Japan" },
  ];

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
        <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
            <p className="text-sm font-medium">Daily</p>
          </div>
          <div className=" cursor border-[#3072C0] border-2 bg-[#3072C014] rounded-[16px] flex flex-col items-center gap-3 py-4">
            <CalendarIcon color={"#265B99"} />
            <p className="text-sm font-medium text-[#265B99]">Every Other Day</p>
          </div>
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
            <p className="text-sm font-medium">Weekdays Only</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-md font-medium">Preferred Time Slots</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 gap-3">
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-medium">9:00 AM</p>
          </div>
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-medium">12:00 PM</p>
          </div>

          <div className=" cursor border-[#3072C0] bg-[#3072C014] border-2 rounded-[16px] flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-medium text-[#265B99]">3:00 PM</p>
          </div>
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-medium">6:00 PM</p>
          </div>
          <div className="border cursor bg-card rounded-[16px] flex flex-col items-center gap-3 py-4">
            <p className="text-sm font-medium">9:00 PM</p>
          </div>
        </div>
      </div>

      <div className="font-medium text-md ">
        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Select defaultValue="EST" value={field.value} onValueChange={field.onChange}>
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
