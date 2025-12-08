import { Info } from "lucide-react";
import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepFormProps } from "@/lib/types";

import { FormValues } from "./Campaign";

function StepOverview({ form, values }: StepFormProps & { values: FormValues }) {
  const [agreed, setAgreed] = useState(false);
  const { control } = form;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-md font-semibold">Review & Launch</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 bg-[#F8FBFA] dark:bg-[#111B26] p-4 rounded-lg">
        <div>
          <OverviewItem label="Campaign Name" value={values.campaignName} />
          <OverviewItem label="Campaign Type" value={values.campaignType} />
          <OverviewItem label="Target Audience" value={values.targetAudience} />
          <OverviewItem label="Total Budget" value={values.totalBudget} />
        </div>
        <div>
          <OverviewItem label="Primary Headline" value={values.headline || ""} />
          <OverviewItem label="Call-to-Action" value={values.callToAction} />
          <OverviewItem label="Platforms" value={values.platforms} />
          <OverviewItem label="Objectives" value={values.objectives} />
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          className="rounded-md mt-1"
          checked={agreed}
          onCheckedChange={() => setAgreed(!agreed)}
        />
        <p className="max-w-4xl">
          I agree to the{" "}
          <span className="cursor-pointer hover:underline text-[#3072C0]"> Terms of Service</span>{" "}
          and <span className="cursor-pointer hover:underline text-[#3072C0]"> Privacy Policy</span>
          . I understand that campaign charges will be applied according to The budget allocation
          and platform pricing.
        </p>
      </div>

      <div className="mt-6 border rounded-[12px] p-4 border-[#78A7DD] bg-[#3072C014]">
        <FormField
          control={control}
          name="launchOptions"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[16px]">
                <Info color="#3072C0" />
                Campaign Launch Options
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:px-5 md:px-6 px-3 gap-2"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="immediate"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p>Launch Immediately After Approval</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="scheduled"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p>Schedule for Later Launch</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="draft"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p>Save As Draft For Review</p>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
export default StepOverview;

function OverviewItem({ label, value }: { label: string; value: string | number | string[] }) {
  const formatValue = (val: string | number | string[]) => {
    if (Array.isArray(val)) {
      return val.length > 0 ? val.join(", ") : "n/a";
    }
    return val;
  };
  return (
    <div className="flex w-full justify-between items-center p-1">
      <div className="text-[16px] text-[#687192] dark:text-[#CACCD6]">{label}</div>
      <div className="text-[#303444] dark:text-[#CCCFDB] text-[16px]">
        {formatValue(value) || "n/a"}
      </div>
    </div>
  );
}
