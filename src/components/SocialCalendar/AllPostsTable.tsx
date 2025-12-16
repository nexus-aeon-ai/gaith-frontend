"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import CreatePostSheet, { type PostFormData } from "@/components/sheet/AiCalendar/NewPostSheet";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FbIcon from "@/components/ui/icons/social/fb";
import GoogleIcon from "@/components/ui/icons/social/google";
import IgIcon from "@/components/ui/icons/social/instagram";
import LkIcon from "@/components/ui/icons/social/linkedin";
import TiktokIcon from "@/components/ui/icons/social/tiktok";
import TwIcon from "@/components/ui/icons/social/twitterx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Post {
  id: number;
  platform: string;
  platformName: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: string;
  status: "Published" | "Failed" | "Scheduled" | "Draft";
  originalIndex?: number;
}

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

const StatusBadge = ({ status }: { status: Post["status"] }) => {
  const statusStyles = {
    Published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    Failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    Scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    Draft: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default function AllPostsTable({
  posts,
  calendarData,
  calendarId,
  onCalendarUpdate,
}: {
  posts: Post[];
  calendarData: CalendarData | null | undefined;
  calendarId: number | null;
  onCalendarUpdate?: () => void;
}) {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<(CalendarEntry & { index: number }) | null>(null);
  const queryClient = useQueryClient();

  // Save post mutation (create or update)
  const savePostMutation = useMutation({
    mutationFn: async ({
      calendarId,
      updatedCalendar,
    }: {
      calendarId: number;
      updatedCalendar: CalendarEntry[];
    }) => {
      const { updateSocialMediaCalendar } = await import("@/lib/api/reports");
      const response = await updateSocialMediaCalendar(calendarId, { calendar: updatedCalendar });
      if (response.status !== 200) {
        throw new Error("Failed to save post");
      }
      return response;
    },
    onSuccess: () => {
      toast.success(editingPost ? "Post updated successfully" : "Post duplicated successfully");
      setIsModalOpen(false);
      setEditingPost(null);
      onCalendarUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["social-media-calendars", calendarId] });
    },
    onError: error => {
      console.error("Error saving post:", error);
      toast.error(editingPost ? "Failed to update post" : "Failed to duplicate post");
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async ({
      calendarId,
      updatedCalendar,
    }: {
      calendarId: number;
      updatedCalendar: CalendarEntry[];
    }) => {
      const { updateSocialMediaCalendar } = await import("@/lib/api/reports");
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
    onError: error => {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting post");
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FbIcon />;
      case "instagram":
        return <IgIcon />;
      case "twitter":
        return <TwIcon />;
      case "linkedin":
        return <LkIcon />;
      case "google":
        return <GoogleIcon />;
      case "tiktok":
        return <TiktokIcon />;
      default:
        return null;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const handleEdit = (post: Post) => {
    if (!calendarData || post.originalIndex === undefined) return;

    const originalPost = calendarData.calendar[post.originalIndex];
    setEditingPost({
      date: originalPost.date,
      content: originalPost.content,
      platform: originalPost.platform,
      post_details: originalPost.post_details,
      index: post.originalIndex,
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = (post: Post) => {
    if (!calendarId || !calendarData || post.originalIndex === undefined) {
      toast.error("Cannot duplicate post");
      return;
    }

    const originalPost = calendarData.calendar[post.originalIndex];
    // Add duplicated post to calendar array
    const updatedCalendar = [
      ...calendarData.calendar,
      {
        date: originalPost.date,
        content: originalPost.content,
        platform: originalPost.platform,
        post_details: originalPost.post_details,
      },
    ];

    savePostMutation.mutate({ calendarId, updatedCalendar });
  };

  const handleDelete = (post: Post) => {
    if (!calendarId || !calendarData || post.originalIndex === undefined) {
      toast.error("Cannot delete post");
      return;
    }

    // Remove the post from calendar array
    const updatedCalendar = calendarData.calendar.filter((_, idx) => idx !== post.originalIndex);

    deletePostMutation.mutate({ calendarId, updatedCalendar });
  };

  const handleViewDetails = (post: Post) => {
    // Implement view details logic here
    console.log("View details for post:", post);
  };

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
          return {
            date: data.date,
            content: data.content,
            platform: data.platform,
            post_details: data.post_details,
          };
        }
        return entry;
      });
    } else {
      // This shouldn't happen in this flow, but handle it just in case
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

  const allSelected = selectedPosts.length === posts.length && posts.length > 0;

  return (
    <div className="w-full bg-white shadow-sm dark:bg-[#212945] rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="w-full overflow-x-auto">
        <Table className="table-fixed w-full min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700 ">
              <TableHead className="w-12">
                <CheckboxSquare checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white w-[120px]">
                Platform
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white w-[180px]">
                Content
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white w-[180px]">
                Scheduled Date
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white w-[120px]">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {posts.map(post => (
              <TableRow
                key={post.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
              >
                <TableCell>
                  <CheckboxSquare
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={checked => handleSelectPost(post.id, checked as boolean)}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 flex shrink-0 items-center justify-center">
                      {getPlatformIcon(post.platform)}
                    </div>

                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.platformName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="w-[180px]">
                  <div className="truncate">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {post.description}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {post.scheduledStart} - {post.scheduledEnd}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {post.duration}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(post)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(post)}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(post)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreatePostSheet
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSavePost}
        initialData={
          editingPost
            ? {
                date: editingPost.date,
                platform: editingPost.platform,
                content: editingPost.content,
                post_details: editingPost.post_details,
              }
            : undefined
        }
        defaultDate={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
}
