"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RightArrow from "@/components/ui/icons/right-arrow";
import { Separator } from "@/components/ui/separator";

import { Button } from "../ui/button";
import { EndingIcon } from "../ui/icons/alerts/ending";
import { PendingIcon } from "../ui/icons/alerts/pending";
import { UnassignedIcon } from "../ui/icons/alerts/unassigned";


const alerts = [
  {
    id: 1,
    type: "Pending Content Approval",
    message: "12 content pieces are waiting for your approval for TechVision campaign.",
    actions: ["Review Now", "Dismiss"],
    icon: <PendingIcon className="text-[#F5B719]" />,
    time: "3h",
    color: "#ECA33814",
  },
  {
    id: 2,
    type: "Campaign Ending Soon",
    message:
      "Global Bites Summer campaign will end in 3 days. Consider renewal or prepare final report.",
    actions: ["Extend Campaign", "Prepare Report"],
    icon: <EndingIcon className="text-[#EA3B1F]" />,
    time: "3h",
    color: "#EA3B1F14",
  },
  {
    id: 3,
    type: "Unassigned Tasks",
    message: "18 tasks for Fluidic campaign need assignment. Team capacity is currently 85%.",
    actions: ["Assign Tasks", "View Details"],
    icon: <UnassignedIcon className="text-[#508CD3]" />,
    time: "3h",
    color: "#3072C014",
  },
];

const AlertsNotifications = () => {
  return (
    <Card className="col-span-1 lg:col-span-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between  py-[12px] px-4">
        <CardTitle className="text-lg p-0 font-bold text-card-foreground">
          Alerts & Notifications
        </CardTitle>
        <div className="flex items-center gap-1">
          <a href="#none" className="text-md font-medium text-[#3072C0]">
            View All
          </a>
          <RightArrow size={16} className="text-[#3072C0] "/>
        </div>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-2 px-4 pt-4">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className="p-3 rounded-lg border flex flex-col gap-2"
            style={{ backgroundColor: alert.color }}
          >
            <div className="flex w-full items-start gap-2">
              <div>{alert.icon}</div>
              <div className="w-full">
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-sm text-primary-text">{alert.type}</span>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
                <div className="text-xs max-w-[250px] text-secondary-text font-medium mb-1">
                  {alert.message}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button className="cursor-pointer text-xs px-4 py-2 rounded-[16px] bg-[#3072C0] hover:bg-[#2563eb] font-medium text-white transition-colors duration-200">
                    {alert.actions[0]}
                  </Button>
                  <Button
                    className={`cursor-pointer text-xs px-4 py-2 border-1 hover:bg-transparent shadow-none rounded-[16px] bg-transparent font-medium transition-colors duration-200 ${
                      alert.id === 1
                        ? "border-[#303444] text-[#303444] dark:text-[#b6b9c3] dark:border-[#b6b9c3]"
                        : "border-[#3072C0] text-[#3072c0]"
                    }`}
                  >
                    {alert.actions[1]}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsNotifications;
