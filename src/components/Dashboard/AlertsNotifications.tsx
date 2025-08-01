      

import { EndingIcon } from "../ui/icons/alerts/ending";
import { PendingIcon } from "../ui/icons/alerts/pending";
import { UnassignedIcon } from "../ui/icons/alerts/unassigned";

const alerts = [
  {     
    id: 1,
    type: "Pending Content Approval",
    message: "12 content pieces are waiting for your approval for TechVision campaign.",
    actions: ["Review Now", "Dismiss"],
    icon: <PendingIcon className="text-[#fbbf24]" />,
    time: "3h",
    color: "#ECA33814",
  },
  {
    id: 2,
    type: "Campaign Ending Soon",
    message:
      "Global Bites Summer campaign will end in 3 days. Consider renewal or prepare final report.",
    actions: ["Extend Campaign", "Prepare Report"],
    icon: <EndingIcon className="text-[#ef4444]" />,
    time: "3h",
    color: "#EA3B1F14",
  },
  {
    id: 3,
    type: "Unassigned Tasks",
    message: "18 tasks for Fluidic campaign need assignment. Team capacity is currently 85%.",
    actions: ["Assign Tasks", "View Details"],
    icon: <UnassignedIcon className="text-[#3b82f6]" />,
    time: "3h",
    color: "#3072C014",
  },
];

const AlertsNotifications = () => (
  <div className="bg-card rounded-lg shadow-md p-4 w-full text-card-foreground">
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-semibold text-lg text-card-foreground">Alerts & Notifications</h2>
      <button className="text-xs px-2 py-1 bg-card rounded">View All</button>
    </div>
    <div className="space-y-3">

      {alerts.map(alert => (
        <div
          key={alert.id}
          className="p-3 rounded-lg border flex flex-col gap-2"
          style={{ borderLeft: `4px solid ${alert.color}` }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm" style={{ color: alert.color }}>
              {alert.type}
            </span>
            <span className="text-xs text-gray-400">{alert.time}</span>

          </div>
          <div className="text-xs text-secondary-text font-medium mb-1">{alert.message}</div>
          <div className="flex gap-2">
            {alert.actions.map((action, idx) => (

              <button 
                key={idx} 
                className="text-xs px-4 py-2 rounded-3xl bg-[#3072C0] hover:bg-[#2563eb] font-medium text-white transition-colors duration-200 "
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AlertsNotifications;
