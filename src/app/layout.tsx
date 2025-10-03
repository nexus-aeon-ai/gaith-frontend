import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Gait - Dashboard",
  description: "Gait - Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <footer className="w-full text-center py-4 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Gaith | All rights reserved |{" "}
          <a href="https://gaith.ae" className="underline hover:text-blue-600">
            Terms of Service
          </a>
        </footer>
      </body>
    </html>
  );
}
