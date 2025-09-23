"use client";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  // ComposedChart
  ComposedChart,
  Bar,
} from "recharts";

const data = [
  { month: "JAN", social: 13, email: 12, website: 11 },
  { month: "FEB", social: 25, email: 18, website: 20 },
  { month: "MAR", social: 20, email: 12, website: 15 },
  { month: "APR", social: 18, email: 15, website: 17 },
  { month: "MAY", social: 22, email: 16, website: 18 },
  { month: "JUN", social: 19, email: 14, website: 16 },
  { month: "JUL", social: 23, email: 17, website: 19 },
  { month: "AUG", social: 21, email: 15, website: 17 },
  { month: "SEP", social: 20, email: 12, website: 15 },
  { month: "OCT", social: 18, email: 11, website: 14 },
  { month: "NOV", social: 15, email: 13, website: 13 },
  { month: "DEC", social: 17, email: 14, website: 15 },
];
const data2 = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 2000, revenue: 9800 },
  { name: "Apr", sales: 2780, revenue: 3908 },
  { name: "May", sales: 1890, revenue: 4800 },
  { name: "Jun", sales: 2390, revenue: 3800 },
  { name: "Jul", sales: 3490, revenue: 4300 },
];

const colors = {
  social: "#3b82f6",
  email: "#fbbf24",
  website: "#10b981",
};

type TooltipPayload = {
  color: string;
  name: string;
  value: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-3 py-1 text-xs shadow">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span>
              {entry.name}: <span className="font-bold">{entry.value}%</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EngagementTrend = () => {
  const [range, setRange] = useState("12 Month");
  // ReferenceArea for each month (bar behind lines)
  const referenceAreas = data.map((_, idx) => (
    <ReferenceArea
      key={idx}
      x1={idx - 0.5}
      x2={idx + 0.5}
      y1={0}
      y2={30}
      fill="#64748b"
      fillOpacity={0.3}
      stroke="none"
    />
  ));
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
          <ComposedChart data={data2} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Bar chart */}
            <Bar dataKey="sales" barSize={40} fill="#82ca9d" />

            {/* Line chart */}
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementTrend;
