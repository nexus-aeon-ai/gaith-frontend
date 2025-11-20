import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import React from "react";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
        <footer className="w-full text-center py-4 text-xs bg-[#E4E9F1] dark:bg-[#0F1220] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Gaith | All rights reserved |{" "}
          <a href="https://gaith.ae" className="underline hover:text-blue-600">
            Terms of Service
          </a>
        </footer>
      </body>
    </html>
  );
}
