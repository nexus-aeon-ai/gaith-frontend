"use client";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import Facebook from "@/components/ui/icons/social/fb";
import GoogleIcon from "@/components/ui/icons/social/google";
import Instagram from "@/components/ui/icons/social/instagram";
import XIcon from "@/components/ui/icons/social/twitterx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface EditPostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms = [
  { id: "facebook", name: "Facebook", icon: <Facebook />, checked: true },
  { id: "google", name: "Google", icon: <GoogleIcon />, checked: false },
  { id: "instagram", name: "Instagram", icon: <Instagram />, checked: false },
  { id: "x", name: "X Platform", icon: <XIcon />, checked: false },
];

const recentPosts = [
  {
    platform: "facebook",
    icon: <Facebook />,
    title: "Facebook Post - Customer Testimonials",
    date: "Dec 28, 2024 at 3:00 PM",
  },
  {
    platform: "instagram",
    icon: <Instagram />,
    title: "Instagram Post - Customer",
    date: "Dec 28, 2024 at 3:00 PM",
  },
];

export default function EditPostSheet({ open, onOpenChange }: EditPostSheetProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook"]);
  const [promptText, setPromptText] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [autoPublish, setAutoPublish] = useState(false);
  const [addToLibrary, setAddToLibrary] = useState(false);
  const { theme } = useTheme();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId],
    );
  };

  const handleSelectAll = () => {
    if (selectedPlatforms.length === platforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(platforms.map(p => p.id));
    }
  };

  const handleClear = () => {
    setPromptText("");
  };

  const handleGenerate = () => {
    // Handle AI generation logic
    console.log("Generating content...");
  };

  const handleStartDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] font-inter bg-white w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden p-0">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <SheetTitle className="text-lg font-semibold">Edit Posts</SheetTitle>
        </SheetHeader>

        <div className="flex">
          {/* Left Section - Form */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Platform Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium ">Select Platforms</Label>
                <div className="flex items-center gap-2">
                  <CheckboxSquare
                    id="select-all"
                    checked={selectedPlatforms.length === platforms.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Select All
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <div key={platform.id} className="flex items-center gap-3">
                    <CheckboxSquare
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <label
                      htmlFor={platform.id}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-center">{platform.icon}</div>
                      <span className="text-sm ">{platform.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium ">Post Content AI Prompt</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-sm text-muted-foreground hover:"
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    form="lead-form"
                    variant={"outline"}
                    className="p-4 text-[16px] hover:bg-[#3072C0]/10 font-[400] rounded-[12px] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Enter your prompt for custom generation..."
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Schedule Date */}
            <div>
              <Label className="text-sm font-medium  mb-2 block">Schedule Date</Label>
              <div className="relative w-full">
                <Input
                  id="date-start"
                  type="date"
                  value={scheduleDate ? new Date(scheduleDate).toISOString().split("T")[0] : ""}
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setScheduleDate(date.toString());
                  }}
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

                <button
                  type="button"
                  onClick={handleStartDateClick}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>

            {/* Schedule Time */}
            <div>
              <Label className="text-sm font-medium  mb-2 block">Schedule Time</Label>
              <div className="relative w-full">
                <Input
                  id="date-start"
                  type="date"
                  value={scheduleTime ? new Date(scheduleDate).toISOString().split("T")[0] : ""}
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setScheduleTime(date.toString());
                  }}
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

                <button
                  type="button"
                  onClick={handleStartDateClick}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div>
              <Label className="text-sm font-medium  mb-3 block">Schedule Time</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm ">Auto-Publish</span>
                  <Switch
                    checked={autoPublish}
                    onCheckedChange={setAutoPublish}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm ">Add To Content Library</span>
                  <Switch
                    checked={addToLibrary}
                    onCheckedChange={setAddToLibrary}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Recent Posts */}
          <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-l overflow-y-auto">
            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex items-center justify-center mt-0.5">{post.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium  dark:text-white">{post.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.date}</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Post Details
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="p-6 px-8 hover:bg-[#637a96] text-[16px] font-[400] rounded-[16px] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
            >
              Save Draft
            </Button>
            <Button
              // type="submit"
              // form="aidata-form"
              variant={"outline"}
              className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Post
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
