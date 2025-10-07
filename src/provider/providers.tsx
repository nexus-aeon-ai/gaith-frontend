"use client";
import { getCookie } from "cookies-next";
import type { FC } from "react";
import { ToastContainer } from "react-toastify";

import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const theme = getCookie("theme");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={typeof theme === "string" ? theme : "system"}
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Providers;
