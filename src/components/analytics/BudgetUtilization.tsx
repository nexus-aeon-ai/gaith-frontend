"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for different time periods
const budgetDataByPeriod = {
  3: [
    { label: "Marketing", value: 25, color: "#F5B719" },
    { label: "Development", value: 30, color: "#A1C2E7" },
    { label: "Operations", value: 15, color: "#91E4C8" },
    { label: "Sales", value: 30, color: "#3072C0" },
  ],
  6: [
    { label: "Marketing", value: 35, color: "#F5B719" },
    { label: "Development", value: 25, color: "#A1C2E7" },
    { label: "Operations", value: 20, color: "#91E4C8" },
    { label: "Sales", value: 20, color: "#3072C0" },
  ],
  9: [
    { label: "Marketing", value: 20, color: "#F5B719" },
    { label: "Development", value: 40, color: "#A1C2E7" },
    { label: "Operations", value: 25, color: "#91E4C8" },
    { label: "Sales", value: 15, color: "#3072C0" },
  ],
  12: [
    { label: "Marketing", value: 30, color: "#F5B719" },
    { label: "Development", value: 35, color: "#A1C2E7" },
    { label: "Operations", value: 10, color: "#91E4C8" },
    { label: "Sales", value: 25, color: "#3072C0" },
  ],
};

const timeOptions = [
  { value: 3 as const, label: "3 Months" },
  { value: 6 as const, label: "6 Months" },
  { value: 9 as const, label: "9 Months" },
  { value: 12 as const, label: "12 Months" },
];

const RADIAN = Math.PI / 180;

// Enhanced active shape that scales the slice
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      {/* Regular slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Expanded overlay slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={2}
        style={{ filter: "brightness(1.1)" }}
      />
    </g>
  );
};

// small responsive hook
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
  
  // Get current data based on selected period
  const currentData = budgetDataByPeriod[selectedPeriod];
  const selectedOption = timeOptions.find(option => option.value === selectedPeriod);
  
  // Calculate total budget for selected period
  const totalBudget = currentData.reduce((sum, item) => sum + item.value, 0);

  // responsive breakpoints
  const isSmall = useMediaQuery("(max-width: 640px)");
  const isMedium = useMediaQuery("(max-width: 1024px)");

  // radii based on viewport
  const innerRadius = isSmall ? 90 : isMedium ? 110 : 120;
  const outerRadius = isSmall ? 130: isMedium ? 150 : 180;
  const overlaySize = Math.max(64, Math.min(220, Math.round(innerRadius * 1.6)));

  // custom label uses actual cx/cy provided by Recharts (fixes positioning)
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius: ir, outerRadius: orr, percent } = props;

    // position the label between inner and outer radius
    const factor = isSmall ? 0.2 : isMedium ? 0.4 : 0.4;
    const radius = ir + (orr - ir) * factor;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // pick anchor so text doesn't run into the center
    const textAnchor = x > cx ? "start" : "end";
    const fontSize = isSmall ? 10 : 12;
   

    return (
      <text
        x={x}
        y={y}
        fill={"#000"}
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
    <div className="bg-card rounded-lg shadow-md p-4 w-full flex flex-col text-card-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-card-foreground">Budget Utilization</h2>
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
            {timeOptions.map((option) => (
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
      </div>
      <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={currentData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                cornerRadius={5}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {currentData.map((entry) => (
                  <Cell  
                    key={`cell-${entry.label}`} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Overlay Text (center) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className="bg-[#E4E9F1] dark:bg-[#0F1220] rounded-full flex flex-col items-center justify-center text-center"
              style={{
                width: overlaySize,
                height: overlaySize,
                boxShadow: "0px 3.11px 15.57px 0px #00000029",
              }}
            >
              <div
                className={`font-bold ${
                  isSmall ? "text-sm" : "text-xl"
                } text-gray-900 dark:text-gray-100`}
              >
                {totalBudget.toLocaleString()}K Đ
              </div>
              <div
                className={`text-gray-500 dark:text-gray-400 ${
                  isSmall ? "text-[10px]" : "text-xs"
                }`}
              >
                Total Budget ({selectedPeriod}M)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilization;
