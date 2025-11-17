"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import QuotationForm from "@/components/Forms/QuotationForm";
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
import { BackendQuotationItem, getQuotationById, updateQuotation } from "@/lib/api/quotations";
import { CreateQuotationFormData, udpateQuoteSchema } from "@/lib/validations/quotation";

import { Quotation } from "../../lib/types";

const EditQuote = ({
  closeEditQuoteForm,
  quotation,
}: {
  closeEditQuoteForm: () => void;
  quotation: Quotation | null;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: { id: string; data: CreateQuotationFormData }) => {
      return updateQuotation(payload.id, payload.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
      closeEditQuoteForm();
    },
    onError: err => {
      console.error("Failed to update quotation.", err);
    },
  });

  const handleCancel = () => {
    closeEditQuoteForm();
  };

  const handleSave = async (data: CreateQuotationFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data using partial (update) schema so optional fields are allowed
      const result = udpateQuoteSchema.safeParse(data);
      if (!result.success) {
        console.log("validation erroir:", result.error);
        // Extract validation errors (optional: surface to UI later)
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        return;
      }
      if (!quotation) return;
      // prefer backend id (uuid) if available
      const backendId = quotation?.id;
      mutation.mutate({ id: backendId as string, data: result.data as CreateQuotationFormData });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // if we have a backend id for this quotation, fetch full details to prefill the edit form
  const backendId = quotation?.id;
  const { data: backendResp } = useQuery<BackendQuotationItem | null>({
    queryKey: ["quotation-edit", backendId],
    queryFn: async () => {
      if (!backendId) return null;
      const resp = await getQuotationById(backendId);
      return resp.data;
    },
    enabled: !!backendId,
  });

  const mapToInitialData = (
    item: BackendQuotationItem | null,
  ): CreateQuotationFormData | undefined => {
    if (!item) return undefined;
    const serviceInstance = (item.pricingItems || []).map(p => {
      const serviceId = p.serviceId || "";
      const currencyId = p.currencyId || "";
      const servicePrice = Number(p.servicePrice) || 0;
      const tax = Number(p.taxPercentage) || 0;
      const total = parseFloat((1 * servicePrice * (1 + tax / 100)).toFixed(2));
      return {
        serviceId: serviceId || "",
        currencyId: currencyId || "",
        servicePrice,
        taxPercentage: tax,
        total,
      };
    });

    return {
      clientId: item?.accountId || "",
      validUntil: item.validUntil ? new Date(item.validUntil) : new Date(),
      title: item.title || "",
      description: item.description || "",
      serviceInstance: serviceInstance.length
        ? serviceInstance
        : [{ serviceId: "", currencyId: "", servicePrice: 0, taxPercentage: 0, total: 0 }],
      notes: item.notes || "",
      status: item.status,
    };
  };

  const initialData: CreateQuotationFormData | undefined = mapToInitialData(backendResp || null);

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
                href="/quotations"
                className="text-blue-600 font-medium text-md"
                onClick={closeEditQuoteForm}
              >
                Quotations Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Quotation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Quotation</h1>
          <p className="text-muted-foreground">
            {quotation?.id} - {quotation?.customer.name}
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
            form="quotation-form"
            variant={"outline"}
            disabled={isSubmitting}
            onClick={() => console.log("EditQuote Save button clicked")}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0]/80 font-[400] rounded-[16px] border-none bg-[#3072C0] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <QuotationForm
        mode="edit"
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        quotation={quotation}
        initialData={initialData}
      />
    </div>
  );
};

export default EditQuote;
