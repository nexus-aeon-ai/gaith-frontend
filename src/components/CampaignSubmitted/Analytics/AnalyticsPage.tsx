import { Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PerformanceCard from "@/components/analytics/PerformanceCard";
import CampaignComparison from "@/components/CampaignSubmitted/Analytics/CampaignComparison";
import ChoreCard from "@/components/CampaignSubmitted/Analytics/ChoreCard";
import StatsGeographic from "@/components/CampaignSubmitted/Analytics/StatsGeographic";
import AnalyticsCard, { AnalyticsSummaryCardProps } from "@/components/Dashboard/AnalyticsCard";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ChevronUp from "@/components/ui/icons/analytics/chevronUp";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import LightBulbIcon from "@/components/ui/icons/insights/bulb";
import TrophyIcon from "@/components/ui/icons/insights/trophy";
import WarningIcon from "@/components/ui/icons/insights/warning";
import Fb from "@/components/ui/icons/social/fb";
import Google from "@/components/ui/icons/social/google";
import Instagram from "@/components/ui/icons/social/instagram";
import { cn } from "@/lib/utils";

import { ActiveClientsIcon } from "../../ui/icons/analytics/activeClients";
import { CalenderIcon } from "../../ui/icons/analytics/calender";
import { CampaignsIcon } from "../../ui/icons/analytics/campaigns";
import { ContentPiecesIcon } from "../../ui/icons/analytics/contentPieces";
import { SuccessRateIcon } from "../../ui/icons/analytics/successRate";

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
  {
    label: "Avg CPC",
    value: "0,100",
    icon: <SuccessRateIcon className="text-[#EA3B1F] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
  {
    label: "ROAS",
    value: "4.6 X",
    icon: <SuccessRateIcon className="text-[#EA3B1F] w-12 h-12" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    subLabel: "Last month",
  },
];

const facebookData = [
  {
    label: "Impressions",
    value: "1.2M",
  },
  {
    label: "Clicks",
    value: "24.8K",
  },
  {
    label: "Conversions",
    value: "642",
  },
  {
    label: "CTR",
    value: "2.07%",
  },
  {
    label: "CPC",
    value: "$0.35",
  },
  {
    label: "Engagement Rate",
    value: "4.2%",
  },
];

const aiInsightsData = [
  {
    icon: <LightBulbIcon className="w-6 h-6 text-yellow-500" />,
    title: "Optimization Opportunity",
    description:
      "Instagram Stories show 32% higher engagement. Consider reallocating 15% of Facebook budget.",
    border: "#3072C0",
    bgColor: "#2BAE8214",
  },
  {
    icon: <TrophyIcon className="w-6 h-6 text-green-500" />,
    title: "Best Performing",
    description: "Female audience 25-34 in US shows highest ROAS (5.2x). Scale this segment.",
    border: "#123300",
    bgColor: "#2BAE8214",
  },
  {
    icon: <WarningIcon className="w-6 h-6 text-red-500" />,
    title: "Attention Needed",
    description: "Twitter CTR declining 0.3% weekly. Review creative freshness and targeting.",
    border: "#ECA338",
    bgColor: "#ECA33814",
  },
];
const AnalyticsPage = () => (
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
              Campaigns Submitted
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Campaign Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-2">
      <div>
        <div className="flex md:gap-2 gap-1 md:items-center items-start">
          <h1 className="text-2xl font-semibold text-foreground">Holiday Season Sale 2025</h1>
          <Badge className="md:mt-0 mt-2 rounded-sm bg-yellow-100 pointer-events-none dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500">
            Pending
          </Badge>
        </div>
        <p className="text-muted-foreground">Submitted Dec 18, 2024</p>
      </div>
      <div className="flex md:flex-row flex-col gap-2">
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            variant="outline"
            className="w-fit p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#EA3B1F] rounded-[16px] bg-transparent"
          >
            Reject
          </Button>
          <Button
            variant="outline"
            className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
          >
            Request Changes
          </Button>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            className="w-fit p-6 px-8 text-[16px] bg-[#3072C0] font-[400] rounded-[16px] border-none hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve Campaign
          </Button>
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            className="w-fit p-6 px-8 text-[16px] bg-[#2BAE82] font-[400] rounded-[16px] border-none hover:bg-[#2BAE82]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Launch Campaign
          </Button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {analyticsCards.map((card: AnalyticsSummaryCardProps, idx: number) => (
        <AnalyticsCard key={idx} {...card} />
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <PerformanceCard title="Facebook Performance" icon={<Fb />} data={facebookData} />
      <PerformanceCard title="Google Performance" icon={<Google />} data={facebookData} />
      <PerformanceCard title="Instagram Performance" icon={<Instagram />} data={facebookData} />
    </div>

    <ChartsSection />
    <StatsGeographic />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChoreCard title="Campaign Timeline">
        {/* timeline */}
        <div className="flex flex-col my-2">
          <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
            <li className="mb-5 ms-6">
              <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <Target color="#3FD09F" size={16} />
              </span>
              <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                Campaign Created
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                December 18, 2025 at 2:30 PM
              </p>
            </li>
            <li className="mb-5 ms-6">
              <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <Target color="#ECA338" size={16} />
              </span>
              <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                Submitted for Review
              </h3>

              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                December 18, 2025 at 3:15 PM
              </p>
            </li>
            <li className="mb-5 ms-6">
              <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <Target color="#A0AEBA" size={16} />
              </span>
              <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                Pending Approval
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Expected by December 19, 2025
              </p>
            </li>
            <li className="ms-6">
              <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <Target color="#A0AEBA" size={16} />
              </span>
              <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                Campaign Launch
              </h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Scheduled for December 20, 2025
              </p>
            </li>
          </ol>
        </div>
      </ChoreCard>
      <ChoreCard title="Top Performing Content">
        <div className="flex flex-col mt-2 gap-3 h-full">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className={cn("flex gap-3 items-start rounded-[16px]")}>
                <div className="mt-[2px] aspect-square rounded-[12px] overflow-hidden">
                  <Image
                    src={"/images/girl-avatar.jpg"}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">Spring Floral Dress Collection</h4>
                  <p className="text-sm text-muted-foreground">CTR: 3.8% • 245 conversions</p>
                </div>
              </div>
            ))}
        </div>
      </ChoreCard>
      <ChoreCard title="AI Insights & Recommendations">
        <div className="flex flex-col gap-2 mt-2">
          {aiInsightsData.map((insight, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3 items-start rounded-[16px] p-3",
                `border border-[${insight.border}] bg-[${insight.bgColor}]`,
              )}
            >
              <div className="mt-[2px]">{insight.icon}</div>
              <div>
                <h4 className="text-md font-semibold">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ChoreCard>
    </div>

    {/* campaign comparison chart */}
    <CampaignComparison />

    {/* analytics cards grid */}
    <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
      <ChoreCard>
        <div className="flex items-center justify-between">
          <p>Impressions</p>
          <div className="flex gap-1 items-center">
            <ChevronUp />
            <p className="text-green-300">12.5%</p>
          </div>
        </div>
        <p className="font-bold text-lg mt-2">2,400,000</p>
      </ChoreCard>
      <ChoreCard>
        <div className="flex items-center justify-between">
          <p>Clicks</p>
          <div className="flex gap-1 items-center">
            <ChevronUp />
            <p className="text-green-300">12.5%</p>
          </div>
        </div>
        <p className="font-bold text-lg mt-2">2,400,000</p>
      </ChoreCard>
      <ChoreCard>
        <div className="flex items-center justify-between">
          <p>Conversions</p>
          <div className="flex gap-1 items-center">
            <ChevronUp />
            <p className="text-green-300">12.5%</p>
          </div>
        </div>
        <p className="font-bold text-lg mt-2">2,400,000</p>
      </ChoreCard>
    </div>
  </div>
);

export default AnalyticsPage;
