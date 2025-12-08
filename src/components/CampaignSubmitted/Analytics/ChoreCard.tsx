import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ChoreCardProps {
  title?: string;
  children?: React.ReactNode;
}

const ChoreCard = ({ title="", children }: ChoreCardProps) => {
  return (
    <Card className="overflow-hidden rounded-lg p-3 pb-3">
      <CardHeader className="px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#070913] dark:text-[#F6FBFE]">{title}</h2>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-full">{children}</CardContent>
    </Card>
  );
};

export default ChoreCard;
