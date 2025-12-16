"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

import BlogPreviewPage from "@/components/BlogArticles/BlogPreviewPage";
import EditBlogPostModal, {
  type BlogPostFormData,
} from "@/components/BlogArticles/EditBlogPostModal";
import GenerateBlogIdeasPage from "@/components/BlogArticles/GenerateBlogIdeasPage";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeftArrow from "@/components/ui/icons/left-arrow";
import MagicWandIcon from "@/components/ui/icons/magicwand";
import RightArrow from "@/components/ui/icons/right-arrow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  generateBlog,
  publishBlog,
  getBlogPost,
  updateBlogPost,
  BlogPostListItem,
} from "@/lib/api/reports";
import { cn } from "@/lib/utils";

interface BlogArticlesPageProps {
  initialArticles?: BlogPostListItem[];
  pagination?: {
    count: number;
    num_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

const BlogArticlesPage = ({ initialArticles = [], pagination }: BlogArticlesPageProps) => {
  const [articles, setArticles] = useState<BlogPostListItem[]>(initialArticles);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [pageView, setPageView] = useState<"list" | "generate" | "preview">("list");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [editingArticleData, setEditingArticleData] = useState<BlogPostFormData | null>(null);
  const [viewingArticleData, setViewingArticleData] = useState<BlogPostFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = pagination?.current_page || 1;
  const totalPages = pagination?.num_pages || 1;
  const queryClient = useQueryClient();

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    setSelectedArticles(prev =>
      checked ? [...prev, articleId] : prev.filter(id => id !== articleId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(articles.map(a => a.id.toString()));
    } else {
      setSelectedArticles([]);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-[#DCE0E4] text-[#687192] dark:bg-gray-800 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "published":
        return "bg-[#2BAE8214] text-[#175E46] dark:bg-red-900/30 dark:text-red-400";
      case "scheduled":
        return "bg-[#3072C014] text-[#3072C0] dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Fetch single blog post mutation for editing
  const fetchBlogPostMutation = useMutation({
    mutationFn: async (blog_post_id: number) => {
      const response = await getBlogPost(blog_post_id);
      if (response.status !== 200 || !response.data?.details?.message) {
        throw new Error("Failed to fetch blog post");
      }
      return response.data.details.message;
    },
    onSuccess: data => {
      setEditingArticleData({
        title: data.blog_post.title,
        content: data.blog_post.content,
        keywords: data.blog_post.keywords,
        reference_links: data.blog_post.reference_links ?? [],
      });
      setShowEditModal(true);
    },
    onError: error => {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to fetch blog post details");
    },
  });

  // Fetch single blog post mutation for viewing
  const fetchBlogPostForViewMutation = useMutation({
    mutationFn: async (blog_post_id: number) => {
      const response = await getBlogPost(blog_post_id);
      if (response.status !== 200 || !response.data?.details?.message) {
        throw new Error("Failed to fetch blog post");
      }
      return response.data.details.message;
    },
    onSuccess: data => {
      setViewingArticleData({
        title: data.blog_post.title,
        content: data.blog_post.content,
        keywords: data.blog_post.keywords,
        reference_links: data.blog_post.reference_links ?? [],
      });
      setPageView("preview");
    },
    onError: error => {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to fetch blog post details");
    },
  });

  // Update blog post mutation
  const updateBlogPostMutation = useMutation({
    mutationFn: async ({
      blog_post_id,
      blog_post_data,
    }: {
      blog_post_id: number;
      blog_post_data: BlogPostFormData;
    }) => {
      const response = await updateBlogPost(blog_post_id, blog_post_data);
      if (response.status !== 200) {
        throw new Error("Failed to update blog post");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
      setShowEditModal(false);
      setEditingArticleId(null);
      setEditingArticleData(null);
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      // Refresh the page to get updated data
      window.location.reload();
    },
    onError: error => {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
    },
  });

  const handleGenerate = async (data: {
    postContent?: string;
    platform: string;
    topic: string;
    company_website: string;
    clientId?: string;
  }) => {
    try {
      setIsGenerating(true);
      const response = await generateBlog({
        platform: data.platform,
        topic: data.topic,
        company_website: data.company_website,
        clientId: data.clientId,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Blog article generation started successfully!");
        setPageView("list");
        // Refresh the page to get updated data
        window.location.reload();
      } else {
        toast.error("Failed to generate blog article");
      }
    } catch (error) {
      console.error("Error generating blog:", error);
      toast.error("An error occurred while generating the blog article");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (article: BlogPostListItem) => {
    setEditingArticleId(article.id);
    fetchBlogPostMutation.mutate(article.id);
  };

  const handleView = (article: BlogPostListItem) => {
    setEditingArticleId(article.id);
    fetchBlogPostForViewMutation.mutate(article.id);
  };

  const handlePublish = async (article: BlogPostListItem) => {
    console.log("article to publish:", article);
    try {
      // Fetch the full blog post data first
      const blogRes = await getBlogPost(article.id);
      if (blogRes.status !== 200 || !blogRes.data?.details?.message?.blog_post) {
        toast.error("Failed to fetch blog post details for publishing");
        return;
      }
      const blogData = blogRes.data.details.message.blog_post;
      // Show preview page
      setEditingArticleId(article.id);
      setViewingArticleData({
        title: blogData.title,
        content: blogData.content,
        keywords: blogData.keywords,
        reference_links: blogData.reference_links ?? [],
      });
      setPageView("preview");
    } catch (error) {
      console.error("Error preparing blog for publish:", error);
      toast.error("Failed to prepare blog for publishing");
    }
  };

  const handlePreviewPublish = async () => {
    if (!viewingArticleData) {
      toast.error("No blog post data available");
      return;
    }

    try {
      setIsGenerating(true);
      // Find the article being published
      const article = articles.find(a => a.id === editingArticleId);
      if (!article) {
        toast.error("Article not found");
        return;
      }

      const response = await publishBlog(article.id, {
        title: viewingArticleData.title,
        content: viewingArticleData.content,
        keywords: viewingArticleData.keywords,
        reference_links: viewingArticleData.reference_links ?? [],
        status: "published",
      });

      if (response.status === 200 || response.status === 204) {
        // Update status to completed
        const updatedArticles = articles.map(a =>
          a.id === article.id ? { ...a, status: "completed" as const } : a,
        );
        setArticles(updatedArticles);
        toast.success("Blog article published successfully!");
        queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
        setPageView("list");
        setViewingArticleData(null);
      } else {
        toast.error("Failed to publish blog article");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("Failed to publish blog article");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (articleId: number) => {
    setArticles(articles.filter(a => a.id !== articleId));
    toast.success("Blog article deleted successfully!");
  };

  const handleUpdate = (data: BlogPostFormData) => {
    if (editingArticleId === null) {
      toast.error("No article selected for editing");
      return;
    }
    const blogPostData = {
      title: data.title,
      content: data.content,
      keywords: data.keywords,
      reference_links: data.reference_links ?? [],
    };
    updateBlogPostMutation.mutate({ blog_post_id: editingArticleId, blog_post_data: blogPostData });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  if (pageView === "generate") {
    return (
      <GenerateBlogIdeasPage
        onBack={() => setPageView("list")}
        onSubmit={handleGenerate}
        defaultWebsite=""
        isLoading={isGenerating}
      />
    );
  }

  if (pageView === "preview") {
    return (
      <BlogPreviewPage
        blogPostData={viewingArticleData}
        isLoading={isGenerating}
        onBack={() => {
          setPageView("list");
          setViewingArticleData(null);
        }}
        onPublish={handlePreviewPublish}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">Blog & Articles Management</h1>
              <span className="text-[12px] text-muted-foreground">
                Upload and schedule multiple social media posts at once to save time and improve
                efficiency.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className={cn(
                  "flex items-center gap-1 sm:gap-2 cursor-pointer",
                  "bg-[#3072C0] rounded-2xl w-auto",
                  " sm:px-4 py-6 h-9 sm:h-10 lg:h-12",
                  "hover:bg-blue-700 text-white",
                  "text-xs sm:text-sm lg:text-base",
                )}
                onClick={() => {
                  setPageView("generate");
                }}
              >
                <span className="font-medium text-[16px] ">Generate Idea</span>
                <MagicWandIcon className="w-6! h-6!"/>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FBFA] dark:bg-[#06080F] border-b-[#DCE0E4] dark:border-b-[#404663]">
                <TableHead>
                  <CheckboxSquare
                    className="!rounded-[8px]"
                    checked={
                      (articles?.length ?? 0) > 0 && selectedArticles.length === articles.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Date</TableHead>
                {/* <TableHead>Updated At</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No blog articles found. Click &quot;Generate Idea&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                articles.map(article => (
                  <TableRow key={article.id} className="border-b-[#DCE0E4] dark:border-b-[#404663]">
                    <TableCell className="px-4 py-3">
                      <CheckboxSquare
                        className="!rounded-[8px]"
                        checked={selectedArticles.includes(article.id.toString())}
                        onCheckedChange={checked =>
                          handleSelectArticle(article.id.toString(), checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <span className="truncate block" title={article.title || "No title"}>
                        {article.title || "No title"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-medium",
                          getStatusBadgeClass(article.status),
                        )}
                      >
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(article.created_at)}</TableCell>
                    {/* <TableCell>{formatDate(article.updated_at)}</TableCell> */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(article)}
                            disabled={fetchBlogPostForViewMutation.isPending}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(article)}
                            disabled={fetchBlogPostMutation.isPending}
                          >
                            Edit
                          </DropdownMenuItem>
                          {article.status === "draft" && (
                            <DropdownMenuItem onClick={() => handlePublish(article)}>
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.num_pages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} ({pagination.count} total)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (pagination.previous_page) {
                      handlePageChange(pagination.previous_page);
                    }
                  }}
                  disabled={!pagination.has_previous}
                  className="cursor-pointer px-3 py-5"
                >
                  <LeftArrow size={28} color={!pagination.has_previous ? "gray" : "#3072C0"} />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10",
                      "cursor-pointer",
                      "flex items-center gap-1 sm:gap-2",
                      "bg-card border-border text-xs h-8 sm:h-10",
                      "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
                      currentPage === page && "bg-[#3072C0] text-white hover:bg-[#3072C0]/90",
                    )}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (pagination.next_page) {
                      handlePageChange(pagination.next_page);
                    }
                  }}
                  disabled={!pagination.has_next}
                  className="cursor-pointer px-3 py-5"
                >
                  <RightArrow size={32} color={!pagination.has_next ? "gray" : "#3072C0"} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditBlogPostModal
        open={showEditModal}
        onOpenChange={open => {
          setShowEditModal(open);
          if (!open) {
            setEditingArticleId(null);
            setEditingArticleData(null);
          }
        }}
        onSubmit={handleUpdate}
        initialData={editingArticleData || undefined}
        isSubmitting={updateBlogPostMutation.isPending || fetchBlogPostMutation.isPending}
      />
    </>
  );
};

export default BlogArticlesPage;
