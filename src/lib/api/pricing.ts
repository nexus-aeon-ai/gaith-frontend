import { fetchInstance } from "../clients";

// Request payload types
export interface SelectedService {
  serviceId: string;
  quantity: number;
}

export interface CustomService {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  vatRatePct?: number;
}

export interface SelectedAddon {
  addonId: string;
  quantity: number;
}

export interface CustomAddon {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  vatRatePct?: number;
}

export interface SelectedPackage {
  packageTemplateId: string;
}

export interface DiscountPayload {
  apply: boolean;
  type?: "PERCENTAGE" | "FIXED" | string;
  amount?: number;
  reasonId?: string;
  notes?: string;
}

export interface CreatePricingProposalPayload {
  clientId: string;
  clientContactName: string;
  clientContactEmail: string;
  preparedByEmployeeId?: string;
  preparedByTitle?: string;
  proposalDate: string; // ISO date string
  validUntil: string; // ISO date string
  title?: string;
  currencyCode: string;
  paymentTermId?: string;
  notes?: string;
  termsAndConditions?: string;
  selectedServices?: SelectedService[];
  customServices?: CustomService[];
  selectedAddons?: SelectedAddon[];
  customAddons?: CustomAddon[];
  selectedPackages?: SelectedPackage[];
  enablePackages?: boolean;
  discount?: DiscountPayload;
}

// Response type - keep generic as backend contract may vary
export interface CreatePricingProposalResponse {
  id?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Create a pricing proposal.
 * POST /pricing/proposals
 *
 * Returns the fetchInstance response ({ status, data }).
 */
export const createPricingProposal = async (
  payload: CreatePricingProposalPayload,
): Promise<{ status: number; data: CreatePricingProposalResponse | null }> => {
  const response = await fetchInstance<CreatePricingProposalResponse>("/pricing/proposals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response;
};

export default createPricingProposal;
