"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import DatedPostSheet from "@/components/sheet/AiCalendar/DatedPostsSheet";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  date: number;
  platforms: string[];
}

const PLATFORMS = {
  instagram: { color: "bg-pink-500", label: "Instagram" },
  x: { color: "bg-black", label: "X" },
  facebook: { color: "bg-blue-500", label: "Facebook" },
  googleAds: { color: "bg-cyan-500", label: "Google Ads" },
};

const EVENTS: CalendarEvent[] = [
  { date: 1, platforms: ["instagram", "x", "facebook", "googleAds"] },
  { date: 2, platforms: ["instagram", "x", "facebook", "googleAds"] },
  { date: 5, platforms: ["instagram", "x", "facebook", "googleAds"] },
  { date: 8, platforms: ["instagram"] },
  { date: 10, platforms: ["instagram", "x", "facebook"] },
  { date: 15, platforms: ["instagram", "x"] },
];

export default function Calendar({
  setShowAllPostsPage,
}: {
  setShowAllPostsPage: (arg: boolean) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPostsByDate, setShowPostsByDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

            return (
              <div
                key={index}
                className={`aspect-square p-3 border rounded-lg flex flex-col cursor-pointer hover:bg-accent justify-between transition-colors ${
                  highlight ? "border-blue-500 border-2 " : "border-gray-200 0"
                }`}
                role="button"
                onClick={() => {
                  setSelectedDate(new Date(d.year, d.month, d.day));
                  setShowPostsByDate(true);
                }}
                onKeyDown={() => {
                  setSelectedDate(new Date(d.year, d.month, d.day));
                  setShowPostsByDate(true);
                }}
                tabIndex={0}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{d.day}</span>
                  {highlight && <span className="text-xs font-semibold text-blue-600">Today</span>}
                </div>

                {/* Event Indicators */}
                {event && (
                  <div className="flex gap-1.5 flex-wrap">
                    {event.platforms.map(platform => (
                      <div
                        key={platform}
                        className={`w-2 h-2 rounded-full ${
                          PLATFORMS[platform as keyof typeof PLATFORMS].color
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-200">
          {Object.entries(PLATFORMS).map(([key, { color, label }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <DatedPostSheet
        day={selectedDate ? selectedDate.toISOString() : ""}
        open={showPostsByDate}
        onOpenChange={setShowPostsByDate}
      />
    </>
  );
}
