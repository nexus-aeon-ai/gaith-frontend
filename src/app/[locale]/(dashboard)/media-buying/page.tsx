import React from "react";

import MediaBuyingPage from "@/components/MediaBuying/MediaBuyingPage";
import { getMediaBuyingPlans } from "@/lib/api/reports";

export default async function MediaBuyingServerPage() {
  // Fetch initial media buying plans from API
  let initialPlans: Array<{
    id: number;
    created_at: string;
    updated_at: string;
    status: "draft" | "completed" | "failed";
  }> = [];

  try {
    const response = await getMediaBuyingPlans();
    if (response.status === 200 && response.data) {
      // Extract plans from the nested structure
      initialPlans = response.data.details?.message || [];
    }
  } catch (error) {
    console.error("Error fetching media buying plans:", error);
  }

  return <MediaBuyingPage initialPlans={initialPlans} />;
}

