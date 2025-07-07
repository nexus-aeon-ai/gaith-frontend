'use client';
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const budgetData = [
  { label: "Nexus A", value: 55, color: "#3b82f6" },
  { label: "Nexus B", value: 30, color: "#fbbf24" },
  { label: "Nexus C", value: 15, color: "#10b981" },
];

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col items-center gap-1 mt-2">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
          <span style={{ color: entry.color }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const BudgetUtilization = () => (
  <div className="bg-white rounded-lg shadow-md p-4 w-full flex flex-col items-center">
    <h2 className="font-semibold text-lg mb-2">Budget Utilization</h2>
    <ResponsiveContainer width={220} height={220}>
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
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
    <div className="text-center mt-2">
      <div className="font-bold text-xl">100,887.5 b</div>
      <div className="text-xs text-gray-500">Total Budget</div>
    </div>
  </div>
);

export default BudgetUtilization; 