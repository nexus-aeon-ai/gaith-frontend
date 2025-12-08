"use client";

import { useTheme } from "next-themes";
import { CartesianGrid, Line, XAxis, YAxis, ComposedChart, Bar } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

const data = [
  { month: "Mon", reach: 12, impressions: 11, bar: 27 },
  { month: "Tue", reach: 18, impressions: 20, bar: 27 },
  { month: "Wed", reach: 12, impressions: 15, bar: 27 },
  { month: "Thu", reach: 15, impressions: 17, bar: 27 },
  { month: "Fri", reach: 16, impressions: 18, bar: 27 },
  { month: "Sat", reach: 12, impressions: 16, bar: 27 },
  { month: "Sun", reach: 14, impressions: 19, bar: 27 },
];

const chartConfig = {
  reach: {
    label: "Reach",
    color: "#3FD09F",
  },
  impressions: {
    label: "Impressions",
    color: "#3072C0",
  },
} satisfies ChartConfig;

const ReachImpressionChart = () => {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between p-2">
          <CardTitle className="text-md font-bold">Reach vs Impressions</CardTitle>
        </div>
      </CardHeader>
      <Separator className="mb-4" />
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
              dataKey="impressions"
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
              legendType="none"
              barSize={35}
              fill={themeNext === "light" ? "#DCE0E4" : "#404663"}
              radius={[12, 12, 12, 12]}
              activeBar={{ fill: "url(#barGradientHover)" }}
            />

            {/* 2 lines without dots */}
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#3072C0"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#F7C649"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReachImpressionChart;
