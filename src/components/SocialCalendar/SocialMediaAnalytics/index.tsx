import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useTheme } from "next-themes";

import AnalyticsCard, { AnalyticsSummaryCardProps } from "@/components/Dashboard/AnalyticsCard";
import AudienceDemographics from "@/components/SocialCalendar/SocialMediaAnalytics/AudienceDemographics";
import ReachImpressionChart from "@/components/SocialCalendar/SocialMediaAnalytics/ReachImpressionsChart";
import TopPerformingPosts from "@/components/SocialCalendar/SocialMediaAnalytics/TopPerformingPosts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ActiveClientsIcon } from "../../ui/icons/analytics/activeClients";
import { CalenderIcon } from "../../ui/icons/analytics/calender";
import { CampaignsIcon } from "../../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../../ui/icons/analytics/contentPieces";

import ChartsSection from "./ChartsSection";

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Total Impression",
    value: "2.4M",
    icon: <ActiveClientsIcon className="text-[#508CD3] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Total Clicks",
    value: "348.5K",
    icon: <CampaignsIcon className="text-[#2BAE82] w-12 h-12" />,
    trend: "+8.3%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    label: "Conversions",
    value: "1,247",
    icon: <ContentPiecesIcon className="text-[#ff5999d2] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "CTR",
    value: "86%",
    icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
    trend: "-12.5%",
    trendColor: "text-red-500",
    subLabel: "Last month",
  },
];

const SocialMediaAnalytics = () => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/submitted" className="text-blue-600 font-medium text-md">
                Social Media Calendar
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Social Media Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Social Media Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your social media performance across all platforms
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex lg:flex-row flex-col gap-2">
            <div className="relative w-full">
              <Input
                id="date-start"
                type="date"
                placeholder="Select Date Range"
                min={new Date().toISOString().split("T")[0]}
                className="
                        dark:bg-[#0F1B29] bg-[#F3F5F7] p-6 rounded-[16px]
                          pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0 
                          [&::-webkit-calendar-picker-indicator]:absolute 
                          [&::-webkit-calendar-picker-indicator]:w-full 
                          [&::-webkit-calendar-picker-indicator]:h-full
                        "
              />

              <button
                type="button"
                // onClick={handleStartDateClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card rounded-2xl w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 py-6 sm:h-12",
                "border-border",
                "hover:bg-white/70 hover:text-[#3072C0] ",
                "text-xs sm:text-sm",
                "dark:text-white cursor-pointer",
              )}
            >
              <ExcelIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
              <span>Export Excel</span>
            </Button>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card rounded-2xl w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 py-6 sm:h-12",
                "border-border",
                "hover:bg-white/70 hover:text-[#3072C0] ",
                "text-xs sm:text-sm",
                "dark:text-white cursor-pointer",
              )}
            >
              <PdfIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
          <AnalyticsCard key={idx} {...card} />
        ))}
      </div>

      <ChartsSection />
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.1fr] gap-4">
        <ReachImpressionChart />
        <AudienceDemographics />
      </div>
      <TopPerformingPosts/>
    </div>
  );
};

export default SocialMediaAnalytics;
