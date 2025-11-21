"use client";

import { MoreVertical, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import BlogGenerationModal from "@/components/ClientManagement/GenerateAssets/BlogGenerationModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateBlog, publishBlog } from "@/lib/api/reports";
import { cn } from "@/lib/utils";

interface BlogArticle {
  id: number;
  title: string;
  status: "draft" | "completed" | "failed";
  author: string;
  category: string;
  date: string;
  views: number;
  platform?: string;
  topic?: string;
  company_website?: string;
}

interface BlogArticlesPageProps {
  initialArticles?: BlogArticle[];
}

const BlogArticlesPage = ({ initialArticles = [] }: BlogArticlesPageProps) => {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleGenerate = async (data: {
    platform: string;
    topic: string;
    company_website: string;
  }) => {
    setIsGenerating(true);
    try {
      const response = await generateBlog(data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Blog article generation started successfully!");

        // Add new article to the list
        const newArticle: BlogArticle = {
          id: Date.now(), // temporary ID
          title: data.topic,
          status: "draft",
          author: "System",
          category: "Generated",
          date: new Date().toISOString().split("T")[0],
          views: 0,
          platform: data.platform,
          topic: data.topic,
          company_website: data.company_website,
        };

        setArticles([newArticle, ...articles]);
        setShowModal(false);
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

  const handleEdit = (article: BlogArticle) => {
    setEditingArticle(article);
    setShowModal(true);
  };

  const handlePublish = async (article: BlogArticle) => {
    try {
      const response = await publishBlog(article.id);

      if (response.status === 200 || response.status === 204) {
        // Update status to completed
        const updatedArticles = articles.map((a) =>
          a.id === article.id ? { ...a, status: "completed" as const } : a
        );
        setArticles(updatedArticles);
        toast.success("Blog article published successfully!");
      } else {
        toast.error("Failed to publish blog article");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("Failed to publish blog article");
    }
  };

  const handleDelete = (articleId: number) => {
    setArticles(articles.filter((a) => a.id !== articleId));
    toast.success("Blog article deleted successfully!");
  };

  // Pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">Blog & Articles Management</h1>
              <span className="text-[12px] max-w-[300px] text-muted-foreground">
                Upload and schedule multiple social media posts at once to save time and improve
                efficiency.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className={cn(
                  "flex items-center gap-1 sm:gap-2 cursor-pointer",
                  "bg-[#508CD3] rounded-2xl w-auto",
                  "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
                  "hover:bg-blue-700 text-white",
                  "text-xs sm:text-sm lg:text-base",
                )}
                onClick={() => {
                  setEditingArticle(null);
                  setShowModal(true);
                }}
              >
                <Plus className="h-4 w-4 rounded-full bg-blue-400 text-white" />
                <span>Generate Idea</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No blog articles found. Click "Generate Idea" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                currentArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadgeClass(article.status),
                        )}
                      >
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.date}</TableCell>
                    <TableCell>{article.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(article)}>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of{" "}
                {articles.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "cursor-pointer",
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card border-border text-xs h-8 sm:h-10",
                    "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
                  )}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
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
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "cursor-pointer",
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card border-border text-xs h-8 sm:h-10",
                    "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
                  )}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <BlogGenerationModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingArticle(null);
          }
        }}
        onSubmit={handleGenerate}
        defaultWebsite={editingArticle?.company_website || ""}
        initialData={
          editingArticle
            ? {
                platform: editingArticle.platform || "",
                topic: editingArticle.topic || "",
                company_website: editingArticle.company_website || "",
              }
            : undefined
        }
      />
    </>
  );
};

export default BlogArticlesPage;

