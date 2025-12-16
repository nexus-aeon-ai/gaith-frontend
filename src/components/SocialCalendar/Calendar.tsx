"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import DatedPostSheet from "@/components/sheet/AiCalendar/DatedPostsSheet";
import { Button } from "@/components/ui/button";

interface CalendarData {
  calendar: Array<{
    date: string;
    content: string;
    platform: string;
    post_details: string;
  }>;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
}

const PLATFORMS = {
  instagram: { color: "bg-pink-500", label: "Instagram" },
  x: { color: "bg-black", label: "X" },
  twitter: { color: "bg-black", label: "Twitter/X" },
  facebook: { color: "bg-blue-500", label: "Facebook" },
  googleAds: { color: "bg-cyan-500", label: "Google Ads" },
  linkedin: { color: "bg-blue-700", label: "LinkedIn" },
  tiktok: { color: "bg-gray-900", label: "TikTok" },
};

interface CalendarProps {
  setShowAllPostsPage: (arg: boolean) => void;
  calendarData?: CalendarData | null;
  calendarId?: number | null;
  onCalendarUpdate?: () => void;
}

export default function Calendar({
  setShowAllPostsPage,
  calendarData,
  calendarId,
  onCalendarUpdate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPostsByDate, setShowPostsByDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Convert API calendar data to events format
  const EVENTS = useMemo(() => {
    console.log(calendarData);
    if (!calendarData?.calendar || calendarData.calendar.length === 0) {
      return []; // Return empty array if no data
    }

    const eventsMap = new Map<number, Set<string>>();

    calendarData.calendar.forEach(entry => {
      try {
        console.log(entry);
        const entryDate = new Date(entry.date);
        const day = entryDate.getDate();
        const month = entryDate.getMonth();
        const year = entryDate.getFullYear();

        // Only include events from the current month/year
        if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
          if (!eventsMap.has(day)) {
            eventsMap.set(day, new Set());
          }
          const platformKey = entry.platform.toLowerCase().replace(/\s+/g, "");
          eventsMap.get(day)?.add(platformKey);
        }
      } catch (error) {
        console.error("Error parsing date:", entry.date, error);
      }
    });

    return Array.from(eventsMap.entries()).map(([date, platforms]) => ({
      date,
      platforms: Array.from(platforms),
    }));
  }, [calendarData, currentDate]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const today = new Date();

  type DayCell = { day: number; month: number; year: number };
  const days: DayCell[] = [];

  // Previous month
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const prevMonthDays = getDaysInMonth(prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: prevMonth.getMonth(),
      year: prevMonth.getFullYear(),
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    });
  }

  // Next month
  const remainingDays = 42 - days.length;
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      month: nextMonth.getMonth(),
      year: nextMonth.getFullYear(),
    });
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonthHandler = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (d: DayCell) =>
    d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();

  return (
    <>
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold ">Calendar View</h1>
          <Button
            variant={"ghost"}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            onClick={() => setShowAllPostsPage(true)}
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold ">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={nextMonthHandler}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px mb-8">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-4">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((d, index) => {
            const currentMonth = d.month === currentDate.getMonth();
            const highlight = isToday(d);
            const event = currentMonth && EVENTS.find(e => e.date === d.day);
            const hasEvent = event && event.platforms.length > 0;

            return (
              <div
                key={index}
                className={`aspect-square p-3 border rounded-lg flex flex-col cursor-pointer hover:bg-accent transition-colors ${
                  highlight ? "border-blue-500 border-2 " : "border-border"
                } ${!currentMonth ? "opacity-40" : ""} ${hasEvent ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                role="button"
                onClick={() => {
                  if (hasEvent) {
                    const dayString = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
                    setSelectedDate(dayString);
                    console.log("Selected date:", d);
                    setShowPostsByDate(true);
                  }
                }}
                onKeyDown={() => {
                  if (hasEvent) {
                    const dayString = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
                    setSelectedDate(dayString);
                    setShowPostsByDate(true);
                  }
                }}
                tabIndex={hasEvent ? 0 : -1}
              >
                <div className="flex flex-col items-start">
                  <span
                    className={`text-sm font-medium ${hasEvent ? "font-bold text-blue-600 dark:text-blue-400" : ""}`}
                  >
                    {d.day}
                  </span>
                {highlight && <p className="text-xs font-semibold mb-1 text-blue-600">Today</p>}
                </div>

                {/* Event Indicators */}
                {hasEvent && (
                  <div className="flex gap-1 flex-wrap">
                    {event.platforms.map((platform, idx) => {
                      const platformConfig = PLATFORMS[platform as keyof typeof PLATFORMS];
                      return platformConfig ? (
                        <div
                          key={`${platform}-${idx}`}
                          className={`w-2 h-2 rounded-full ${platformConfig.color}`}
                          title={platformConfig.label}
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend - Only show platforms that have posts */}
        {EVENTS.length > 0 && (
          <div className="flex items-center justify-center gap-6 pt-6 border-t border-border">
            {Object.entries(PLATFORMS)
              .filter(([key]) => EVENTS.some(event => event.platforms.includes(key)))
              .map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
          </div>
        )}

        {/* No posts message */}
        {EVENTS.length === 0 && (
          <div className="flex items-center justify-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              No scheduled posts for this month. Create your first post to get started!
            </p>
          </div>
        )}
      </div>
      <DatedPostSheet
        day={selectedDate}
        open={showPostsByDate}
        onOpenChange={setShowPostsByDate}
        calendarData={calendarData}
        calendarId={calendarId}
        onCalendarUpdate={onCalendarUpdate}
      />
    </>
  );
}
