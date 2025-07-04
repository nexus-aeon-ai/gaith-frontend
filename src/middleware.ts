import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { Locale } from "@/lib/types";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string {
    // Check for locale in cookies first
    const cookieDefaultLocale = request.cookies.get("DEFAULT_LOCALE")?.value;
    if (
        cookieDefaultLocale &&
        LOCALES.includes(cookieDefaultLocale as Locale)
    ) {
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

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    // const token = request.cookies.get("accessToken")?.value;
    const locale = getLocale(request);

    // Check if the pathname starts with a locale
    const pathnameHasLocale = LOCALES.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (!pathnameHasLocale) {
        // Redirect if there is no locale
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url),
        );
    }

    // Handle authentication
    // if (
    //     !token &&
    //     !pathname.includes("/login") &&
    //     !pathname.includes("/signup") &&
    //     !pathname.includes("/pricing")
    // ) {
    //     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    // }

    return NextResponse.next();
}

export const config = {
    // add public routes
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
