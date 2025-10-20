import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PerformanceCardProps {
  title: string;
  icon: React.ReactNode;
  data: { label: string; value: string }[];
}
const PerformanceCard = ({ title, icon, data }: PerformanceCardProps) => {
  return (
    <Card className="overflow-hidden rounded-lg p-3 pb-3">
      <CardHeader className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-[18px] font-bold text-[#070913] dark:text-[#F6FBFE]">{title}</h2>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center border-b pb-1 justify-between">
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
