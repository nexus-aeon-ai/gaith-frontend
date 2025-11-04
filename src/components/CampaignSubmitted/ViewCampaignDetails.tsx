"use client";

import { Clock4 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import RejectCampaignSheet from "@/components/sheet/Campaign/RejectCampaignSheet";
import RequestChangesSheet from "@/components/sheet/Campaign/RequestChangesSheet";
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
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/ui/icons";
import FbIcon from "@/components/ui/icons/social/fb";
import IgIcon from "@/components/ui/icons/social/instagram";
import LkIcon from "@/components/ui/icons/social/linkedin";
import TwIcon from "@/components/ui/icons/social/twitterx";
import { Separator } from "@/components/ui/separator";
import { ApiCampaign, getCampaignById } from "@/lib/api/campaign/campaign";
import { cn } from "@/lib/utils";

export type ViewCampaignDetailsProps = {
  className?: string;
  closeViewDetails: () => void;
  campaignId?: string;
};

const ViewCampaignDetails = ({ closeViewDetails, campaignId }: ViewCampaignDetailsProps) => {
  const [showRequestChangesSheet, setShowRequestChangesSheet] = useState(false);
  const [showRejectCampaignSheet, setShowRejectCampaignSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<ApiCampaign | null>(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignId) {
        setError("No campaign ID provided");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getCampaignById(campaignId);
        if (response.data) {
          setCampaign(response.data);
        } else {
          setError("Failed to load campaign details");
        }
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="text-red-500">{error}</div>
        <Button onClick={closeViewDetails} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/submitted"
                className="text-blue-600 font-medium text-md"
                onClick={closeViewDetails}
              >
                Campaigns Submitted
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Campaign Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-8">
        <div>
          <div className="flex md:gap-2 gap-1 md:items-center items-start">
            <h1 className="text-2xl font-semibold text-foreground">
              {campaign?.name || "Campaign Details"}
            </h1>
            <Badge className="md:mt-0 mt-2 rounded-sm bg-yellow-100 pointer-events-none dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500">
              {campaign?.isLaunched ? "Launched" : "Draft"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {campaign?.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : ""}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectCampaignSheet(true)}
              className="w-fit p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#EA3B1F] rounded-[16px] bg-transparent"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
              onClick={() => setShowRequestChangesSheet(true)}
            >
              Request Changes
            </Button>
          </div>
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="w-fit p-6 px-8 text-[16px] bg-[#3072C0] font-[400] rounded-[16px] border-none hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve Campaign
            </Button>
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="w-fit p-6 px-8 text-[16px] bg-[#2BAE82] font-[400] rounded-[16px] border-none hover:bg-[#2BAE82]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>

      <Card className={cn("rounded-xl border bg-card ", "p-4")} role="region" aria-label="Campaign">
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left */}
          <div className="flex flex-col gap-2">
            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Campaign Basics
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Campaign Type</span>
                  <span className="text-foreground">{campaign?.campaignType.name}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Call to Action</span>
                  <span className="text-foreground">{campaign?.callToActionType.name}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Campaign Status</span>
                  <span className="text-foreground">
                    {campaign?.isLaunched ? "Active" : "Draft"}
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Campaign Objectives</span>
                <span className="text-foreground">
                  {campaign?.objectives.map(obj => obj.objectiveType.name).join(", ")}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Primary Headline</span>
                <span className="text-foreground">{campaign?.primaryHeadline}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Description</span>
                <span className="text-foreground">{campaign?.description}</span>
              </div>
            </section>

            <section
              className="rounded-lg h-fit border p-4 md:p-5"
              aria-labelledby="targeting-settings-heading"
            >
              <h3
                id="targeting-settings-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Targeting Settings
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="text-foreground">{campaign?.genderType.name}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-foreground">
                    {campaign?.countries.map(c => c.countryType.name).join(", ")}
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Interests & Behaviors</span>
                <span className="text-foreground">
                  {campaign?.interests.map(i => i.interestType.name).join(", ")}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col justify-between md:flex-row gap-1">
                <span className="text-muted-foreground">Platform Selection</span>
                <div className="flex items-center gap-3">
                  {campaign?.platforms.map(p => {
                    const name = p.platformType.name.toLowerCase();
                    return (
                      <div key={`platform-${p.platformType.name}`}>
                        {name === "facebook" && <FbIcon />}
                        {name === "instagram" && <IgIcon />}
                        {name === "twitter" && <TwIcon />}
                        {name === "linkedin" && <LkIcon />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-2">
            <section
              className="rounded-lg h-fit border p-4 md:p-5"
              aria-labelledby="budget-allocation-heading"
            >
              <h3
                id="budget-allocation-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Budget Allocation
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="text-foreground">${campaign?.totalBudget}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Daily Spend Limit</span>
                  <span className="text-foreground">${campaign?.dailySpendLimit}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Bidding Strategy</span>
                  <span className="text-foreground">{campaign?.biddingStrategyType.name}</span>
                </div>
              </div>
            </section>

            <section className="rounded-lg h-fit border p-4 md:p-5">
              <h3 className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]">
                Schedule
              </h3>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="text-foreground">
                    {campaign?.startAt
                      ? new Date(campaign.startAt).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="text-foreground">
                    {campaign?.endAt ? new Date(campaign.endAt).toLocaleDateString() : "Not set"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Launch Option</span>
                  <span className="text-foreground">{campaign?.launchOption}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Card>

      <Card
        className={cn("rounded-xl mt-3 border bg-card ", "p-4")}
        role="region"
        aria-label="Review"
      >
        <div className="flex flex-col gap-2">
          <section aria-labelledby="review-heading">
            <h3
              id="review-heading"
              className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
            >
              Review & Launch
            </h3>

            <Separator className="my-2" />

            <div className="rounded-lg p-3 border border-[#ECA338] bg-[#ECA33814] flex flex-items-start gap-2">
              <Clock4 color="#D29A09" />
              <div className="flex flex-col gap-2">
                <p className="text-[#D29A09] font-semibold">Campaign Under Review</p>
                <p className="text-sm text-[#D29A09]">
                  This campaign is currently pending review. The team will assess and provide
                  feedback shortly.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Card>

      <RequestChangesSheet
        open={showRequestChangesSheet}
        onOpenChange={setShowRequestChangesSheet}
      />
      <RejectCampaignSheet
        open={showRejectCampaignSheet}
        onOpenChange={setShowRejectCampaignSheet}
      />
    </div>
  );
};

export default ViewCampaignDetails;
