"use client";

import { Heart, Share2, MessageCircle, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Fb from "@/components/ui/icons/social/fb";
import Insta from "@/components/ui/icons/social/instagram";
import { Separator } from "@/components/ui/separator";

// X Platform Icon Component
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Threads Icon Component
const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12.186 3.5c-3.826 0-6.186 2.058-6.186 5.395 0 1.096.287 2.105.832 2.935.088.133.18.26.276.38L5.84 14.5c-.375.566-.224 1.329.339 1.704.563.375 1.326.224 1.701-.339l1.142-1.713c.91.582 1.989.923 3.164.923 3.826 0 6.186-2.058 6.186-5.395S16.012 3.5 12.186 3.5zm0 1.5c2.897 0 4.686 1.558 4.686 3.895 0 2.337-1.789 3.895-4.686 3.895-.897 0-1.732-.198-2.445-.553l-.244-.122-.244.366-1.142 1.713c-.094.141-.28.179-.421.085-.141-.094-.179-.28-.085-.421l1.267-1.901.122-.183-.122-.183c-.566-.848-.868-1.813-.868-2.796 0-2.337 1.789-3.895 4.686-3.895z" />
  </svg>
);

interface Post {
  id: number;
  platform: "instagram" | "x" | "threads" | "facebook";
  title: string;
  description: string;
  image: string;
  likes: string;
  shares: string;
  comments: string;
  reach: string;
  engagement: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    platform: "instagram",
    title: "Product Innovation Launch",
    description:
      "Introducing our revolutionary new product that combines cutting-edge technology with user-friendly design...",
    image: "/placeholder-image.jpg",
    likes: "1,247",
    shares: "89",
    comments: "156",
    reach: "12.4K",
    engagement: "18%",
  },
  {
    id: 2,
    platform: "x",
    title: "Product Innovation Launch",
    description:
      "Introducing our revolutionary new product that combines cutting-edge technology with user-friendly design...",
    image: "/placeholder-image.jpg",
    likes: "1,247",
    shares: "89",
    comments: "156",
    reach: "12.4K",
    engagement: "18%",
  },
  {
    id: 3,
    platform: "threads",
    title: "Product Innovation Launch",
    description:
      "Introducing our revolutionary new product that combines cutting-edge technology with user-friendly design...",
    image: "/placeholder-image.jpg",
    likes: "1,247",
    shares: "89",
    comments: "156",
    reach: "12.4K",
    engagement: "18%",
  },
  {
    id: 4,
    platform: "facebook",
    title: "Product Innovation Launch",
    description:
      "Introducing our revolutionary new product that combines cutting-edge technology with user-friendly design...",
    image: "/placeholder-image.jpg",
    likes: "1,247",
    shares: "89",
    comments: "156",
    reach: "12.4K",
    engagement: "18%",
  },
];

const PlatformIcon = ({ platform }: { platform: Post["platform"] }) => {
  const icons = {
    instagram: <Insta />,
    x: <XIcon />,
    threads: <ThreadsIcon />,
    facebook: <Fb />,
  };

  return <div className="w-6 h-6 flex items-center justify-center">{icons[platform]}</div>;
};

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Post Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-12 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>

      {/* Post Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          <PlatformIcon platform={post.platform} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{post.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {post.description}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-3">
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span>{post.likes} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>{post.shares} shares</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{post.comments} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.reach} reach</span>
          </div>
        </div>
      </div>

      {/* Engagement Percentage */}
      <div className="flex flex-col items-end justify-center flex-shrink-0">
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {post.engagement}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Engagement</div>
      </div>
    </div>
  );
};

export default function TopPerformingPosts() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between p-2">
          <CardTitle className="text-md font-bold">Top Performing Posts</CardTitle>
        </div>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="space-y-3">
          {mockPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
