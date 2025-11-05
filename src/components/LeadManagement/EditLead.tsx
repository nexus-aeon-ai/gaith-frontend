"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import LeadForm from "@/components/Forms/LeadForm";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DashboardListIcon } from "@/components/ui/icons/sidebar/dashboard-list";
import { editLead } from "@/lib/api/leads";
import { CreateLeadFormData, createLeadSchema } from "@/lib/validations/lead";

interface EditLeadProps {
  initialData: CreateLeadFormData;
  leadId: string;
  closeEditLeadForm: () => void;
}

const EditLead = ({ initialData, leadId, closeEditLeadForm }: EditLeadProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateLeadFormData) => editLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      closeEditLeadForm();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSave = (data: CreateLeadFormData) => {
    setIsSubmitting(true);
    const result = createLeadSchema.safeParse(data);
    if (!result.success) {
      setIsSubmitting(false);
      return;
    }
    mutation.mutate(data);
    setIsSubmitting(false);
  };

  if (!initialData || !leadId) return <div className="p-6">No lead found to edit.</div>;

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard"><DashboardListIcon className="dark:text-[#E6EFF9]" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/leads" className="text-blue-600 font-medium text-md" onClick={closeEditLeadForm}>Leads</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Lead</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Lead</h1>
          <p className="text-muted-foreground">
            Create a comprehensive client profile with all necessary information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={closeEditLeadForm}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <LeadForm
        initialData={initialData}
        onSubmit={handleSave}
        onCancel={closeEditLeadForm}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default EditLead;
