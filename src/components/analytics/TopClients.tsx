'use client';
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const clients = [
  { name: "Nexus", percent: 12.4 },
  { name: "Nexus", percent: 7.9 },
  { name: "Nexus", percent: 6.8 },
  { name: "Nexus", percent: 4.9 },
  { name: "Nexus", percent: 4.4 },
  { name: "Nexus", percent: 3.3 },
  { name: "Nexus", percent: 2.5 },
];

const barColors = ["#3b82f6", "#6366f1", "#06b6d4", "#fbbf24", "#10b981", "#ef4444", "#a78bfa"];

const TopClients = () => (
  <div className="bg-white rounded-lg shadow-md p-4 w-full">
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-semibold text-lg">Top Performing Clients</h2>
      <button className="text-xs px-2 py-1 bg-gray-100 rounded">Engagement</button>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={clients}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <XAxis type="number" domain={[0, 20]} hide />
        <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Bar dataKey="percent" radius={[0, 8, 8, 0]}>
          {clients.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TopClients; 