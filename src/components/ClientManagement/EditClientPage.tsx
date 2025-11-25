"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";

interface EditClientPageProps {
  initialData: ClientByIdResponse;
  clientId: string;
}

// Helper function to parse socialMediaUrls
function parseSocialMediaUrls(socialMediaUrls: SocialMediaUrls | string | null): SocialMediaUrls | null {
  if (!socialMediaUrls) return null;
  if (typeof socialMediaUrls === "string") {
    try {
      return JSON.parse(socialMediaUrls) as SocialMediaUrls;
    } catch {
      return null;
    }
  }
  return socialMediaUrls;
}

// Helper function to map API response to form data
function mapClientToFormData(client: ClientByIdResponse): CreateClientFormData {
  const socialMediaUrls = parseSocialMediaUrls(client.socialMediaUrls);
  
  // Helper to safely parse dates
  const safeParseDate = (val: string | null | undefined): Date => {
    if (!val) return new Date();
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return {
    fullName: client.clientName || "",
    industry: client.industrySectorId || "technology",
    businessOverview: client.businessOverview || "",
    email: client.emailAddress || "",
    companySize: client.companySize?.name || "0-50",
    contactName: client.fullName || "",
    jobTitle: "",
    phoneNumber: client.phoneNumber || "",
    location: client.area?.name || client.cityType?.name || "",
    fullAddress: client.fullAddress || "",
    linkedinProfile: socialMediaUrls?.linkedin || "",
    department: "",
    accountManager: client.accountManagerId || "",
    clientSince: safeParseDate(client.agreementStartDate),
    agreementStartDate: safeParseDate(client.agreementStartDate),
    agreementEndDate: safeParseDate(client.agreementEndDate),
    contractDuration: client.contractDuration?.toString() || "",
    clientStatus: client.isActive ? "active" : "inactive",
    monthlyBudget: "0",
    priorityLevel: "low",
    websiteUrl: client.websiteUrl || "",
    internalNotes: client.internalNotes || "",
  };
}

export default function EditClientPage({ initialData, clientId }: EditClientPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const formData = mapClientToFormData(initialData);

  const mutation = useMutation({
    mutationFn: async (data: CreateClientFormData) => {
      // Map form data to API request format
      const socialMediaUrls: SocialMediaUrls = {};
      if (data.linkedinProfile) socialMediaUrls.linkedin = data.linkedinProfile;

      const payload: Parameters<typeof updateClient>[1] = {
        clientName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths: parseInt(data.contractDuration) || 0,
        primaryMarketRegionId: initialData.primaryMarketRegionId || "",
        targetAudienceId: initialData.targetAudienceId || "",
        secondaryMarketIds: initialData.secondaryMarkets?.map(m => m.marketRegion.id) || [],
        languagesSupported: initialData.languagesSupported?.map(l => l.code) || [],
        visionStatement: initialData.visionStatement || undefined,
        missionStatement: initialData.missionStatement || undefined,
        socialMediaUrls: Object.keys(socialMediaUrls).length > 0 ? socialMediaUrls : null,
        websiteUrl: data.websiteUrl || undefined,
        fullAddress: data.fullAddress || undefined,
        countryId: initialData.countryId || undefined,
        cityId: initialData.cityId || undefined,
        areaId: initialData.areaId || undefined,
        accountManagerId: data.accountManager || undefined,
        marketingStrategistId: initialData.marketingStrategistId || undefined,
        assignedUserIds: initialData.assignedUsers?.map(u => u.id) || [],
        serviceOfferingIds: initialData.serviceOfferings?.map(s => s.id) || [],
        teamRoleIds: initialData.teamRoles?.map(t => t.id) || [],
        internalNotes: data.internalNotes || undefined,
      };

      return updateClient(clientId, payload);
    },
    onSuccess: () => {
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
    router.push(`/client-management/${clientId}`);
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

