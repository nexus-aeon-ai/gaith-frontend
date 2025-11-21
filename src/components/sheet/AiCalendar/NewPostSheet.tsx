"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import XIcon from "@/components/ui/icons/social/twitterx";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
}

const platforms = [
  { id: "LinkedIn", name: "LinkedIn", icon: <Facebook /> },
  { id: "Instagram", name: "Instagram", icon: <Instagram /> },
  { id: "Facebook", name: "Facebook", icon: <Facebook /> },
  { id: "TikTok", name: "TikTok", icon: <XIcon /> },
  { id: "Twitter", name: "Twitter/X", icon: <XIcon /> },
];

export default function CreatePostSheet({ 
  open, 
  onOpenChange, 
  onSubmit,
  initialData,
  defaultDate 
}: CreatePostSheetProps) {
  const { theme } = useTheme();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      date: initialData?.date || defaultDate || new Date().toISOString().split("T")[0],
      platform: initialData?.platform || "LinkedIn",
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
        platform: initialData?.platform || "LinkedIn",
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-1 overflow-hidden flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* Left Section - Form */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Platform Selection */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-3 block">Select Platform</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6 rounded-[12px]">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platforms.map(platform => (
                            <SelectItem key={platform.id} value={platform.id}>
                              <div className="flex items-center gap-2">
                                {platform.icon}
                                <span>{platform.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Post Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-sm font-medium">Post Content</FormLabel>
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
                          placeholder="Enter post content..."
                          {...field}
                          className="min-h-[120px] resize-none dark:bg-[#0F1B29] bg-[#DCE0E4]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="min-h-[150px] resize-none dark:bg-[#0F1B29] bg-[#DCE0E4]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Schedule Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-2 block">Schedule Date</FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            id="date-start"
                            type="date"
                            {...field}
                            className="
                              dark:bg-[#0F1B29] bg-[#DCE0E4] p-6
                                pr-10
                                [&::-webkit-calendar-picker-indicator]:opacity-0 
                                [&::-webkit-calendar-picker-indicator]:absolute 
                                [&::-webkit-calendar-picker-indicator]:w-full 
                                [&::-webkit-calendar-picker-indicator]:h-full
                              "
                            min={new Date().toISOString().split("T")[0]}
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

                {/* Schedule Time */}
                <FormField
                  control={form.control}
                  name="scheduleTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-2 block">Schedule Time</FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            id="time-start"
                            type="time"
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
                        </FormControl>
                        <button
                          type="button"
                          onClick={handleTimeClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Toggle Options */}
                <div>
                  <FormLabel className="text-sm font-medium mb-3 block">Options</FormLabel>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="autoPublish"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="text-sm">Auto-Publish</FormLabel>
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
                          <FormLabel className="text-sm">Add To Content Library</FormLabel>
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
                  {form.formState.isSubmitting ? "Submitting..." : (initialData ? "Update Post" : "Schedule Post")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
