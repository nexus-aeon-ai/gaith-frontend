"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";


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
import { usePermission } from "@/hooks/usePermission";
import { createClient, getClientCompanySizes } from "@/lib/api/client/client";
import { SocialMediaUrls } from "@/lib/api/leads";
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";

import ClientForm from "../Forms/ClientForm";
import PopupModal from "../PopupModal/PopupModal";


const defaultFormData: CreateClientFormData = {
  fullName: "",
  industry: "",
  companySize: "0-50",
  businessOverview: "",
  email: "",
  contactName: "",
  jobTitle: "",
  phoneNumber: "",
  linkedinProfile: "",
  department: "",
  location: "",
  country: "",
  city: "",
  area: "",
  fullAddress: "",
  accountManager: "",
  clientSince: new Date(),
  agreementStartDate: new Date(),
  agreementEndDate: new Date(),
  clientStatus: "active",
  monthlyBudget: "0",
  priorityLevel: "low",
  websiteUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  internalNotes: "",
  primaryMarketRegionId: "",
  secondaryMarketIds: [],
  targetAudienceId: "",
  languagesSupported: [],
  serviceOfferingIds: [],
  assignedUserIds: [],
  teamRoleIds: [],
  visionStatement: "",
  missionStatement: "",
  businessMaturity: "",
};

const NewClient = ({ closeNewClientForm }: { closeNewClientForm: () => void }) => {
  const queryClient = useQueryClient();
  const { canAdd } = usePermission("clients");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: companySizes } = useQuery({
    queryKey: ["company-size"],
    queryFn: getClientCompanySizes,
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateClientFormData) => {
      // Map form data to API request format - build socialMediaUrls array
      const socialMediaUrls: SocialMediaUrls = [];
      if (data.linkedinProfile) socialMediaUrls.push({ platform: "LinkedIn", url: data.linkedinProfile });
      if (data.facebookUrl) socialMediaUrls.push({ platform: "Facebook", url: data.facebookUrl });
      if (data.twitterUrl) socialMediaUrls.push({ platform: "Twitter", url: data.twitterUrl });
      if (data.instagramUrl) socialMediaUrls.push({ platform: "Instagram", url: data.instagramUrl });

      const payload = {
        clientName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths: Math.ceil((data.agreementEndDate.getTime() - data.agreementStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30)),
        primaryMarketRegionId: data.primaryMarketRegionId,
        targetAudienceId: data.targetAudienceId,
        secondaryMarketIds: data.secondaryMarketIds,
        languagesSupported: data.languagesSupported,
        visionStatement: data.visionStatement || undefined,
        missionStatement: data.missionStatement || undefined,
        socialMediaUrls: socialMediaUrls.length > 0 ? socialMediaUrls : null,
        websiteUrl: data.websiteUrl || undefined,
        fullAddress: data.fullAddress || undefined,
        countryId: data.country || undefined,
        cityId: data.city || undefined,
        areaId: data.area || undefined,
        departmentId: data.department || undefined,
        accountManagerId: data.accountManager || undefined,
        assignedUserIds: data.assignedUserIds,
        serviceOfferingIds: data.serviceOfferingIds,
        teamRoleIds: data.teamRoleIds,
        internalNotes: data.internalNotes || undefined,
        businessMaturity: data.businessMaturity || undefined,
        companySizeId: Array.isArray(companySizes) ? companySizes.find(c => c.name === data.companySize)?.id : undefined,
        jobTitle: data.jobTitle,
        contactName: data.contactName,
      };

      return createClient(payload);
    },
    onSuccess: (res) => {
      if (res.status >= 200 && res.status < 300) {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Client created successfully!");
        closeNewClientForm();
      } else {
        throw new Error("Failed to create client");
      }
    },
    onError: (error) => {
      console.error("Failed to create client:", error);
      toast.error("Failed to create client. Please try again.");
    },
  });

  const handleSave = (data: CreateClientFormData) => {
    if (!canAdd) return;
    const result = createClientSchema.safeParse(data);
    if (!result.success) {
      console.error("Validation failed:", result.error);
      // You might want to show toast error here or let the form handle display
      return;
    }
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
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
          {canAdd && (
            <Button
              type="submit"
              form="lead-form" // Changed to match ClientForm ID
              variant={"outline"}
              disabled={mutation.isPending}
              className="p-6 px-8 text-[#3072C0] text-[16px] border-[#3072C0] bg-transparent hover:bg-[#3072C0] hover:text-white transition-all font-[400] rounded-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Saving..." : "Save Client"}
            </Button>
          )}
        </div>
      </div>

      <ClientForm
        initialData={defaultFormData}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={mutation.isPending}
        mode="create"
        readOnly={!canAdd}
        companySizes={companySizes}
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
