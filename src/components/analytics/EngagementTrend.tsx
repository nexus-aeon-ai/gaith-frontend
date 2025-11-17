"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { CartesianGrid, Line, XAxis, YAxis, ComposedChart, Bar } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DownArrow from "@/components/ui/icons/down-arrow";
import { Separator } from "@/components/ui/separator";

const data = [
  { month: "JAN", social: 12, email: 15, website: 10, bar: 27 },
  { month: "FEB", social: 18, email: 10, website: 14 },
  { month: "MAR", social: 10, email: 18, website: 12 },
  { month: "APR", social: 20, email: 12, website: 18 },
  { month: "MAY", social: 14, email: 22, website: 20 },
  { month: "JUN", social: 16, email: 19, website: 20, bar: 27 },
  { month: "JUL", social: 12, email: 22, website: 15 },
  { month: "AUG", social: 18, email: 14, website: 22 },
  { month: "SEP", social: 25, email: 18, website: 12 },
  { month: "OCT", social: 12, email: 23, website: 18 },
  { month: "NOV", social: 20, email: 12, website: 25 },
  { month: "DEC", social: 15, email: 20, website: 15, bar: 27 },
];

const chartConfig = {
  social: {
    label: "Social Media",
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
} satisfies ChartConfig;

const EngagementTrend = () => {
  const [range, setRange] = useState("12 Month");
  const { theme: themeNext } = useTheme();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative flex justify-center min-w-[70px]">
          {/* Bubble */}
          <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg">
            7.5 Đ
          </div>

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
  const CustomLegend = () => {
    const items = [
      { key: "social", label: "Social Media", color: "#F5B719" },
      { key: "email", label: "Email", color: "#3072C0" },
      { key: "website", label: "Website", color: "#2BAE82" },
    ];

    return (
      <div className="flex items-center justify-center gap-6 mt-4">
        {items.map(item => (
          <div key={item.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full lg:col-span-6 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-[10px]">
        <CardTitle className="font-bold text-lg text-card-foreground">
          Engagement Rate Trend
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm px-3 py-[10px] dark:bg-card bg-white dark:hover:bg-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-100 rounded-[16px] border-[#DCE0E4] dark:border-[#404663] shadow-none h-auto gap-1"
            >
              {range}
              <DownArrow className="!h-5 !w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px]">
            <DropdownMenuItem onClick={() => setRange("3 Month")}>3 Month</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRange("6 Month")}>6 Month</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRange("12 Month")}>12 Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <Separator />
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart data={data} margin={{ top: 30, right: 20, bottom: -20, left: 10 }}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="5 5"
              stroke={themeNext === "dark" ? "#404663" : "#DCE0E4"}
            />
            {/* Define gradients */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#404663" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#404663" stopOpacity={0.4} />
              </linearGradient>

              {/* hover gradient: (applied bottom -> top) */}
              <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                {/* rgba(247, 198, 73, 0.05)  1.32% */}
                <stop offset="1.32%" stopColor="#F7C649" stopOpacity={0.05} />
                {/* rgba(255, 178, 87, 0.1) 26.89% */}
                <stop offset="26.89%" stopColor="#FFB257" stopOpacity={0.1} />
                {/* rgba(41, 173, 130, 0.15) 66.55% */}
                <stop offset="66.55%" stopColor="#29AD82" stopOpacity={0.15} />
                {/* rgba(38, 91, 153, 0.8) 98.63% */}
                <stop offset="98.63%" stopColor="#265B99" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            {/* X-axis for Bars - centered */}
            <XAxis
              xAxisId="bar"
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />

            {/* X-axis for Lines - extended to edges */}
            <XAxis
              xAxisId="line"
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={false}
              padding={{ left: -25, right: -25 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={30}
              domain={[0, 30]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={value => `${value}%`}
            />

            <ChartTooltip content={CustomTooltip} />
            <ChartLegend content={<CustomLegend />} />

            {/* Bar with gradient + hover gradient */}
            <Bar
              xAxisId="bar"
              dataKey="bar"
              barSize={50}
              fill={themeNext === "light" ? "#DCE0E4" : "#404663"}
              radius={[10, 10, 10, 10]}
              activeBar={{ fill: "url(#barGradientHover)" }}
            />

            {/* 3 lines without dots */}
            {/* 3 lines without dots */}
            <Line
              xAxisId="line"
              type="natural"
              dataKey="email"
              stroke="var(--color-email)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              xAxisId="line"
              type="natural"
              dataKey="social"
              stroke="var(--color-social)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              xAxisId="line"
              type="natural"
              dataKey="website"
              stroke="var(--color-website)"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EngagementTrend;
