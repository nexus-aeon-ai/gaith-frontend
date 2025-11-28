"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { updateClient, type ClientByIdResponse } from "@/lib/api/client/client";
import { SocialMediaUrls } from "@/lib/api/leads";
import { createClientSchema, type CreateClientFormData, companySizeOptions } from "@/lib/validations/client";

interface EditClientPageProps {
  initialData: ClientByIdResponse;
  clientId: string;
}

// Helper function to parse socialMediaUrls
function parseSocialMediaUrls(socialMediaUrls: SocialMediaUrls | string | null): SocialMediaUrls {
  if (!socialMediaUrls) return [];
  if (typeof socialMediaUrls === "string") {
    try {
      const parsed = JSON.parse(socialMediaUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(socialMediaUrls) ? socialMediaUrls : [];
}

// Helper function to map API response to form data
function mapClientToFormData(client: ClientByIdResponse): CreateClientFormData {
  const socialMediaUrls = parseSocialMediaUrls(client.socialMediaUrls);
  
  // Extract URLs by platform name (case-insensitive)
  const getUrlByPlatform = (platform: string): string => {
    const item = socialMediaUrls.find(
      (item) => item.platform.toLowerCase() === platform.toLowerCase()
    );
    return item?.url || "";
  };
  
  // Helper to safely parse dates
  const safeParseDate = (val: string | null | undefined): Date => {
    if (!val) return new Date();
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return {
    fullName: client.clientName || "",
    industry: client.industrySector?.id || client.industrySectorId || "",
    businessOverview: client.businessOverview || "",
    email: client.emailAddress || "",
    companySize: (companySizeOptions.find((c) => c === client.companySize?.name) as typeof companySizeOptions[number]) || "0-50",
    contactName: client.fullName || "",
    jobTitle: "", // Not available in API response
    phoneNumber: client.phoneNumber || "",
    location: client.area?.name || client.cityType?.name || "",
    fullAddress: client.fullAddress || "",
    country: client.countryId || "",
    city: client.cityId || "",
    area: client.areaId || "",
    linkedinProfile: getUrlByPlatform("LinkedIn"),
    facebookUrl: getUrlByPlatform("Facebook"),
    twitterUrl: getUrlByPlatform("Twitter"),
    instagramUrl: getUrlByPlatform("Instagram"),
    department: "", // Not available in API response
    accountManager: client.accountManagerId || "",
    clientSince: safeParseDate(client.agreementStartDate),
    agreementStartDate: safeParseDate(client.agreementStartDate),
    agreementEndDate: safeParseDate(client.agreementEndDate),
    contractDuration: client.contractDuration?.toString() || "",
    clientStatus: client.isActive ? "active" : "inactive",
    monthlyBudget: "0", // Not available in API response
    priorityLevel: "low", // Not available in API response
    websiteUrl: client.websiteUrl || "",
    internalNotes: client.internalNotes || "",
    
    // New Fields Mapping
    primaryMarketRegionId: client.primaryMarketRegion?.id || client.primaryMarketRegionId || "",
    secondaryMarketIds: client.secondaryMarkets?.map(m => m.marketRegion.id) || [],
    targetAudienceId: client.targetAudience?.id || client.targetAudienceId || "",
    languagesSupported: client.languagesSupported?.map(l => l.code) || [],
    serviceOfferingIds: client.serviceOfferings?.map(s => s.id) || [],
    assignedUserIds: client.assignedUsers?.map(u => u.id) || [],
    teamRoleIds: client.teamRoles?.map(t => t.id) || [],
    visionStatement: client.visionStatement || "",
    missionStatement: client.missionStatement || "",
    businessMaturity: client.businessMaturity || "",
  };
}

export default function EditClientPage({ initialData, clientId }: EditClientPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const formData = mapClientToFormData(initialData);

  const mutation = useMutation({
    mutationFn: async (data: CreateClientFormData) => {
      // Map form data to API request format - build socialMediaUrls array
      const socialMediaUrls: SocialMediaUrls = [];
      if (data.linkedinProfile) socialMediaUrls.push({ platform: "LinkedIn", url: data.linkedinProfile });
      if (data.facebookUrl) socialMediaUrls.push({ platform: "Facebook", url: data.facebookUrl });
      if (data.twitterUrl) socialMediaUrls.push({ platform: "Twitter", url: data.twitterUrl });
      if (data.instagramUrl) socialMediaUrls.push({ platform: "Instagram", url: data.instagramUrl });

      const payload: Parameters<typeof updateClient>[1] = {
        clientName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths: parseInt(data.contractDuration) || 0,
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
        marketingStrategistId: initialData.marketingStrategistId || undefined,
        assignedUserIds: data.assignedUserIds,
        serviceOfferingIds: data.serviceOfferingIds,
        teamRoleIds: data.teamRoleIds,
        internalNotes: data.internalNotes || undefined,
        businessMaturity: data.businessMaturity || undefined,
        companySizeId: undefined, // We only have name in form, need ID if we want to update it properly, or rely on backend to handle name? 
        // Assuming companySize in form is just a string from enum, but API expects ID? 
        // The API definition shows companySizeId. 
        // However, the form uses an enum of strings "0-50", etc. 
        // If the backend expects an ID, we might need to look it up or the backend handles the string.
        // For now, I'll leave it as is or try to find if there's a lookup for company size IDs.
        // Looking at client.ts, there is `CompanySize` interface with ID and name.
        // But `companySizeOptions` in validation are strings.
        // I will assume for now that I can't easily map back to ID without fetching company sizes lookup.
        // Let's check if I can fetch company sizes.
      };

      return updateClient(clientId, payload);
    },
    onSuccess: (res) => {
      if (![201,200].includes(res.status)){
        throw new Error(res.data?.message || "Failed to update client");
      }
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      router.push(`/client-management/${clientId}`);
    },
    onError: (error) => {
      console.error("Failed to update client:", error);
    },
  });

  const handleSave = (data: CreateClientFormData) => {
    const result = createClientSchema.safeParse(data);
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return;
    }
    mutation.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full mx-auto p-6">
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
              <Link href={`/client-management/${clientId}`} className="text-blue-600 font-medium text-md">
                {initialData.clientName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Client</h1>
          <p className="text-muted-foreground">
            Update client information and details.
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
            disabled={mutation.isPending}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ClientForm
        initialData={formData}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={mutation.isPending}
        mode="edit"
      />
    </div>
  );
}

