"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Clock5 from "@/components/ui/icons/alerts/clock-5";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import TikTok from "@/components/ui/icons/social/tiktok";
import XIcon from "@/components/ui/icons/social/twitterx";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const postFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  platform: z.string().min(1, "Platform is required"),
  content: z.string().min(1, "Content is required"),
  post_details: z.string().min(1, "Post details are required"),
  scheduleTime: z.string().optional(),
  autoPublish: z.boolean().optional(),
  addToLibrary: z.boolean().optional(),
});

export type PostFormData = z.infer<typeof postFormSchema>;

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData;
  defaultDate?: string;
  scheduleOnly?: boolean;
}

const platforms = [
  { id: "LinkedIn", name: "LinkedIn", icon: <Linkedin /> },
  { id: "Instagram", name: "Instagram", icon: <Instagram /> },
  { id: "Facebook", name: "Facebook", icon: <Facebook /> },
  { id: "TikTok", name: "TikTok", icon: <TikTok /> },
  { id: "Twitter", name: "Twitter/X", icon: <XIcon /> },
];

export default function CreatePostSheet({
  open,
  onOpenChange, 
  onSubmit,
  initialData,
  defaultDate,
  scheduleOnly = false,
}: CreatePostSheetProps) {
  const { theme } = useTheme();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      date: initialData?.date || defaultDate || new Date().toISOString().split("T")[0],
      platform: initialData?.platform || "",
      content: initialData?.content || "",
      post_details: initialData?.post_details || "",
      scheduleTime: "",
      autoPublish: false,
      addToLibrary: false,
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        date: initialData?.date || defaultDate || new Date().toISOString().split("T")[0],
        platform: initialData?.platform || "",
        content: initialData?.content || "",
        post_details: initialData?.post_details || "",
        scheduleTime: "",
        autoPublish: false,
        addToLibrary: false,
      });
    }
  }, [open, initialData, defaultDate, form]);

  const handleClear = () => {
    form.setValue("content", "");
  };

  const handleGenerate = () => {
    // Handle AI generation logic
    console.log("Generating content...");
  };

  const handleDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleTimeClick = () => {
    const input = document.getElementById("time-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleSubmit = (data: PostFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] font-inter bg-white w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden p-0 flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b flex-shrink-0">
          <SheetTitle className="text-lg font-semibold">
            {initialData ? "Edit Post" : "Create New Post"}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-1 overflow-hidden flex-col"
          >
            <div className="flex flex-1 overflow-hidden">
              {/* Left Section - Form */}
              <div className="flex-1 p-6 pt-0 space-y-6 overflow-y-auto scrollbar-hide ">
                {/* Platform Selection, Content, Details, and Toggles only if not scheduleOnly */}
                {!scheduleOnly && (
                  <>
                    {/* Platform Selection */}
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold mb-3 block">Select Platform</FormLabel>
                          <FormControl>
                            <div className="space-y-2 rounded-[12px]">
                              {platforms.map(platform => {
                                const isChecked = field.value === platform.id;
                                const isDisabled = field.value !== "" && !isChecked;
                                return (
                                  <div key={platform.id} className="flex items-center gap-3">
                                    <CheckboxSquare
                                      id={platform.id}
                                      checked={isChecked}
                                      disabled={isDisabled}
                                      onCheckedChange={checked => {
                                        if (checked) {
                                          field.onChange(platform.id);
                                        } else {
                                          field.onChange("");
                                        }
                                      }}
                                      className="data-[state=checked]:bg-[#3072C0]/50 data-[state=checked]:border-none data-[state=checked]:text-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <label
                                      htmlFor={platform.id}
                                      className={`flex items-center gap-2 flex-1 ${
                                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                      }`}
                                    >
                                      {platform.icon}
                                      <span className="text-sm">{platform.name}</span>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Separator */}
                    <Separator className="my-4" />
                    {/* Post Content */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel className="text-sm font-semibold">
                              Post Content AI Prompt
                            </FormLabel>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="text-sm text-muted-foreground hover:"
                              >
                                Clear
                              </Button>
                              <Button
                                type="button"
                                variant={"outline"}
                                className="p-4 text-[16px] hover:bg-[#3072C0]/10 font-[400] rounded-[12px] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleGenerate}
                              >
                                Generate
                              </Button>
                            </div>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your prompt for custom generation"
                              {...field}
                              className="min-h-[120px] resize-none dark:bg-[#0F1B29] rounded-2xl bg-[#F3F5F7]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator className="my-4" />
                    {/* Post Details */}
                    <FormField
                      control={form.control}
                      name="post_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium mb-2 block">Post Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter detailed post information..."
                              {...field}
                              className="min-h-[120px] resize-none dark:bg-[#0F1B29] rounded-2xl bg-[#F3F5F7]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator className="my-4" />
                    {/* Toggle Options */}
                    <div>
                      <FormLabel className="text-sm font-semibold mb-3 block">Schedule Time</FormLabel>
                      <div>
                        <FormField
                          control={form.control}
                          name="autoPublish"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="text-sm font-normal">Auto-Publish</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="addToLibrary"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="text-sm font-normal">Add To Content Library</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Always show Schedule Date and Time fields */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-2 block">
                        Schedule Date
                      </FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            id="date-start"
                            type="date"
                            {...field}
                            className="
                              dark:bg-[#0F1B29] bg-[#F3F5F7] border-[#DCE0E4] dark:border-[#404663] p-6 
                                pr-10 shadow-none rounded-xl
                                [&::-webkit-calendar-picker-indicator]:opacity-0 
                                [&::-webkit-calendar-picker-indicator]:absolute 
                                [&::-webkit-calendar-picker-indicator]:w-full 
                                [&::-webkit-calendar-picker-indicator]:h-full
                              "
                            min={new Date().toISOString().split("T")[0]}
                            // disabled={scheduleOnly}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={handleDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduleTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-2 block">
                        Schedule Time
                      </FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            id="time-start"
                            type="time"
                            {...field}
                            className="
                              dark:bg-[#0F1B29] bg-[#F3F5F7] border-[#DCE0E4] dark:border-[#404663] p-6
                                pr-10 shadow-none rounded-xl
                                [&::-webkit-calendar-picker-indicator]:opacity-0 
                                [&::-webkit-calendar-picker-indicator]:absolute 
                                [&::-webkit-calendar-picker-indicator]:w-full 
                                [&::-webkit-calendar-picker-indicator]:h-full
                              "
                            // disabled={scheduleOnly}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={handleTimeClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <Clock5 color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="p-6 px-8 hover:bg-[#637a96] text-[16px] font-[400] rounded-[16px] bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarIcon className="!w-6 !h-6" fill="#F6FBFE" />
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : initialData
                      ? "Update Post"
                      : "Schedule Post"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
