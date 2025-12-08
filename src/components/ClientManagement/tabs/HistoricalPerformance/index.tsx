"use client";

import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  Line,
  PieChart,
  ComposedChart,
  XAxis,
  YAxis,
  Label,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PDFIcon from "@/components/ui/icons/options/pdf-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HistoricalPerformanceTabProps } from "@/lib/types";
import { cn } from "@/lib/utils";

import { mockBudgetData, mockFinancialData, mockSummaryMetrics } from "../../data";

const HistoricalPerformanceTab = ({ client: _client }: HistoricalPerformanceTabProps) => {
  const budgetData = mockBudgetData;
  const financialData = mockFinancialData;
  const { theme: themeNext } = useTheme();
  const summaryMetrics = mockSummaryMetrics.map(metric => ({
    ...metric,
    icon: metric.icon === "arrow-right" ? <ArrowRight className="h-4 w-4" /> : metric.icon,
  }));

  const chartConfig = {
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

  const data = [
    { month: "JAN", social: 13, email: 9, website: 11, bar: 27 },
    { month: "FEB", social: 12, email: 14, website: 20, bar: 27 },
    { month: "MAR", social: 20, email: 24, website: 15, bar: 27 },
    { month: "APR", social: 18, email: 26, website: 17, bar: 27 },
    { month: "MAY", social: 13, email: 24, website: 18, bar: 27 },
    { month: "JUN", social: 19, email: 12, website: 16, bar: 27 },
    { month: "JUL", social: 20, email: 14, website: 19, bar: 27 },
    { month: "AUG", social: 12, email: 18, website: 17, bar: 27 },
    { month: "SEP", social: 20, email: 14, website: 15, bar: 27 },
    { month: "OCT", social: 8, email: 11, website: 14, bar: 27 },
    { month: "NOV", social: 15, email: 9, website: 13, bar: 27 },
    { month: "DEC", social: 17, email: 7, website: 15, bar: 27 },
  ];

  return (
    <div className="space-y-6 bg-card p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Historical Performance</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track success metrics and campaign performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select defaultValue="3-month">
            <SelectTrigger className="w-full sm:w-32 bg-card rounded-[16px] py-6 shadow-none">
              <SelectValue defaultValue={"3 Month"} placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-month">3 Month</SelectItem>
              <SelectItem value="6-month">6 Month</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col sm:flex-row gap-2">
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
              <PDFIcon />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Performance Metrics Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <Select defaultValue="last-year">
                <SelectTrigger className="w-24 p-2 rounded-[16px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="this-year">This year</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="p-0 pr-2">
            <ChartContainer
              config={chartConfig}
              className="h-[400px] w-full"
              style={{ padding: 0 }}
            >
              <ComposedChart
                data={data}
                margin={{ top: 20, left: -20, right: 0, bottom: 0 }}
                className="p-0"
              >
                {/* gradients */}
                <defs>
                  {/* normal gradient */}
                  <linearGradient id="newBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(252, 252, 253, 0)" />
                    <stop offset="100%" stopColor="rgba(52, 179, 241, 0.15)" />
                  </linearGradient>

                  {/* darker hover gradient */}
                  <linearGradient id="newBarGradientHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(252, 252, 253, 0.2)" />
                    <stop offset="100%" stopColor="rgba(52, 179, 241, 0.35)" />
                  </linearGradient>

                  {/* stronger, thicker line shadow */}
                  <filter id="lineShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
                  </filter>
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

                {/* Bar with gradient + hover gradient */}
                <Bar
                  dataKey="bar"
                  barSize={35}
                  radius={[16, 16, 16, 16]}
                  // normal shape
                  shape={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const barHeight = height;
                    const maxValue = payload.bar;
                    const lineValue = payload.email;
                    const fillHeight = (lineValue / maxValue) * barHeight;

                    return (
                      <g>
                        {/* Light background for full bar */}
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={barHeight}
                          fill="rgba(52,179,241,0.05)"
                          rx={16}
                          ry={16}
                        />

                        {/* Gradient fill up to email value */}
                        <rect
                          x={x}
                          y={y + (barHeight - fillHeight)}
                          width={width}
                          height={fillHeight}
                          fill="url(#newBarGradient)" // normal gradient
                          rx={16}
                          ry={16}
                        />
                      </g>
                    );
                  }}
                  // hover state
                  activeBar={(props: any) => {
                    const { x, y, width, height, payload } = props;
                    const barHeight = height;
                    const maxValue = payload.bar;
                    const lineValue = payload.email;
                    const fillHeight = (lineValue / maxValue) * barHeight;

                    return (
                      <g>
                        {/* Slightly darker background */}
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={barHeight}
                          fill="rgba(52,179,241,0.1)"
                          rx={16}
                          ry={16}
                        />

                        {/* Darker gradient fill up to email value */}
                        <rect
                          x={x}
                          y={y + (barHeight - fillHeight)}
                          width={width}
                          height={fillHeight}
                          fill="url(#newBarGradientHover)" // hover gradient
                          rx={16}
                          ry={16}
                        />
                      </g>
                    );
                  }}
                />

                {/* 3 lines without dots */}
                <Line
                  type="monotone"
                  dataKey="email"
                  stroke="#3072C0"
                  strokeWidth={5}
                  dot={false}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter="url(#lineShadow)" // 🔥 shadow applied here
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Budget Overview Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle className="text-lg">Budget Overview</CardTitle>
              <Select defaultValue="last-year">
                <SelectTrigger className="w-24 p-2 rounded-[16px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="this-year">This year</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="relative flex items-center justify-center">
              <ChartContainer config={chartConfig} className="h-[300px] w-[300px]">
                <PieChart>
                  {/* Border for ring */}
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="82%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    pointerEvents={"none"}
                  >
                    <Cell fill={"#3072C014"} stroke="none" />
                  </Pie>

                  {/* Background for ring */}
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="75%"
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    pointerEvents={"none"}
                  >
                    <Cell fill={themeNext === "dark" ? "#0F1220" : "#e5e7eb"} stroke="none" />
                  </Pie>

                  {/* Actual Progress Slice */}
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="75%"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    cornerRadius={12}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        stroke="none"
                        fill={index === 1 ? entry.color : "transparent"}
                      />
                    ))}

                    {/* ✅ Center Label inside Pie (no overlay issues) */}
                    <Label
                      value="70%"
                      position="center"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        fill: "currentColor",
                      }}
                    />
                  </Pie>

                  {/* Tooltip on top */}
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    wrapperStyle={{ zIndex: 9999 }}
                  />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend-like info */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Allocated Budget:</span>
                <span className="font-medium">Ɖ 4,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent To Date:</span>
                <span className="font-medium">Ɖ 2,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-medium text-green-600">Ɖ 1,500</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between p-2">
            <CardTitle className="text-lg">Financial Summary</CardTitle>
            <Select defaultValue="last-year">
              <SelectTrigger className="w-24 rounded-[16px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-year">Last year</SelectItem>
                <SelectItem value="this-year">This year</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Shadcn Responsive Container */}
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <BarChart
              data={financialData}
              margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray="3 3"
                stroke="gray"
                opacity={0.3}
              />
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: "#666" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666" }}
                domain={[0, 100000]}
                fontSize={16}
                ticks={[0, 20000, 40000, 60000, 80000, 100000]}
              />
              {/* ✅ Shadcn Tooltip & Legend */}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="#3072C0" radius={16} />
              <Bar dataKey="expenses" fill="#ECA338" radius={16} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {summaryMetrics.map(metric => (
          <Card key={`${metric.label}-${metric.value}`}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p
                    className={`text-base sm:text-lg font-bold ${
                      metric.isGreen ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {metric.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
                {metric.icon && <div className="text-muted-foreground ml-2">{metric.icon}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex justify-center min-w-[70px]">
        {/* Bubble */}
        <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg">7.5 Đ</div>
        {/* Arrow */}
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

export default HistoricalPerformanceTab;
