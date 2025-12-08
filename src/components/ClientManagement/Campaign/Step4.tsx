import { useTheme } from "next-themes";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import Cloud from "@/components/ui/icons/options/cloud";
import Gallery from "@/components/ui/icons/options/gallery";
import Email from "@/components/ui/icons/social/email";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import Twitter from "@/components/ui/icons/social/twitterx";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StepFormProps } from "@/lib/types";

function StepContent({ form }: StepFormProps) {
  const { control } = form;
  const { theme } = useTheme();

  const interests = [
    {
      value: "linkedin",
      label: "Linkedin",
      icon: (
        <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
          <Linkedin />
        </div>
      ),
    },
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
      value: "instagram",
      label: "Instagram",
      icon: (
        <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
          <Instagram />
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
    {
      value: "email",
      label: "Email",
      icon: (
        <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
          <Email />
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
    {
      value: "instagram",
      label: "Instagram",
      icon: (
        <div className="bg-[#3072C014] w-7 h-7 flex items-center justify-center rounded-full p-1">
          <Linkedin />
        </div>
      ),
    },
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
    <div className="flex flex-col gap-4 ">
      <div>
        <p className="pb-2 text-[#303444] dark:text-[white] font-[700]">Content Planning</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="primaryImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-[#CCCFDB] text-[#303444]">
                  Primary Image/Video
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/mp4"
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
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">PNG, JPG, MP4 up to 10MB</p>
                        </div>
                        {field.value && (
                          <p className="text-sm text-green-600 font-medium">
                            Selected: {(field.value as File).name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondaryImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-[#CCCFDB] text-[#303444]">
                  Secondary Images
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="secondaryImagesUpload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
                        if (validFiles.length > 0) {
                          const currentFiles = field.value || [];
                          const newFiles = [...currentFiles, ...validFiles].slice(0, 5);
                          field.onChange(newFiles);
                        }
                      }}
                    />
                    <div className="dark:bg-[#0F1B29] min-h-[120px] flex justify-center py-4 bg-[#F3F5F7] rounded-[12px] text-center hover:border-muted-foreground/50 transition-colors">
                      <div className="flex flex-col self-center items-center space-y-2">
                        <Gallery
                          className="h-8 w-8 text-muted-foreground"
                          color={theme === "dark" ? "#CCCFDB" : "#303444"}
                        />
                        <div className="space-y-0">
                          <p className="text-md font-[400] dark:text-[#CCCFDB] text-[#303444]">
                            Upload additional images
                          </p>
                          <p className="text-sm text-muted-foreground">Up to 5 images</p>
                        </div>
                        {(field.value || []).length > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            {(field.value || []).length} image{(field.value || []).length !== 1 ? "s" : ""} selected
                          </div>
                        )}
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

      <div className="sm:col-span-3 font-medium text-md">
        <FormField
          control={control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Headline</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter compelling headline"
                  {...field}
                  value={field.value || ""}
                  maxLength={60}
                  className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                />
              </FormControl>
              <span className="text-sm">{field.value?.length || 0}/60 characters</span>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="sm:col-span-3 font-medium text-md">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter campaign description"
                  {...field}
                  value={field.value || ""}
                  maxLength={300}
                  rows={4}
                  className="dark:bg-[#0F1B29] py-6 pt-1 bg-[#F3F5F7] rounded-[12px]"
                />
              </FormControl>
              <span className="text-sm">{field.value?.length || 0}/300 characters</span>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3 gap-3 grid-cols-1 font-medium text-md">
        <FormField
          control={control}
          name="callToAction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call to Action</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select Call to Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learn_more">Learn More</SelectItem>
                    <SelectItem value="sign_up">Sign Up</SelectItem>
                    <SelectItem value="shop_now">Shop Now</SelectItem>
                    <SelectItem value="contact_us">Contact Us</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="book_now">Book Now</SelectItem>
                    <SelectItem value="subscribe">Subscribe</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3 font-medium text-md flex flex-col gap-2">
        <p>Publishing Schedule</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="publishStartDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Start Publishing</FormLabel>
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
                    dark:bg-[#0F1B29] bg-[#DCE0E4] p-6
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
                <FormLabel>End Publishing</FormLabel>
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
                    dark:bg-[#0F1B29] bg-[#DCE0E4] p-6
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

      <div className="sm:col-span-2 mt-2">
        <FormField
          control={control}
          name="platforms"
          render={() => (
            <FormItem>
              <FormLabel className="mb-3">Platform Selection</FormLabel>
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
                          className="flex flex-row items-center space-x-3 space-y-0"
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
export default StepContent;
