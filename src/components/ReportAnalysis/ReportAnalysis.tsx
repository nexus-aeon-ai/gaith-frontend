"use client";

import { MoveUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

import { EngagementTrend, TopClients, BudgetUtilization } from "@/components/analytics";
import AlertsNotifications from "@/components/Dashboard/AlertsNotifications";
import ClientReportsTable from "@/components/ReportAnalysis/ClientReports";
import LeadReportsTable from "@/components/ReportAnalysis/LeadReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { QuotationIcon } from "@/components/ui/icons/analytics/quotation";
import { RejectedIcon } from "@/components/ui/icons/analytics/rejected";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { PendingIcon } from "../ui/icons/alerts/pending";

const analyticsCards = [
  {
    id: "total-quotations",
    label: "Total Quotations",
    value: "548",
    icon: <QuotationIcon className="text-[#3072C0] w-8 h-8" />,
  },
  {
    id: "pending-approvals",
    label: "Pending Approvals",
    value: "37",
    icon: <PendingIcon className="text-[#D29A09] w-8 h-8" />,
  },
  {
    id: "accepted",
    label: "Accepted",
    value: "370",
    icon: <PendingIcon className="text-[#2BAE82] w-8 h-8" />,
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "7",
    icon: <RejectedIcon className="text-[#2BAE82] w-8 h-8" />,
  },
];

const ReportAnalysis = () => {
  const { theme: themeNext } = useTheme();

  return (
    <div className="w-full p-4 md:p-6 space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report & Analysis</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive campaign performance insights and analytics
          </p>
        </div>
        <div className="flex gap-2 md:flex-row flex-col">
          <div className="relative w-full">
            <Input
              id="date-start"
              type="date"
              className="
               rounded-[16px] bg-white dark:bg-card p-6
                pr-10 shadow-none
                border border-gray-300 dark:border-gray-500
                [&::-webkit-calendar-picker-indicator]:opacity-0 
                [&::-webkit-calendar-picker-indicator]:absolute 
                [&::-webkit-calendar-picker-indicator]:w-full 
                [&::-webkit-calendar-picker-indicator]:h-full
              "
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <CalendarIcon color={themeNext === "dark" ? "#CCCFDB" : "#303444"} />
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-1 sm:gap-2",
                  "bg-white dark:bg-card rounded-2xl sm:w-auto",
                  "px-3 sm:px-4 lg:px-6 py-6",
                  "border border-gray-300 dark:border-gray-500 h-12 shadow-none",
                  "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                  "text-sm font-medium cursor-pointer",
                )}
              >
                <div className="rounded-sm bg-[#508CD3]/30 p-1">
                  <MoveUpRight className="h-4 w-4" color="#508CD3" />
                </div>
                <span>Export as</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="rounded-2xl border border-gray-300 dark:border-gray-500 p-2 bg-white dark:bg-card"
            >
              <DropdownMenuItem
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer",
                  "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                )}
              >
                <PdfIcon className="h-4 w-4" />
                <span>Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer",
                  "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                )}
              >
                <ExcelIcon className="h-4 w-4" />
                <span>Export Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map(card => (
          <Card key={card.id} className="rounded-[12px]">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium opacity-80 mb-1">{card.label}</span>
                  <div>{card.icon}</div>
                </div>
                <span className="text-[24px] font-bold leading-tight">{card.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex flex-col gap-6 w-full mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <TopClients />
          <BudgetUtilization />
        </div>

        {/* Second row - EngagementTrend and AlertsNotifications side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <EngagementTrend />
          <AlertsNotifications />
        </div>
        {/* third row -  */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <ClientReportsTable />
          <LeadReportsTable />
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
