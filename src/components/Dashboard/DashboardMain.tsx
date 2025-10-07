import React from "react";

import { EngagementTrend, TopClients, BudgetUtilization } from "@/components/analytics";

import { ActiveClientsIcon } from "../ui/icons/analytics/activeClients";
import { CalenderIcon } from "../ui/icons/analytics/calender";
import { CampaignsIcon } from "../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../ui/icons/analytics/contentPieces";
import { SuccessRateIcon } from "../ui/icons/analytics/successRate";

import AlertsNotifications from "./AlertsNotifications";
import AnalyticsCard, { AnalyticsSummaryCardProps } from "./AnalyticsCard";
import { ClientReports,LeadReports } from "./MarketingReports";

const analyticsCards: AnalyticsSummaryCardProps[] = [
  {
    label: "Active Clients",
    value: 24,
    icon: <ActiveClientsIcon className="text-[#508CD3] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Ongoing Campaigns",
    value: 37,
    icon: <CampaignsIcon className="text-[#2BAE82] w-12 h-12" />,
    trend: "+8.3%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    label: "Content Pieces",
    value: "1,420,100",
    icon: <ContentPiecesIcon className="text-[#ff5999d2] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "Calendar Completion",
    value: "86%",
    icon: <CalenderIcon className="text-[#F5B719] w-12 h-12" />,
    trend: "-12.5%",
    trendColor: "text-red-500",
    subLabel: "Last month",
  },
  {
    label: "Success Rate",
    value: "78%",
    icon: <SuccessRateIcon className="text-[#EA3B1F] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
];

const DashboardMain = () => (
  <div className="flex flex-col gap-6 w-full p-4">
    {/* Top analytics cards row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
        <AnalyticsCard key={idx} {...card} />
      ))}
    </div>
    {/* Main dashboard grid */}
    {/* First row - TopClients and BudgetUtilization side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <TopClients />
      <BudgetUtilization />
    </div>

    {/* Second row - EngagementTrend and AlertsNotifications side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <EngagementTrend />
      <AlertsNotifications />
    </div>

    {/* Third row - MarketingReports standalone full width */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <ClientReports />
      <LeadReports />
    </div>
  </div>
);

export default DashboardMain;
