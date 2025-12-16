"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import BulkPostSheet from "@/components/sheet/AiCalendar/BulkPostsSheet";
import CreatePostSheet, { type PostFormData } from "@/components/sheet/AiCalendar/NewPostSheet";
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
import DownArrow from "@/components/ui/icons/down-arrow";
import EyeIcon from "@/components/ui/icons/eye";
import HeartIcon from "@/components/ui/icons/heart";
import MouseIcon from "@/components/ui/icons/mouse";
import { TaskSuccessIcon } from "@/components/ui/icons/task-tracking/Tasksuccess";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarListItem,
  getSocialMediaCalendars,
  updateSocialMediaCalendar,
} from "@/lib/api/reports";
import { cn } from "@/lib/utils";

import AnalyticsCard, { AnalyticsSummaryCardProps } from "../Dashboard/AnalyticsCard";
import { CalenderIcon } from "../ui/icons/analytics/calender-nobg";

import Calendar from "./Calendar";

const isPaginatedCalendarList = (
  message: unknown,
): message is import("@/lib/api/reports").SocialMediaCalendarListResponse["details"]["message"] => {
  return typeof message === "object" && message !== null && "results" in message;
};

// Sort calendars by status: completed > failed > draft
const statusPriority = { completed: 1, failed: 2, draft: 3 };

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Scheduled Posts",
    value: 24,
    icon: (
      <div className=" bg-[#3072C014] p-2 rounded-full">
        <TaskSuccessIcon className="text-[#508CD3] w-5 h-5" />
      </div>
    ),
    trendColor: "text-green-500",
  },
  {
    label: "Total Engagement",
    value: 37,
    icon: (
      <div className=" bg-[#EE4F8D14] p-1 rounded-full">
        <HeartIcon className="w-7 h-7" color="#EE4F8D" />
      </div>
    ),
    trendColor: "text-green-500",
  },
  {
    label: "Total Reach",
    value: "1,420,100",
    icon: (
      <div className=" bg-[#2BAE8214] p-1 rounded-full">
        <EyeIcon className="w-7 h-7" color="#2BAE82" />
      </div>
    ),
    trendColor: "text-green-500",
  },
  {
    label: "Total Clicks",
    value: "86%",
    icon: (
      <div className=" bg-[#ECA33814] p-1 rounded-full">
        <MouseIcon className="w-7 h-7" color="#ECA338" />
      </div>
    ),
    trendColor: "text-red-500",
  },
];

interface SocialCalendarPageProps {
  calendarsList: CalendarListItem[];
  initialCalendarData?: {
    calendar: Array<{
      date: string;
      content: string;
      platform: string;
      post_details: string;
    }>;
    created_at: string;
    updated_at: string;
    status: "draft" | "completed" | "failed";
  } | null;
  initialSelectedCalendarId: number | null;
  initialPagination?: {
    count: number;
    num_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  } | null;
}

const SocialCalendarPage = ({
  calendarsList: initialCalendarsList = [],
  initialCalendarData,
  initialSelectedCalendarId,
  initialPagination = null,
}: SocialCalendarPageProps) => {
  const [calendarsList, setCalendarsList] = useState(
    [...initialCalendarsList].sort((a, b) => statusPriority[a.status] - statusPriority[b.status]),
  );

  const [showNewPostSheet, setShowNewPostSheet] = useState(false);
  const [showBulkPostSheet, setShowBulkPostSheet] = useState(false);
  const [showAllPostsPage, setShowAllPostsPage] = useState(false);
  const [showBulkSchedulePage, setShowBulkSchedulePage] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(
    initialSelectedCalendarId,
  );
  const [currentCalendarData, setCurrentCalendarData] = useState(initialCalendarData);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoadingMoreCalendars, setIsLoadingMoreCalendars] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const handleLoadMoreCalendars = useCallback(async () => {
    if (!pagination?.has_next || !pagination.next_page || isLoadingMoreCalendars) return;

    setIsLoadingMoreCalendars(true);
    try {
      const response = await getSocialMediaCalendars(undefined, pagination.next_page);
      if (response.status === 200 && response.data?.details?.message) {
        const message = response.data.details.message;
        let newCalendars: CalendarListItem[] = [];
        let newPagination: {
          count: number;
          num_pages: number;
          current_page: number;
          has_next: boolean;
          has_previous: boolean;
          next_page: number | null;
          previous_page: number | null;
        } | null = pagination;

        if (Array.isArray(message)) {
          newCalendars = message;
          newPagination = null;
        } else if (isPaginatedCalendarList(message)) {
          newCalendars = message.results || [];
          newPagination = {
            count: message.count,
            num_pages: message.num_pages,
            current_page: message.current_page,
            has_next: message.has_next,
            has_previous: message.has_previous,
            next_page: message.next_page,
            previous_page: message.previous_page,
          };
        }

        setCalendarsList(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const merged = [...prev];
          newCalendars.forEach(calendar => {
            if (!existingIds.has(calendar.id)) {
              merged.push(calendar);
            }
          });
          return merged.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
        });
        setPagination(newPagination);
      }
    } catch (error) {
      console.error("Error loading more calendars:", error);
      toast.error("Failed to load more calendars");
    } finally {
      setIsLoadingMoreCalendars(false);
    }
  }, [pagination, isLoadingMoreCalendars]);

  // Auto-load more calendars when scrolling to the end
  useEffect(() => {
    const tabsListElement = tabsListRef.current;
    if (!tabsListElement || !pagination?.has_next || isLoadingMoreCalendars) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListElement;
      // Load more when user is within 100px of the end
      if (scrollLeft + clientWidth >= scrollWidth - 100) {
        handleLoadMoreCalendars();
      }
    };

    tabsListElement.addEventListener("scroll", handleScroll);
    return () => {
      tabsListElement.removeEventListener("scroll", handleScroll);
    };
  }, [pagination?.has_next, isLoadingMoreCalendars, handleLoadMoreCalendars]);

  const queryClient = useQueryClient();

  // Handle calendar tab change
  const handleCalendarChange = async (calendarId: string) => {
    const id = parseInt(calendarId);
    if (id === selectedCalendarId) return;

    setIsLoadingCalendar(true);
    setSelectedCalendarId(id);

    try {
      const response = await getSocialMediaCalendars(id);

      if (response.status === 200 && response.data?.details?.message) {
        const apiData = response.data.details.message as {
          calendar?: { calendar: any[] };
          created_at: string;
          updated_at: string;
          status: "draft" | "completed" | "failed";
        };

        if (apiData.calendar?.calendar) {
          setCurrentCalendarData({
            calendar: apiData.calendar.calendar,
            created_at: apiData.created_at,
            updated_at: apiData.updated_at,
            status: apiData.status,
          });
        }
      } else {
        toast.error("Failed to load calendar data");
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
      toast.error("An error occurred while fetching calendar data");
    } finally {
      setIsLoadingCalendar(false);
    }
  };

  // Refresh current calendar data
  const refreshCalendarData = async () => {
    if (!selectedCalendarId) return;

    try {
      const response = await getSocialMediaCalendars(selectedCalendarId);

      if (response.status === 200 && response.data?.details?.message) {
        const apiData = response.data.details.message as {
          calendar?: { calendar: any[] };
          created_at: string;
          updated_at: string;
          status: "draft" | "completed" | "failed";
        };

        if (apiData.calendar?.calendar) {
          setCurrentCalendarData({
            calendar: apiData.calendar.calendar,
            created_at: apiData.created_at,
            updated_at: apiData.updated_at,
            status: apiData.status,
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing calendar:", error);
    }
  };

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async ({
      calendarId,
      updatedCalendar,
    }: {
      calendarId: number;
      updatedCalendar: Array<{
        date: string;
        content: string;
        platform: string;
        post_details: string;
      }>;
    }) => {
      const response = await updateSocialMediaCalendar(calendarId, { calendar: updatedCalendar });
      if (response.status !== 200) {
        throw new Error("Failed to create post");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      setShowNewPostSheet(false);
      // Refresh calendar data to show the new post
      refreshCalendarData();
      queryClient.invalidateQueries({ queryKey: ["social-media-calendars", selectedCalendarId] });
    },
    onError: error => {
      console.error("Error creating post:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while creating post");
    },
  });

  // Handle creating a new post from the main "New Post" button
  const handleCreatePostSubmit = (data: PostFormData) => {
    if (!selectedCalendarId || !currentCalendarData) {
      toast.error("Please select a calendar first");
      return;
    }

    // Add new post to calendar array
    const updatedCalendar = [
      ...currentCalendarData.calendar,
      {
        date: data.date,
        content: data.content,
        platform: data.platform,
        post_details: data.post_details,
      },
    ];

    createPostMutation.mutate({ calendarId: selectedCalendarId, updatedCalendar });
  };

  // Helper to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (showAllPostsPage)
    return (
      <AllPostsPage 
        calendarData={currentCalendarData} 
        calendarId={selectedCalendarId}
        onCalendarUpdate={refreshCalendarData}
        closeAllPostsPage={() => setShowAllPostsPage(false)} 
      />
    );
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
                        "hover:bg-white/70 dark:hover:bg-gray-700 hover:text-[#3072C0] text-[#3072C0]",
                        "text-xs sm:text-sm",
                        "dark:text-white cursor-pointer",
                      )}
                    >
                      <span className="text-[18px] dark:text-[#3072C0]">Export</span>
                      <DownArrow className="ms-1 w-6! h-6! dark:text-[#3072C0] text-[#3072C0]" />
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
                  className="p-6 px-8 text-[18px] hover:bg-[#3072C0]/10 font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowAnalytics(true)}
                >
                  <AnalyticsIcon className="h-6! w-6!" />
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
                  <CalenderIcon className="w-9! h-9! text-[#2BAE82]" />
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

        {/* Calendar Tabs */}
        {calendarsList.length > 0 && (
          <Tabs
            value={selectedCalendarId?.toString() || ""}
            onValueChange={handleCalendarChange}
            className="w-full bg-card rounded-xl"
          >
            <div className="flex items-center gap-2 w-full">
              <TabsList
                ref={tabsListRef}
                className="flex-1 justify-start overflow-x-auto flex-nowrap h-auto p-0 bg-card rounded-t-xl border-b border-border"
              >
                {calendarsList.map(calendar => (
                  <TabsTrigger
                    key={calendar.id}
                    value={calendar.id.toString()}
                    disabled={isLoadingCalendar}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200",
                      "border-b-2 border-transparent rounded-none",
                      "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD]",
                      "data-[state=active]:border-[#78A7DD]",
                      "hover:bg-card/50 hover:text-blue-500",
                      "text-gray-600",
                    )}
                  >
                    <span className="whitespace-nowrap">Calendar #{calendar.id}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                        getStatusBadgeClass(calendar.status),
                      )}
                    >
                      {calendar.status}
                    </span>
                  </TabsTrigger>
                ))}
                {isLoadingMoreCalendars && (
                  <div className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    Loading...
                  </div>
                )}
              </TabsList>
            </div>
          </Tabs>
        )}

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {analyticsCards.map((card: AnalyticsSummaryCardProps) => (
            <AnalyticsCard key={card.label} {...card} />
          ))}
        </div>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-3">
          {/* calendar view */}
          <div className="col-span-3">
            {isLoadingCalendar ? (
              <div className="bg-card rounded-2xl p-4 shadow-sm flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : (
              <Calendar
                setShowAllPostsPage={setShowAllPostsPage}
                calendarData={currentCalendarData}
                calendarId={selectedCalendarId}
                onCalendarUpdate={refreshCalendarData}
              />
            )}
          </div>

          {/* upcoming posts */}
          <div className="col-span-2 rounded-[16px]">
            <UpcomingPosts calendarData={currentCalendarData} />
          </div>
        </div>
      </div>
      <CreatePostSheet
        open={showNewPostSheet}
        onOpenChange={setShowNewPostSheet}
        onSubmit={handleCreatePostSubmit}
      />
      <BulkPostSheet open={showBulkPostSheet} onOpenChange={setShowBulkPostSheet} />
    </>
  );
};

export default SocialCalendarPage;
