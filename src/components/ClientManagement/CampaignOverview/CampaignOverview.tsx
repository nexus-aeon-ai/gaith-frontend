"use client";

import { ChevronDown, PlusCircle, Target } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ActiveShape } from "recharts/types/util/types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardListIcon from "@/components/ui/icons/analytics/chevronUp";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import FbIcon from "@/components/ui/icons/socials/fb";
import InstaIcon from "@/components/ui/icons/socials/instagram";
import TwitterX from "@/components/ui/icons/socials/twitterx";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface KPIEntry {
  title: string;
  progress: number;
  subtext: string;
}

// Performance Analytics Chart Data
const performanceData = [
  { month: "JAN", social: 13, email: 12, website: 11, bar: 27 },
  { month: "FEB", social: 12, email: 18, website: 20 },
  { month: "MAR", social: 20, email: 12, website: 15 },
  { month: "APR", social: 18, email: 15, website: 17 },
  { month: "MAY", social: 13, email: 16, website: 18 },
  { month: "JUN", social: 19, email: 14, website: 16, bar: 27 },
  { month: "JUL", social: 20, email: 17, website: 19 },
  { month: "AUG", social: 12, email: 15, website: 17 },
  { month: "SEP", social: 20, email: 12, website: 15 },
  { month: "OCT", social: 8, email: 11, website: 14 },
  { month: "NOV", social: 15, email: 13, website: 13 },
  { month: "DEC", social: 17, email: 14, website: 15, bar: 27 },
];

const performanceChartConfig = {
  social: {
    label: "Social",
    color: "#3FD09F",
  },
  email: {
    label: "Email",
    color: "#3072C0",
  },
  website: {
    label: "Website",
    color: "#D29A09",
  },
  bar: {
    label: "Background",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

// Budget Breakdown Chart Data
const budgetDataByPeriod = {
  3: [
    { id: "creative", name: "Creative", value: 35, fill: "var(--color-marketing)" },
    { id: "advertising", name: "Advertising", value: 25, fill: "var(--color-development)" },
    { id: "content", name: "Content", value: 20, fill: "var(--color-operations)" },
    { id: "analytics", name: "Analytics", value: 20, fill: "var(--color-sales)" },
  ],
  6: [
    { id: "creative", name: "Creative", value: 35, fill: "var(--color-marketing)" },
    { id: "advertising", name: "Advertising", value: 25, fill: "var(--color-development)" },
    { id: "content", name: "Content", value: 20, fill: "var(--color-operations)" },
    { id: "analytics", name: "Analytics", value: 20, fill: "var(--color-sales)" },
  ],
  9: [
    { id: "creative", name: "Creative", value: 35, fill: "var(--color-marketing)" },
    { id: "advertising", name: "Advertising", value: 25, fill: "var(--color-development)" },
    { id: "content", name: "Content", value: 20, fill: "var(--color-operations)" },
    { id: "analytics", name: "Analytics", value: 20, fill: "var(--color-sales)" },
  ],
  12: [
    { id: "creative", name: "Creative", value: 35, fill: "var(--color-marketing)" },
    { id: "advertising", name: "Advertising", value: 25, fill: "var(--color-development)" },
    { id: "content", name: "Content", value: 20, fill: "var(--color-operations)" },
    { id: "analytics", name: "Analytics", value: 20, fill: "var(--color-sales)" },
  ],
};

const budgetChartConfig = {
  value: {
    label: "Budget",
  },
  marketing: {
    label: "Creative",
    color: "#F5B719",
  },
  development: {
    label: "Advertising",
    color: "#A1C2E7",
  },
  operations: {
    label: "Content",
    color: "#91E4C8",
  },
  sales: {
    label: "Analytics",
    color: "#3072C0",
  },
} satisfies ChartConfig;

const timeOptions = [
  { value: 3 as const, label: "3 Months" },
  { value: 6 as const, label: "6 Months" },
  { value: 9 as const, label: "9 Months" },
  { value: 12 as const, label: "12 Months" },
];

const RADIAN = Math.PI / 180;

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius ? outerRadius + 8 : 0}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        style={{ filter: "brightness(1.1)" }}
      />
    </g>
  );
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const handler = () => setMatches(media.matches);
    handler();
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, [query]);
  return matches;
};

const analyticsCards = [
  {
    id: "total-reach",
    label: "Total Reach",
    value: "1.2M",
    trend: "+18.5%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    id: "engagement-rate",
    label: "Engagement Rate",
    value: "8.2%",
    trend: "+2.1%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    value: "4.8%",
    trend: "+0.5%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
  {
    id: "total-spend",
    label: "Total Spend",
    value: "$45,230",
    trend: "+15.3%",
    trendColor: "text-green-500",
    subLabel: "vs last month",
  },
];

const kpiEntries: (KPIEntry & { id: string })[] = [
  {
    id: "social-followers",
    title: "Increase Social Media Followers",
    progress: 85,
    subtext: "45,200 / 53,000 target",
  },
  {
    id: "website-traffic",
    title: "Website Traffic",
    progress: 72,
    subtext: "120,000 / 166,667 target",
  },
  {
    id: "lead-generation",
    title: "Lead Generation",
    progress: 68,
    subtext: "680 / 1,000 target",
  },
  {
    id: "brand-awareness",
    title: "Brand Awareness",
    progress: 91,
    subtext: "Near completion",
  },
];

const timelineEvents = [
  {
    id: "launch",
    date: "July 1, 2025",
    event: "Campaign Launch",
    description: "Initial content published across all platforms",
    status: "completed",
  },
  {
    id: "milestone",
    date: "July 10, 2025",
    event: "First Milestone Reached",
    description: "Performance analysis and strategy adjustment",
    status: "completed",
  },
  {
    id: "review",
    date: "July 20, 2025",
    event: "Mid-Campaign Review",
    status: "completed",
    description: "Increased ad spend and promotional content",
  },
  {
    id: "end",
    date: "July 31, 2025",
    event: "Campaign Ends",
    status: "upcoming",
    description: "Final reporting and analysis",
  },
];

const ClientCampaignOverview = ({ onBack: _onBack }: { onBack: () => void }) => {
  const [range, setRange] = useState("12 Month");
  const [selectedPeriod, setSelectedPeriod] = useState<3 | 6 | 9 | 12>(3);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const { theme: themeNext } = useTheme();

  const currentBudgetData = budgetDataByPeriod[selectedPeriod];
  const selectedOption = timeOptions.find(option => option.value === selectedPeriod);
  const totalBudget = currentBudgetData.reduce((sum, item) => sum + item.value, 0);

  const isSmall = useMediaQuery("(max-width: 640px)");
  const isMedium = useMediaQuery("(max-width: 1024px)");

  const innerRadius = isSmall ? 90 : isMedium ? 110 : 120;
  const outerRadius = isSmall ? 130 : isMedium ? 150 : 180;
  const overlaySize = Math.max(64, Math.min(220, Math.round(innerRadius * 1.6)));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative flex justify-center min-w-[70px]">
          <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg">
            7.5 Đ
          </div>
          <div
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 
                          border-l-8 border-r-8 border-t-8 border-transparent 
                          border-t-foreground"
          />
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      innerRadius: ir = 0,
      outerRadius: orr = 0,
      percent = 0,
    } = props;

    const factor = isSmall ? 0.2 : isMedium ? 0.4 : 0.4;
    const radius = ir + (orr - ir) * factor;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const textAnchor = x > cx ? "start" : "end";
    const fontSize = isSmall ? 10 : 12;

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6 font-inter">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <DashboardListIcon className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-[#3072C0] font-[500]" href="/client-management">
              Client Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#3072C0] font-[500]">Global Solutions</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-[500]">Campaign Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Summer Sale Campaign
            </h1>
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              In Progress
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Social Media Campaign • Ends July 31, 2025
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              "bg-card border-border text-xs h-10",
              "hover:bg-card hover:border-blue-500",
            )}
          >
            <ExcelIcon />
            <span>Export Excel</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              "bg-card border-border text-xs h-10",
              "hover:bg-card hover:border-blue-500",
            )}
          >
            <PdfIcon className="w-5 h-5" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map(card => (
          <Card key={card.id}>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium opacity-80 mb-1">{card.label}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Performance Analytics Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
              <CardTitle className="text-md font-semibold">Performance Analytics</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-1 dark:bg-card bg-white dark:hover:bg-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-100 rounded-3xl border h-auto gap-1"
                  >
                    {range}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                  <DropdownMenuItem onClick={() => setRange("3 Month")}>3 Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRange("6 Month")}>6 Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRange("12 Month")}>12 Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <Separator />
              <ChartContainer config={performanceChartConfig} className="h-[400px] w-full">
                <ComposedChart
                  data={performanceData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#404663" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#404663" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="1.32%" stopColor="#F7C649" stopOpacity={0.05} />
                      <stop offset="26.89%" stopColor="#FFB257" stopOpacity={0.1} />
                      <stop offset="66.55%" stopColor="#29AD82" stopOpacity={0.15} />
                      <stop offset="98.63%" stopColor="#265B99" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    strokeDasharray="3 3"
                    stroke="#DCE0E4"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={CustomTooltip} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="bar"
                    barSize={50}
                    fill={themeNext === "light" ? "#DCE0E4" : "#404663"}
                    radius={[10, 10, 10, 10]}
                    activeBar={{ fill: "url(#barGradientHover)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="email"
                    stroke="var(--color-email)"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="social"
                    stroke="var(--color-social)"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="website"
                    stroke="var(--color-website)"
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Campaign Objectives & KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-semibold my-2">
                Campaign Objectives & KPIs
              </CardTitle>
              <Separator className="mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {kpiEntries.map(kpi => (
                <div key={kpi.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{kpi.title}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {kpi.progress}%
                    </span>
                  </div>
                  <Progress value={kpi.progress} className="h-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{kpi.subtext}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Task Management */}
          <Card>
            <CardHeader>
              <CardTitle className="my-2 text-md flex justify-between items-center">
                <h4 className=" font-semibold">Task Management</h4>
                <p className="text-xs text-muted-foreground">
                  Progress: <span className="text-[#3072c0]">75%</span>
                </p>
              </CardTitle>
              <Progress
                value={70}
                className="h-2 [&>div]:bg-[linear-gradient(270.06deg,_#2BAE82_49.95%,_#266297_90.48%)]"
              />
            </CardHeader>
            <CardContent className="space-y-2 mt-4">
              <div className="flex justify-between items-start p-2 mt-2 bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-[10px] border-l-destructive border-l-2">
                <div className="h-full">
                  <p className="text-sm font-semibold">Task 1</p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                  <p className="text-xs text-muted-foreground mt-2">Description of task 1</p>
                </div>
                <div className="flex flex-col items-end h-[100%] gap-6 justify-between">
                  <p className="text-xs text-[#3072c0] p-1 px-2 font-semibold rounded-sm bg-[#3072c0]/10">
                    Low
                  </p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                </div>
              </div>
              <div className="flex justify-between items-start p-2 mt-1 bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-[10px] border-l-destructive border-l-2">
                <div className="h-full">
                  <p className="text-sm font-semibold">Task 1</p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                  <p className="text-xs text-muted-foreground mt-2">Description of task 1</p>
                </div>
                <div className="flex flex-col items-end h-[100%] gap-6 justify-between">
                  <p className="text-xs text-[#3072c0] p-1 px-2 font-semibold rounded-sm bg-[#3072c0]/10">
                    Low
                  </p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                </div>
              </div>
              <div className="flex justify-between items-start p-2 mt-1 bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-[10px] border-l-destructive border-l-2">
                <div className="h-full">
                  <p className="text-sm font-semibold">Task 1</p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                  <p className="text-xs text-muted-foreground mt-2">Description of task 1</p>
                </div>
                <div className="flex flex-col items-end h-[100%] gap-6 justify-between">
                  <p className="text-xs text-[#3072c0] p-1 px-2 font-semibold rounded-sm bg-[#3072c0]/10">
                    Low
                  </p>
                  <p className="text-xs text-muted-foreground">Description of task 1</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-auto !py-3 bg-transparent rounded-[16px] border-[#3072C0] hover:bg-[#3072C0]/80 mt-2 text-[#3072C0]"
              >
                <PlusCircle />
                Add New Task
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Campaign Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-semibold my-2">Campaign Timeline</CardTitle>
              <Separator className="mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <Target size={16} color="#3072C0" className="mt-1" />
                      {index < timelineEvents.length - 1 && (
                        <div className="border border-dashed border-gray-300 h-12 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between pb-4">
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-sm text-[#303444] dark:text-[#DCE0E4]">
                          {event.description}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pt-4">
              <CardTitle className="font-semibold text-md text-card-foreground">
                Budget Breakdown
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-1 dark:bg-card bg-white dark:hover:bg-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-100 rounded-3xl border h-auto gap-1"
                  >
                    {selectedOption?.label}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                  {timeOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSelectedPeriod(option.value)}
                      className={selectedPeriod === option.value ? "bg-accent" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="bg-muted rounded-full flex flex-col items-center justify-center text-center"
                    style={{
                      width: overlaySize,
                      height: overlaySize,
                      boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className={`font-bold ${isSmall ? "text-sm" : "text-xl"} text-foreground`}>
                      {totalBudget.toLocaleString()}K Đ
                    </div>
                    <div className={`text-muted-foreground ${isSmall ? "text-[10px]" : "text-xs"}`}>
                      Total Budget ({selectedPeriod}M)
                    </div>
                  </div>
                </div>
                <ChartContainer
                  config={budgetChartConfig}
                  className="w-full h-full aspect-square mx-auto"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={currentBudgetData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      paddingAngle={3}
                      cornerRadius={5}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      activeIndex={activeIndex !== undefined ? activeIndex : -1}
                      activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="my-2 text-md flex justify-between items-center">
                <h4 className=" font-semibold">Team Members</h4>
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-2 mt-4">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-[12px] py-2 px-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#3072C0]/10 p-2 items-center justify-center rounded-full ">
                      <p className="text-sm font-medium text-[#3072C0]">MA</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Michael Anderson</h3>
                      <p className="text-sm text-muted-foreground">Account Manager</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          {/* Content Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="my-2 text-md flex justify-between items-center">
                <h4 className=" font-semibold">Content Calendar</h4>
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-2 mt-4">
              <div className="flex justify-between items-center p-4 rounded-[8px] border border-l-[3px] border-l-[#3072C0] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3072C014] flex items-center justify-center  rounded-lg shadow-sm">
                    <FbIcon />
                  </div>
                  <div>
                    <p className="font-semibold ">Facebook Post - Customer Testimonials</p>
                    <p className="text-sm text-muted-foreground">
                      Showcase satisfied customers and reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-3 font-bold flex-col">
                  <span className="text-sm ">Jul 30, 2025</span>
                  <span className="text-sm text-[#2BAE82]">Scheduled</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 rounded-[8px] border border-l-[3px] border-l-[#2BAE82] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3072C014] flex items-center justify-center  rounded-lg shadow-sm">
                    <InstaIcon />
                  </div>
                  <div>
                    <p className="font-semibold ">Instagram Story - Flash Sale Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Final 48-hour countdown promotion
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-3 font-bold flex-col">
                  <span className="text-sm ">Jul 30, 2025</span>
                  <span className="text-sm text-[#2BAE82]">Ready</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 rounded-[8px] border-l-[3px] border-l-[#ECA338] border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3072C014] flex items-center justify-center  rounded-lg shadow-sm">
                    <TwitterX />
                  </div>
                  <div>
                    <p className="font-semibold ">X Thread - Sale Highlights</p>
                    <p className="text-sm text-muted-foreground">
                      Last chance messaging and top deals
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-3 font-bold flex-col">
                  <span className="text-sm ">Jul 30, 2025</span>
                  <span className="text-sm text-[#D29A09]">In Review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientCampaignOverview;
