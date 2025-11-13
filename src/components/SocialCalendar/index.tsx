"use client";

import { ChevronDown, Plus } from "lucide-react";
import React, { useState } from "react";

import BulkPostSheet from "@/components/sheet/AiCalendar/BulkPostsSheet";
import CreatePostSheet from "@/components/sheet/AiCalendar/NewPostSheet";
import AllPostsPage from "@/components/SocialCalendar/AllPostsPage";
import { BulkScheduleForm } from "@/components/SocialCalendar/BulkScheduling/BulkScheduleMain";
import SocialMediaAnalytics from "@/components/SocialCalendar/SocialMediaAnalytics";
import UpcomingPosts from "@/components/SocialCalendar/UpcomingPosts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnalyticsIcon } from "@/components/ui/icons/analytics/analytics";
import { cn } from "@/lib/utils";

import AnalyticsCard, { AnalyticsSummaryCardProps } from "../Dashboard/AnalyticsCard";
import { ActiveClientsIcon } from "../ui/icons/analytics/activeClients";
import { CalenderIcon } from "../ui/icons/analytics/calender";
import { CampaignsIcon } from "../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../ui/icons/analytics/contentPieces";

import Calendar from "./Calendar";

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Active Clients",
    value: 24,
    icon: <ActiveClientsIcon className="text-[#508CD3] w-12 h-12" />,
    trendColor: "text-green-500",
  },
  {
    label: "Ongoing Campaigns",
    value: 37,
    icon: <CampaignsIcon className="text-[#2BAE82] w-12 h-12" />,
    trendColor: "text-green-500",
  },
  {
    label: "Content Pieces",
    value: "1,420,100",
    icon: <ContentPiecesIcon className="text-[#ff5999d2] w-12 h-12" />,
    trendColor: "text-green-500",
  },
  {
    label: "Calendar Completion",
    value: "86%",
    icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
    trendColor: "text-red-500",
  },
];

const SocialCalendarPage = () => {
  const [showNewPostSheet, setShowNewPostSheet] = useState(false);
  const [showBulkPostSheet, setShowBulkPostSheet] = useState(false);
  const [showAllPostsPage, setShowAllPostsPage] = useState(false);
  const [showBulkSchedulePage, setShowBulkSchedulePage] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (showAllPostsPage)
    return <AllPostsPage closeAllPostsPage={() => setShowAllPostsPage(false)} />;
  if (showBulkSchedulePage) return <BulkScheduleForm />;

  if (showAnalytics) return <SocialMediaAnalytics />;

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">Social Media Calendar</h1>
              <span className="text-[12px] max-w-[300px] text-muted-foreground">
                Plan, schedule, and manage your social media content across all platforms
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex lg:flex-row flex-col gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1 sm:gap-2",
                        "bg-card rounded-2xl w-auto",
                        "px-3 sm:px-4 lg:px-6 h-9 py-6 sm:h-12",
                        "border-border",
                        "hover:bg-white/70 hover:text-[#3072C0] text-[#3072C0]",
                        "text-xs sm:text-sm",
                        "dark:text-white cursor-pointer",
                      )}
                    >
                      <span>Export</span>
                      <ChevronDown className="ms-1 dark:text-white text-[#3072C0]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <span className="hidden sm:inline dark:text-white text-gray-900">
                        Bulk Approve
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="hidden sm:inline dark:text-white text-gray-900">
                        Bulk Reject
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="hidden sm:inline dark:text-white text-gray-900">
                        Bulk Launch
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="submit"
                  form="lead-form"
                  variant={"outline"}
                  className="p-6 px-8 text-[16px] hover:bg-[#3072C0]/10 font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowAnalytics(true)}
                >
                  <AnalyticsIcon />
                  View Analytics
                </Button>
              </div>
              <div className="flex lg:flex-row flex-col gap-2">
                <Button
                  type="submit"
                  form="lead-form"
                  variant={"outline"}
                  className="p-6 text-[16px] hover:bg-[#2BAE82]/10 hover:text-[#2BAE82] font-[400] rounded-[16px] border-[#2BAE82] text-[#2BAE82] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowBulkSchedulePage(true)}
                >
                  <CalenderIcon className="!w-8 !h-8 text-[#2BAE82]" />
                  Bulk Post Scheduling
                </Button>
                <Button
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 cursor-pointer",
                    "bg-[#508CD3] rounded-2xl w-auto",
                    "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-blue-700 text-white",
                    "text-xs sm:text-sm lg:text-base",
                  )}
                  onClick={() => {
                    setShowNewPostSheet(true);
                  }}
                >
                  <Plus className="h-4 w-4 rounded-full bg-blue-400 text-white" />
                  <span>New Post</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
            <AnalyticsCard key={idx} {...card} />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-3">
          {/* calendar view */}
          <div className="col-span-3">
            <Calendar setShowAllPostsPage={setShowAllPostsPage} />
          </div>

          {/* upcoming posts */}
          <div className="col-span-2 rounded-[16px]">
            <UpcomingPosts />
          </div>
        </div>
      </div>
      <CreatePostSheet open={showNewPostSheet} onOpenChange={setShowNewPostSheet} />
      <BulkPostSheet open={showBulkPostSheet} onOpenChange={setShowBulkPostSheet} />
    </>
  );
};

export default SocialCalendarPage;
