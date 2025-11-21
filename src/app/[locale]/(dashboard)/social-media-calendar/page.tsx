import React from "react";

import SocialCalendarPage from "@/components/SocialCalendar";
import { CalendarListItem, getSocialMediaCalendars } from "@/lib/api/reports";

export default async function SocialMediaCalendarServerPage() {
  let calendarsList: CalendarListItem[] = [];
  let initialCalendarData = null;
  let selectedCalendarId: number | null = null;
  
  try {
    // First, fetch the list of calendars (without calendar_id)
    const listResponse = await getSocialMediaCalendars();
    
    if (listResponse.status === 200 && listResponse.data?.details?.message) {
      const message = listResponse.data.details.message;
      
      // Check if message is an array (list response)
      if (Array.isArray(message)) {
        // Sort calendars: completed > failed > draft
        const statusPriority = { completed: 1, failed: 2, draft: 3 };
        calendarsList = message.sort((a, b) => {
          return statusPriority[a.status] - statusPriority[b.status];
        });
        
        // Default to first calendar (which is now the highest priority completed one)
        const defaultCalendar = calendarsList[0];
        
        if (defaultCalendar) {
          selectedCalendarId = defaultCalendar.id;
          
          // Fetch the full calendar data for the selected calendar
          const calendarResponse = await getSocialMediaCalendars(selectedCalendarId);
          
          if (calendarResponse.status === 200 && calendarResponse.data?.details?.message) {
            const apiData = calendarResponse.data.details.message as {
              calendar?: { calendar: any[] };
              created_at: string;
              updated_at: string;
              status: "draft" | "completed" | "failed";
            };
            
            // Transform API structure to match component expectations
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
    />
  );
}
