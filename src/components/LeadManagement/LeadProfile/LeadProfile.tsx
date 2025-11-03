import { useQuery } from "@tanstack/react-query";
import { Flag, Globe, Mail, Phone, SquarePen, UserRound, UserRoundCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

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
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import FileText from "@/components/ui/icons/file";
import Calendar from "@/components/ui/icons/options/calendar-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import Twitterx from "@/components/ui/icons/social/twitterx";
import { LeadByIdResponse, getLeadById } from "@/lib/api/leads";
import { cn } from "@/lib/utils";

interface LeadProfileProps {
  leadId: string;
  closeLeadProfile: () => void;
}

export default function LeadProfile({ leadId, closeLeadProfile }: LeadProfileProps) {
  const { data: lead, isLoading } = useQuery<LeadByIdResponse>({
    queryKey: ["lead", leadId],
    queryFn: () => getLeadById(leadId),
    enabled: !!leadId,
  });

  const { theme } = useTheme();

  if (isLoading || !lead) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

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
              <Link
                href="/leads"
                className="text-blue-600 font-medium text-md"
                onClick={closeLeadProfile}
              >
                Leads Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lead.fullName || "-"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-2">
        <div>
          <div className="flex md:gap-2 gap-1 md:items-center items-start">
            <h1 className="text-2xl font-semibold text-foreground">{lead.fullName || "-"}</h1>
            <Badge className="md:mt-0 mt-2 rounded-sm bg-green-100 pointer-events-none dark:bg-green-900/40 text-green-700 dark:text-green-500">
              {lead.status || "New Lead"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Submitted {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 w-fit p-6 px-8 text-[16px] font-[400]",
                "bg-white dark:bg-card border-border rounded-[16px]",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <ExcelIcon />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
              <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#EA3B1F] rounded-[16px] bg-transparent"
            >
              <Flag />
              Mark as Lost
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#687192] text-[#687192] rounded-[16px] bg-transparent"
            >
              <SquarePen />
              Edit Profile
            </Button>
          </div>
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="w-fit p-6 px-8 text-[16px] bg-[#3072C0] font-[400] rounded-[16px] border-none hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserRoundCheckIcon />
              Convert to Client
            </Button>
          </div>
        </div>
      </div>
      <div className="grid bg-card gap-4  rounded-2xl p-5 border">
        {/* Top Section */}
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Contact Information</h2>
            <div className="space-y-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                {lead.emailAddress || "-"}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />
                {lead.phoneNumber || "-"}
              </div>
              <div className="flex items-center gap-2 md:max-w-xs ">
                <Globe size={16} className="text-blue-600 shrink-0" />
                <span className="truncate block">{lead.websiteUrl || "-"}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Social Media Accounts</h2>
            <div className="flex items-center gap-3">
              {lead.linkedinUrl && (
                <a
                  href={lead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-2 rounded-xl cursor-pointer"
                >
                  <Linkedin />
                </a>
              )}
              {lead.twitterUrl && (
                <a
                  href={lead.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-2 rounded-xl cursor-pointer"
                >
                  <Twitterx />
                </a>
              )}
              {lead.instagramUrl && (
                <a
                  href={lead.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-2 rounded-xl cursor-pointer"
                >
                  <Instagram />
                </a>
              )}
              {lead.facebookUrl && (
                <a
                  href={lead.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-2 rounded-xl cursor-pointer"
                >
                  <Facebook />
                </a>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Lead Details</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Source</span>
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-lg">
                {lead.leadSource?.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Assigned To</span>
              <div className="flex gap-2 items-center">
                <div
                  key={`${lead.id}-assigned-to-${lead.assignedToUser.id}`}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800 bg-orange-400",
                  )}
                >
                  {lead.assignedToUser?.fullName?.charAt(0).toUpperCase() || <UserRound />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vision & Mission */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Vision & Mission</h2>
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <h3 className="font-medium ">Vision</h3>
                <p>{lead.visionStatement || "-"}</p>
              </div>
              <div>
                <h3 className="font-medium ">Mission</h3>
                <p>{lead.missionStatement || "-"}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Location Details</h2>
            <Image
              src="/images/maps.png"
              width={500}
              height={500}
              alt="Map"
              className="rounded-lg mb-3"
            />
            <div className="text-sm text-muted-foreground space-y-1 overflow-clip">
              <p className="flex justify-between gap-2">
                <span className="font-medium ">Primary Region: </span>
                {lead.country?.name || "-"}
              </p>
              <p className="flex justify-between">
                <span className="font-medium ">Secondary Regions: </span>
                {lead.region?.name || "-"}
              </p>
              <p className="flex justify-between">
                <span className="font-medium ">Area: </span>
                {lead.area?.name || "-"}
              </p>
              <p className="flex justify-between gap-2  overflow-x-clip">
                <span className="font-medium ">Address: </span>
                {lead.fullAddress || "-"}
              </p>
            </div>
          </div>

          {/* Recent Activity [STATIC sample] */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Recent Activity</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText width={20} height={20} color={theme === "dark" ? "#C99DDD" : "#853AA6"} />
                <div className="flex flex-col">
                  <p>Downloaded Product Brochure</p>
                  <p className="text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar
                  width={20}
                  height={20}
                  color={theme === "dark" ? "#E02215" : "#A81A10 "}
                />
                <div className="flex flex-col">
                  <p>Scheduled Demo Call</p>
                  <p className="text-gray-500">5 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText width={20} height={20} color={theme === "dark" ? "#68DAB3" : "#175E46"} />
                <div className="flex flex-col">
                  <p>Downloaded Product Brochure</p>
                  <p className="text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Comments */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border">
          <h2 className="font-semibold text-lg mb-3">Notes & Comments</h2>
          <div className="flex items-center text-start w-full p-4 border rounded-lg bg-[#E4E9F1] dark:bg-[#0F1B29]">
            <p className="text-sm max-w-lg text-muted-foreground ">
              {lead.additionalNotes ||
                "Initial contact made. Sarah showed strong interest in our enterprise analytics solution. Planning to schedule a detailed demo next week."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
