"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MoreVertical, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

import EditMarketingPlanModal from "@/components/MarketingPlans/EditMarketingPlanModal";
import MarketingPlanGenerationModal from "@/components/MarketingPlans/MarketingPlanGenerationModal";
import ViewMarketingPlanModal from "@/components/MarketingPlans/ViewMarketingPlanModal";
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
import {
  generateMarketingPlan,
  getMarketingPlan,
  publishMarketingPlan,
  updateMarketingPlan,
  type MarketingPlanData,
  type MarketingPlanListItem,
} from "@/lib/api/reports";
import { cn } from "@/lib/utils";

interface MarketingPlansPageProps {
  initialPlans?: MarketingPlanListItem[];
  defaultWebsite?: string;
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

const MarketingPlansPage = ({ initialPlans = [], defaultWebsite = "", pagination }: MarketingPlansPageProps) => {
  const [plans, setPlans] = useState<MarketingPlanListItem[]>(initialPlans);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<MarketingPlanData | undefined>();
  const [viewingData, setViewingData] = useState<MarketingPlanData | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = pagination?.current_page || 1;
  const totalPages = pagination?.num_pages || 1;
  const queryClient = useQueryClient();

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
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const fetchPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await getMarketingPlan(planId);
      if (response.status !== 200 || !response.data?.details?.message) {
        throw new Error("Failed to fetch marketing plan");
      }
      return response.data.details.message;
    },
    onSuccess: (data) => {
      setEditingData(data.marketing_plan);
      setShowEditModal(true);
    },
    onError: (error) => {
      console.error("Error fetching marketing plan:", error);
      toast.error("Failed to fetch marketing plan details");
    },
  });

  const fetchPlanForViewMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await getMarketingPlan(planId);
      if (response.status !== 200 || !response.data?.details?.message) {
        throw new Error("Failed to fetch marketing plan");
      }
      return response.data.details.message;
    },
    onSuccess: (data) => {
      setViewingData(data.marketing_plan);
      setShowViewModal(true);
    },
    onError: (error) => {
      console.error("Error fetching marketing plan:", error);
      toast.error("Failed to fetch marketing plan details");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ planId, planData }: { planId: number; planData: MarketingPlanData }) => {
      const response = await updateMarketingPlan(planId, planData);
      if (response.status !== 200) {
        throw new Error("Failed to update marketing plan");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Marketing plan updated successfully!");
      setShowEditModal(false);
      setEditingPlanId(null);
      setEditingData(undefined);
      queryClient.invalidateQueries({ queryKey: ["marketing-plans"] });
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error updating marketing plan:", error);
      toast.error("Failed to update marketing plan");
    },
  });

  const handleGenerate = async (data: { company_website: string; clientId?: string }) => {
    try {
      const response = await generateMarketingPlan(data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Marketing plan generation started successfully!");
        setShowGenerateModal(false);
        window.location.reload();
      } else {
        toast.error("Failed to generate marketing plan");
      }
    } catch (error) {
      console.error("Error generating marketing plan:", error);
      toast.error("An error occurred while generating the marketing plan");
    }
  };

  const handleEdit = (plan: MarketingPlanListItem) => {
    setEditingPlanId(plan.id);
    fetchPlanMutation.mutate(plan.id);
  };

  const handleView = (plan: MarketingPlanListItem) => {
    fetchPlanForViewMutation.mutate(plan.id);
  };

  const handlePublish = async (plan: MarketingPlanListItem) => {
    try {
      const response = await publishMarketingPlan(plan.id);
      if (response.status === 200 || response.status === 204) {
        const updatedPlans = plans.map((p) =>
          p.id === plan.id ? { ...p, status: "completed" as const } : p,
        );
        setPlans(updatedPlans);
        toast.success("Marketing plan published successfully!");
        queryClient.invalidateQueries({ queryKey: ["marketing-plans"] });
      } else {
        toast.error("Failed to publish marketing plan");
      }
    } catch (error) {
      console.error("Error publishing marketing plan:", error);
      toast.error("Failed to publish marketing plan");
    }
  };

  const handleDelete = (planId: number) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    toast.success("Marketing plan deleted successfully!");
  };

  const handleUpdate = (data: MarketingPlanData) => {
    if (editingPlanId === null) {
      toast.error("No marketing plan selected for editing");
      return;
    }
    updatePlanMutation.mutate({ planId: editingPlanId, planData: data });
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full p-4 font-inter">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold text-foreground">Marketing Plans</h1>
              <span className="text-[12px] max-w-[300px] text-muted-foreground">
                Generate, review, and publish AI-powered marketing plans.
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
                onClick={() => setShowGenerateModal(true)}
              >
                <Plus className="h-4 w-4 rounded-full bg-blue-400 text-white" />
                <span>Generate Plan</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No marketing plans found. Click &quot;Generate Plan&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">#{plan.id}</TableCell>
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
                    <TableCell>{formatDate(plan.created_at)}</TableCell>
                    <TableCell>{formatDate(plan.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(plan)}
                            disabled={fetchPlanForViewMutation.isPending}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(plan)}
                            disabled={fetchPlanMutation.isPending}
                          >
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

          {pagination && pagination.num_pages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {plans.length > 0 ? (
                  <>
                    Page {currentPage} of {totalPages} ({pagination.count} total)
                  </>
                ) : (
                  <>No results</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (pagination.previous_page) {
                      handlePageChange(pagination.previous_page);
                    }
                  }}
                  disabled={!pagination.has_previous}
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
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (pagination.next_page) {
                      handlePageChange(pagination.next_page);
                    }
                  }}
                  disabled={!pagination.has_next}
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

      <MarketingPlanGenerationModal
        open={showGenerateModal}
        onOpenChange={setShowGenerateModal}
        onSubmit={handleGenerate}
        defaultWebsite={defaultWebsite}
      />

      <EditMarketingPlanModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setEditingPlanId(null);
            setEditingData(undefined);
          }
        }}
        initialData={editingData}
        onSubmit={handleUpdate}
        isSubmitting={updatePlanMutation.isPending || fetchPlanMutation.isPending}
      />

      <ViewMarketingPlanModal
        open={showViewModal}
        onOpenChange={(open) => {
          setShowViewModal(open);
          if (!open) {
            setViewingData(undefined);
          }
        }}
        data={viewingData}
        isLoading={fetchPlanForViewMutation.isPending}
      />
    </>
  );
};

export default MarketingPlansPage;

