"use client";

import Link from "next/link";
import { useState } from "react";

import ClientForm from "@/components/Forms/ClientForm";
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
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";

import PopupModal from "../PopupModal/Modal";
import { X } from "lucide-react";

const NewClient = ({ closeNewClientForm }: { closeNewClientForm: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSave = async (data: CreateClientFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createClientSchema.safeParse(data);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        return;
      }

      // If validation passes, proceed with create lead api
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while creating the lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    closeNewClientForm();
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
                href="/client-management"
                className="text-blue-600 font-medium text-md"
                onClick={closeNewClientForm}
              >
                Client Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Add New Client</h1>
          <p className="text-muted-foreground">
            Create a comprehensive client profile with all necessary information.
          </p>
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
            form="lead-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </div>
      </div>

      <ClientForm
        mode="create"
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
      <PopupModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Cancel Changes?"
        iconComponent={
          <X className="bg-red-200 rounded-full p-2" strokeWidth={3} size={40} color="#EA3B1F" />
        }
        description="Are you sure you want to cancel this Changes? This action cannot be undone.?"
        cancelButton={{ label: "Yes, Cancel", onClick: () => setShowCancelModal(false) }}
        confirmButton={{ label: "No, Keep", onClick: () => setShowCancelModal(false) }}
      />
    </div>
  );
};

export default NewClient;
