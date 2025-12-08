"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const mockBudgetData = [
  { name: "Remaining", value: 30, color: "#e5e7eb" },
  { name: "Spent", value: 70, color: "#10b981" },
];

export const performanceData = [
  { month: "JAN", value: 200 },
  { month: "FEB", value: 400 },
  { month: "MAR", value: 600 },
  { month: "APR", value: 750 },
  { month: "MAY", value: 650 },
  { month: "JUN", value: 500 },
  { month: "JUL", value: 700 },
  { month: "AUG", value: 800 },
  { month: "SEP", value: 900 },
  { month: "OCT", value: 750 },
  { month: "NOV", value: 600 },
  { month: "DEC", value: 400 },
];

export const financialData = [
  { quarter: "Impressions", revenue: 68000 },
  { quarter: "Clicks", revenue: 60000 },
  { quarter: "Visits", revenue: 42000 },
  { quarter: "Conversions", revenue: 83000 },
];

const lightColors = [
  "#3072C0", // blue
  "#853AA6", // purple
  "#ECA338", // amber
  "#2BAE82", // green
];

const darkColors = [
  "#3072C0", // blue
  "#C99DDD", // lighter purple
  "#ECA338", // amber
  "#2BAE82", // green
];

const ChartsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = isDark ? darkColors : lightColors;

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
    <div className="space-y-6 py-4">
      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Metrics Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle>Performance Metrics</CardTitle>
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

        <Card className="p-0 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle>Conversion Funnel</CardTitle>
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

          <CardContent className="p-0 flex-1">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                  barCategoryGap="40%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#DCE0E4"
                    strokeOpacity={0.4}
                    vertical={false}
                    horizontal={true}
                  />
                  <XAxis
                    dataKey="quarter"
                    axisLine={{ stroke: "#ccc", strokeDasharray: "3 3" }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666" }}
                    domain={[0, 100000]}
                    ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" radius={[16, 16, 16, 16]} barSize={50}>
                    {financialData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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

export default ChartsSection;
