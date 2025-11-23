"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlogPostViewData {
  title: string;
  content: string;
  keywords: string[];
  reference_links?: string[];
}

interface ViewBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogPostData: BlogPostViewData | null;
  isLoading?: boolean;
}

export default function ViewBlogPostModal({
  open,
  onOpenChange,
  blogPostData,
  isLoading = false,
}: ViewBlogPostModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">View Blog Post</DialogTitle>
          <DialogDescription>View the blog post details below.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : blogPostData ? (
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] px-4 py-3 text-foreground">
                {blogPostData.title}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] px-4 py-3 min-h-[200px] text-foreground whitespace-pre-wrap">
                {blogPostData.content}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] px-4 py-3">
                {blogPostData.keywords && blogPostData.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {blogPostData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No keywords</span>
                )}
              </div>
            </div>

            {/* Reference Links */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Links</label>
              <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] px-4 py-3">
                {blogPostData.reference_links && blogPostData.reference_links.length > 0 ? (
                  <div className="space-y-2">
                    {blogPostData.reference_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No reference links</span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No blog post data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

