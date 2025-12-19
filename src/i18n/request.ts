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
 
export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to DEFAULT_LOCALE
  const validLocale = locale && LOCALES.includes(locale as any) ? locale : DEFAULT_LOCALE;
  console.log("i18n request config - validLocale:", validLocale);
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});