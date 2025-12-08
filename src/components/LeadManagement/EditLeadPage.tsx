"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { editLead, type LeadByIdResponse, type SocialMediaUrls } from "@/lib/api/leads";
import { createLeadSchema, type CreateLeadFormData } from "@/lib/validations/lead";

interface EditLeadPageProps {
  initialData: LeadByIdResponse;
  leadId: string;
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
function mapLeadToFormData(lead: LeadByIdResponse): CreateLeadFormData {
  const socialMediaUrls = parseSocialMediaUrls(lead.socialMediaUrls);
  
  // Extract URLs by platform name (case-insensitive)
  const getUrlByPlatform = (platform: string): string => {
    const item = socialMediaUrls.find(
      (item) => item.platform.toLowerCase() === platform.toLowerCase()
    );
    return item?.url || "";
  };
  
  return {
    fullName: lead.fullName || "",
    nationality: lead.nationality || "",
    email: lead.emailAddress || "",
    phoneNumber: lead.phoneNumber || "",
    country: lead.countryId || "",
    city: lead.cityId || "",
    area: lead.areaId || "",
    fullAddress: lead.fullAddress || "",
    visionStatement: lead.visionStatement || "",
    missionStatement: lead.missionStatement || "",
    linkedinUrl: getUrlByPlatform("LinkedIn"),
    facebookUrl: getUrlByPlatform("Facebook"),
    youtubeUrl: getUrlByPlatform("YouTube"),
    twitterUrl: getUrlByPlatform("Twitter"),
    instagramUrl: getUrlByPlatform("Instagram"),
    websiteUrl: lead.websiteUrl || "",
    additionalNotes: lead.additionalNotes || "",
    leadSource: lead.leadSourceId || "",
    assignedTo: lead.accountManagerId || "",
    productServiceIds: [],
    serviceOfferingIds: lead.serviceOfferings?.map((so) => so.serviceOfferingId) || [],
    teamRoleIds: lead.teamRoles?.map((tr) => tr.teamRoleId) || [],
    assignedToUserIds: lead.assignedUsers?.map((au) => au.userId) || [],
    companyLogo: undefined,
  };
}

export default function EditLeadPage({ initialData, leadId }: EditLeadPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const formData = mapLeadToFormData(initialData);

  const mutation = useMutation({
    mutationFn: (data: CreateLeadFormData) => editLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      router.push(`/leads/${leadId}`);
    },
    onError: (error) => {
      console.error("Failed to update lead:", error);
    },
  });

  const handleSave = (data: CreateLeadFormData) => {
    const result = createLeadSchema.safeParse(data);
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return;
    }
    mutation.mutate(data);
  };

  const handleCancel = () => {
    router.push(`/leads/${leadId}`);
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
              <Link href="/leads" className="text-blue-600 font-medium text-md">
                Leads
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/leads/${leadId}`} className="text-blue-600 font-medium text-md">
                {initialData.fullName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Lead</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Lead</h1>
          <p className="text-muted-foreground">
            Update lead information and details.
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

      <LeadForm
        initialData={formData}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={mutation.isPending}
        mode="edit"
      />
    </div>
  );
}

