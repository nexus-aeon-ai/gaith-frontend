"use client";

import React, { useState } from "react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ActiveShape } from "recharts/types/util/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

const AudienceDemographics: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const currentData = budgetDataByPeriod[3];

  const totalBudget = currentData.reduce((sum, item) => sum + item.value, 0);

  const isSmall = useMediaQuery("(max-width: 640px)");
  const isMedium = useMediaQuery("(max-width: 1024px)");

  const innerRadius = isSmall ? 90 : isMedium ? 110 : 120;
  const outerRadius = isSmall ? 130 : isMedium ? 150 : 180;
  const overlaySize = Math.max(64, Math.min(220, Math.round(innerRadius * 1.6)));

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius: ir, outerRadius: orr, percent } = props;

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between p-2">
          <CardTitle className="text-md font-bold">Audience Demographics</CardTitle>
        </div>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
          {/* Center overlay - moved outside ChartContainer */}
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
                Total Audience
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
                label={renderCustomizedLabel}
                activeIndex={activeIndex !== undefined ? activeIndex : -1}
                activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceDemographics;
