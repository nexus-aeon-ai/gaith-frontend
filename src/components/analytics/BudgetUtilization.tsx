"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";


const budgetData = [
  { label: "Nexus", value: 25, color: "#F5B719" },
  { label: "Nexus", value: 30, color: "#A1C2E7" },
  { label: "Nexus", value: 15, color: "#91E4C8" },
  { label: "Nexus", value: 30, color: "#3072C0" },
];

const RADIAN = Math.PI / 180;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white z-100 absolute top-12 dark:bg-gray-800 shadow-md rounded-md px-3 py-2 text-sm">
        <p className="font-semibold">{data.label}</p>
        <p>{data.value} Đ</p>
      </div>
    );
  }
  return null;
};

// Active slice only moves outward
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  // Simply increase outerRadius
  const expandedOuterRadius = outerRadius + 10;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={expandedOuterRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

const BudgetUtilization = () => {
  const { theme: themeNext } = useTheme();


  return (
    <div className="bg-card rounded-lg shadow-md p-4 w-full flex flex-col text-card-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-card-foreground">Budget Utilization</h2>
        <select className="text-sm px-3 py-1 bg-card rounded-3xl border appearance-none">
          <option>3 Month</option>
        </select>
      </div>
      <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={budgetData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={110}
                outerRadius={160}
                paddingAngle={1}
                cornerRadius={5}
                label={false} // disable default labels
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              {/* Inner Circle */}
              <Pie
                data={[{ value: 1 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={themeNext === "light" ? "#F3F7FC" : "#0D1E32"}
                stroke="none"
                isAnimationActive={false}
              />
              <Tooltip content={CustomTooltip} />
            </PieChart>
          </ResponsiveContainer>

          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className="bg-[#E4E9F1] dark:bg-[#0F1220] rounded-full w-[170px] h-[170px] flex flex-col items-center justify-center text-center"
              style={{
                boxShadow: "0px 3.11px 15.57px 0px #00000029",
              }}
            >
              <div className="font-bold text-xl text-gray-900 dark:text-gray-100">100,887.5 Đ</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Budget</div>
            </div>
          </div>

          {/* Render labels manually so they never vanish */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {budgetData.map((entry, index) => {
              const total = budgetData.reduce((sum, d) => sum + d.value, 0);
              const startAngle =
                index === 0
                  ? 0
                  : budgetData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
              const midAngle = startAngle + ((entry.value / total) * 360) / 2;

              const radius = 110 + (160 - 110) * 0.5; // same as inner + half width
              const cx = 200; // center x, adjust to match container
              const cy = 200; // center y
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  key={index}
                  x={x}
                  y={y}
                  fill="black"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {`${((entry.value / total) * 100).toFixed(0)}%`}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilization;
