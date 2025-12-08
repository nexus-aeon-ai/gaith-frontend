"use client";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileIcon from "@/components/ui/icons/file";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign, CampaignTasksTabProps, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

import { mockCampaigns, mockTasks } from "../../data";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "megaphone":
      return (
        <div className="rounded-full p-1 bg-[#3072C014]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M3.10787 8.4093C2.44843 8.58593 2.05745 9.26406 2.23407 9.92283L2.89685 12.3953C3.07348 13.0541 3.75061 13.4457 4.40938 13.2688L6.60906 12.6801L5.30688 7.82031L3.10787 8.4093Z"
              fill="#3072C0"
            />
            <path
              d="M10.113 4.84508C10.0329 4.54291 9.72206 4.36294 9.41955 4.44441L8.57681 4.67012C8.29601 4.74558 8.12305 5.0207 8.16612 5.30251L5.86694 7.33124L7.33807 12.8244L10.3438 13.4308C10.4479 13.6962 10.7341 13.8485 11.0169 13.773L11.8586 13.548C12.1608 13.4665 12.3411 13.156 12.2596 12.8535L10.113 4.84508Z"
              fill="#3072C0"
            />
            <path
              d="M5.70603 13.6123L4.58248 13.9131C4.56913 13.9165 4.55544 13.9178 4.54175 13.9212L5.16479 16.246C5.24559 16.5489 5.55678 16.7285 5.85962 16.647L5.92706 16.6287C6.23024 16.5479 6.4092 16.2367 6.32907 15.9342L5.70603 13.6123Z"
              fill="#3072C0"
            />
            <path
              opacity="0.5"
              d="M11.4836 7.37529L12.1811 9.97631C12.8987 9.78365 13.3254 9.04509 13.1331 8.32755C12.9407 7.60868 12.2028 7.18297 11.4836 7.37529Z"
              fill="#3072C0"
            />
            <path
              d="M15.7175 3.59993C15.5789 3.4794 15.3682 3.49442 15.2473 3.63399L13.2887 5.89777C13.1682 6.03701 13.1835 6.24803 13.3234 6.36856C13.3862 6.42332 13.4643 6.45003 13.5418 6.4497C13.635 6.4497 13.7281 6.41063 13.7939 6.33417L15.7522 4.07072C15.8727 3.93082 15.857 3.72013 15.7175 3.59993Z"
              fill="#3072C0"
            />
            <path
              d="M17.5307 10.7048L14.7023 9.72382C14.6071 9.69043 14.507 9.70312 14.4262 9.7502C14.3594 9.78893 14.3053 9.8507 14.2776 9.92983C14.2171 10.1041 14.3093 10.2944 14.4833 10.3549L17.311 11.3362C17.4859 11.3966 17.6759 11.3041 17.736 11.1305C17.7965 10.9559 17.7043 10.7652 17.5307 10.7048Z"
              fill="#3072C0"
            />
            <path
              d="M14.3918 8.33546L17.2509 7.56917C17.4292 7.5221 17.535 7.33879 17.4869 7.16082C17.4395 6.98253 17.2572 6.87702 17.0782 6.92443L14.2181 7.69071C14.0408 7.73812 13.9343 7.92143 13.9817 8.09973C14.0218 8.24898 14.1567 8.34714 14.3046 8.34748C14.3337 8.34748 14.3624 8.34347 14.3918 8.33546Z"
              fill="#3072C0"
            />
          </svg>
        </div>
      );
    case "search":
      return (
        <div className="rounded-full p-1 bg-[#2BAE8214]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M9.58341 17.4998C13.9557 17.4998 17.5001 13.9554 17.5001 9.58317C17.5001 5.21092 13.9557 1.6665 9.58341 1.6665C5.21116 1.6665 1.66675 5.21092 1.66675 9.58317C1.66675 13.9554 5.21116 17.4998 9.58341 17.4998Z"
              fill="#2BAE82"
            />
            <path
              d="M17.7496 18.3335C17.5996 18.3335 17.4496 18.2751 17.3413 18.1668L15.7913 16.6168C15.5663 16.3918 15.5663 16.0251 15.7913 15.7918C16.0163 15.5668 16.383 15.5668 16.6163 15.7918L18.1663 17.3418C18.3913 17.5668 18.3913 17.9335 18.1663 18.1668C18.0496 18.2751 17.8996 18.3335 17.7496 18.3335Z"
              fill="#2BAE82"
            />
          </svg>
        </div>
      );
    case "calendar":
      return (
        <div className="rounded-full p-1 bg-[#EA3B1F14]">
          <CalendarIcon color="#A81A10" width={20} height={20} />
        </div>
      );
    case "file-text":
      return (
        <div className="rounded-full p-1 bg-[#EA3B1F14]">
          <FileIcon color="#A17607" width={20} height={20} />
        </div>
      );
    case "file-text2":
      return (
        <div className="rounded-full p-1 bg-[#2BAE8214]">
          <FileIcon color="#175E46" width={20} height={20} />
        </div>
      );
    default:
      return null;
  }
};

const CampaignTasksTab = ({
  setShowPendingTasks,
  setShowCampaignOverview,
}: CampaignTasksTabProps) => {
  const campaigns = mockCampaigns;
  const tasks = mockTasks;

  const { theme } = useTheme();

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "Inprogress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "On Track":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High Priority":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Medium Priority":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDueColor = (due: string) => {
    if (due.includes("2h")) return "text-red-600";
    if (due.includes("Today")) return "text-orange-600";
    return "text-muted-foreground";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 -mx-6 sm:mx-0 px-6 sm:px-2">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between p-2 ">
            <CardTitle>Campaign Overview</CardTitle>
            <Tabs defaultValue="Active" className="w-auto">
              <TabsList className="inline-flex h-9 gap-2 items-center justify-center rounded-lg bg-card p-1 text-muted-foreground">
                <TabsTrigger
                  value="Active"
                  className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-[12px] px-4 py-2 m-2 mx-0 text-sm font-medium data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0] data-[state=active]:text-blue-500"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="Completed"
                  className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-[12px] px-4 py-2 m-2 mx-0 text-sm font-medium data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0] data-[state=active]:text-blue-500"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <Tabs defaultValue="Active" className="w-full">
            <TabsContent value="Active" className="space-y-4">
              {campaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="p-4 flex  justify-between w-full border border-border bg-[#F3F5F7] dark:bg-card rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => setShowCampaignOverview(true)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") setShowCampaignOverview(true);
                  }}
                  role="button"
                >
                  <div className="left-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                          {getIconComponent(campaign.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.type} • Ends {campaign.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {campaign.budget.totalBudget}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-xs pointer-events-none",
                            getStatusColor(campaign.status),
                          )}
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {campaign.tasksRemaining} tasks remaining
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div className="flex items-center gap-1">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill={theme === "dark" ? "#303444" : "#070913"}
                        />
                      </svg>

                      <p className="text-[#070913] dark:text-[#F6FBFE] font-semibold">text</p>
                    </div>
                    <p className="font-medium text-[#2BAE82] ">+285% ROI</p>
                    <p className="text-sm text-muted-foreground">Updated 2h ago</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="Completed" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                No completed campaigns yet.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between p-2">
            <CardTitle>Pending Tasks</CardTitle>
            <Tabs defaultValue="Today" className="w-auto">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-card p-1 text-muted-foreground">
                <TabsTrigger
                  value="Today"
                  className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-[12px] px-4 py-2 m-2 text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="Upcoming"
                  className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-[12px] px-4 py-2  text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]"
                >
                  Upcoming
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <Tabs defaultValue="Today" className="w-full">
            <TabsContent value="Today" className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  role="button"
                  onClick={() => setShowPendingTasks(true)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") setShowPendingTasks(true);
                  }}
                  className="p-4 border border-border bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        {getIconComponent(task.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <span className={cn("text-sm font-medium", getDueColor(task.due))}>
                      {task.due}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn("text-xs pointer-events-none", getPriorityColor(task.priority))}
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="Upcoming" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">No upcoming tasks.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignTasksTab;
