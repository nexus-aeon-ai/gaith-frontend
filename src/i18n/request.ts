// import { getRequestConfig } from "next-intl/server";

// import { LOCALES } from "@/lib/constants";
// export default getRequestConfig(async ({ locale }) => {
//   if (!locale) {
//     locale = "en";
//   }
//   if (!locale || !LOCALES.includes(locale as (typeof LOCALES)[number])) {
//     throw new Error("Invalid locale");
//   }

//   try {
//     const messages = (await import(`./messages/${locale}.json`)).default;
//     return {
//       messages,
//       locale,
//     };
//   } catch {
//     throw new Error(`Failed to load messages for locale: ${locale}`);
//   }
// });


import {getRequestConfig} from 'next-intl/server';

import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';

// Pre-load message imports to ensure namespaces are available
const messageImports = {
  en: () => import('./messages/en.json'),
  ar: () => import('./messages/ar.json'),
} as const;
 
export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to DEFAULT_LOCALE
  const validLocale = (locale && LOCALES.includes(locale as any) ? locale : DEFAULT_LOCALE) as keyof typeof messageImports;
  
  try {
    const messageModule = await messageImports[validLocale]();
    const messages = messageModule.default;
    
    if (!messages) {
      console.error(`Messages object is null/undefined for locale: ${validLocale}`);
      throw new Error(`Failed to load messages for locale: ${validLocale}`);
    }
    
    // Verify EmployeeTasks namespace exists
    if (!messages.EmployeeTasks) {
      console.error(`EmployeeTasks namespace missing in messages for locale: ${validLocale}`);
    }
    
    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${validLocale}:`, error);
    throw error;
  }
});