"use client";

import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { CartesianGrid, Line, XAxis, YAxis, ComposedChart, Bar } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const data = [
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

  return (
    <Card className="w-full lg:col-span-2 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle>Engagement Rate Trend</CardTitle>
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
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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

            {/* Bar with gradient + hover gradient */}
            <Bar
              dataKey="bar"
              barSize={50}
              fill={themeNext === "light" ? "#DCE0E4" : "#404663"}
              radius={[10, 10, 10, 10]}
              activeBar={{ fill: "url(#barGradientHover)" }}
            />

            {/* 3 lines without dots */}
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
  );
};

export default EngagementTrend;
