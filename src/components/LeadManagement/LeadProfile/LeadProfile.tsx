import { useQuery } from "@tanstack/react-query";
import { Globe, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import Facebook from "@/components/ui/icons/social/fb";
import Instagram from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import Twitterx from "@/components/ui/icons/social/twitterx";
import { LeadByIdResponse, getLeadById } from "@/lib/api/leads";

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
              className="w-fit p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#EA3B1F] rounded-[16px] bg-transparent"
            >
              Mark as Lost
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
            >
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
              Convert to Client
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 bg-card rounded-2xl p-5 border">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                {lead.websiteUrl || "-"}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border">
            <h2 className="font-semibold text-lg mb-3">Social Media Accounts</h2>
            {(() => {
              const parseSocialMediaUrls = (socialMediaUrls: any) => {
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
              };

              const urls = parseSocialMediaUrls(lead.socialMediaUrls);
              const getUrl = (platform: string) => 
                urls.find((u: any) => u.platform.toLowerCase() === platform.toLowerCase())?.url;

              const linkedinUrl = getUrl("LinkedIn");
              const twitterUrl = getUrl("Twitter");
              const instagramUrl = getUrl("Instagram");
              const facebookUrl = getUrl("Facebook");

              return (
                <div className="flex items-center gap-3">
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                    >
                      <Linkedin />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                    >
                      <Twitterx />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                    >
                      <Instagram />
                    </a>
                  )}
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                    >
                      <Facebook />
                    </a>
                  )}
                </div>
              );
            })()}
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
            <div>
              <span className="text-muted-foreground text-sm">Assigned To</span>
              <div className="flex mt-2 gap-2 items-center">
                {lead.accountManager?.fullName ? (
                  <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-blue-900 font-bold">
                    {lead.accountManager.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex justify-between gap-2">
                <span className="font-medium ">Primary Region: </span>
                {lead.countryType?.name || "-"}
              </p>
              <p className="flex justify-between">
                <span className="font-medium ">Secondary Regions: </span>
                {lead.cityType?.name || "-"}
              </p>
              <p className="flex justify-between">
                <span className="font-medium ">Area: </span>
                {lead.area?.name || "-"}
              </p>
              <p className="flex justify-between">
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
                <FileText />
                <div className="flex flex-col">
                  <p>Downloaded Product Brochure</p>
                  <p className="text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar />
                <div className="flex flex-col">
                  <p>Scheduled Demo Call</p>
                  <p className="text-gray-500">5 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText />
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
