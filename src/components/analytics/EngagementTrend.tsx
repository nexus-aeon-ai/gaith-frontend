'use client';
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "JAN", social: 15, email: 10, website: 12 },
  { month: "FEB", social: 25, email: 18, website: 20 },
  { month: "MAR", social: 20, email: 12, website: 15 },
];

const colors = {
  social: "#3b82f6",
  email: "#fbbf24",
  website: "#10b981",
};

const EngagementTrend = () => (
  <div className="bg-card rounded-lg shadow-md p-4 w-full text-card-foreground">
    <h2 className="font-semibold text-lg mb-2 text-card-foreground">Engagement Rate Trend</h2>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <XAxis dataKey="month" />
        <YAxis domain={[0, 30]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="social" stroke={colors.social} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="email" stroke={colors.email} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="website" stroke={colors.website} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
    <div className="flex gap-4 mt-2 text-xs">
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background: colors.social}}></span>Social Media</span>
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background: colors.email}}></span>Email</span>
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background: colors.website}}></span>Website</span>
    </div>
  </div>
);

export default EngagementTrend; 