import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { Locale } from "@/lib/types";

import { IsUserAuthenticated } from "./lib/auth";

function getLocale(request: NextRequest): string {
  // Check for locale in cookies first
  const cookieDefaultLocale = request.cookies.get("DEFAULT_LOCALE")?.value;
  if (cookieDefaultLocale && LOCALES.includes(cookieDefaultLocale as Locale)) {
    return cookieDefaultLocale;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale;
  }

  // If no cookie, check Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages();

  try {
    return matchLocale(languages, LOCALES, DEFAULT_LOCALE);
  } catch {
    return DEFAULT_LOCALE;
  }
}

const AUTH_PAGES = ["/login", "/signup", "/pricing"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  // Check if the pathname starts with a locale
  const pathnameHasLocale = LOCALES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let response: NextResponse;

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  } else {
    // Check if user is authenticated (has auth token in cookies)
    const isAuthenticated = await IsUserAuthenticated();
    console.log("isAuthenticated", isAuthenticated);
    console.log("pathname", pathname);
    console.log("AUTH_PAGES", AUTH_PAGES.includes(pathname.replace(`/${locale}`, "")));

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && AUTH_PAGES.includes(pathname.replace(`/${locale}`, ""))) {
      response = NextResponse.redirect(new URL("/", request.url));
    }
    // Handle authentication
    else if (
      !isAuthenticated &&
      !pathname.includes("/login") &&
      !pathname.includes("/signup") &&
      !pathname.includes("/forget-password") &&
      !pathname.includes("/pricing")
    ) {
      response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    } else {
      response = NextResponse.next();
    }
  }

  // Set locale cookies to preserve preference across route changes
  const pathLocale = pathname.split("/")[1];
  if (LOCALES.includes(pathLocale as Locale)) {
    response.cookies.set("NEXT_LOCALE", pathLocale);
    response.cookies.set("DEFAULT_LOCALE", pathLocale);
  }

  return response;
}

export const config = {
  // add public routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|svgs).*)"],
};
