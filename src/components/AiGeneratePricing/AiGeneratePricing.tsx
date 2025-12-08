"use client";

import Link from "next/link";
import { useState } from "react";

import GeneratePricingForm from "@/components/Forms/PricingForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { DashboardListIcon } from "@/components/ui/icons/sidebar/dashboard-list";
import { cn } from "@/lib/utils";
import {
  GeneratePricingFormData,
  generatePricingSchema,
} from "@/lib/validations/generate-pricing";

const AiGeneratePricing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCancel = () => {
    // closeEditCampaignPricingForm();
  };

  const handleSave = async (data: GeneratePricingFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = generatePricingSchema.safeParse(data);

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
      alert("Client created successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while creating the client. Please try again.");
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
              <Link href="/client-management" className="text-blue-600 font-medium text-md">
                Client Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/client-management" className="text-blue-600 font-medium text-md">
                Add New Client
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/client-management" className="text-blue-600 font-medium text-md">
                Generate Marketing Assets
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Generate Pricing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Generate Pricing</h1>
          <p className="text-muted-foreground">
            Quickly create accurate, customized pricing for selected services.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2 p-6 px-8",
              "bg-card border-border text-sm h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500 rounded-[16px]",
            )}
          >
            <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
            <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
          </Button>
          <Button
            type="submit"
            form="client-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <GeneratePricingForm
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default AiGeneratePricing;
