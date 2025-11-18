"use client";

import { useTheme } from "next-themes";
import React, { useState } from "react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ActiveShape } from "recharts/types/util/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DownArrow from "@/components/ui/icons/down-arrow";
import { Separator } from "@/components/ui/separator";

// Mock data for different time periods
const budgetDataByPeriod = {
  3: [
    { label: "Marketing", value: 25, fill: "var(--color-marketing)" },
    { label: "Development", value: 30, fill: "var(--color-development)" },
    { label: "Operations", value: 15, fill: "var(--color-operations)" },
    { label: "Sales", value: 30, fill: "var(--color-sales)" },
  ],
  6: [
    { label: "Marketing", value: 35, fill: "var(--color-marketing)" },
    { label: "Development", value: 25, fill: "var(--color-development)" },
    { label: "Operations", value: 20, fill: "var(--color-operations)" },
    { label: "Sales", value: 20, fill: "var(--color-sales)" },
  ],
  9: [
    { label: "Marketing", value: 20, fill: "var(--color-marketing)" },
    { label: "Development", value: 40, fill: "var(--color-development)" },
    { label: "Operations", value: 25, fill: "var(--color-operations)" },
    { label: "Sales", value: 15, fill: "var(--color-sales)" },
  ],
  12: [
    { label: "Marketing", value: 30, fill: "var(--color-marketing)" },
    { label: "Development", value: 35, fill: "var(--color-development)" },
    { label: "Operations", value: 10, fill: "var(--color-operations)" },
    { label: "Sales", value: 25, fill: "var(--color-sales)" },
  ],
};

// Chart configuration for shadcn
const chartConfig = {
  value: {
    label: "Budget",
  },
  marketing: {
    label: "Marketing",
    color: "#F5B719",
  },
  development: {
    label: "Development",
    color: "#A1C2E7",
  },
  operations: {
    label: "Operations",
    color: "#91E4C8",
  },
  sales: {
    label: "Sales",
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

// Enhanced active shape that scales the slice
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

// Responsive hook
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

const BudgetUtilization: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<3 | 6 | 9 | 12>(3);
  const { theme } = useTheme();

  const currentData = budgetDataByPeriod[selectedPeriod];
  const selectedOption = timeOptions.find(option => option.value === selectedPeriod);

  const totalBudget = currentData.reduce((sum, item) => sum + item.value, 0);

  const isXs = useMediaQuery("(max-width: 480px)");
  const isSm = useMediaQuery("(max-width: 640px)");
  const isMd = useMediaQuery("(max-width: 768px)");
  const isLg = useMediaQuery("(max-width: 1024px)");
  const isXl = useMediaQuery("(max-width: 1280px)");
  const is2xl = useMediaQuery("(max-width: 1536px)");

  // Decide radii based on breakpoints
  const innerRadius = isXs ? 50 : isSm ? 60 : isMd ? 70 : isLg ? 80 : isXl ? 90 : is2xl ? 100 : 100;

  const outerRadius = isXs
    ? 75
    : isSm
      ? 90
      : isMd
        ? 95
        : isLg
          ? 110
          : isXl
            ? 120
            : is2xl
              ? 140
              : 140;

  const overlaySize = Math.max(64, Math.min(240, Math.round(innerRadius * 1.6)));

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius: ir, outerRadius: orr, percent, fill } = props;

    //for inner percentage text
    // Adjust factor per breakpoint
    const factor = isXs ? 0.15 : isSm ? 0.2 : isMd ? 0.2 : isLg ? 0.2 : isXl ? 0.2 : 0.2;

    const radiusP = ir + (orr - ir) * factor;
    const xP = cx + radiusP * Math.cos(-midAngle * RADIAN);
    const yP = cy + radiusP * Math.sin(-midAngle * RADIAN);

    const textAnchor = xP > cx ? "start" : "end";

    const radius = outerRadius; // push line outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const lineEndX = x + (x > cx ? 30 : -30); // horizontal line direction
    const lineEndY = y;

    return (
      <g>
        <text
          x={xP}
          y={yP}
          fill="hsl(var(--foreground))"
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="600"
          pointerEvents={"none"}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>

        {/* horizontal line */}
        <line x1={x} y1={y} x2={lineEndX} y2={lineEndY} stroke={fill} strokeWidth={1.5} />

        {/* label */}
        <text
          x={lineEndX + (x > cx ? 6 : -6)}
          y={lineEndY}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="middle"
          fontSize={14}
          fill={theme === "dark" ? "#F6FBFE" : "#070913"}
        >
          Nexus
        </text>
      </g>
    );

    // // Adjust factor per breakpoint
    // const factor = isXs ? 0.15 : isSm ? 0.2 : isMd ? 0.2 : isLg ? 0.2 : isXl ? 0.2 : 0.2;

    // const radius = ir + (orr - ir) * factor;
    // const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // const textAnchor = x > cx ? "start" : "end";

    // // for line labels
    // const radiusLine = orr; // push line outside the pie
    // const xLine = cx + radiusLine * Math.cos(-midAngle * RADIAN);
    // const yLine = cy + radiusLine * Math.sin(-midAngle * RADIAN);

    // const lineEndX = xLine + (xLine > cx ? 50 : -50); // horizontal line direction
    // const lineEndY = yLine;

    // return (
    //   <g>
    //     <text
    //       x={x}
    //       y={y}
    //       fill="hsl(var(--foreground))"
    //       textAnchor={textAnchor}
    //       dominantBaseline="central"
    //       fontSize={12}
    //       fontWeight="600"
    //       pointerEvents={"none"}
    //     >
    //       {`${(percent * 100).toFixed(0)}%`}
    //     </text>
    //     {/* horizontal line with slice color */}
    //     <line
    //       x1={x}
    //       y1={y}
    //       x2={lineEndX}
    //       y2={lineEndY}
    //       stroke={fill} // use the slice color
    //       strokeWidth={1.5}
    //     />

    //     {/* label text - dynamic from slice */}
    //     <text
    //       x={lineEndX + (x > cx ? 6 : -6)}
    //       y={lineEndY}
    //       textAnchor={x > cx ? "start" : "end"}
    //       dominantBaseline="middle"
    //       fontSize={12}
    //       fill={"red"} // match slice color
    //     >
    //       Nexus
    //     </text>
    //   </g>
    // );
  };

  return (
    <Card className="w-full lg:col-span-4 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between p-3 py-[11px]">
        <CardTitle className="font-bold text-lg text-card-foreground">Budget Utilization</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm px-3 py-[10px] dark:bg-card bg-white dark:hover:bg-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-100 rounded-[16px] border-[#DCE0E4] dark:border-[#404663] shadow-none h-auto gap-1"
            >
              {selectedOption?.label}
              <DownArrow className="!h-5 !w-5" />
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
      <Separator />
      <CardContent className="p-0">
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
          {/* Center overlay - moved outside ChartContainer */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {/* Dashed ring */}
            <div
              className="absolute rounded-full border border-dashed border-muted-foreground/30 dark:border-[#A0AEBA]"
              style={{
                width: overlaySize + 25,
                height: overlaySize + 25,
              }}
            />

            {/* Outer lighter circle */}
            <div
              className="absolute rounded-full bg-[#E8ECF5] dark:bg-[#1A2336]"
              style={{
                width: overlaySize + 15,
                height: overlaySize + 15,
              }}
            />

            {/* Inner main circle */}
            <div
              className="relative bg-muted dark:bg-[#0F1220] rounded-full flex flex-col items-center justify-center text-center"
              style={{
                width: overlaySize,
                height: overlaySize,
              }}
            >
              <div className={`font-bold ${isSm ? "text-sm" : "text-xl"} text-foreground`}>
                {totalBudget.toLocaleString()}K Đ
              </div>
              <div className={`text-muted-foreground ${isSm ? "text-[10px]" : "text-xs"}`}>
                Total Budget ({selectedPeriod}M)
              </div>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="w-full h-full aspect-square mx-auto">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={currentData}
                dataKey="value"
                nameKey="label"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                cornerRadius={5}
                labelLine={false}
                label={renderCustomizedLabel} // percentage inside
                isAnimationActive={true}
                activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetUtilization;
