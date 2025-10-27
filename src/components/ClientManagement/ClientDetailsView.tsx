"use client";

import {
  ArrowLeft,
  BarChart3,
  CirclePlus,
  FileSpreadsheet,
  FolderOpen,
  Info,
  Megaphone,
  Pencil,
} from "lucide-react";
import { useState } from "react";

import { CampaignForm } from "@/components/ClientManagement/Campaign/Campaign";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  CampaignTasksTab,
  HistoricalPerformanceTab,
  IntegrationsTab,
  MainInformationTab,
} from "./tabs";

interface ClientDetailsViewProps {
  client: Client;
  onBack: () => void;
}

const ClientDetailsView = ({ client, onBack }: ClientDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState("main-info");
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [showPendingTasks, setShowPendingTasks] = useState(false);

  if (newCampaignOpen) {
    return <CampaignForm client={client} setCampaignOpen={setNewCampaignOpen} />;
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-background overflow-x-hidden",
      )}
    >
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/client-management">Client Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Client Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{client.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={cn(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    client.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : client.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                  )}
                >
                  {client.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {client.services}. Client since March 2023
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card rounded-2xl w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12  lg:w-40",
                "border-border",
                "hover:bg-blue-700 text-white",
                "text-xs sm:text-sm lg:text-base text-black",
                "dark:text-white",
              )}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-transparent rounded-2xl w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12  lg:w-40",
                "hover:bg-blue-700 text-white",
                "border-border",
                "text-xs sm:text-sm lg:text-base text-muted-foreground",
              )}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
            <Button
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-[#508CD3] rounded-2xl w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12  lg:w-60",
                "hover:bg-blue-700 text-white",
                "text-xs sm:text-sm lg:text-base",
              )}
              onClick={() => {
                setNewCampaignOpen(true);
              }}
            >
              <CirclePlus className="h-4 w-4" />
              <span>New Campaign</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full bg-card rounded-xl border border-border"
        defaultValue="main-info"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-16 sm:mb-4 h-16 bg-card  relative ">
          <TabsTrigger
            value="main-info"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 h-14 border-border border-b-1 rounded-none",
              "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD] data-[state=active]:rounded-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#78A7DD]",
              "hover:bg-card/50 hover:text-blue-500",
              "text-gray-600 text-xs sm:text-sm px-2 py-3",
            )}
          >
            <Info
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                activeTab === "main-info" ? "text-[#78A7DD]" : "text-gray-600",
              )}
            />
            <span className="hidden sm:inline">Main Information</span>
            <span className="sm:hidden">Main</span>
          </TabsTrigger>
          <TabsTrigger
            value="campaign-tasks"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 h-14 rounded-none border-border border-b-1",
              "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD] data-[state=active]:rounded-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#78A7DD]",
              "hover:bg-card/50 hover:text-blue-500",
              "text-gray-600 text-xs sm:text-sm px-2 py-3",
            )}
          >
            <Megaphone
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                activeTab === "campaign-tasks" ? "text-[#78A7DD]" : "text-gray-600",
              )}
            />
            <span className="hidden sm:inline">Campaign & Tasks</span>
            <span className="sm:hidden">Campaign</span>
          </TabsTrigger>
          <TabsTrigger
            value="historical-performance"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 h-14 rounded-none border-border border-b-1",
              "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD] data-[state=active]:rounded-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#78A7DD]",
              "hover:bg-card/50 hover:text-blue-500",
              "text-gray-600 text-xs sm:text-sm px-2 py-3",
            )}
          >
            <BarChart3
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                activeTab === "historical-performance" ? "text-[#78A7DD]" : "text-gray-600",
              )}
            />
            <span className="hidden sm:inline">Historical Performance</span>
            <span className="sm:hidden">Performance</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 h-14 rounded-none border-border border-b-1",
              "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD] data-[state=active]:rounded-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#78A7DD]",
              "hover:bg-card/50 hover:text-blue-500",
              "text-gray-600 text-xs sm:text-sm px-2 py-3",
            )}
          >
            <FolderOpen
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                activeTab === "integrations" ? "text-[#78A7DD]" : "text-gray-600",
              )}
            />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main-info" className="mt-0">
          <MainInformationTab client={client} />
        </TabsContent>

        <TabsContent value="campaign-tasks" className="mt-0">
          <CampaignTasksTab client={client} setShowPendingTasks={setShowPendingTasks} />
        </TabsContent>

        <TabsContent value="historical-performance" className="mt-0">
          <HistoricalPerformanceTab client={client} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <IntegrationsTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailsView;
