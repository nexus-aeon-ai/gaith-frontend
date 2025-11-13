import React from "react";

import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import XIcon from "@/components/ui/icons/social/twitterx";

const posts = [
  {
    id: 1,
    platform: "facebook",
    title: "Facebook Post - Customer Testimonials",
    description: "Showcase satisfied customers and reviews",
    status: "Scheduled",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
  {
    id: 2,
    platform: "x",
    title: "X Thread - Sale Highlights",
    description: "Last chance messaging and top deals",
    status: "Draft",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
  {
    id: 3,
    platform: "instagram",
    title: "Instagram Story - Flash Sale Alert",
    description: "Final 48-hour countdown promotion",
    status: "Scheduled",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
  {
    id: 4,
    platform: "instagram",
    title: "Instagram Story - Flash Sale Alert",
    description: "Final 48-hour countdown promotion",
    status: "Scheduled",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
  {
    id: 5,
    platform: "facebook",
    title: "Facebook Post - Customer Testimonials",
    description: "Showcase satisfied customers and reviews",
    status: "Published",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
  {
    id: 6,
    platform: "x",
    title: "X Thread - Sale Highlights",
    description: "Last chance messaging and top deals",
    status: "Draft",
    date: "Dec 28, 2024",
    time: "at 3:00 PM",
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  
  switch (platform) {
    case "facebook":
      return <Facebook />;
    case "instagram":
      return <Instagram />;
    case "x":
      return <XIcon />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Scheduled":
        return "text-blue-600";
      case "Draft":
        return "text-gray-500";
      case "Published":
        return "text-emerald-600";
      default:
        return "text-muted-foreground";
    }
  };

  return <div className={`font-semibold ${getStatusColor()}`}>{status}</div>;
};

export default function UpcomingPosts() {
  return (
    <div className="bg-white border  dark:bg-card rounded-[16px] overflow-hidden">
      <div className=" mx-auto">
        <div className=" shadow-sm p-3">
          <h1 className="text-lg font-bold  mb-6">Upcoming Posts</h1>

          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex gap-4">
                <PlatformIcon platform={post.platform} />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold  text-sm mb-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <StatusBadge status={post.status} />
                  <div className="text-xs text-muted-foreground mt-1">{post.date}</div>
                  <div className="text-xs text-muted-foreground">{post.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
