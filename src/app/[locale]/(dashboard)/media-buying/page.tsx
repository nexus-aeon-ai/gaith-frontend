import React from "react";

import MediaBuyingPage from "@/components/MediaBuying/MediaBuyingPage";
import { getMediaBuyingPlans, type MediaBuyingListItem } from "@/lib/api/reports";

export default async function MediaBuyingServerPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  let initialPlans: MediaBuyingListItem[] = [];
  let pagination = {
    count: 0,
    num_pages: 1,
    current_page: 1,
    has_next: false,
    has_previous: false,
    next_page: null as number | null,
    previous_page: null as number | null,
  };

  try {
    const response = await getMediaBuyingPlans(page);
    if (response.status === 200 && response.data?.details?.message) {
      initialPlans = response.data.details.message.results || [];
      pagination = {
        count: response.data.details.message.count || 0,
        num_pages: response.data.details.message.num_pages || 1,
        current_page: response.data.details.message.current_page || 1,
        has_next: response.data.details.message.has_next || false,
        has_previous: response.data.details.message.has_previous || false,
        next_page: response.data.details.message.next_page,
        previous_page: response.data.details.message.previous_page,
      };
    }
  } catch (error) {
    console.error("Error fetching media buying plans:", error);
  }

  return <MediaBuyingPage initialPlans={initialPlans} pagination={pagination} />;
}

