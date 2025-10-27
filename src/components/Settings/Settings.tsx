"use client";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import { SettingsTabs, SettingsTabsRef } from "./SettingTabs";

const Settings = () => {
  // 🔹 Create a ref for SettingsTabs
  const settingsRef = useRef<SettingsTabsRef>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Function to handle "Save All Changes" - only saves modified forms
  const handleSaveAll = async () => {
    if (settingsRef.current) {
      setIsSaving(true);
      try {
        const result = await settingsRef.current.submitModifiedForms();
        
        // Show success message for saved forms
        if (result.savedForms.length > 0) {
          toast.success(
            `Successfully saved: ${result.savedForms.join(", ")}`,
            { autoClose: 3000 },
          );
        }
        
        // Show info message for skipped forms
        if (result.skippedForms.length > 0) {
          const noChanges = result.skippedForms.filter(form => form.includes("no changes"));
          const noApi = result.skippedForms.filter(form => form.includes("no API"));
          const validationFailed = result.skippedForms.filter(form => form.includes("validation failed"));
          
          if (noChanges.length > 0 && result.savedForms.length === 0) {
            toast.info("No changes detected in any forms.");
          }
          
          if (validationFailed.length > 0) {
            toast.warning(`Some forms have validation errors: ${validationFailed.map(f => f.split(" (")[0]).join(", ")}`);
          }
          
          if (noApi.length > 0) {
            console.log(`Forms without API integration: ${noApi.join(", ")}`);
          }
        }
        
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error("An error occurred while saving settings.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="p-6 font-inter w-full">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-card-foreground text-sm">
        Configure system preferences and manage account settings
      </p>

      {/* 🔹 Pass ref to SettingsTabs */}
      <SettingsTabs ref={settingsRef} />

      <div className="flex justify-end gap-2 mt-4">
        <Button className="border border-[#687192] text-[#687192] p-4 px-6 h-16 text-md font-[400] bg-transparent dark:hover:bg-[#687192]/20 hover:bg-[#687192]/10 rounded-[16px]">
          Reset To Defaults
        </Button>

        <Button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="border-none text-white p-4 px-6 h-16 text-md font-[400] bg-[#3072C0] hover:bg-[#3072C0]/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-[16px]"
        >
          {isSaving ? "Saving..." : "Save All Changes"}
          {!isSaving && <ChevronRight />}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
