"use client";

import { ChevronRight, Copy, Home } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import SendIcon from "@/components/ui/icons/analytics/send2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BlogPreviewPageProps {
  blogPostData: {
    title: string;
    content: string;
    keywords?: string[];
    reference_links?: string[];
  } | null;
  isLoading?: boolean;
  onBack: () => void;
  onPublish: () => void;
}

export default function BlogPreviewPage({
  blogPostData,
  isLoading = false,
  onBack,
  onPublish,
}: BlogPreviewPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const urlToCopy = blogPostData?.reference_links?.[0] || "";
    if (urlToCopy) {
      try {
        await navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        toast.success("URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy URL");
      }
    }
  };

  if (!blogPostData) {
    return (
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        <div className="text-center py-8 text-muted-foreground">No blog post data to display</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 font-inter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <button
          onClick={onBack}
          className="text-[#3072C0]  hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          Blogs & Articles
        </button>
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-[#3072C0]">Generated Content Ideas</span>
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Blog Preview</span>
      </div>

      {/* Header with Title and Publish Button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">
            {blogPostData.title || "Blog Preview"}
          </h1>
          <span className="text-[12px] text-muted-foreground">
            Review and publish your generated blog post
          </span>
        </div>
        <Button
          onClick={onPublish}
          disabled={isLoading}
          className="h-auto p-4 text-[18px] font-normal py-3 bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px] whitespace-nowrap"
        >
            <SendIcon className="w-6! h-6!"/>
          {isLoading ? "Publishing..." : "Publish"}
        </Button>
      </div>

      {/* Blog Title Card */}
      <div className="bg-card rounded-lg overflow-hidden border border-border p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="blog-title" className="text-sm font-medium text-foreground">
              Blog Title
            </label>
            <Input
              id="blog-title"
              value={blogPostData.title || ""}
              readOnly
              className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] mt-2 text-foreground shadow-none"
            />
            <div className="flex items-center justify-between mt-2 text-[14px] text-muted-foreground">
                <p className="">SEO-Optimized title length </p>
                <span className="text-sm text-muted-foreground">({blogPostData.title.length} characters)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Links Card */}
      {blogPostData.reference_links && blogPostData.reference_links.length > 0 && (
        <div className="bg-card rounded-lg overflow-hidden border border-border p-6">
          <div className="space-y-4">
            <label htmlFor="live-url" className="text-sm font-medium text-foreground">
              Live URL
            </label>
            <div className="relative flex items-center gap-2 dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] p-2 px-4 mt-2 text-foreground shadow-none">
              <a
                id="live-url"
                href={blogPostData.reference_links[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-[#3072C0] hover:underline break-all text-sm"
              >
                {blogPostData.reference_links[0]}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUrl}
                className={cn(
                  "flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700",
                  copied && "bg-green-100 dark:bg-green-900/30",
                )}
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Card */}
      <div className="bg-card rounded-lg overflow-hidden border border-border p-6">
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">
            Content
          </p>
          <Textarea
            id="blog-content"
            value={blogPostData.content || ""}
            readOnly
            className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] min-h-[300px] resize-none text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
