"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CirclePlus, SquarePen } from "lucide-react";
import { useState } from "react";

import { CampaignForm } from "@/components/ClientManagement/Campaign/Campaign";
import ClientCampaignOverview from "@/components/ClientManagement/CampaignOverview/CampaignOverview";
import PendingTasks from "@/components/ClientManagement/PendingLastMeeting";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import BuildingIcon from "@/components/ui/icons/building";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById } from "@/lib/api/client/client";
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
  const [showCampaignOverview, setShowCampaignOverview] = useState(false);

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["clients", client.id],
    queryFn: async () => {
      const res = await getClientById(client.id);
      console.log("Single client data:", res);
      return res;
    },
  });
  if (isLoading || !clientData) {
    return <div>Loading...</div>;
  }

  // Client Data
  const clientServiceName = clientData?.serviceOfferings?.[0]?.name || "";

  const clientSince = new Date(clientData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (newCampaignOpen) {
    return <CampaignForm client={client} setCampaignOpen={setNewCampaignOpen} />;
  }

  if (showPendingTasks) {
    return <PendingTasks client={client} onBack={onBack} />;
  }

  if (showCampaignOverview) {
    return <ClientCampaignOverview onBack={onBack} />;
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-gray-50 dark:bg-gray-900 overflow-x-hidden",
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
            <BreadcrumbPage>{clientData.fullName}</BreadcrumbPage>
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
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-white dark:bg-card p-2 border-border">
                <BuildingIcon />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 mt-1 text-xs font-semibold rounded-full",
                      client.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : client.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                    )}
                  >
                    {client.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted-foreground">
                    {clientServiceName || ""}. Client since {clientSince || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-white dark:bg-card rounded-2xl sm:w-auto",
                "px-3 sm:px-4 lg:px-6 py-6",
                "border border-gray-300 dark:border-gray-500 h-12 shadow-none",
                "hover:bg-transparent hover:text-primary text-[#303444] dark:text-[#9aa1bb]",
                "text-sm font-medium",
              )}
            >
              <ExcelIcon className="h-4 w-4" />
              <span>Export Excel</span>
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#687192]/30 text-[16px] font-[400] border-[#687192] text-[#687192] hover:text-[#687192] rounded-[16px] bg-transparent"
            >
              <SquarePen color="#687192" />
              Edit Profile
            </Button>
            <Button
              disabled
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-[#3072C0] rounded-2xl w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9  py-6",
                "hover:bg-[#124c92] text-white",
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
        className="w-full bg-card rounded-xl"
        defaultValue="main-info"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-16 sm:mb-4 h-16 bg-card p-0 rounded rounded-t-[16px] overflow-hidden relative ">
          <TabsTrigger
            value="main-info"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 h-full border-border border-b-1 rounded-none",
              "data-[state=active]:bg-[#3072C014] data-[state=active]:text-[#78A7DD] data-[state=active]:rounded-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#78A7DD]",
              "hover:bg-card/50 hover:text-blue-500",
              "text-gray-600 text-xs sm:text-sm px-2 py-3",
            )}
          >
            {activeTab === "main-info" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#3072C0"
                />
                <path
                  d="M12 13.75C12.41 13.75 12.75 13.41 12.75 13V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V13C11.25 13.41 11.59 13.75 12 13.75Z"
                  fill="#3072C0"
                />
                <path
                  d="M12.92 15.6199C12.87 15.4999 12.8 15.3899 12.71 15.2899C12.61 15.1999 12.5 15.1299 12.38 15.0799C12.14 14.9799 11.86 14.9799 11.62 15.0799C11.5 15.1299 11.39 15.1999 11.29 15.2899C11.2 15.3899 11.13 15.4999 11.08 15.6199C11.03 15.7399 11 15.8699 11 15.9999C11 16.1299 11.03 16.2599 11.08 16.3799C11.13 16.5099 11.2 16.6099 11.29 16.7099C11.39 16.7999 11.5 16.8699 11.62 16.9199C11.74 16.9699 11.87 16.9999 12 16.9999C12.13 16.9999 12.26 16.9699 12.38 16.9199C12.5 16.8699 12.61 16.7999 12.71 16.7099C12.8 16.6099 12.87 16.5099 12.92 16.3799C12.97 16.2599 13 16.1299 13 15.9999C13 15.8699 12.97 15.7399 12.92 15.6199Z"
                  fill="#3072C0"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                  fill="#303444"
                />
                <path
                  d="M12 13.75C11.59 13.75 11.25 13.41 11.25 13V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75Z"
                  fill="#303444"
                />
                <path
                  d="M12 16.9999C11.87 16.9999 11.74 16.9699 11.62 16.9199C11.5 16.8699 11.39 16.7999 11.29 16.7099C11.2 16.6099 11.13 16.5099 11.08 16.3799C11.03 16.2599 11 16.1299 11 15.9999C11 15.8699 11.03 15.7399 11.08 15.6199C11.13 15.4999 11.2 15.3899 11.29 15.2899C11.39 15.1999 11.5 15.1299 11.62 15.0799C11.86 14.9799 12.14 14.9799 12.38 15.0799C12.5 15.1299 12.61 15.1999 12.71 15.2899C12.8 15.3899 12.87 15.4999 12.92 15.6199C12.97 15.7399 13 15.8699 13 15.9999C13 16.1299 12.97 16.2599 12.92 16.3799C12.87 16.5099 12.8 16.6099 12.71 16.7099C12.61 16.7999 12.5 16.8699 12.38 16.9199C12.26 16.9699 12.13 16.9999 12 16.9999Z"
                  fill="#303444"
                />
              </svg>
            )}

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
            {activeTab === "campaign-tasks" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M3.72959 10.0906C2.93827 10.3025 2.46908 11.1163 2.68104 11.9068L3.47637 14.8738C3.68832 15.6643 4.50088 16.1343 5.2914 15.9219L7.93102 15.2155L6.3684 9.38379L3.72959 10.0906Z"
                  fill="#3072C0"
                />
                <path
                  d="M12.1356 5.81341C12.0394 5.4508 11.6664 5.23484 11.3034 5.33261L10.2921 5.60346C9.95516 5.69401 9.74761 6.02416 9.7993 6.36233L7.04028 8.7968L8.80564 15.3886L12.4125 16.1162C12.5375 16.4348 12.8808 16.6175 13.2202 16.5269L14.2303 16.2569C14.5929 16.1591 14.8093 15.7865 14.7115 15.4235L12.1356 5.81341Z"
                  fill="#3072C0"
                />
                <path
                  d="M6.84709 16.3345L5.49883 16.6955C5.48281 16.6995 5.46638 16.7011 5.44995 16.7051L6.1976 19.495C6.29456 19.8584 6.66799 20.0739 7.0314 19.9762L7.11233 19.9541C7.47614 19.8572 7.6909 19.4837 7.59474 19.1207L6.84709 16.3345Z"
                  fill="#3072C0"
                />
                <path
                  opacity="0.5"
                  d="M13.7803 8.84986L14.6173 11.9711C15.4783 11.7399 15.9904 10.8536 15.7596 9.99257C15.5288 9.12993 14.6433 8.61908 13.7803 8.84986Z"
                  fill="#3072C0"
                />
                <path
                  d="M18.861 4.31933C18.6948 4.17469 18.4419 4.19272 18.2969 4.3602L15.9466 7.07674C15.8019 7.24382 15.8204 7.49705 15.9882 7.64169C16.0636 7.7074 16.1573 7.73945 16.2503 7.73905C16.3621 7.73905 16.4738 7.69217 16.5528 7.60042L18.9027 4.88428C19.0473 4.7164 19.0285 4.46357 18.861 4.31933Z"
                  fill="#3072C0"
                />
                <path
                  d="M21.0368 12.8452L17.6427 11.668C17.5286 11.6279 17.4084 11.6432 17.3114 11.6997C17.2313 11.7461 17.1663 11.8203 17.1331 11.9152C17.0606 12.1244 17.1712 12.3527 17.3799 12.4253L20.7732 13.6028C20.9831 13.6754 21.2111 13.5644 21.2832 13.356C21.3558 13.1465 21.2452 12.9177 21.0368 12.8452Z"
                  fill="#3072C0"
                />
                <path
                  d="M17.27 10.0018L20.7009 9.08223C20.9149 9.02573 21.0419 8.80577 20.9842 8.59221C20.9273 8.37825 20.7085 8.25164 20.4938 8.30853L17.0616 9.22807C16.8489 9.28497 16.721 9.50493 16.7779 9.71889C16.826 9.89799 16.9879 10.0158 17.1654 10.0162C17.2002 10.0162 17.2347 10.0114 17.27 10.0018Z"
                  fill="#3072C0"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.37793 14.8965L5.1748 15.4863H5.17383C4.62448 15.6337 4.05873 15.3073 3.91113 14.7568L3.11621 11.79C2.96875 11.24 3.29524 10.674 3.8457 10.5264L6.04883 9.93555L7.37793 14.8965Z"
                  stroke="#303444"
                  strokeWidth="0.901508"
                />
                <path
                  d="M11.4199 5.76807C11.542 5.7352 11.6671 5.80793 11.6992 5.9292L11.7002 5.93018L14.2764 15.5405C14.3049 15.6465 14.253 15.757 14.1562 15.8052L14.1123 15.8218L13.1035 16.0913C12.9919 16.121 12.8757 16.0626 12.832 15.9517L12.7422 15.7231L12.501 15.6743L9.16797 15.0015L7.54785 8.94971L10.0977 6.70068L10.2822 6.5376L10.2451 6.29443C10.2273 6.17786 10.2993 6.06811 10.4092 6.03857L10.4082 6.0376L11.4199 5.76807Z"
                  stroke="#303444"
                  strokeWidth="0.901508"
                />
                <path
                  d="M7.15869 19.2378C7.19058 19.3614 7.11712 19.4867 6.99561 19.519H6.99365L6.91357 19.5405C6.79089 19.5733 6.66592 19.5007 6.6333 19.3784H6.63232L6.00244 17.0269L6.52783 16.8862L7.15869 19.2378Z"
                  fill="#303444"
                  stroke="#303444"
                  strokeWidth="0.901508"
                />
                <path
                  d="M14.355 9.25537C14.8066 9.3166 15.1986 9.64137 15.3237 10.1089C15.4486 10.5749 15.2709 11.0515 14.9116 11.3306L14.355 9.25537Z"
                  fill="#303444"
                  stroke="#303444"
                  strokeWidth="0.901508"
                />
                <path
                  d="M18.4478 4.49121C18.5115 4.41788 18.6157 4.40219 18.6958 4.44727L18.729 4.4707C18.8123 4.54245 18.8225 4.66875 18.7505 4.75293L16.3999 7.46973C16.3608 7.51516 16.3056 7.539 16.2495 7.53906H16.2485C16.2021 7.53926 16.1556 7.5225 16.1187 7.49023H16.1177C16.0337 7.41786 16.0252 7.2912 16.0972 7.20801L18.4478 4.49121Z"
                  fill="#303444"
                  stroke="#303444"
                  strokeWidth="0.40067"
                />
                <path
                  d="M17.5757 11.8574L20.9702 13.0342C21.0734 13.0702 21.1295 13.1845 21.0933 13.29C21.0574 13.3935 20.9432 13.4496 20.8374 13.4131H20.8364L17.4448 12.2363C17.3407 12.2002 17.2854 12.0853 17.3218 11.9805L17.3208 11.9795C17.3377 11.9325 17.3706 11.8963 17.4106 11.873H17.4116C17.4479 11.852 17.49 11.8417 17.5327 11.8467L17.5757 11.8574Z"
                  fill="#303444"
                  stroke="#303444"
                  strokeWidth="0.40067"
                />
                <path
                  d="M20.5444 8.50098C20.6528 8.47226 20.7622 8.53704 20.7905 8.64355V8.64453C20.8192 8.75086 20.7561 8.86044 20.6499 8.88867H20.6489L17.2183 9.80859H17.2173C17.1982 9.81379 17.1813 9.8154 17.1655 9.81543L17.1011 9.80469C17.0597 9.79064 17.0233 9.76403 16.9985 9.72754L16.9712 9.66699C16.943 9.5601 17.0072 9.45034 17.1128 9.42188L20.5454 8.50195L20.5444 8.50098Z"
                  fill="#303444"
                  stroke="#303444"
                  strokeWidth="0.40067"
                />
              </svg>
            )}
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
            {activeTab === "historical-performance" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#3072C0"
                />
                <path
                  d="M12 19.75C7.73 19.75 4.25 16.27 4.25 12C4.25 11.59 4.59 11.25 5 11.25C5.41 11.25 5.75 11.59 5.75 12C5.75 15.45 8.55 18.25 12 18.25C15.45 18.25 18.25 15.45 18.25 12C18.25 8.55 15.45 5.75 12 5.75C11.59 5.75 11.25 5.41 11.25 5C11.25 4.59 11.59 4.25 12 4.25C16.27 4.25 19.75 7.73 19.75 12C19.75 16.27 16.27 19.75 12 19.75Z"
                  fill="#3072C0"
                />
                <path
                  d="M12 16.75C11.59 16.75 11.25 16.41 11.25 16C11.25 15.59 11.59 15.25 12 15.25C13.79 15.25 15.25 13.79 15.25 12C15.25 10.21 13.79 8.75 12 8.75C11.59 8.75 11.25 8.41 11.25 8C11.25 7.59 11.59 7.25 12 7.25C14.62 7.25 16.75 9.38 16.75 12C16.75 14.62 14.62 16.75 12 16.75Z"
                  fill="#3072C0"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1.75C17.6539 1.75 22.25 6.34614 22.25 12C22.25 17.6539 17.6539 22.25 12 22.25C6.34614 22.25 1.75 17.6539 1.75 12C1.75 9.74854 2.46503 7.61432 3.81934 5.82129L3.81836 5.82031C3.89824 5.71593 4.05373 5.69192 4.16797 5.77832C4.28282 5.86533 4.30097 6.02304 4.22168 6.12793C2.9358 7.82487 2.25 9.86102 2.25 12C2.25 17.3761 6.62386 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62386 17.3761 2.25 12 2.25C11.8661 2.25 11.75 2.13386 11.75 2C11.75 1.86614 11.8661 1.75 12 1.75Z"
                  stroke="#303444"
                />
                <path
                  d="M12 4.75C15.9939 4.75 19.25 8.00614 19.25 12C19.25 15.9939 15.9939 19.25 12 19.25C8.00614 19.25 4.75 15.9939 4.75 12C4.75 11.8661 4.86614 11.75 5 11.75C5.13386 11.75 5.25 11.8661 5.25 12C5.25 15.7261 8.27386 18.75 12 18.75C15.7261 18.75 18.75 15.7261 18.75 12C18.75 8.27386 15.7261 5.25 12 5.25C11.8661 5.25 11.75 5.13386 11.75 5C11.75 4.86614 11.8661 4.75 12 4.75Z"
                  stroke="#303444"
                />
                <path
                  d="M12 7.75C14.3439 7.75 16.25 9.65614 16.25 12C16.25 14.3439 14.3439 16.25 12 16.25C11.8661 16.25 11.75 16.1339 11.75 16C11.75 15.8661 11.8661 15.75 12 15.75C14.0661 15.75 15.75 14.0661 15.75 12C15.75 9.93386 14.0661 8.25 12 8.25C11.8661 8.25 11.75 8.13386 11.75 8C11.75 7.86614 11.8661 7.75 12 7.75Z"
                  fill="#303444"
                  stroke="#303444"
                />
              </svg>
            )}
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
            {activeTab === "integrations" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M18.75 21C18.75 21.41 18.41 21.75 18 21.75H14C13.95 21.75 13.91 21.73 13.86 21.72C13.57 22.47 12.85 23 12 23C11.15 23 10.43 22.47 10.14 21.72C10.09 21.73 10.05 21.75 10 21.75H6C5.59 21.75 5.25 21.41 5.25 21C5.25 20.59 5.59 20.25 6 20.25H10C10.05 20.25 10.09 20.27 10.14 20.28C10.34 19.76 10.76 19.34 11.28 19.14C11.27 19.09 11.25 19.05 11.25 19V16H12.75V19C12.75 19.05 12.73 19.09 12.72 19.14C13.24 19.34 13.66 19.76 13.86 20.28C13.91 20.27 13.95 20.25 14 20.25H18C18.41 20.25 18.75 20.59 18.75 21Z"
                  fill="#3072C0"
                />
                <path
                  d="M19 8.29999V12.5C19 15.3 18.3 16 15.5 16H8.5C5.7 16 5 15.3 5 12.5V5.5C5 2.7 5.7 2 8.5 2H9.54999C10.6 2 10.83 2.31003 11.23 2.84003L12.28 4.23999C12.55 4.58999 12.7 4.79999 13.4 4.79999H15.5C18.3 4.79999 19 5.49999 19 8.29999Z"
                  fill="#3072C0"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.75C12.1339 15.75 12.25 15.8661 12.25 16V19C12.25 19.1339 12.1339 19.25 12 19.25C11.8661 19.25 11.75 19.1339 11.75 19V16C11.75 15.8661 11.8661 15.75 12 15.75Z"
                  stroke="#303444"
                />
                <path
                  d="M12 18.75C13.2439 18.75 14.25 19.7561 14.25 21C14.25 22.2439 13.2439 23.25 12 23.25C10.7561 23.25 9.75 22.2439 9.75 21C9.75 19.7561 10.7561 18.75 12 18.75ZM12 19.25C11.0339 19.25 10.25 20.0339 10.25 21C10.25 21.9661 11.0339 22.75 12 22.75C12.9661 22.75 13.75 21.9661 13.75 21C13.75 20.0339 12.9661 19.25 12 19.25Z"
                  stroke="#303444"
                />
                <path
                  d="M14 20.75H18C18.1339 20.75 18.25 20.8661 18.25 21C18.25 21.1339 18.1339 21.25 18 21.25H14C13.8661 21.25 13.75 21.1339 13.75 21C13.75 20.8661 13.8661 20.75 14 20.75Z"
                  fill="#303444"
                  stroke="#303444"
                />
                <path
                  d="M6 20.75H10C10.1339 20.75 10.25 20.8661 10.25 21C10.25 21.1339 10.1339 21.25 10 21.25H6C5.86614 21.25 5.75 21.1339 5.75 21C5.75 20.8661 5.86614 20.75 6 20.75Z"
                  fill="#303444"
                  stroke="#303444"
                />
                <path
                  d="M15.5 16.75H8.5C5.28 16.75 4.25 15.72 4.25 12.5V5.5C4.25 2.28 5.28 1.25 8.5 1.25H9.54999C10.88 1.25 11.31 1.70001 11.83 2.39001L12.88 3.79004C13.08 4.05004 13.08 4.05005 13.4 4.05005H15.5C18.72 4.05005 19.75 5.08005 19.75 8.30005V12.5C19.75 15.72 18.72 16.75 15.5 16.75ZM8.5 2.75C6.11 2.75 5.75 3.11 5.75 5.5V12.5C5.75 14.89 6.11 15.25 8.5 15.25H15.5C17.89 15.25 18.25 14.89 18.25 12.5V8.30005C18.25 5.91005 17.89 5.55005 15.5 5.55005H13.4C12.41 5.55005 12.05 5.17995 11.69 4.69995L10.63 3.29004C10.28 2.82004 10.23 2.75 9.54999 2.75H8.5Z"
                  fill="#303444"
                />
              </svg>
            )}
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main-info" className="mt-0 p-4 pt-0">
          <MainInformationTab client={clientData} />
        </TabsContent>

        <TabsContent value="campaign-tasks" className="mt-0">
          <CampaignTasksTab
            setShowPendingTasks={setShowPendingTasks}
            setShowCampaignOverview={setShowCampaignOverview}
          />
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
