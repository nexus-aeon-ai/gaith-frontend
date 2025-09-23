"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Bar,
} from "recharts";

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

const colors = {
  social: "#3FD09F",
  email: "#3072C0",
  website: "#D29A09",
};

const EngagementTrend = () => {
  const [range, setRange] = useState("12 Month");
  const { theme: themeNext } = useTheme();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative flex justify-center min-w-[70px]">
          {/* Bubble */}
          <div className="dark:bg-white dark:text-black bg-black text-white px-4 py-2 rounded-full shadow-lg">
            7.5 Đ
          </div>

          {/* Arrow */}
          <div
            className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 
                          border-l-8 border-r-8 border-t-8 border-transparent 
                          dark:border-t-white border-t-black"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg py-3 w-full text-card-foreground">
      <div className="flex items-center justify-between mb-2 px-3">
        <h2 className="font-semibold text-lg text-card-foreground">Engagement Rate Trend</h2>
        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="bg-muted text-xs rounded-md px-3 py-1 border border-border focus:outline-none"
        >
          <option>3 Month</option>
          <option>6 Month</option>
          <option>12 Month</option>
        </select>
      </div>
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
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
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
              stroke="#404663"
            />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={CustomTooltip} />
            <Legend iconType="circle" />

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
              stroke={colors.email}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="social"
              stroke={colors.social}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="website"
              stroke={colors.website}
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementTrend;
