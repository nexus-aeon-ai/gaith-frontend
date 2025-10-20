"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { mockCampaignCompData } from "@/components/ClientManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3072C0",
  },
  expenses: {
    label: "Expenses",
    color: "#ECA338",
  },
};

const CampaignComparison = () => {
  const financialData = mockCampaignCompData;
  const { theme } = useTheme();

  return (
    <div className="space-y-6 bg-card p-4">
      {/* Campaign Comparison chart card */}
      <Card className="p-0 w-full h-auto">
        <CardHeader>
          <div className="flex items-center justify-between p-2">
            <CardTitle>Campaign Comparison</CardTitle>
            <Select defaultValue="last-year">
              <SelectTrigger className="w-24">
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
        <CardContent className="p-0 h-auto">
          <ChartContainer className="p-0 h-[400px] w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData}
                margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                barCategoryGap="40%"
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                  dataKey="quarter"
                  axisLine={{ stroke: "#ccc", strokeDasharray: "3 3" }}
                  tickLine={false}
                  tick={{ fontSize: 15, fill: theme === "dark" ? "#CCCFDB" : "#303444" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 15, fill: theme === "dark" ? "#CCCFDB" : "#303444" }}
                  domain={[0, 100000]}
                  ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                />

                {/* ✅ Shadcn Tooltip (now works) */}
                <ChartTooltip content={<ChartTooltipContent />} />

                {/* ✅ Use Shadcn color tokens */}
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[16, 16, 16, 16]}
                  barSize={35}
                />
                <Bar
                  dataKey="expenses"
                  fill="var(--color-expenses)"
                  radius={[16, 16, 16, 16]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignComparison;
