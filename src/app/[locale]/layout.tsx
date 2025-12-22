import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";
import "../globals.css";

import Providers from "@/provider/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gait - Dashboard",
  description: "Gait - Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  
  // Ensure EmployeeTasks namespace exists in messages
  if (messages && !messages.EmployeeTasks) {
    console.warn(`EmployeeTasks namespace missing for locale: ${locale}`);
  }
  
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
          <footer className="w-full text-center py-4 text-xs bg-[#E4E9F1] dark:bg-[#0F1220] text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Gaith | All rights reserved |{" "}
            <a href="https://gaith.ae" className="underline hover:text-blue-600">
              Terms of Service
            </a>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
