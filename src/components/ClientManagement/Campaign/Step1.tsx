import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";

import { Checkbox } from "@/components/ui/checkbox";
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
import { getClients } from "@/lib/api";
import { useCampaignLookups } from "@/lib/api/campaign/campaign-lookups";
import { StepFormProps } from "@/lib/types";

/* Step 1: Campaign Basics */
function StepPersonal({ form }: StepFormProps) {

  const { types, objectiveTypes, isLoading } = useCampaignLookups();

  const { data: apiClientsData, isLoading : isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    initialData: [],
  });

  console.log("🚀 ~ apiClientsData:", apiClientsData);

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

  if (isLoading || isLoadingClients) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <p className="pb-2 font-[700]">Campaign Basics</p>
      <div className="sm:col-span-3 gap-3 font-medium text-md grid grid-cols-2">
        <FormField
          control={control}
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter campaign name"
                  {...field}
                  className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Client</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiClientsData?.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
        <FormField
          control={control}
          name="campaignType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types?.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="startDate"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    id="date-start"
                    type="date"
                    value={value ? new Date(value).toISOString().split("T")[0] : ""}
                    onChange={e => {
                      const date = new Date(e.target.value);
                      onChange(date);
                    }}
                    className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] p-6
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
          control={control}
          name="endDate"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    id="date-end"
                    type="date"
                    value={value ? new Date(value).toISOString().split("T")[0] : ""}
                    onChange={e => {
                      const date = new Date(e.target.value);
                      onChange(date);
                    }}
                    min={form.getValues().startDate?.toISOString().split("T")[0]}
                    {...field}
                    className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] p-6
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

      <div className="sm:col-span-3">
        <p className="pb-2 font-medium text-md">Campaign Objectives</p>
        <div className="grid grid-cols-2 gap-4">
          {objectiveTypes.map(obj => (
            <FormField
              key={obj.id}
              control={control}
              name="objectives"
              render={({ field }) => {
                const value: string[] = field.value || [];
                return (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 py-3 rounded-md border">
                    <FormControl>
                      <Checkbox
                        className="rounded-md"
                        checked={value.includes(obj.id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            field.onChange([...value, obj.id]);
                          } else {
                            field.onChange(value.filter(v => v !== obj.id));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{obj.name}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
        <FormMessage />
      </div>
    </div>
  );
}

export default StepPersonal;
