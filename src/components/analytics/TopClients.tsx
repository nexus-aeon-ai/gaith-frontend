'use client';
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

const barColor = "#3b82f6";

const renderBarChart = (clients: { name: string; percent: number }[]) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart
      data={clients}
      layout="vertical"
      barGap={18}
      barCategoryGap={18}
      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="2 2" vertical={false} />
      <XAxis type="number" domain={[0, 20]} axisLine={false} tickLine={false} fontSize={13} tick={{ fill: '#303444' }} />
      <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 15, fill: '#303444', fontWeight: 500 }} axisLine={false} tickLine={false} />
      <Tooltip formatter={(value) => `${value}%`} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
      <Bar dataKey="percent" radius={[0, 10, 10, 0]} fill={barColor} minPointSize={3}>
        <LabelList 
          dataKey="percent" 
          position="right" 
          formatter={(label) => typeof label === 'number' ? `${label}%` : label} 
          style={{ fill: '#303444', fontWeight: 600, fontSize: 14, paddingLeft: 4 }} 
        />
        {clients.map((_, index) => (
          <Cell key={`cell-${index}`} fill={barColor} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const TopClients = () => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg py-3 w-full text-card-foreground">
      <div className="flex items-center justify-between mb-2 px-3">
        <h2 className="font-semibold text-lg text-card-foreground">Top Performing Clients</h2>
        <Tabs defaultValue="engagement" className="min-w-[200px]">
          <TabsList className="bg-transparent rounded-lg p-1 h-9 gap-3">
            <TabsTrigger value="engagement" className="px-5 py-1.5 text-sm font-semibold  border-1 rounded-md data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black data-[state=active]:border-[#F7C649] data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground  data-[state=inactive]:border-[#DCE0E4] data-[state=active]:dark:bg-[#1E1405] data-[state=active]:dark:text-white  transition-colors ">Engagement</TabsTrigger>
            <TabsTrigger value="roi" className="px-5 py-1.5 text-sm font-semibold border-1 rounded-md data-[state=active]:bg-[#FEF9F1] data-[state=active]:text-black data-[state=active]:border-[#F7C649] data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground  data-[state=inactive]:border-[#DCE0E4] data-[state=active]:dark:bg-[#1E1405] data-[state=active]:dark:text-white  transition-colors">ROI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs defaultValue="engagement" className="w-full">
        <TabsContent value="engagement">
          {renderBarChart(engagementClients)}
        </TabsContent>
        <TabsContent value="roi">
          {renderBarChart(roiClients)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopClients; 