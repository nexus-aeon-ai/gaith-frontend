import React from "react";
import { EngagementTrend, TopClients, BudgetUtilization } from "@/components/analytics";
import AlertsNotifications from "./AlertsNotifications";
import MarketingReports from "./MarketingReports";

const DashboardMain = () => (
  <div className="flex flex-col gap-4 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <TopClients />
        <EngagementTrend />
        <MarketingReports />
      </div>
      <div className="flex flex-col gap-4">
        <BudgetUtilization />
        <AlertsNotifications />
      </div>
    </div>
  </div>
);

export default DashboardMain; 