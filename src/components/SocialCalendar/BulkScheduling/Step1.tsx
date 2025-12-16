import { Info } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Cloud from "@/components/ui/icons/options/cloud";
import Facebook from "@/components/ui/icons/social/fb";
import Google from "@/components/ui/icons/social/google";
import Instagram from "@/components/ui/icons/social/instagram";
import Twitter from "@/components/ui/icons/social/twitterx";
import { Textarea } from "@/components/ui/textarea";
import { StepFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const interests = [
  {
    value: "twitter",
    label: "Twitter",
    icon: (
      <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
        <Twitter />
      </div>
    ),
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: (
      <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
        <Instagram />
      </div>
    ),
  },
  {
    value: "google",
    label: "Google",
    icon: (
      <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
        <Google />
      </div>
    ),
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: (
      <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
        <Facebook />
      </div>
    ),
  },
];

/* Step 1: Campaign Basics */
function StepUpload({ form }: StepFormProps) {
  const { control } = form;

  const { theme } = useTheme();

  return (
    <div className="space-y-2 font-inter">
      <div>
        <p className=" text-[#303444] dark:text-[white] font-[700]">CSV File Upload</p>
        <p className="text-muted-foreground mb-2">
          Upload a CSV file containing your post content and scheduling information
        </p>

        <div className="flex w-full gap-4">
          <FormField
            control={control}
            name="primaryImage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept="csv"
                      id="primaryImageUpload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 10 * 1024 * 1024) {
                          field.onChange(file);
                        }
                      }}
                    />
                    <div className="dark:bg-[#0F1B29] flex justify-center py-4 min-h-[120px] bg-[#F3F5F7] rounded-[12px] text-center hover:border-muted-foreground/50 transition-colors">
                      <div className="flex flex-col items-center space-y-2 self-center">
                        <Cloud
                          className="h-12 w-12 text-muted-foreground"
                          color={theme === "dark" ? "#CCCFDB" : "#303444"}
                        />
                        <div className="space-y-0">
                          <p className="text-md font-[400] dark:text-[#CCCFDB] text-[#303444]">
                            Drop your CSV file here, or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Supports CSV files up to 10MB
                          </p>
                        </div>
                        {field.value && (
                          <p className="text-sm text-green-600 font-medium">
                            Selected: {(field.value as File).name}
                          </p>
                        )}
                        <Button
                          className={cn(
                            "flex items-center gap-1 sm:gap-2",
                            "bg-[#508CD3] rounded-2xl  sm:w-auto",
                            "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                            "hover:bg-blue-700  text-white",
                            "text-xs sm:text-sm lg:text-base",
                          )}
                        >
                          <input
                            type="file"
                            accept="csv"
                            id="primaryImageUpload"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size <= 10 * 1024 * 1024) {
                                  field.onChange(file);
                                } else {
                                  toast.error("File size must be less than 10MB");
                                }
                              }
                            }}
                          />
                          Browser
                        </Button>
                      </div>
                    </div>
                  </div>
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
          <p className="font-medium">CSV Format Requirements</p>
        </div>
        <ul className="list-disc pl-6 mt-2">
          <li>Column headers: content, platform, date, time, hashtags</li>
          <li>Date format: YYYY-MM-DD (e.g., 2024-12-25)</li>
          <li>Time format: HH:MM (e.g., 14:30)</li>
          <li>Platform values: facebook, twitter, instagram, linkedin</li>
        </ul>
        <a href="#none" className="underline text-sm font-semibold">
          Download Sample CSV
        </a>
      </div>

      <div className="sm:col-span-3 font-medium text-md mt-4">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add post content and scheduling information *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter post content and scheduling information"
                  {...field}
                  maxLength={300}
                  rows={4}
                  className="dark:bg-[#0F1B29] py-6 pt-1 bg-[#F3F5F7] rounded-[12px]"
                  value={field.value || ""}
                />
              </FormControl>
              <span className="text-sm">{field.value?.length || 0}/300 characters</span>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2 mt-4">
        <FormField
          control={control}
          name="platforms"
          render={() => (
            <FormItem>
              <FormLabel className="mb-1">Platform Selection</FormLabel>
              <p className="text-sm text-muted-foreground mb-3">Choose which social media platforms to schedule posts for</p>
              <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
                {interests.map(interest => (
                  <FormField
                    key={interest.value}
                    control={control}
                    name="platforms"
                    render={({ field: { value, onChange } }) => {
                      const values = (value as string[]) || [];
                      return (
                        <FormItem
                          key={interest.value}
                          className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-[12px]"
                        >
                          <FormControl>
                            <Checkbox
                              className="rounded-md"
                              checked={values.includes(interest.value)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  onChange([...values, interest.value]);
                                } else {
                                  onChange(values.filter(val => val !== interest.value));
                                }
                              }}
                            />
                          </FormControl>
                          {interest.icon}
                          <FormLabel className="font-normal">{interest.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default StepUpload;
