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
import { Client } from "@/lib/types";
import { CreateClientFormData, createClientSchema } from "@/lib/validations/client";

interface EditClientProps {
  client: Client | null;
  closeEditClientForm: () => void;
}

const EditClient = ({ client, closeEditClientForm }: EditClientProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCancel = () => {
    closeEditClientForm();
    console.warn(client);
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

      // Map form data to API request shape
      const [city = "", country = ""] = data.location
        ? data.location.split(",").map(s => s.trim())
        : ["", ""];

      const payload = {
        clientName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber || "",
        industrySectorId: data.industry,
        businessOverview: data.businessOverview,
        agreementStartDate: data.agreementStartDate.toISOString(),
        agreementEndDate: data.agreementEndDate.toISOString(),
        contractDurationMonths: parseInt(data.contractDuration) || 0,
        primaryMarketRegionId: "",
        targetAudienceId: "",
        secondaryMarketIds: [],
        languagesSupported: [],
        visionStatement: "",
        missionStatement: "",
        serviceOfferingIds: [],
        linkedinUrl: data.linkedinProfile || "",
        twitterUrl: "",
        instagramUrl: "",
        youtubeUrl: "",
        websiteUrl: data.websiteUrl || "",
        locationCity: city,
        locationCountry: country,
        fullAddress: data.fullAddress,
        accountManagerId: data.accountManager || "",
        marketingStrategistId: "",
        assignedUserIds: [],
        teamRoleIds: [],
        type: "Client",
        fullName: data.fullName,
        companyName: data.fullName,
        industry: data.industry,
        country: country,
        city: city,
        branchLocations: {},
        languagePreferences: "",
        businessMaturity: "",
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
      alert("An error occurred while creating the client. Please try again.");
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
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default EditClient;
