"use client";

import { X } from "lucide-react";
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
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import MagicStarIcon from "@/components/ui/icons/magic-star";
import { createClient } from "@/lib/api/client/client";
import { createAiDataSchema, type CreateAiFormData } from "@/lib/validations/ai-data";

import AiDataForm from "../Forms/AiDataForm";
import PopupModal from "../PopupModal/Modal";

import GenerateMarketingAssets from "./GenerateAssets/GenerateMarketingAssets";

const NewClient = ({ closeNewClientForm }: { closeNewClientForm: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMarketingAssets, setShowMarketingAssets] = useState(false);
  const assignedUserID = "188b267a-d063-4a76-9163-78ff55febb24";
  const handleSave = async (data: CreateAiFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createAiDataSchema.safeParse(data);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        console.error("Validation errors:", errors);
        return;
      }

      // If validation passes, proceed with create client api
      console.log("Creating new client with data:", data);
      
      // Extract city and country from location string
      const [city = "", country = ""] = data.location ? data.location.split(",").map(s => s.trim()) : ["", ""];

      const response = await createClient({
        type: "ActiveClient",
        clientName: data.clientName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths: parseInt(data.contractDuration) || 0,
        primaryMarketRegionId: data.primaryRegion,
        targetAudienceId: data.targetAudience,
        secondaryMarketIds: [], // Currently empty as per form
        languagesSupported: data.languagesSupported || [],
        visionStatement: data.visionStatement || "",
        missionStatement: data.missionStatement || "",
        serviceOfferingIds: data.aiDataProdsServices,
        linkedinUrl: data.linkedinUrl || "",
        twitterUrl: data.twitterUrl || "",
        instagramUrl: data.instagramUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        websiteUrl: data.websiteUrl || "",
        locationCity: city,
        locationCountry: country,
        fullAddress: data.fullAddress,
        accountManagerId: data.primaryAccManager as string,
        marketingStrategistId: data.marketingStrategist as string,
        assignedUserIds: [assignedUserID],
        teamRoleIds: [],  // Will be populated when team roles are implemented
        fullName: data.clientName,
        companyName: data.clientName,
        industry: data.industry,
        country: country,
        city: city,
        branchLocations: {},
        languagePreferences: data.languagesSupported?.[0] || "EN",
        businessMaturity: "Startup",
      });

      console.log("Client created successfully:", response);

      // Close the form on success
      if (response.status >= 200 && response.status < 300) {
        alert("Client created successfully!");
        closeNewClientForm();
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while creating the client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    closeNewClientForm();
  };

  if (showMarketingAssets) {
    return <GenerateMarketingAssets closePage={() => setShowMarketingAssets(false)} />;
  }

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
            form="aidata-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[#3072C0] text-[16px] border-[#3072C0] bg-transparent hover:bg-[#3072C0] hover:text-white transition-all font-[400] rounded-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Client"}
          </Button>
          <Button
            type="submit"
            form="aidata-form"
            onClick={() => setShowMarketingAssets(true)}
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MagicStarIcon />
            {isSubmitting ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      <AiDataForm
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
        cancelButton={{
          label: "Yes, Cancel",
          onClick: () => {
            setShowCancelModal(false);
            closeNewClientForm();
          },
        }}
        confirmButton={{ label: "No, Keep", onClick: () => setShowCancelModal(false) }}
      />
    </div>
  );
};

export default NewClient;
