"use client";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { useState } from "react";

import AllPostsFilter from "@/components/sheet/AiCalendar/AllPostsFilter";
import AllPostsTable, { Post as TablePost } from "@/components/SocialCalendar/AllPostsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import Facebook from "@/components/ui/icons/social/fb";
import GoogleIcon from "@/components/ui/icons/social/google";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import TikTok from "@/components/ui/icons/social/tiktok";
import XIcon from "@/components/ui/icons/social/twitterx";
import { TaskSuccessIcon } from "@/components/ui/icons/task-tracking/Tasksuccess";
import { cn } from "@/lib/utils";

import AnalyticsCard, { AnalyticsSummaryCardProps } from "../Dashboard/AnalyticsCard";
import { CalenderIcon } from "../ui/icons/analytics/calender";
import { CampaignsIcon } from "../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../ui/icons/analytics/contentPieces";

// Dynamic analytics cards from calendarData
interface CalendarEntry {
  date: string;
  content: string;
  platform: string;
  post_details: string;
}

interface CalendarData {
  calendar: CalendarEntry[];
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

const getAnalyticsCards = (calendarData: CalendarData | null | undefined): AnalyticsSummaryCardProps[] => {
  const posts = calendarData?.calendar || [];
  const total = posts.length;
  // For demo: treat all as scheduled, none as published/failed unless status is available
  const draft = calendarData?.status === "draft" ? total : 0;
  const scheduled = calendarData?.status === "completed" ? total : 0;
  // You can refine these if you have more status info per post
  return [
    {
      label: "Total Posts",
      value: total,
      icon:  <div className=" bg-[#3072C014] p-2 rounded-full">
              <TaskSuccessIcon className="text-[#508CD3] w-5 h-5" />
            </div>,
      trendColor: "text-green-500",
    },
    {
      label: "Draft Posts",
      value: draft,
      icon: <CampaignsIcon className="text-[#2BAE82] w-12 h-12" />,
      trendColor: "text-green-500",
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: <ContentPiecesIcon className="text-[#ff5999d2] w-12 h-12" />,
      trendColor: "text-green-500",
    },
    {
      label: "Published",
      value: 0,
      icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
      trendColor: "text-red-500",
    },
    {
      label: "Failed",
      value: 0,
      icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
      trendColor: "text-red-500",
    },
  ];
};

// Dynamic platform data from calendarData
const getPlatformData = (calendarData: CalendarData | null | undefined) => {
  const posts = calendarData?.calendar || [];
  const platformIcons: Record<string, React.ReactNode> = {
    Facebook: <Facebook />,
    Instagram: <Instagram />,
    LinkedIn: <Linkedin />,
    TikTok: <TikTok />,
    Twitter: <XIcon />,
    "X": <XIcon />,
    "X (Twitter)": <XIcon />,
    Google: <GoogleIcon className="w-4 h-4 text-green-600" />,
  };
  const platformCounts: Record<string, number> = {};
  posts.forEach((post: any) => {
    const key = post.platform;
    platformCounts[key] = (platformCounts[key] || 0) + 1;
  });
  return Object.entries(platformCounts).map(([name, count]) => ({
    name,
    icon: platformIcons[name] || null,
    posts: count,
  }));
};

// Dynamic upcoming posts (this week) from calendarData
const getUpcomingPosts = (calendarData: CalendarData | null | undefined) => {
  const posts = calendarData?.calendar || [];
  const platformIcons: Record<string, React.ReactNode> = {
    Facebook: <Facebook />,
    Instagram: <Instagram />,
    LinkedIn: <Linkedin />,
    TikTok: <TikTok />,
    Twitter: <XIcon />,
    "X": <XIcon />,
    "X (Twitter)": <XIcon />,
    Google: <GoogleIcon />,
  };
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);
  return posts
    .map((post) => ({
      ...post,
      icon: platformIcons[post.platform] || null,
      dateObj: new Date(post.date),
    }))
    .filter((post) => post.dateObj >= now && post.dateObj <= weekFromNow)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 4);
};

const AllPostsPage = ({
  closeAllPostsPage,
  calendarData,
}: {
  closeAllPostsPage: () => void;
  calendarData: any;
}) => {
  const { theme } = useTheme();
  const [showAllPostsFilter, setShowAllPostsFilter] = useState(false);
  console.log("Calendar Data in AllPostsPage:", calendarData);

  // Dynamic data
  const analyticsCards = getAnalyticsCards(calendarData);
  const platformData = getPlatformData(calendarData);
  const upcomingPosts = getUpcomingPosts(calendarData);

  // Transform calendarData to table posts
  const posts: TablePost[] = (calendarData?.calendar || []).map((entry, idx) => {
    // Example: scheduledStart/End/duration logic (customize as needed)
    const scheduledStart = entry.date;
    const scheduledEnd = entry.date;
    const duration = "1 day";
    return {
      id: idx + 1,
      platform: entry.platform.toLowerCase(),
      platformName: entry.platform,
      title: entry.content,
      description: entry.post_details,
      scheduledStart,
      scheduledEnd,
      duration,
      status: calendarData.status === "draft" ? "Draft" : calendarData.status === "completed" ? "Scheduled" : "Published",
    };
  });

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">
                  <DashboardListIcon className="dark:text-[#E6EFF9]" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="#"
                  className="text-blue-600 font-medium text-md"
                  onClick={closeAllPostsPage}
                >
                  Social Media Calendar
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-md">All Posts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">All Posts</h1>
              <span className="text-[12px] text-muted-foreground">
                Comprehensive list of all scheduled social media posts across platforms
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex lg:flex-row flex-col gap-2">
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card rounded-2xl w-auto",
                    "px-3 sm:px-4 lg:px-6 h-9 py-6 sm:h-12",
                    "border-border",
                    "hover:bg-white/70 dark:hover:bg-[#0F1B29] hover:text-[#3072C0]",
                    "text-xs sm:text-sm",
                    "cursor-pointer",
                  )}
                  onClick={() => setShowAllPostsFilter(true)}
                >
                  <FilterIcon color={theme === "dark" ? "white" : "#303444"} />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
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
                      <span className="hidden sm:inline dark:text-white ">PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="hidden sm:inline dark:text-white ">Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex lg:flex-row flex-col gap-2">
                <Button
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 cursor-pointer",
                    "bg-[#508CD3] rounded-2xl w-auto",
                    "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-blue-700 text-white",
                    "text-xs sm:text-sm lg:text-base",
                  )}
                >
                  <Plus className="h-4 w-4 rounded-full bg-blue-400 text-white" />
                  <span>New Post</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
            <AnalyticsCard key={idx} {...card} />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-3">
          {/* left table and right column */}
          <div className="lg:col-span-3 col-span-1">
            <AllPostsTable posts={posts} />
          </div>
          <div className="lg:col-span-2 col-span-1">
            {/* platform distribution card */}
            <div className="bg-card rounded-xl p-5 shadow-sm border ">
              <h2 className=" font-semibold mb-4 text-base">Platform Distribution</h2>
              <div className="space-y-3">
                {platformData.map((platform, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 shrink-0 flex items-center justify-center  rounded-lg">
                        {platform.icon}
                      </div>
                      <span className="text-sm  font-medium">{platform.name}</span>
                    </div>
                    <span className="text-sm">{platform.posts} Posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* upcoming this week card */}
            <div className="bg-card rounded-xl p-5 shadow-sm border  mt-4">
              <h2 className=" font-semibold mb-4 text-base">Upcoming This Week</h2>
              <div className="space-y-3">
                {upcomingPosts.map((post: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between  rounded-lg px-3 py-2 bg-[#F3F5F7] dark:bg-card "
                  >
                    <div className="flex items-center gap-2 ">
                      <div className="w-6 h-6 flex items-center justify-center rounded-lg">
                        {post.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold ">{post.platform} Post</p>
                        <p className="text-xs text-gray-500">{post.dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllPostsFilter open={showAllPostsFilter} onOpenChange={setShowAllPostsFilter} />
    </>
  );
};

export default AllPostsPage;
