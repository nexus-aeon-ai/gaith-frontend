"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import QuotationForm from "@/components/Forms/QuotationForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import { createQuotation } from "@/lib/api/quotations";
import { createQuoteSchema, type CreateQuotationFormData } from "@/lib/validations/quotation";

import { ConfirmDialog } from "../Popups/PopupModal";

const NewQuote = ({ closeNewQuoteForm }: { closeNewQuoteForm: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createQuotation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setShowConfirmModal(true);
    },
    onError: err => {
      console.error("Failed to create quotation.", err);
    },
  });

  const handleSave = async (data: CreateQuotationFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createQuoteSchema.safeParse(data);
      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        return;
      }

      console.log("data to submit:", data);

      mutation.mutate({
        ...data,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/quotations"
                className="text-blue-600 font-medium text-md"
                onClick={closeNewQuoteForm}
              >
                Quotations Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Quotation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Create New Quotation</h1>
          <p className="text-muted-foreground">Create New Quotation</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCancelModal(true)}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="quotation-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0]/80 bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Create Quotation"}
          </Button>
        </div>
      </div>

      <QuotationForm
        mode="create"
        onSubmit={handleSave}
        onCancel={() => setShowCancelModal(true)}
        isSubmitting={isSubmitting}
      />
      {/* Confirmation success modal */}
      <ConfirmDialog
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="Changes saved Successfully"
        description="Your changes has been saved and is now available in Quotations List."
        singleButton
        onConfirm={closeNewQuoteForm}
        confirmText="View Table"
        icon={
          <div>
            <Check
              strokeWidth={3}
              color="#2BAE82"
              className="h-[70px] w-[70px] p-3 bg-[#2BAE82]/30 rounded-full"
            />
            <span className="sr-only">Close</span>
          </div>
        }
      />
      {/* cancel modal */}
      <ConfirmDialog
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onCancel={closeNewQuoteForm}
        title="Cancel Changes?"
        description="Are you sure you want to cancel these changes? This action cannot be undone."
        confirmText="No, Keep"
        cancelText="Yes, Cancel"
        icon={
          <div>
            <X
              strokeWidth={3}
              color="#EA3B1F"
              className="h-[70px] w-[70px] p-3 bg-[#EA3B1F]/30 rounded-full"
            />
            <span className="sr-only">Close</span>
          </div>
        }
      />
    </div>
  );
};

export default NewQuote;
