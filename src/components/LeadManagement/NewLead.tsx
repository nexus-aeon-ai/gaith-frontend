"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LeadForm from "@/components/Forms/LeadForm";
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
import { createLead } from "@/lib/api/leads";
import { createLeadSchema, type CreateLeadFormData } from "@/lib/validations/lead";

const NewLead = ({ closeNewLeadForm }: { closeNewLeadForm: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("LeadForm");
  const tLead = useTranslations("LeadManagement");

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      closeNewLeadForm();
    },
    onError: err => {
      // show simple error, can replace with toast/notification later
      console.error("Failed to create lead. " + (err instanceof Error ? err.message : ""));
    },
  });
  
  const handleSave = async (data: CreateLeadFormData) => {
    setIsSubmitting(true);
    try {
      // Validate form data
      const result = createLeadSchema.safeParse(data);
      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        setIsSubmitting(false);
        return;
      }
      // If validation passes, proceed with create lead api
      mutation.mutate(data);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    closeNewLeadForm();
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
              <Link href="/leads" className="text-blue-600 font-medium text-md" onClick={closeNewLeadForm}>
                {tLead("leads")}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("createNewLead")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">{t("addNewLead")}</h1>
          <p className="text-muted-foreground">
            {t("createNewLead")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("saving") : t("saveLead")}
          </Button>
        </div>
      </div>

      <LeadForm mode="create" onSubmit={handleSave} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </div>
  );
};

export default NewLead;
