import React from "react";

import SocialCalendarPage from "@/components/SocialCalendar";
import {
  CalendarListItem,
  type SocialMediaCalendarListResponse,
  getSocialMediaCalendars,
  type SocialMediaCalendarData,
} from "@/lib/api/reports";

const isPaginatedCalendarList = (
  message: unknown,
): message is SocialMediaCalendarListResponse["details"]["message"] => {
  return typeof message === "object" && message !== null && "results" in message;
};

export default async function SocialMediaCalendarServerPage() {
  let calendarsList: CalendarListItem[] = [];
  let initialCalendarData = null;
  let selectedCalendarId: number | null = null;
  let pagination:
    | {
        count: number;
        num_pages: number;
        current_page: number;
        has_next: boolean;
        has_previous: boolean;
        next_page: number | null;
        previous_page: number | null;
      }
    | null = null;

  try {
    const listResponse = await getSocialMediaCalendars(undefined, 1);

    if (listResponse.status === 200 && listResponse.data?.details?.message) {
      const message = listResponse.data.details.message;

      if (Array.isArray(message)) {
        calendarsList = message;
      } else if (isPaginatedCalendarList(message)) {
        calendarsList = message.results || [];
        pagination = {
          count: message.count,
          num_pages: message.num_pages,
          current_page: message.current_page,
          has_next: message.has_next,
          has_previous: message.has_previous,
          next_page: message.next_page,
          previous_page: message.previous_page,
        };
      }

      if (calendarsList.length) {
        const statusPriority: Record<CalendarListItem["status"], number> = { completed: 1, failed: 2, draft: 3 };
        calendarsList = calendarsList
          .slice()
          .sort(
            (a: CalendarListItem, b: CalendarListItem) =>
              statusPriority[a.status] - statusPriority[b.status],
          );

        const defaultCalendar = calendarsList[0];

        if (defaultCalendar) {
          selectedCalendarId = defaultCalendar.id;

          const calendarResponse = await getSocialMediaCalendars(selectedCalendarId);

          if (calendarResponse.status === 200 && calendarResponse.data?.details?.message) {
            const apiData = calendarResponse.data.details.message as SocialMediaCalendarData;

            if (apiData.calendar?.calendar) {
              initialCalendarData = {
                calendar: apiData.calendar.calendar,
                created_at: apiData.created_at,
                updated_at: apiData.updated_at,
                status: apiData.status,
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }

  return (
    <SocialCalendarPage
      calendarsList={calendarsList}
      initialCalendarData={initialCalendarData}
      initialSelectedCalendarId={selectedCalendarId}
      initialPagination={pagination}
    />
  );
}
