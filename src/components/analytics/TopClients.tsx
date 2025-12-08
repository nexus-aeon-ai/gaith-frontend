"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Data
const engagementClients = [
  { name: "Nexus", percent: 12.4 },
  { name: "Nexus", percent: 7.9 },
  { name: "Nexus", percent: 6.8 },
  { name: "Nexus", percent: 4.9 },
  { name: "Nexus", percent: 4.4 },
  { name: "Nexus", percent: 3.3 },
  { name: "Nexus", percent: 2.5 },
];

const roiClients = [
  { name: "Nexus", percent: 10.2 },
  { name: "Nexus", percent: 8.7 },
  { name: "Nexus", percent: 7.1 },
  { name: "Nexus", percent: 5.6 },
  { name: "Nexus", percent: 4.2 },
  { name: "Nexus", percent: 3.8 },
  { name: "Nexus", percent: 2.1 },
];

const barColor = "#3072C0";

// Bar chart reusable renderer
const renderBarChart = (clients: { name: string; percent: number }[], theme: string) => (
  <ChartContainer
    className="h-[400px] w-full"
    config={{
      percent: {
        label: "Percent",
        color: barColor,
      },
    }}
  >
    <BarChart
      data={clients}
      layout="vertical"
      barGap={18}
      barCategoryGap={18}
      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
    >
      <CartesianGrid
        vertical={true}
        horizontal={false}
        strokeDasharray="5 5"
        stroke={theme === "dark" ? "#404663" : "#DCE0E4"}
      />

      <XAxis
        domain={[0, 20]}
        ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
        type="number"
        axisLine={{ stroke: theme == "dark" ? "#404663" : "#DCE0E4", strokeWidth: 1 }}
        tickLine={false}
        fontSize={13}
        tick={{ fill: "var(--secondary-text)" }}
      />

      <YAxis
        type="category"
        dataKey="name"
        width={70}
        tick={{ fontSize: 15, fill: "var(--secondary-text)", fontWeight: 500 }}
        axisLine={{ stroke: theme == "dark" ? "#404663" : "#DCE0E4", strokeWidth: 1 }}
        tickLine={false}
      />

      <ChartTooltip
        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
        content={<ChartTooltipContent formatter={v => `${v}%`} />}
      />

      <Bar dataKey="percent" radius={[5, 5, 5, 5]} minPointSize={20}>
        <LabelList
          dataKey="percent"
          position="right"
          formatter={(val: number) => `${val}%`}
          style={{
            fill: "var(--secondary-text)",
            fontWeight: 600,
            fontSize: 14,
            paddingLeft: 4,
          }}
        />

        {clients.map((client, index) => (
          <Cell key={index} fill={barColor} height={25} />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);

const TopClients = () => {
  const { theme } = useTheme();
  const [tab, setTab] = useState("engagement");
  const chartData = tab === "engagement" ? engagementClients : roiClients;

  return (
    <Card className="w-full lg:col-span-6 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between p-3 pt-4">
        <CardTitle className="font-bold text-lg text-card-foreground ">
          Top Performing Clients
        </CardTitle>

        <Tabs
          defaultValue="engagement"
          onValueChange={setTab}
          value={tab}
          className="min-w-[200px]"
        >
          <TabsList className="bg-transparent rounded-lg p-1 h-9 gap-3">
            <TabsTrigger
              value="engagement"
              className="px-5 py-1.5 text-sm font-medium cursor-pointer border-1 rounded-[12px]
              data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black
              data-[state=active]:border-[#F7C649]
              data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground
              data-[state=inactive]:border-[#DCE0E4]
              dark:data-[state=active]:bg-[#1E1405] dark:data-[state=active]:text-white transition-colors"
            >
              Engagement
            </TabsTrigger>

            <TabsTrigger
              value="roi"
              onChange={() => setTab("roi")}
              className="px-5 py-1.5 text-sm font-medium cursor-pointer border-1 rounded-[12px]
              data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black
              data-[state=active]:border-[#F7C649]
              data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground
              data-[state=inactive]:border-[#DCE0E4]
              dark:data-[state=active]:bg-[#1E1405] dark:data-[state=active]:text-white transition-colors"
            >
              ROI
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <Separator />

      <CardContent className="px-4">
        <Tabs defaultValue="engagement" className="w-full">
          <TabsContent value="engagement">{renderBarChart(chartData, theme as string)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopClients;
