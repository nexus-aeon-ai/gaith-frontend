"use client";
import { useTheme } from "next-themes";
import React, { useRef } from "react";

import { EngagementTrend, TopClients, BudgetUtilization } from "@/components/analytics";
import ClientReportsTable from "@/components/ReportAnalysis/ClientReports";
import LeadReportsTable from "@/components/ReportAnalysis/LeadReports";
import { Button } from "@/components/ui/button";
import AED from "@/components/ui/icons/aed";
import DownArrow from "@/components/ui/icons/down-arrow";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import UpArrow from "@/components/ui/icons/up-arrow";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ActiveClientsIcon } from "../ui/icons/analytics/activeClients";
import { CalenderIcon } from "../ui/icons/analytics/calender";
import { CampaignsIcon } from "../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../ui/icons/analytics/contentPieces";
import { SuccessRateIcon } from "../ui/icons/analytics/successRate";

import AlertsNotifications from "./AlertsNotifications";
import AnalyticsCard, { AnalyticsSummaryCardProps } from "./AnalyticsCard";

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Active Clients",
    value: 24,
    icon: <ActiveClientsIcon className="text-[#508CD3] w-12 h-12" />,
    trend: (
      <p className="flex items-center">
        <UpArrow className="light:text-[#16A34A]" width={16} height={16} />
        12.5%
      </p>
    ),
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Ongoing Campaigns",
    value: 37,
    icon: <CampaignsIcon className="text-[#2BAE82] w-12 h-12" />,
    trend: (
      <p className="flex items-center">
        <UpArrow className="light:text-[#16A34A]" width={16} height={16} />
        8.3%
      </p>
    ),

    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    label: "Content Pieces",
    value: (
      <p className="flex items-center gap-1">
        1,420,100 <AED width={15} height={13} />
      </p>
    ),
    icon: <ContentPiecesIcon className="text-[#ff5999d2] w-12 h-12" />,
    trend: (
      <p className="flex items-center">
        <UpArrow className="light:text-[#16A34A]" width={16} height={16} />
        12.5%
      </p>
    ),
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Calendar Completion",
    value: "86%",
    icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
    trend: (
      <p className="flex items-center">
        <DownArrow width={16} height={16} />
        8.3%
      </p>
    ),
    trendColor: "text-red-500",
    subLabel: "Last month",
  },
  {
    label: "Success Rate",
    value: "78%",
    icon: <SuccessRateIcon className="text-[#EA3B1F] w-12 h-12" />,
    trend: (
      <p className="flex items-center">
        <UpArrow className="light:text-[#16A34A]" width={16} height={16} />
        12.5%
      </p>
    ),
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
];

const DashboardMain = () => {
  const { theme } = useTheme();
  const dateRef = useRef<HTMLInputElement | null>(null);

  const openCalendar = () => {
    dateRef.current?.showPicker();
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 font-inter">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview of your marketing performance
          </p>
        </div>
        <div className="flex gap-2 md:flex-row flex-col">
          <div className="relative w-full">
            <Input
              ref={dateRef}
              id="date-dashboard"
              type="date"
              className="
               rounded-[16px] bg-white dark:bg-card p-6
                pr-10 shadow-none
                border border-gray-300 dark:border-gray-500
                [&::-webkit-calendar-picker-indicator]:opacity-0 
                [&::-webkit-calendar-picker-indicator]:absolute 
                [&::-webkit-calendar-picker-indicator]:w-full 
                [&::-webkit-calendar-picker-indicator]:h-full 
                hover:border-blue-600 dark:hover:border-blue-500 hover:bg-[white] 
              "
            />
            <button
              type="button"
              onClick={openCalendar}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-white dark:bg-card rounded-2xl sm:w-auto",
              "px-3 sm:px-4 lg:px-6 py-6",
              "border border-gray-300 dark:border-gray-500 h-12 shadow-none",
              "hover:border-blue-600 dark:hover:border-blue-500 hover:bg-[white]  hover:text-primary text-[#303444] dark:text-[#CCCFDB]",
              "text-sm font-medium cursor-pointer",
            )}
          >
            <ExcelIcon className="!h-6 !w-6" />
            <span>Export Excel</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-white dark:bg-card rounded-2xl sm:w-auto",
              "px-3 sm:px-4 lg:px-6 py-6",
              "border border-gray-300 dark:border-gray-500 h-12 shadow-none",
              "hover:border-blue-600 dark:hover:border-blue-500 hover:bg-[white]  hover:text-primary text-[#303444] dark:text-[#CCCFDB]",
              "text-sm font-medium cursor-pointer",
            )}
          >
            <PdfIcon className="!h-5 !w-5" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Top analytics cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
          <AnalyticsCard key={idx} {...card} />
        ))}
      </div>
      {/* Main dashboard grid */}
      {/* First row - TopClients and BudgetUtilization side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <TopClients />
        <BudgetUtilization />
      </div>

      {/* Second row - EngagementTrend and AlertsNotifications side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <EngagementTrend />
        <AlertsNotifications />
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <ClientReportsTable />
        <LeadReportsTable />
      </div>
    </div>
  );
};

export default DashboardMain;
