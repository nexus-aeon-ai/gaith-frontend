import { fetchInstance } from "../clients";
import type { Quotation } from "../types";
import type { CreateQuotationFormData } from "../validations/quotation";

const quotationsEndpoint = "/quotations";

interface BackendCurrencyItem {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

const currenciesEndpoint = `${quotationsEndpoint}/currencies`;

// Backend types based on provided API response
interface BackendPricingItem {
  serviceDescription: string;
  servicePrice: number;
  taxPercentage: number;
  quantity: number;
}

export interface BackendQuotationItem {
  id: string;
  quotationNumber: string;
  accountId: string;
  currencyId: string;
  title: string;
  description: string;
  validUntil: string; // ISO
  pricingItems: BackendPricingItem[];
  totalAmount: number;
  termsAndConditions: string;
  notes: string;
  createdBy: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  isActive: boolean;
  isDeleted: boolean;
}

interface BackendQuotationsResponse {
  quotations: BackendQuotationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function formatDateOnly(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function relativeDaysText(fromIso: string): string {
  const now = new Date();
  const target = new Date(fromIso);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} days left`;
  if (diffDays === 0) return "due today";
  return `${Math.abs(diffDays)} days overdue`;
}

function transformQuotation(item: BackendQuotationItem): Quotation {
  // We don't have explicit customer fields in API; use placeholders.
  // Title will be shown as the customer name to provide meaningful context in table.
  return {
    id: item.id,
    quotationId: item.quotationNumber || item.id,
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: item.title || `Account ${item?.accountId?.slice(0, 8)}`,
      email: "-",
    },
    amount: item.totalAmount || 0,
    status: item.isDeleted ? "rejected" : item.isActive ? "pending" : "draft",
    createdDate: formatDateOnly(item.createdAt),
    validUntil: {
      date: formatDateOnly(item.validUntil),
      text: relativeDaysText(item.validUntil),
    },
  };
}

export const getQuotations = async () => {
  const response = await fetchInstance<BackendQuotationsResponse>(quotationsEndpoint);
  const backend = response.data;
  if (response.status >= 200 && response.status < 300) {
    console.log("[getQuotations] Success:", {
      status: response.status,
      data: backend,
    });
  } else {
    console.error("[getQuotations] Failure:", {
      status: response.status,
      data: backend,
    });
  }
  return {
    status: response.status,
    data: backend
      ? {
        results: backend.quotations.map(transformQuotation),
        count: backend.total,
      }
      : { results: [], count: 0 },
  } as {
    status: number;
    data: { results: Quotation[]; count: number };
  };
};

export const createQuotation = async (
  form: CreateQuotationFormData & { currencyId?: string ,accountId: string },
): Promise<{ status: number; data: Quotation | null }> => {

  const accountId = "176c429f-89f7-4389-9e12-19be5d9ddada";
  console.log("account id:", accountId);
  // allow currencyId to come from form; fall back to hardcoded id
  const currencyId = form.currencyId || "4cf154b1-236f-496b-a0aa-3a8d0f1dd2ad";

  const pricingItems = (form.serviceInstance || []).map(item => ({
    serviceDescription: item.description,
    servicePrice: Number(item.servicePrice) || 0,
    taxPercentage: Number(item.tax) || 0,
    quantity: Number(item.quantity) || 0,
  }));

  const totalAmount = pricingItems.reduce((sum, item) => {
    const subtotal = item.quantity * item.servicePrice;
    const tax = subtotal * (item.taxPercentage / 100);
    return sum + subtotal + tax;
  }, 0);

  const body = {
    accountId,
    currencyId,
    title: form.quotationTitle,
    description: form.description,
    quotationNumber: form.quoteNumber,
    validUntil: form.validUntil
      ? new Date(form.validUntil).toISOString()
      : new Date().toISOString(),
    pricingItems,
    totalAmount,
    termsAndConditions:
      "Payment terms: 50% upfront, 50% upon completion. Project timeline: 3-4 months. Includes 6 months of technical support.",
    notes: form.notes || "",
  };

  try {
    const response = await fetchInstance(quotationsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status >= 200 && response.status < 300) {
      console.log("[createQuotation] Success:", {
        status: response.status,
        data: response.data,
      });
    } else {
      console.error("[createQuotation] Failure:", {
        status: response.status,
        data: response.data,
      });
    }
    const respData = response.data as unknown as
      | { quotations?: BackendQuotationItem[] }
      | BackendQuotationItem
      | null;
    const created = (respData && (respData as { quotations?: BackendQuotationItem[] }).quotations
      ? (respData as { quotations: BackendQuotationItem[] }).quotations?.[0]
      : (respData as BackendQuotationItem | null)) as BackendQuotationItem | null;
    return {
      status: response.status,
      data: created ? transformQuotation(created as BackendQuotationItem) : null,
    };
  } catch (error) {
    console.error("[createQuotation] Exception:", error);
    return { status: 500, data: null };
  }
};

export const updateQuotation = async (
  id: string,
  form: CreateQuotationFormData & { currencyId?: string },
): Promise<{ status: number; data: Quotation | null }> => {
  const accountId = "689e1ef8-8c22-4e64-acbc-b34ad7e887c5";
  const currencyId = form.currencyId || "4cf154b1-236f-496b-a0aa-3a8d0f1dd2ad";
  const pricingItems = (form.serviceInstance || []).map(item => ({
    serviceDescription: item.description,
    servicePrice: Number(item.servicePrice) || 0,
    taxPercentage: Number(item.tax) || 0,
    quantity: Number(item.quantity) || 0,
  }));

  const totalAmount = pricingItems.reduce((sum, item) => {
    const subtotal = item.quantity * item.servicePrice;
    const tax = subtotal * (item.taxPercentage / 100);
    return sum + subtotal + tax;
  }, 0);

  const body = {
    accountId,
    currencyId,
    title: form.quotationTitle,
    description: form.description,
    quotationNumber: form.quoteNumber,
    validUntil: form.validUntil
      ? new Date(form.validUntil).toISOString()
      : new Date().toISOString(),
    pricingItems,
    totalAmount,
    termsAndConditions:
      "Payment terms: 50% upfront, 50% upon completion. Project timeline: 3-4 months. Includes 6 months of technical support.",
    notes: form.notes || "",
  };

  try {
    const response = await fetchInstance<BackendQuotationItem>(`${quotationsEndpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status >= 200 && response.status < 300) {
      console.log("[updateQuotation] Success:", {
        status: response.status,
        data: response.data,
      });
    } else {
      console.error("[updateQuotation] Failure:", {
        status: response.status,
        data: response.data,
      });
    }
    const updated = response.data as unknown as BackendQuotationItem | null;
    return {
      status: response.status,
      data: updated ? transformQuotation(updated) : null,
    };
  } catch (error) {
    console.error("[updateQuotation] Exception:", error);
    return { status: 500, data: null };
  }
};

export const deleteQuotation = async (id: string): Promise<{ status: number }> => {
  try {
    const response = await fetchInstance(`${quotationsEndpoint}/${id}`, {
      method: "DELETE",
    });
    if (response.status >= 200 && response.status < 300) {
      console.log("[deleteQuotation] Success:", {
        status: response.status,
        data: response.data,
      });
    } else {
      console.error("[deleteQuotation] Failure:", {
        status: response.status,
        data: response.data,
      });
    }
    return { status: response.status };
  } catch (error) {
    console.error("[deleteQuotation] Exception:", error);
    return { status: 500 };
  }
};

export const getQuotationCurrencies = async (): Promise<{
  status: number;
  data: BackendCurrencyItem[] | null;
}> => {
  try {
    const response = await fetchInstance<BackendCurrencyItem[]>(currenciesEndpoint);
    if (response.status >= 200 && response.status < 300) {
      console.log("[getQuotationCurrencies] Success:", { status: response.status });
    } else {
      console.error("[getQuotationCurrencies] Failure:", { status: response.status, data: response.data });
    }
    return { status: response.status, data: (response.data as BackendCurrencyItem[]) || null };
  } catch (error) {
    console.error("[getQuotationCurrencies] Exception:", error);
    return { status: 500, data: null };
  }
};

export const getQuotationById = async (
  id: string,
): Promise<{ status: number; data: BackendQuotationItem | null }> => {
  try {
    const response = await fetchInstance<BackendQuotationItem>(`${quotationsEndpoint}/${id}`);
    if (response.status >= 200 && response.status < 300) {
      console.log("[getQuotationById] Success:", { status: response.status });
    } else {
      console.error("[getQuotationById] Failure:", { status: response.status, data: response.data });
    }
    return { status: response.status, data: (response.data as BackendQuotationItem) || null };
  } catch (error) {
    console.error("[getQuotationById] Exception:", error);
    return { status: 500, data: null };
  }
};
