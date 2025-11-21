"use client";

import { MoreVertical, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import MediaBuyingModal from "@/components/ClientManagement/GenerateAssets/MediaBuyingModal";
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
import { generateMediaBuying, publishMediaBuyingPlan } from "@/lib/api/reports";
import { cn } from "@/lib/utils";

interface MediaBuyingPlan {
  id: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "completed" | "failed";
  platform?: string;
}

interface MediaBuyingPageProps {
  initialPlans?: MediaBuyingPlan[];
}

const MediaBuyingPage = ({ initialPlans = [] }: MediaBuyingPageProps) => {
  const [plans, setPlans] = useState<MediaBuyingPlan[]>(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MediaBuyingPlan | null>(null);
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleGenerate = async (data: { platform: string }) => {
    setIsGenerating(true);
    try {
      const response = await generateMediaBuying(data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Media buying plan generation started successfully!");

        // Add new plan to the list
        const newPlan: MediaBuyingPlan = {
          id: Date.now(), // temporary ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "draft",
          platform: data.platform,
        };

        setPlans([newPlan, ...plans]);
        setShowModal(false);
      } else {
        toast.error("Failed to generate media buying plan");
      }
    } catch (error) {
      console.error("Error generating media buying plan:", error);
      toast.error("An error occurred while generating the media buying plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (plan: MediaBuyingPlan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handlePublish = async (plan: MediaBuyingPlan) => {
    try {
      const response = await publishMediaBuyingPlan(plan.id);

      if (response.status === 200 || response.status === 204) {
        // Update status to completed
        const updatedPlans = plans.map((p) =>
          p.id === plan.id ? { ...p, status: "completed" as const } : p
        );
        setPlans(updatedPlans);
        toast.success("Media buying plan published successfully!");
      } else {
        toast.error("Failed to publish media buying plan");
      }
    } catch (error) {
      console.error("Error publishing media buying plan:", error);
      toast.error("Failed to publish media buying plan");
    }
  };

  const handleDelete = (planId: number) => {
    setPlans(plans.filter((p) => p.id !== planId));
    toast.success("Media buying plan deleted successfully!");
  };

  // Pagination
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlans = plans.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">Media Buying Plans</h1>
              <span className="text-[12px] max-w-[300px] text-muted-foreground">
                Generate and manage media buying plans for your advertising campaigns across
                different platforms.
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
                  setEditingPlan(null);
                  setShowModal(true);
                }}
              >
                <Plus className="h-4 w-4 rounded-full bg-blue-400 text-white" />
                <span>Generate Plan</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Updated Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No media buying plans found. Click "Generate Plan" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                currentPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">#{plan.id}</TableCell>
                    <TableCell>{plan.platform || "N/A"}</TableCell>
                    <TableCell>{formatDate(plan.created_at)}</TableCell>
                    <TableCell>{formatDate(plan.updated_at)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadgeClass(plan.status),
                        )}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(plan)}>
                            Edit
                          </DropdownMenuItem>
                          {plan.status === "draft" && (
                            <DropdownMenuItem onClick={() => handlePublish(plan)}>
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(plan.id)}
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
                Showing {startIndex + 1}-{Math.min(endIndex, plans.length)} of {plans.length}
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
      <MediaBuyingModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingPlan(null);
          }
        }}
        onSubmit={handleGenerate}
        initialData={
          editingPlan
            ? {
                platform: editingPlan.platform || "",
              }
            : undefined
        }
      />
    </>
  );
};

export default MediaBuyingPage;

