"use client";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import DeleteIcon from "@/components/ui/icons/options/delete-icon-v2";
import EditIcon from "@/components/ui/icons/options/edit-icon-v2";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import XIcon from "@/components/ui/icons/social/twitterx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface DatedPostSheetProps {
  day: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface Post {
  id: number;
  platform: "facebook" | "instagram" | "x";
  title: string;
  description: string;
  status: string;
  datetime: string;
  content: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    platform: "facebook",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 2,
    platform: "facebook",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 3,
    platform: "instagram",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 4,
    platform: "x",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 5,
    platform: "instagram",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 6,
    platform: "x",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
  {
    id: 7,
    platform: "x",
    title: "Industry Insights Article",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    datetime: "Dec 28, 2024 at 3:00 PM",
    content: "Showcase satisfied customers and reviews",
  },
];

const PlatformIcon = ({ platform }: { platform: "facebook" | "instagram" | "x" }) => {
  const icons = {
    facebook: <Facebook />,
    instagram: <Instagram />,
    x: <XIcon />,
  };

  return <div className="w-5 h-5 flex items-center justify-center">{icons[platform]}</div>;
};

export default function DatedPostSheet({ day, open, onOpenChange }: DatedPostSheetProps) {
  const date = new Date(day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleEdit = (postId: number) => {
    console.log("Edit post:", postId);
  };

  const handleSchedule = (postId: number) => {
    console.log("Schedule post:", postId);
  };

  const handleDelete = (postId: number) => {
    console.log("Delete post:", postId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] h-full font-inter bg-white w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden p-0">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <SheetTitle className="text-lg font-semibold">Posts for {date}</SheetTitle>
        </SheetHeader>

        {/* Posts List */}
        <div className="p-4 space-y-3 pb-32">
          {mockPosts.map(post => (
            <div key={post.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex md:flex-row flex-col lg:items-center items-start justify-between ">
                {/* Post Header */}
                <div className="flex items-start gap-3">
                  <PlatformIcon platform={post.platform} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {post.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.datetime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post.id)}
                    className="cursor-pointer flex-1 text-blue-600 hover:text-blue-600 bg-transparent border-blue-600 hover:bg-transparent  rounded-lg"
                  >
                    <EditIcon className="w-4 h-4 mr-1" fill="#3072C0" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSchedule(post.id)}
                    className="cursor-pointer flex-1 text-emerald-600 hover:text-emerald-600 bg-transparent border-emerald-600 hover:bg-transparent  rounded-lg"
                  >
                    <CalendarIcon className="!w-4 !h-4" fill="#2BAE82" />
                    Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="cursor-pointer flex-1 text-red-600 hover:text-red-600 border-red-600 bg-transparent hover:bg-transparent rounded-lg"
                  >
                    <DeleteIcon className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="bg-white border-l-3 border-l-blue-500 rounded-sm dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">{post.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
          <div className="flex gap-3 w-full justify-between items-center">
            <p className="text-sm text-muted-foreground">3 posts scheduled for this day</p>
            <Button
              // type="submit"
              // form="aidata-form"
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
  );
}
