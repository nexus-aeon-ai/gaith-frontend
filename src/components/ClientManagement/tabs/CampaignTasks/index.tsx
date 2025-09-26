"use client";


import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { Calendar, FileText, Megaphone, Search } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Campaign, CampaignTasksTabProps, Task } from "@/lib/types";
import { mockCampaigns, mockTasks } from "../../data";

const getIconComponent = (iconName: string, color: string) => {
  const iconProps = { className: `h-5 w-5 ${color}` };
  switch (iconName) {
    case "megaphone": return <Megaphone {...iconProps} />;
    case "search": return <Search {...iconProps} />;
    case "calendar": return <Calendar {...iconProps} />;
    case "file-text": return <FileText {...iconProps} />;
    default: return null;
  }
};

const CampaignTasksTab = ({ client }: CampaignTasksTabProps) => {
  const campaigns = mockCampaigns;
  const tasks = mockTasks;

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
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-card  p-1 text-muted-foreground">
                <TabsTrigger value="Active" className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 m-2 text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]">Active</TabsTrigger>
                <TabsTrigger value="Completed" className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 m-2 text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator  />   
        <CardContent>
          <Tabs defaultValue="Active" className="w-full">
            <TabsContent value="Active" className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 w-full border border-border bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        {getIconComponent(campaign.icon, campaign.iconColor)}
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
                        {campaign.budget}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {campaign.roi}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(campaign.status))}>
                        {campaign.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.tasksRemaining} tasks remaining
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {campaign.lastUpdated}
                    </span>
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
                <TabsTrigger value="Today" className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 m-2 text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]">Today</TabsTrigger>
                <TabsTrigger value="Upcoming" className="inline-flex border-1 items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2  text-sm font-medium data-[state=active]:text-foreground data-[state=active]:bg-[#3072C014] data-[state=active]:border-[#3072C0]">Upcoming</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator  />   
        <CardContent>
          <Tabs defaultValue="Today" className="w-full">
            <TabsContent value="Today" className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-border bg-background rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        {getIconComponent(task.icon, task.iconColor)}
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
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="Upcoming" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                No upcoming tasks.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignTasksTab;
