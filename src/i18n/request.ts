import { getRequestConfig } from "next-intl/server";

import { LOCALES } from "@/lib/constants";
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    locale = "en";
  }
  if (!locale || !LOCALES.includes(locale as (typeof LOCALES)[number])) {
    throw new Error("Invalid locale");
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      messages,
      locale,
    };
  } catch {
    throw new Error(`Failed to load messages for locale: ${locale}`);
  }
});
