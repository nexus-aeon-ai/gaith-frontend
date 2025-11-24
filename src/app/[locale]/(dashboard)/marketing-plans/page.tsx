import React from "react";

import MarketingPlansPage from "@/components/MarketingPlans/MarketingPlansPage";
import { getMarketingPlans, type MarketingPlanListItem } from "@/lib/api/reports";

export default async function MarketingPlansServerPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  let initialPlans: MarketingPlanListItem[] = [];

  try {
    const response = await getMarketingPlans(page);
    if (response.status === 200 && response.data?.details?.message) {
      initialPlans = response.data.details.message;
    }
  } catch (error) {
    console.error("Error fetching marketing plans:", error);
  }

  return <MarketingPlansPage initialPlans={initialPlans} />;
}

