import React, { useMemo } from "react";

import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import TikTok from "@/components/ui/icons/social/tiktok";
import XIcon from "@/components/ui/icons/social/twitterx";

interface CalendarEntry {
  date: string;
  content: string;
  platform: string;
  post_details: string;
}

interface UpcomingPostsProps {
  calendarData?: {
    calendar: CalendarEntry[];
    created_at: string;
    updated_at: string;
    status: "draft" | "completed" | "failed";
  } | null;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const platformLower = platform.toLowerCase();
  console.log("platform in platformIcon:", platform);

  
  switch (platformLower) {
    case "facebook":
      return <Facebook />;
    case "instagram":
      return <Instagram />;
    case "x":
    case "twitter":
      return <XIcon />;
    case "tiktok":
      return <TikTok />;
    case "linkedin":
      return <Linkedin />;
    default:
      return null;
  }
};

export default function UpcomingPosts({ calendarData }: UpcomingPostsProps) {
  // Get upcoming posts sorted by date
  const upcomingPosts = useMemo(() => {
    if (!calendarData?.calendar || calendarData.calendar.length === 0) {
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter posts from today onwards and sort by date
    const filtered = calendarData.calendar
      .map((entry, index) => {
        try {
          const postDate = new Date(entry.date);
          return {
            id: `${entry.date}-${index}`,
            date: postDate,
            dateStr: entry.date,
            platform: entry.platform,
            content: entry.content,
            post_details: entry.post_details,
          };
        } catch (_e) {
          console.error("Error parsing date:", entry.date, _e);
          return null;
        }
      })
      .filter((post) => post !== null && post.date >= today)
      .sort((a, b) => a!.date.getTime() - b!.date.getTime())
      .slice(0, 6); // Show up to 6 upcoming posts

    return filtered;
  }, [calendarData]);

  console.log("upcomingPosts:", upcomingPosts);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const truncateContent = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white border dark:bg-card rounded-[16px] overflow-hidden">
      <div className="mx-auto">
        <div className="shadow-sm p-3">
          <h1 className="text-lg font-bold mb-6">Upcoming Posts</h1>

          {upcomingPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming posts scheduled
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingPosts.map((post) => (
                <div
                  key={post!.id}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex gap-4"
                >
                  <PlatformIcon platform={post!.platform} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {post!.platform} Post
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {truncateContent(post!.content)}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-blue-600">Scheduled</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(post!.dateStr)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
