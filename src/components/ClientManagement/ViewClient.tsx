"use client";

import { Calendar, Globe, Mail, Phone, MapPin, Building2, Users, FileText, Paperclip, Briefcase, Target, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import TikTok from "@/components/ui/icons/social/tiktok";
import Twitterx from "@/components/ui/icons/social/twitterx";
import Youtube from "@/components/ui/icons/socials/youtube";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientByIdResponse } from "@/lib/api/client/client";
import { SocialMediaUrls } from "@/lib/api/leads";
import type { Client } from "@/lib/types/client-management";
import { cn } from "@/lib/utils";

import {
  CampaignTasksTab,
  HistoricalPerformanceTab,
  IntegrationsTab,
} from "./tabs";

interface ViewClientProps {
  initialData: ClientByIdResponse;
}

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
];

// Helper function to parse socialMediaUrls
function parseSocialMediaUrls(socialMediaUrls: SocialMediaUrls | string | null): SocialMediaUrls {
  if (!socialMediaUrls) return [];
  if (typeof socialMediaUrls === "string") {
    try {
      const parsed = JSON.parse(socialMediaUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(socialMediaUrls) ? socialMediaUrls : [];
}

// Helper function to map ClientByIdResponse to Client type for tabs
function mapClientToTabType(client: ClientByIdResponse): Client {
  return {
    id: client.id,
    name: client.fullName || client.clientName || "",
    email: client.emailAddress || "",
    clientName: client.clientName || "",
    status: client.isActive ? "Active" : "Inactive",
    agreementPeriod: {
      start: client.agreementStartDate
        ? new Date(client.agreementStartDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      end: client.agreementEndDate
        ? new Date(client.agreementEndDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
    },
    marketRegion: client.primaryMarketRegion?.name || "N/A",
    industrySector: client.industrySector?.name || "N/A",
    services: client.serviceOfferings?.map(so => so.name).join(", ") || "N/A",
    contactInfo: client.phoneNumber || "N/A",
    assignedTo: client.assignedUsers?.map((u, index) => ({
      name: u.fullName,
      initial: u.fullName[0] || "",
      color: COLORS[index % COLORS.length],
    })) || [],
  };
}

export default function ViewClient({ initialData }: ViewClientProps) {
  console.log(initialData);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("main-info");
  const client = initialData;
  const clientForTabs = mapClientToTabType(client);
  const socialMediaUrls = parseSocialMediaUrls(client.socialMediaUrls);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-500"
      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-500";
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-500";
      case "InProgress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-500";
      case "NotStarted":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-500";
      case "AwaitingFeedback":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-500";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-500";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500";
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-500";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 font-inter">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/client-management" className="text-blue-600 font-medium text-md">
                Client Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.clientName || "-"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-2">
        <div>
          <div className="flex md:gap-2 gap-1 md:items-center items-start">
            <h1 className="text-2xl font-semibold text-foreground">{client.clientName || "-"}</h1>
            {client.type && (
              <Badge variant="outline" className="md:mt-0 mt-2 rounded-sm">
                {client.type}
              </Badge>
            )}
            <Badge className={cn("md:mt-0 mt-2 rounded-sm pointer-events-none", getStatusColor(client.isActive))}>
              {client.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "-"}
            {client.updatedAt && client.updatedAt !== client.createdAt && (
              <> • Updated {new Date(client.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/client-management/${client.id}/edit`)}
            className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
          >
            Edit Client
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full bg-card rounded-xl"
        defaultValue="main-info"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-16 sm:mb-4 h-16 bg-card p-0 rounded rounded-t-[16px] overflow-hidden relative">
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
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main-info" className="mt-0 p-4 pt-0">
          <div className="grid gap-4">
        {/* Top Section - Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact Information */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Contact Information</h2>
              </div>
              <div className="space-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <a href={`mailto:${client.emailAddress}`} className="hover:underline">
                    {client.emailAddress || "-"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <a href={`tel:${client.phoneNumber}`} className="hover:underline">
                    {client.phoneNumber || "-"}
                  </a>
                </div>
                {client.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {client.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Social Media Accounts</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {socialMediaUrls.length > 0 ? (
                  socialMediaUrls.map((item) => {
                    const platform = item.platform.toLowerCase();
                    if (platform === "linkedin") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin />
                        </a>
                      );
                    }
                    if (platform === "twitter") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="Twitter"
                        >
                          <Twitterx />
                        </a>
                      );
                    }
                    if (platform === "instagram") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="Instagram"
                        >
                          <Instagram />
                        </a>
                      );
                    }
                    if (platform === "facebook") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="Facebook"
                        >
                          <Facebook />
                        </a>
                      );
                    }
                    if (platform === "youtube") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="YouTube"
                        >
                          <Youtube />
                        </a>
                      );
                    }
                    if (platform === "tiktok") {
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          title="TikTok"
                        >
                          <TikTok />
                        </a>
                      );
                    }
                    return null;
                  })
                ) : (
                  <span className="text-muted-foreground text-sm">No social media links</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Business Details</h2>
              <div className="space-y-3 text-sm">
                {client.industrySector && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <Badge variant="outline" className="text-xs">
                      {client.industrySector.name}
                    </Badge>
                  </div>
                )}
                {client.companySize && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="text-foreground">{client.companySize.name}</span>
                  </div>
                )}
                {client.businessMaturity && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Business Maturity</span>
                    <span className="text-foreground">{client.businessMaturity}</span>
                  </div>
                )}
                {client.languagePreferences && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language Preference</span>
                    <span className="text-foreground">{client.languagePreferences}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Section - Location & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Details */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Location Details</h2>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {client.countryType && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Country:</span>
                    <span>{client.countryType.name} ({client.countryType.code})</span>
                  </div>
                )}
                {client.cityType && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">City:</span>
                    <span>{client.cityType.name}</span>
                  </div>
                )}
                {client.area && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Area:</span>
                    <span>{client.area.name}</span>
                  </div>
                )}
                {client.fullAddress && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Full Address:</span>
                    <span className="text-right max-w-[60%]">{client.fullAddress}</span>
                  </div>
                )}
                {(client.latitude !== null && client.longitude !== null) && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Coordinates:</span>
                    <span className="text-xs">{client.latitude.toFixed(6)}, {client.longitude.toFixed(6)}</span>
                  </div>
                )}
              </div>
              {(client.latitude !== null && client.longitude !== null) ? (
                <div className="mt-3">
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${client.longitude - 0.01},${client.latitude - 0.01},${client.longitude + 0.01},${client.latitude + 0.01}&layer=mapnik&marker=${client.latitude},${client.longitude}`}
                    className="rounded-lg w-full"
                    title="Location Map"
                  />
                </div>
              ) : client.countryType ? (
                <div className="mt-3">
                  <Image
                    src="/images/maps.png"
                    width={500}
                    height={150}
                    alt="Map"
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Company Profile */}
          <Card className="flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Company Profile</h2>
              </div>
              {client.companyLogoUrl && (
                <div className="mb-3">
                  <Image
                    src={client.companyLogoUrl}
                    width={200}
                    height={200}
                    alt="Company Logo"
                    className="rounded-lg max-w-[200px] h-auto"
                  />
                </div>
              )}
              {client.businessOverview && (
                <div className="mb-3">
                  <h3 className="font-medium text-foreground mb-1 text-sm">Business Overview</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.businessOverview}</p>
                </div>
              )}
              <div className="space-y-3 text-sm text-muted-foreground flex-1">
                {client.visionStatement && (
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Vision Statement</h3>
                    <p className="text-sm whitespace-pre-wrap">{client.visionStatement}</p>
                  </div>
                )}
                {client.missionStatement && (
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Mission Statement</h3>
                    <p className="text-sm whitespace-pre-wrap">{client.missionStatement}</p>
                  </div>
                )}
                {!client.visionStatement && !client.missionStatement && !client.businessOverview && (
                  <p className="text-sm text-muted-foreground">No company profile information available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Section - Agreement & Market */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement Details */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Agreement Details</h2>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Start Date:</span>
                  <span>
                    {client.agreementStartDate
                      ? new Date(client.agreementStartDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">End Date:</span>
                  <span>
                    {client.agreementEndDate ? new Date(client.agreementEndDate).toLocaleDateString() : "-"}
                  </span>
                </div>
                {client.contractDuration !== null && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Duration:</span>
                    <span>
                      {client.contractDuration} {client.contractDurationUnit || "months"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market Information */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Market Information</h2>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {client.primaryMarketRegion && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Primary Region:</span>
                    <span>{client.primaryMarketRegion.name}</span>
                  </div>
                )}
                {client.targetAudience && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Target Audience:</span>
                    <span>{client.targetAudience.name}</span>
                  </div>
                )}
                {client.secondaryMarkets && client.secondaryMarkets.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground block mb-1">Secondary Markets:</span>
                    <div className="flex flex-wrap gap-1">
                      {client.secondaryMarkets.map((market) => (
                        <Badge key={market.marketRegion.id} variant="outline" className="text-xs">
                          {market.marketRegion.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {client.languagesSupported && client.languagesSupported.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground block mb-1">Languages Supported:</span>
                    <div className="flex flex-wrap gap-1">
                      {client.languagesSupported.map((lang) => (
                        <Badge key={lang.code} variant="secondary" className="text-xs">
                          {lang.name} ({lang.code})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fourth Section - Team & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assigned Users */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Assigned Team Members</h2>
              </div>
              {client.assignedUsers && client.assignedUsers.length > 0 ? (
                <div className="space-y-3">
                  {client.assignedUsers.map((assignedUser, index) => {
                    const color = COLORS[index % COLORS.length];
                    const initials = assignedUser.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <div key={assignedUser.id} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-gray-800",
                            color,
                          )}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{assignedUser.fullName}</p>
                          <p className="text-xs text-muted-foreground">{assignedUser.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No team members assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Service Offerings */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Service Offerings</h2>
              {client.serviceOfferings && client.serviceOfferings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {client.serviceOfferings.map((service) => (
                    <Badge
                      key={service.id}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {service.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No service offerings selected</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fifth Section - Account Manager & Marketing Strategist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Manager */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Account Manager</h2>
              {client.accountManager ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-blue-900 dark:text-blue-100 font-bold text-sm">
                    {client.accountManager.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{client.accountManager.fullName}</p>
                    <p className="text-xs text-muted-foreground">{client.accountManager.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No account manager assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Marketing Strategist */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Marketing Strategist</h2>
              {client.marketingStrategist ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-purple-900 dark:text-purple-100 font-bold text-sm">
                    {client.marketingStrategist.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{client.marketingStrategist.fullName}</p>
                    <p className="text-xs text-muted-foreground">{client.marketingStrategist.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No marketing strategist assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        {client.tasks && client.tasks.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Tasks ({client.tasks.length})</h2>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {client.tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex gap-1">
                        <Badge className={cn("text-xs", getTaskStatusColor(task.status))}>
                          {task.status}
                        </Badge>
                        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.estimatedHours !== null && (
                        <span>{task.estimatedHours} hours</span>
                      )}
                    </div>
                    {task.additionalComments && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Comments: {task.additionalComments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotations Section */}
        {client.Quotation && client.Quotation.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Quotations ({client.Quotation.length})</h2>
              </div>
              <div className="space-y-3">
                {client.Quotation.map((quotation) => (
                  <div key={quotation.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{quotation.title}</h4>
                        <p className="text-xs text-muted-foreground">{quotation.quotationNumber}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {quotation.status}
                      </Badge>
                    </div>
                    {quotation.description && (
                      <p className="text-xs text-muted-foreground mb-2">{quotation.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Amount: ${quotation.totalAmount.toFixed(2)}</span>
                      <span>Valid until: {new Date(quotation.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaigns Section */}
        {client.Campaign && client.Campaign.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Campaigns ({client.Campaign.length})</h2>
              </div>
              <div className="space-y-3">
                {client.Campaign.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{campaign.name}</h4>
                      <Badge variant={campaign.isLaunched ? "default" : "outline"} className="text-xs">
                        {campaign.isLaunched ? "Launched" : "Draft"}
                      </Badge>
                    </div>
                    {campaign.description && (
                      <p className="text-xs text-muted-foreground mb-2">{campaign.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Budget: ${campaign.totalBudget.toFixed(2)}</span>
                      <span>Start: {new Date(campaign.startAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communications */}
        {client.communications && client.communications.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Communications</h2>
              </div>
              <div className="space-y-3">
                {client.communications.map((communication) => (
                  <div key={communication.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {communication.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(communication.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{communication.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {client.attachments && client.attachments.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Attachments</h2>
              </div>
              <div className="space-y-2">
                {client.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{attachment.fileName}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{attachment.fileType}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Section */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-lg mb-3">Notes</h2>
            {client.internalNotes && (
              <div className="mb-3">
                <h3 className="font-medium text-sm mb-2">Internal Notes</h3>
                <div className="flex items-start w-full p-4 border rounded-lg bg-[#E4E9F1] dark:bg-[#0F1B29]">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {client.internalNotes}
                  </p>
                </div>
              </div>
            )}
            {client.notes && (
              <div>
                <h3 className="font-medium text-sm mb-2">Public Notes</h3>
                <div className="flex items-start w-full p-4 border rounded-lg bg-[#E4E9F1] dark:bg-[#0F1B29]">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                </div>
              </div>
            )}
            {!client.internalNotes && !client.notes && (
              <p className="text-sm text-muted-foreground">No notes available.</p>
            )}
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaign-tasks" className="mt-0">
          <CampaignTasksTab
            setShowPendingTasks={() => {}}
            setShowCampaignOverview={() => {}}
          />
        </TabsContent>

        <TabsContent value="historical-performance" className="mt-0">
          <HistoricalPerformanceTab client={clientForTabs} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <IntegrationsTab client={clientForTabs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

