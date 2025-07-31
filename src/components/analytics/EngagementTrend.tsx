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
      <ResponsiveContainer width="100%" height={430}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          {/* Grid lines */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            stroke="#64748b44"
          />
          {/* ReferenceArea bars for each month */}
          {referenceAreas}
          <XAxis dataKey="month" tick={{ fill: 'var(--secondary-text)', fontWeight: 600, fontSize: 15 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 30]} tickFormatter={v => `${v}%`} tick={{ fill: 'var(--secondary-text)', fontWeight: 600, fontSize: 15 }} axisLine={false} tickLine={false} />
          <Tooltip content={CustomTooltip} contentStyle={{ backgroundColor: 'var(--background)', color: 'var(--secondary-text)' }} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, gap: 30 }} formatter={(value) => {
            if (value === 'social') return <span className="text-[#3b82f6] font-medium">Social Media</span>;
            if (value === 'email') return <span className="text-[#fbbf24] font-medium">Email</span>;
            if (value === 'website') return <span className="text-[#10b981] font-medium">Website</span>;
            return value;
          }} />
          <Line type="monotone" dataKey="social" stroke={colors.social} strokeWidth={2} dot={false} name="Social Media" />
          <Line type="monotone" dataKey="email" stroke={colors.email} strokeWidth={2} dot={false} name="Email" />
          <Line type="monotone" dataKey="website" stroke={colors.website} strokeWidth={2} dot={false} name="Website" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTrend;
