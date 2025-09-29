"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { createLeadSchema, type CreateLeadFormData } from "@/lib/validations/lead";

import LeadForm from "../../../../../../components/Forms/LeadForm";
import { DashboardListIcon } from "../../../../../../components/ui/icons/sidebar/dashboard-list";

const EditLeadPage = () => {
  const [formData, setFormData] = useState<CreateLeadFormData>({
    fullName: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    country: "",
    region: "",
    area: "",
    fullAddress: "",
    leadSource: "website",
    assignedTo: "creative-director",
    visionStatement: "",
    missionStatement: "",
    linkedinUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    additionalNotes: "",
    productsServices: {
      software: false,
      hardware: false,
      consulting: false,
      webDesign: false,
      mobileApp: false,
      cloudServices: false,
    },
    additionalTeamMembers: {
      software: false,
      hardware: false,
      consulting: false,
      webDesign: false,
      mobileApp: false,
      cloudServices: false,
      marketing: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    // Reset form or navigate away
    setFormData({
      fullName: "",
      nationality: "",
      email: "",
      phoneNumber: "",
      country: "",
      region: "",
      area: "",
      fullAddress: "",
      leadSource: "website",
      assignedTo: "creative-director",
      visionStatement: "",
      missionStatement: "",
      linkedinUrl: "",
      facebookUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      websiteUrl: "",
      additionalNotes: "",
      productsServices: {
        software: false,
        hardware: false,
        consulting: false,
        webDesign: false,
        mobileApp: false,
        cloudServices: false,
      },
      additionalTeamMembers: {
        software: false,
        hardware: false,
        consulting: false,
        webDesign: false,
        mobileApp: false,
        cloudServices: false,
        marketing: false,
      },
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createLeadSchema.safeParse(formData);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        return;
      }

      // If validation passes, proceed with form submission
      // TODO: Log valid form data for debugging
      // console.log("Valid form data:", result.data);

      // TODO: Implement actual form submission logic here
      // await submitLeadForm(result.data);

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
              <Link href="/leads" className="text-blue-600 font-medium text-md">
                Leads
              </Link>
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
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <LeadForm
        initialData={formData}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default EditLeadPage;
