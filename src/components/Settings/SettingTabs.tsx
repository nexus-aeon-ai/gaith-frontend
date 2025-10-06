"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import Notification from "@/components/ui/icons/notfication";
import NotificationIconFilled from "@/components/ui/icons/notification-filled";
import Security from "@/components/ui/icons/security";
import SecurityIconFilled from "@/components/ui/icons/security-filled";
import SettingsIconFilled from "@/components/ui/icons/settings-filled";
import { SettingsIcon } from "@/components/ui/icons/sidebar/settings";
import UsersIcon from "@/components/ui/icons/user";
import UsersIconFilled from "@/components/ui/icons/user-filled";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type SettingsTabsProps = {
  className?: string;
  defaultTab?: "general" | "users" | "notifications" | "security";
};

export function SettingsTabs({ defaultTab = "general" }: SettingsTabsProps) {
  const { theme } = useTheme();
  const iconColor = theme === "dark" ? "#CCCFDB" : "#303444";
  const [activeTab, setActiveTab] = useState("general");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const items = [
    { value: "general", label: "General", Icon: SettingsIcon, Filled: SettingsIconFilled },
    { value: "users", label: "User Management", Icon: UsersIcon, Filled: UsersIconFilled },
    {
      value: "notifications",
      label: "Notifications",
      Icon: Notification,
      Filled: NotificationIconFilled,
    },
    { value: "security", label: "Security", Icon: Security, Filled: SecurityIconFilled },
  ] as const;

  return (
    <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
      <TabsList
        aria-label="Settings sections"
        className={cn(
          "w-full gap-0 h-auto",
          "rounded-t-xl rounded-b-none border bg-card ",
          "p-0 overflow-hidden",
        )}
      >
        {items.map(({ value, label, Icon, Filled }) => {
          const isActive = value === activeTab;
          const isHovered = value === hoveredTab;
          const ActiveIcon = isActive || isHovered ? Filled : Icon;

          return (
            <TabsTrigger
              key={value}
              value={value}
              onMouseEnter={() => setHoveredTab(value)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "group relative flex-1 py-4",
                "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
                "data-[state=active]:shadow-sm",
                "data-[state=active]:border data-[state=active]:border-border",
                "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full after:bg-transparent",
                "data-[state=active]:after:bg-[#3072C0]",
                "rounded-none px-3",
                "text-sm text-muted-foreground",
                "hover:text-foreground hover:bg-secondary/80 transition-all duration-200",
              )}
            >
              <ActiveIcon color={iconColor} className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="text-pretty">{label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Example content panes; replace with real forms as needed */}
      <TabsContent className=" rouned-none" value="general">
        <SectionPlaceholder title="General" />
      </TabsContent>
      <TabsContent className="m-0 rounded-none" value="users">
        <SectionPlaceholder title="User Management" />
      </TabsContent>
      <TabsContent className="m-0 rounded-none" value="notifications">
        <SectionPlaceholder title="Notifications" />
      </TabsContent>
      <TabsContent className="m-0 rounded-none" value="security">
        <SectionPlaceholder title="Security" />
      </TabsContent>
    </Tabs>
  );
}

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <div
      className={cn(
        "rounded-none m-0 border border-t-transparent bg-card p-6",
        "text-sm text-muted-foreground",
      )}
    >
      <p>{title} content goes here. Replace this with your settings form sections.</p>
    </div>
  );
}
