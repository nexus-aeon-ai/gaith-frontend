"use client";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Fb from "@/components/ui/icons/social/fb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Post {
  id: number;
  platform: "facebook" | "instagram" | "x";
  platformName: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: string;
  status: "Published" | "Failed" | "Scheduled" | "Draft";
}

const mockPosts: Post[] = [
  {
    id: 1,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 2,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 3,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 4,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 5,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 6,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Published",
  },
  {
    id: 7,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Failed",
  },
  {
    id: 8,
    platform: "facebook",
    platformName: "Facebook",
    title: "Product Launch Announcement",
    description: "Excited to announce our latest prod...",
    scheduledStart: "Dec 20",
    scheduledEnd: "Jan 15",
    duration: "26 days",
    status: "Scheduled",
  },
];

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

export default function AllPostsTable() {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(mockPosts.map(post => post.id));
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

  const handleAction = (action: string, postId: number) => {
    console.log(`${action} post:`, postId);
  };

  const allSelected = selectedPosts.length === mockPosts.length && mockPosts.length > 0;

  return (
    <div className="w-full bg-white shadow-sm dark:bg-[#212945] rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="w-full overflow-x-auto">
        <Table className="table-fixed w-full min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
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
            {mockPosts.map(post => (
              <TableRow
                key={post.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={checked => handleSelectPost(post.id, checked as boolean)}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Fb />
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
                      <DropdownMenuItem onClick={() => handleAction("Edit", post.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Duplicate", post.id)}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("View Details", post.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("Delete", post.id)}
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
    </div>
  );
}
