import React from "react";
import { EngagementTrend, TopClients, BudgetUtilization } from "@/components/analytics";
import AlertsNotifications from "./AlertsNotifications";
import MarketingReports from "./MarketingReports";
import AnalyticsCard, { AnalyticsSummaryCardProps } from "./AnalyticsCard";

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Active Clients",
    value: 24,
    icon: "👥",
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Ongoing Campaigns",
    value: 37,
    icon: "📈",
    trend: "+8.3%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    label: "Content Pieces",
    value: "1,420,100",
    icon: "📄",
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Calendar Completion",
    value: "86%",
    icon: "🗓️",
    trend: "-12.5%",
    trendColor: "text-red-500",
    subLabel: "Last month",
  },
  {
    label: "Success Rate",
    value: "78%",
    icon: "✅",
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
];

const DashboardMain = () => (
  <div className="flex flex-col gap-6 w-full p-4">
    {/* Top analytics cards row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
        <AnalyticsCard key={idx} {...card} />
      ))}
    </div>
    {/* Main dashboard grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <TopClients />
        <EngagementTrend />
        <MarketingReports />
      </div>
      <div className="flex flex-col gap-4">
        <BudgetUtilization />
        <AlertsNotifications />
      </div>
    </div>
  </div>
);

export default DashboardMain; 