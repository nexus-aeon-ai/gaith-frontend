"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import CreatePostSheet, { type PostFormData } from "@/components/sheet/AiCalendar/NewPostSheet";
import { Button } from "@/components/ui/button";
import { CalenderIcon } from "@/components/ui/icons/analytics/calender-nobg";
import DeleteIcon from "@/components/ui/icons/options/delete-icon-v2";
import EditIcon from "@/components/ui/icons/options/edit-icon-v2";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import TikTok from "@/components/ui/icons/social/tiktok";
import XIcon from "@/components/ui/icons/social/twitterx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { updateSocialMediaCalendar } from "@/lib/api/reports";

interface CalendarEntry {
  date: string;
  content: string;
  platform: string;
  post_details: string;
}

interface DatedPostSheetProps {
  day: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarData?: {
    calendar: CalendarEntry[];
    created_at: string;
    updated_at: string;
    status: "draft" | "completed" | "failed";
  } | null;
  calendarId?: number | null;
  onCalendarUpdate?: () => void;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const platformLower = platform.toLowerCase();
  
  if (platformLower === "facebook") return <Facebook />;
  if (platformLower === "instagram") return <Instagram />;
  if (platformLower === "x" || platformLower === "twitter") return <XIcon />;
  if (platformLower === "tiktok") return <TikTok />;
  if (platformLower === "linkedin") return <Linkedin />;
  
  return <XIcon />; // Default icon
};

export default function DatedPostSheet({ 
  day, 
  open, 
  onOpenChange, 
  calendarData, 
  calendarId,
  onCalendarUpdate 
}: DatedPostSheetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<(CalendarEntry & { index: number }) | null>(null);
  const [scheduleOnly, setScheduleOnly] = useState(false);
  const queryClient = useQueryClient();

  const date = new Date(day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  console.log("Rendering DatedPostsSheet for date:", day);

  // Filter posts for the selected date
  const postsForDate = useMemo(() => {
    if (!calendarData?.calendar || calendarData.calendar.length === 0) {
      return [];
    }

    const selectedDate = new Date(day);
    selectedDate.setHours(0, 0, 0, 0);

    return calendarData.calendar
      .map((entry, index) => {
        try {
          const postDate = new Date(entry.date);
          postDate.setHours(0, 0, 0, 0);
          
          if (postDate.getTime() === selectedDate.getTime()) {
            return {
              ...entry,
              originalIndex: index,
              id: `${entry.date}-${index}`,
            };
          }
          return null;
        } catch (e) {
          console.error("Error parsing date:", entry.date, e);
          return null;
        }
      })
      .filter((post) => post !== null);
  }, [day, calendarData]);

  const handleEdit = (post: any) => {
    setEditingPost({
      date: post.date,
      content: post.content,
      platform: post.platform,
      post_details: post.post_details,
      index: post.originalIndex,
    });
    setScheduleOnly(false);
    setIsModalOpen(true);
  };

  const handleSchedule = (post: any) => {
    setEditingPost({
      date: post.date,
      content: post.content,
      platform: post.platform,
      post_details: post.post_details,
      index: post.originalIndex,
    });
    setScheduleOnly(true);
    setIsModalOpen(true);
  };

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async ({ calendarId, updatedCalendar }: { calendarId: number; updatedCalendar: CalendarEntry[] }) => {
      const response = await updateSocialMediaCalendar(calendarId, { calendar: updatedCalendar });
      if (response.status !== 200) {
        throw new Error("Failed to delete post");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      onCalendarUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["social-media-calendars", calendarId] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting post");
    },
  });

  const handleDelete = (post: any) => {
    if (!calendarId || !calendarData) {
      toast.error("Calendar ID not available");
      return;
    }

    // Remove the post from calendar array
    const updatedCalendar = calendarData.calendar.filter((_, idx) => idx !== post.originalIndex);
    
    deletePostMutation.mutate({ calendarId, updatedCalendar });
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  // Save post mutation (create or update)
  const savePostMutation = useMutation({
    mutationFn: async ({ calendarId, updatedCalendar }: { calendarId: number; updatedCalendar: CalendarEntry[] }) => {
      const response = await updateSocialMediaCalendar(calendarId, { calendar: updatedCalendar });
      if (response.status !== 200) {
        throw new Error("Failed to save post");
      }
      return response;
    },
    onSuccess: () => {
      toast.success(editingPost ? "Post updated successfully" : "Post created successfully");
      setIsModalOpen(false);
      setEditingPost(null);
      onCalendarUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["social-media-calendars", calendarId] });
    },
    onError: (error) => {
      console.error("Error saving post:", error);
      toast.error(editingPost ? "Failed to update post" : "Failed to create post");
    },
  });

  const handleSavePost = (data: PostFormData) => {
    if (!calendarId || !calendarData) {
      toast.error("Calendar ID not available");
      return;
    }

    let updatedCalendar: CalendarEntry[];
    if (editingPost !== null) {
      // Edit existing post
      updatedCalendar = calendarData.calendar.map((entry, idx) => {
        if (idx === editingPost.index) {
          if (scheduleOnly) {
            // Only update date and scheduleTime, keep other fields unchanged
            return {
              ...entry,
              date: data.date,
              // Optionally, if you want to store scheduleTime separately, add it here
            };
          } else {
            return {
              date: data.date,
              content: data.content,
              platform: data.platform,
              post_details: data.post_details,
            };
          }
        }
        return entry;
      });
    } else {
      // Add new post
      updatedCalendar = [
        ...calendarData.calendar,
        {
          date: data.date,
          content: data.content,
          platform: data.platform,
          post_details: data.post_details,
        },
      ];
    }

    savePostMutation.mutate({ calendarId, updatedCalendar });
  };

  const truncateContent = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="dark:bg-[#212945] h-full font-inter bg-white w-auto sm:min-w-[640px] rounded-l-[16px] overflow-x-hidden p-0 flex flex-col">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b flex-shrink-0">
            <SheetTitle className="text-lg font-semibold">Posts for {date}</SheetTitle>
          </SheetHeader>

          {/* Posts List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {postsForDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No posts scheduled for this date
              </div>
            ) : (
              postsForDate.map((post) => (
                <div key={post!.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex md:flex-row flex-col lg:items-center items-start justify-between ">
                    {/* Post Header */}
                    <div className="flex items-start gap-3">
                      <PlatformIcon platform={post!.platform} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {post!.platform} Post
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {truncateContent(post!.content, 80)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Scheduled
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(post!.date).toLocaleDateString("en-US")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        disabled={savePostMutation.isPending || deletePostMutation.isPending}
                        className="cursor-pointer flex-1 text-blue-600 hover:text-blue-600 bg-transparent border-blue-600 hover:bg-transparent rounded-lg"
                      >
                        <EditIcon className="w-4 h-4 mr-1" fill="#3072C0" />
                        Edit
                      </Button>
                      {/* Schedule button commented out as per requirements */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSchedule(post)}
                        className="cursor-pointer flex-1 text-emerald-600 hover:text-emerald-600 bg-transparent border-emerald-600 hover:bg-transparent rounded-lg"
                      >
                        <CalenderIcon className="w-6! h-6!"/>
                        Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post)}
                        disabled={savePostMutation.isPending || deletePostMutation.isPending}
                        className="cursor-pointer flex-1 text-red-600 hover:text-red-600 border-red-600 bg-transparent hover:bg-transparent rounded-lg"
                      >
                        <DeleteIcon className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="bg-white border-l-3 border-l-blue-500 rounded-sm dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {post!.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
            <div className="flex gap-3 w-full justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {postsForDate.length} {postsForDate.length === 1 ? "post" : "posts"} scheduled for this day
              </p>
              <Button
                onClick={handleAddNew}
                disabled={savePostMutation.isPending || deletePostMutation.isPending}
                variant={"outline"}
                className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle/>
                Add New Post
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CreatePostSheet
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSavePost}
        initialData={editingPost ? {
          date: editingPost.date,
          platform: editingPost.platform,
          content: editingPost.content,
          post_details: editingPost.post_details,
        } : undefined}
        defaultDate={day.split('T')[0]}
        scheduleOnly={scheduleOnly}
      />
    </>
  );
}
