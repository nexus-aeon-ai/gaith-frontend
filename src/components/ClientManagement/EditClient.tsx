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
import { DashboardListIcon } from "@/components/ui/icons/sidebar/dashboard-list";
import { deleteClient, updateClient } from "@/lib/api/client/client";
import { SocialMediaUrls } from "@/lib/api/leads";
import { Client } from "@/lib/types";
import { CreateClientFormData, createClientSchema } from "@/lib/validations/client";

interface EditClientProps {
  client: Client | null;
  closeEditClientForm: () => void;
}

const EditClient = ({ client, closeEditClientForm }: EditClientProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapClientToFormData = (client: Client | null): CreateClientFormData => {
    if (!client) return {} as CreateClientFormData;
    // helper to safely parse a date-like value into a Date object
    const safeParseDate = (val: unknown): Date => {
      if (!val) return new Date();
      if (val instanceof Date) return val;
      if (typeof val !== "string") return new Date();

      // Trim and handle common display formats like "December 18, 2025 at 2:30 PM"
      let s = val.trim();
      // remove trailing 'at HH:MM' parts which break Date parsing in some locales
      s = s.replace(/\s+at\s+.*$/i, "");

      const parsed = new Date(s);
      if (!isNaN(parsed.getTime())) return parsed;

      // Try parsing only the date portion (remove time, timezone words)
      const dateOnly = s.replace(/[,\s]+\d{1,2}:\d{2}(?:\s?[AP]M)?$/i, "").trim();
      const parsed2 = new Date(dateOnly);
      if (!isNaN(parsed2.getTime())) return parsed2;

      // fallback to now
      return new Date();
    };

    return {
      fullName: client.name || "",
      industry: client.services || "technology",
      businessOverview: "", // Not available in client data
      email: client.email || "",
      companySize: "0-50", // Default as not available in client data
      contactName: "", // Not available in client data
      jobTitle: "", // Not available in client data
      phoneNumber: client.contactInfo || "",
      location: client.marketRegion || "",
      fullAddress: "", // Not available in client data
      linkedinProfile: "", // Not available in client data
      department: "", // Not available in client data
      accountManager: "", // Not available in client data
      clientSince: safeParseDate(client.agreementPeriod?.start ?? null),
      agreementStartDate: safeParseDate(client.agreementPeriod?.start ?? null),
      agreementEndDate: safeParseDate(client.agreementPeriod?.end ?? null),
      clientStatus: (client.status || "active").toLowerCase() as
        | "active"
        | "inactive"
        | "pending"
        | "suspended",
      monthlyBudget: "0", // Not available in client data
      priorityLevel: "low", // Default as not available
      websiteUrl: "", // Not available in client data
      internalNotes: "", // Not available in client data
      
      // New Fields
      primaryMarketRegionId: "", // Not available in client data
      secondaryMarketIds: [],
      targetAudienceId: "", // Not available in client data
      languagesSupported: [],
      serviceOfferingIds: [],
      assignedUserIds: [],
      teamRoleIds: [],
      visionStatement: "",
      missionStatement: "",
      businessMaturity: "",
    };
  };

  const handleCancel = () => {
    closeEditClientForm();
  };

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
      if (!client?.id) {
        throw new Error("Missing client id");
      }

      // Map form data to API request format - build socialMediaUrls array
      const socialMediaUrls: SocialMediaUrls = [];
      if (data.linkedinProfile) socialMediaUrls.push({ platform: "LinkedIn", url: data.linkedinProfile });
      if (data.facebookUrl) socialMediaUrls.push({ platform: "Facebook", url: data.facebookUrl });
      if (data.twitterUrl) socialMediaUrls.push({ platform: "Twitter", url: data.twitterUrl });
      if (data.instagramUrl) socialMediaUrls.push({ platform: "Instagram", url: data.instagramUrl });

      const payload = {
        // Required fields only as per API spec
        clientName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths:
          (data.agreementEndDate.getFullYear() - data.agreementStartDate.getFullYear()) * 12 +
          (data.agreementEndDate.getMonth() - data.agreementStartDate.getMonth()),
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
      };

      const response = await updateClient(client.id, payload);

      if (response.status >= 200 && response.status < 300) {
        alert("Client updated successfully!");
        closeEditClientForm();
      } else {
        console.error("Update failed", response);
        throw new Error("Failed to update client");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!client?.id) return;

    const confirmed = confirm("Are you sure you want to delete this client? This action cannot be undone.");
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const response = await deleteClient(client.id);
      if (response.status >= 200 && response.status < 300) {
        alert("Client deleted successfully");
        closeEditClientForm();
      } else {
        console.error("Delete failed:", response);
        throw new Error("Failed to delete client");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the client. Please try again.");
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
              <Link
                href="/client-management"
                className="text-blue-600 font-medium text-md"
                onClick={closeEditClientForm}
              >
                Client Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/client-management"
                className="text-blue-600 font-medium text-md"
                onClick={closeEditClientForm}
              >
                {client?.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Client</h1>
          <p className="text-muted-foreground">
            Create a comprehensive client profile with all necessary information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="p-6 px-8 bg-red-600 hover:bg-red-700 text-white rounded-[16px]"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
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
            className="p-6 px-8 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ClientForm
        initialData={mapClientToFormData(client)}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default EditClient;
