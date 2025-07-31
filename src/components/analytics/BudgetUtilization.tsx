'use client';
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const budgetData = [
  { label: "Nexus", value: 30, color: "#3b82f6" },
  { label: "Nexus", value: 25, color: "#fbbf24" },
  { label: "Nexus", value: 30, color: "#10b981" },
  { label: "Nexus", value: 15, color: "#60a5fa" },
];

const BudgetUtilization = () => (
  <div className="bg-card rounded-lg shadow-md p-4 w-full flex flex-col text-card-foreground">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-lg text-card-foreground">Budget Utilization</h2>
      
      <select className="text-sm px-3 py-1 bg-card rounded-3xl border appearance-none p-28">
        <option>3 Month</option>
      </select>
    </div>
    <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />
    <div className="flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={budgetData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
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
    </div>
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="font-bold text-xl">100,887.5 Đ</div>
      <div className="text-xs text-gray-500">Total Budget</div>
    </div>
  </div>
);

export default BudgetUtilization; 