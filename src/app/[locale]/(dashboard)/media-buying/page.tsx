import React from "react";

import MediaBuyingPage from "@/components/MediaBuying/MediaBuyingPage";
import { getMediaBuyingPlans, type MediaBuyingListItem } from "@/lib/api/reports";

export default async function MediaBuyingServerPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  let initialPlans: MediaBuyingListItem[] = [];

  try {
    const response = await getMediaBuyingPlans(page);
    if (response.status === 200 && response.data?.details?.message) {
      initialPlans = response.data.details.message;
    }
  } catch (error) {
    console.error("Error fetching media buying plans:", error);
  }

  return <MediaBuyingPage initialPlans={initialPlans} />;
}

