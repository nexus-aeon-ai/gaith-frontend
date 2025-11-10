import { Info } from "lucide-react";
import React from "react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepFormProps } from "@/lib/types";


function StepBulkPostOverview({ form }: StepFormProps) {
  const { control } = form;
  return (
    <>
      <div className="flex flex-col gap-5 font-inter">
        <div className="space-y-1">
          <p className="text-md font-medium">Final Confirmation</p>
          <p className="text-sm text-muted-foreground mb-2">
            Review your bulk scheduling settings before confirming
          </p>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
            <div className="border border-[#EE4F8D] cursor bg-[#EE4F8D14] rounded-[16px] flex flex-col items-center gap-3 py-4">
              <h3 className="font-bold text-lg">24</h3>
              <p className="text-md font-medium">Total Posts</p>
            </div>
            <div className="border border-[#2BAE82] cursor bg-[#2BAE8214] rounded-[16px] flex flex-col items-center gap-3 py-4">
              <h3 className="font-bold text-lg">24</h3>
              <p className="text-md font-medium">Total Posts</p>
            </div>
            <div className="border border-[#ECA338] cursor bg-[#ECA33814] rounded-[16px] flex flex-col items-center gap-3 py-4">
              <h3 className="font-bold text-lg">24</h3>
              <p className="text-md font-medium">Total Posts</p>
            </div>
            <div className="border border-[#3072C0] cursor bg-[#3072C014] rounded-[16px] flex flex-col items-center gap-3 py-4">
              <h3 className="font-bold text-lg">24</h3>
              <p className="text-md font-medium">Total Posts</p>
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
                  <Select defaultValue="EST"  onValueChange={field.onChange}>
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
      <div className="mt-6 border rounded-[12px] p-4 border-[#78A7DD] bg-[#3072C014]">
        <div className="flex items-center gap-2 text-[16px]">
          <Info color="#3072C0" />
          <p className="font-medium">Schedule Summary</p>
        </div>
        <ul className="list-disc pl-6 mt-2">
          <li>Date Range: December 26, 2024 - January 31, 2025</li>
          <li>Frequency: Every other day</li>
          <li>Time Slots: 12:00 PM, 6:00 PM (EST)</li>
          <li>Platforms: Facebook, Twitter, Instagram, LinkedIn</li>
        </ul>
      </div>
    </>
  );
}
export default StepBulkPostOverview;
