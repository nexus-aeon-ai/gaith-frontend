"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const engagementClients = [
  { name: "Nexus", percent: 12.4 },
  { name: "Acme Corp", percent: 7.9 },
  { name: "Globex", percent: 6.8 },
  { name: "Umbrella", percent: 4.9 },
  { name: "Initech", percent: 4.4 },
  { name: "Hooli", percent: 3.3 },
  { name: "Soylent", percent: 2.5 },
];

const roiClients = [
  { name: "Nexus", percent: 10.2 },
  { name: "Acme Corp", percent: 8.7 },
  { name: "Globex", percent: 7.1 },
  { name: "Umbrella", percent: 5.6 },
  { name: "Initech", percent: 4.2 },
  { name: "Hooli", percent: 3.8 },
  { name: "Soylent", percent: 2.1 },
];

const barColor = "#3072C0";

const renderBarChart = (clients: { name: string; percent: number }[]) => (
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
      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
    >
      <CartesianGrid vertical={true} horizontal={false} strokeDasharray="5 5" strokeOpacity={0.3} />
      <XAxis
        domain={[-0.2, 20]}
        type="number"
        axisLine={{ stroke: "#DCE0E4", strokeWidth: 1 }}
        tickLine={false}
        fontSize={13}
        tick={{ fill: "var(--secondary-text)" }}
      />
      <YAxis
        type="category"
        dataKey="name"
        width={70}
        tick={{ fontSize: 15, fill: "var(--secondary-text)", fontWeight: 500 }}
        axisLine={{ stroke: "#DCE0E4", strokeWidth: 1 }}
        tickLine={false}
      />
      <ChartTooltip
        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
        content={<ChartTooltipContent formatter={value => `${value}%`} />}
      />
      <Bar dataKey="percent" radius={[5, 5, 5, 5]} minPointSize={20}>
        <LabelList
          dataKey="percent"
          position="right"
          formatter={label => (typeof label === "number" ? `${label}%` : label)}
          style={{
            fill: "var(--secondary-text)",
            fontWeight: 600,
            fontSize: 14,
            paddingLeft: 4,
          }}
        />
        {clients.map((_, index) => (
          <Cell key={`cell-${clients[index].name}`} height={25} fill={barColor} />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);

const TopClients = () => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg py-4 w-full lg:col-span-2 col-span-1 text-card-foreground">
      <div className="flex items-center justify-between mb-2 px-3">
        <h2 className="font-semibold text-lg text-card-foreground">Top Performing Clients</h2>
        <Tabs defaultValue="engagement" className="min-w-[200px]">
          <TabsList className="bg-transparent rounded-lg p-1 h-9 gap-3">
            <TabsTrigger
              value="engagement"
              className="px-5 py-1.5 text-sm font-semibold cursor-pointer border-1 rounded-md data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black data-[state=active]:border-[#F7C649] data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground  data-[state=inactive]:border-[#DCE0E4] data-[state=active]:dark:bg-[#1E1405] data-[state=active]:dark:text-white  transition-colors "
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger
              value="roi"
              className="px-5 py-1.5 text-sm font-semibold cursor-pointer border-1 rounded-md data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black data-[state=active]:border-[#F7C649] data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground  data-[state=inactive]:border-[#DCE0E4] data-[state=active]:dark:bg-[#1E1405] data-[state=active]:dark:text-white  transition-colors"
            >
              ROI
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs defaultValue="engagement" className="w-full px-4">
        <TabsContent value="engagement">{renderBarChart(engagementClients)}</TabsContent>
        <TabsContent value="roi">{renderBarChart(roiClients)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TopClients;
