import { Info } from "lucide-react";
import React from "react";

import { StepFormProps } from "@/lib/types";


function StepBulkPostOverview({ form }: StepFormProps) {
  const formValues = form.getValues();
  
  // Format dates
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };
  
  // Format frequency
  const formatFrequency = (freq: string | null | undefined) => {
    if (!freq) return "Not set";
    switch(freq) {
      case "daily": return "Daily";
      case "every-other-day": return "Every other day";
      case "weekdays-only": return "Weekdays only";
      default: return freq;
    }
  };
  
  // Format time slots
  const formatTimeSlots = (slots: string[] | undefined) => {
    if (!slots || slots.length === 0) return "Not set";
    return slots.map(slot => {
      const [hours, minutes] = slot.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }).join(", ");
  };
  
  // Format platforms
  const formatPlatforms = (platforms: string[] | undefined) => {
    if (!platforms || platforms.length === 0) return "Not selected";
    return platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
  };
  
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
          <div className="mb-2">
            <span className="block font-medium">Timezone</span>
            <span className="block py-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-[12px]">
              {formValues.timezone || "Not set"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 border rounded-[12px] p-4 border-[#78A7DD] bg-[#3072C014]">
        <div className="flex items-center gap-2 text-[16px]">
          <Info color="#3072C0" />
          <p className="font-medium">Schedule Summary</p>
        </div>
        <ul className="list-disc pl-6 mt-2">
          <li>Date Range: {formatDate(formValues.publishStartDate)} - {formatDate(formValues.publishEndDate)}</li>
          <li>Frequency: {formatFrequency(formValues.postingFrequency)}</li>
          <li>Time Slots: {formatTimeSlots(formValues.preferredTimeSlots)} ({formValues.timezone || "Not set"})</li>
          <li>Platforms: {formatPlatforms(formValues.platforms)}</li>
        </ul>
      </div>
    </>
  );
}
export default StepBulkPostOverview;
