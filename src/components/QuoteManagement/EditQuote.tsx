"use client";

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
import { DashboardListIcon } from "@/components/ui/icons/sidebar/dashboard-list";
import { CreateQuotationFormData, createQuoteSchema } from "@/lib/validations/quotation";

import { Quotation } from "../../lib/types";

const EditQuote = ({
  closeEditQuoteForm,
  quotation,
}: {
  closeEditQuoteForm: () => void;
  quotation: Quotation | null;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    closeEditQuoteForm();
  };

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
      // Show success message or redirect
      alert("Lead created successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while creating the lead. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                onClick={closeEditQuoteForm}
              >
                Quotations Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Quotation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Quotation</h1>
          <p className="text-muted-foreground">{quotation?.quotationId} - {quotation?.customer.name}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0]/80 font-[400] rounded-[16px] border-none bg-[#3072C0] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <QuotationForm
        mode="edit"
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        quotation={quotation}
      />
    </div>
  );
};

export default EditQuote;
