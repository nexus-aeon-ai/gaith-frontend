"use client";

import { Search } from "lucide-react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActiveClientsIcon } from "@/components/ui/icons/analytics/activeClients";
import { CampaignsIcon } from "@/components/ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "@/components/ui/icons/analytics/contentPieces";
import { SuccessRateIcon } from "@/components/ui/icons/analytics/successRate";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const analyticsCards = [
  {
    id: "active-clients",
    label: "Active Clients",
    value: "24",
    trend: "12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
    icon: <ActiveClientsIcon className="text-[#508CD3] w-8 h-8" />,
  },
  {
    id: "ongoing-campaigns",
    label: "Ongoing Campaigns",
    value: "37",
    trend: "+8.5%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
    icon: <CampaignsIcon className="text-[#2BAE82] w-8 h-8" />,
  },
  {
    id: "content-pieces",
    label: "Content Pieces",
    value: "1,420,100",
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
    icon: <ContentPiecesIcon className="text-[#ff5999d2] w-8 h-8" />,
  },
  {
    id: "calendar-completion",
    label: "Calendar Completion",
    value: "86%",
    trend: "-12.5%",
    trendColor: "text-red-500",
    subLabel: "Last month",
    icon: (
      <div className="rounded-full bg-[#D29A09]/10 p-1">
        <CalendarIcon color="#D29A09" width={18} height={18} />
      </div>
    ),
  },
  {
    id: "success-rate",
    label: "Success Rate",
    value: "78%",
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
    icon: <SuccessRateIcon className="text-[#F5B719] w-8 h-8" />,
  },
];


const ReportAnalysis = () => {
  const { theme: themeNext } = useTheme();

  return (
    <div className="w-full p-4 md:p-6 space-y-3 font-inter">
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
          <div className="flex  items-center gap-2 ">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-white dark:bg-card rounded-2xl sm:w-auto",
                "px-3 sm:px-4 lg:px-6 py-6",
                "border border-gray-300 dark:border-gray-500 h-12 shadow-none",
                "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                "text-sm font-medium",
              )}
            >
              <ExcelIcon className="h-4 w-4" />
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
                "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                "text-sm font-medium",
              )}
            >
              <PdfIcon className="w-5 h-5" />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and actions section */}
      <div
        className={cn(
          "bg-card items-center justify-center rounded-[16px] px-3 py-2 mb-3 shadow-sm",
        )}
      >
        <div
          className={cn(
            "flex flex-col lg:flex-row items-start lg:items-center justify-between ",
            "gap-2 sm:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search clients"
              // value={searchTerm}
              // onChange={e => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 xl:min-w-md md:min-w-[250px] min-w-[100px]"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 ",
                    "bg-card border-border text-xs h-auto",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500 rounded-[16px]",
                  )}
                >
                  <MenuIcon color={themeNext === "dark" ? "#CCCFDB" : "#303444"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    // Handle delete action here
                    // TODO: Implement delete functionality
                  }}
                >
                  <DeleteIcon color={themeNext === "dark" ? "#CCCFDB" : "#303444"} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500 rounded-[16px] ",
              )}
            >
              <FilterIcon color={themeNext === "dark" ? "#CCCFDB" : "#303444"} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
              )}
            >
              <ExcelIcon />
              <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
              <span className=" dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px]",
              )}
            >
              <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
              <span className=" dark:text-white text-gray-900">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {analyticsCards.map(card => (
          <Card key={card.id}>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium opacity-80 mb-1">{card.label}</span>
                  <div>{card.icon}</div>
                </div>
                <span className="text-2xl font-bold leading-tight mb-2">{card.value}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${card.trendColor}`}>{card.trend}</span>
                  <span className="text-xs opacity-70">{card.subLabel}</span>
                </div>
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
          <ClientReportsTable/>
          <LeadReportsTable/>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
