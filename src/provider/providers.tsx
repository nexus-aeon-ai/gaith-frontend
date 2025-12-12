"use client";
import type { FC } from "react";
import { ToastContainer } from "react-toastify";

import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Providers;
