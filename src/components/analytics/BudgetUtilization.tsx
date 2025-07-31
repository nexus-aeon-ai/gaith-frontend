"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const budgetData = [
  { label: "Nexus A", value: 55, color: "#3b82f6" },
  { label: "Nexus B", value: 30, color: "#fbbf24" },
  { label: "Nexus C", value: 15, color: "#10b981" },
];

const BudgetUtilization = () => (
  <div className="bg-card rounded-lg shadow-md p-4 w-full flex flex-col items-center text-card-foreground">
    <h2 className="font-semibold text-lg mb-2 text-card-foreground">Budget Utilization</h2>
    <ResponsiveContainer width={220} height={220} className="flex items-center justify-center">
      <PieChart>
        <Pie
          data={budgetData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
        >
          {budgetData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-col items-center justify-center">
      <div className="font-bold text-xl">100,887.5 b</div>
      <div className="text-xs text-gray-500">Total Budget</div>
      <Legend />
    </div>
  </div>
);

export default BudgetUtilization;
