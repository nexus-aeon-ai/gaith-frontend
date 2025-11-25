"use client";

import { Globe, Mail, Phone, MapPin, Building2, Users, FileText, Paperclip } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { LeadByIdResponse, SocialMediaUrls } from "@/lib/api/leads";
import { cn } from "@/lib/utils";

interface ViewLeadProps {
  initialData: LeadByIdResponse;
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

export default function ViewLead({ initialData }: ViewLeadProps) {
  const router = useRouter();
  const lead = initialData;
  const socialMediaUrls = parseSocialMediaUrls(lead.socialMediaUrls);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-500";
      case "QUALIFIED":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-500";
      case "LOST":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-500";
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
              <Link href="/leads" className="text-blue-600 font-medium text-md">
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
            <Badge className={cn("md:mt-0 mt-2 rounded-sm pointer-events-none", getStatusColor(lead.status))}>
              {lead.status || "New Lead"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}
            {lead.updatedAt && lead.updatedAt !== lead.createdAt && (
              <> • Updated {new Date(lead.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/leads/${lead.id}/edit`)}
            className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
          >
            Edit Lead
          </Button>
        </div>
      </div>

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
                  <a href={`mailto:${lead.emailAddress}`} className="hover:underline">
                    {lead.emailAddress || "-"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <a href={`tel:${lead.phoneNumber}`} className="hover:underline">
                    {lead.phoneNumber || "-"}
                  </a>
                </div>
                {lead.websiteUrl && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    <a
                      href={lead.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {lead.websiteUrl}
                    </a>
                  </div>
                )}
                {lead.nationality && (
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    <span>Nationality: {lead.nationality}</span>
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
                    console.log(initialData);
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

          {/* Lead Details */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Lead Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Source</span>
                  {lead.leadSource ? (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-500 text-xs font-medium px-3 py-1">
                      {lead.leadSource.name}
                    </Badge>
                  ) : (
                    <span className="text-foreground">-</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground text-sm block mb-2">Account Manager</span>
                  {lead.accountManager ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-blue-900 dark:text-blue-100 font-bold text-xs">
                        {lead.accountManager.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lead.accountManager.fullName}</p>
                        <p className="text-xs text-muted-foreground">{lead.accountManager.email}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-foreground">-</span>
                  )}
                </div>
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
                {lead.countryType && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Country:</span>
                    <span>{lead.countryType.name} ({lead.countryType.code})</span>
                  </div>
                )}
                {lead.cityType && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">City:</span>
                    <span>{lead.cityType.name}</span>
                  </div>
                )}
                {lead.area && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Area:</span>
                    <span>{lead.area.name}</span>
                  </div>
                )}
                {lead.fullAddress && (
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Full Address:</span>
                    <span className="text-right max-w-[60%]">{lead.fullAddress}</span>
                  </div>
                )}
              </div>
              {lead.countryType && (
                <div className="mt-3">
                  <Image
                    src="/images/maps.png"
                    width={500}
                    height={150}
                    alt="Map"
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Profile */}
          <div className="flex flex-col gap-4">
          <Card className="flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Company Profile</h2>
              </div>
              {lead.companyLogoUrl && (
                <div className="mb-3">
                  <Image
                    src={lead.companyLogoUrl}
                    width={200}
                    height={200}
                    alt="Company Logo"
                    className="rounded-lg max-w-[200px] h-auto"
                  />
                </div>
              )}
              <div className="space-y-3 text-sm text-muted-foreground flex-1">
                {lead.visionStatement && (
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Vision Statement</h3>
                    <p className="text-sm">{lead.visionStatement}</p>
                  </div>
                )}
                {lead.missionStatement && (
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Mission Statement</h3>
                    <p className="text-sm">{lead.missionStatement}</p>
                  </div>
                )}
                {!lead.visionStatement && !lead.missionStatement && (
                  <p className="text-sm text-muted-foreground">No company profile information available.</p>
                )}
              </div>
              </CardContent>
            </Card>
             {/* Assigned Users */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Assigned Team Members</h2>
              </div>
              {lead.assignedUsers && lead.assignedUsers.length > 0 ? (
                <div className="space-y-3">
                  {lead.assignedUsers.map((assignedUser, index) => {
                    const color = COLORS[index % COLORS.length];
                    const initials = assignedUser.user.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <div key={assignedUser.userId} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-gray-800",
                            color,
                          )}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{assignedUser.user.fullName}</p>
                          <p className="text-xs text-muted-foreground">{assignedUser.user.email}</p>
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
          </div>
        </div>

        {/* Third Section - Team & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Service Offerings</h2>
              {lead.serviceOfferings && lead.serviceOfferings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {lead.serviceOfferings.map((service) => (
                    <Badge
                      key={service.serviceOfferingId}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {service.serviceOffering.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No service offerings selected</p>
              )}
            </CardContent>
          </Card>

        {/* Additional Notes */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-lg mb-3">Additional Notes</h2>
            <div className="flex items-start w-full p-4 border rounded-lg bg-[#E4E9F1] dark:bg-[#0F1B29]">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {lead.additionalNotes || "No additional notes provided."}
              </p>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Team Roles */}
        {lead.teamRoles && lead.teamRoles.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-lg mb-3">Team Roles</h2>
              <div className="flex flex-wrap gap-2">
                {lead.teamRoles.map((role) => (
                  <Badge
                    key={role.teamRoleId}
                    variant="outline"
                    className="text-xs"
                  >
                    {role.teamRole?.name || role.teamRoleId}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communications */}
        {lead.communications && lead.communications.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Communications</h2>
              </div>
              <div className="space-y-3">
                {lead.communications.map((communication) => (
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
        {lead.attachments && lead.attachments.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-lg">Attachments</h2>
              </div>
              <div className="space-y-2">
                {lead.attachments.map((attachment) => (
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

      </div>
    </div>
  );
}

