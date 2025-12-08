"use client";

import { Check, Clock4, Target } from "lucide-react";
import Image from "next/image";
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
import { useCampaignLookups } from "@/lib/api/campaign/campaign-lookups";
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

  const { ageRangeTypes } = useCampaignLookups();

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
          console.log("Campaign details:", response.data);
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

  const getAgeRange = (campaign: ApiCampaign) => {
    // Add safety checks
    if (!campaign?.ageRanges || !Array.isArray(campaign.ageRanges)) {
      return "N/A";
    }

    const campaignAgeRangeTypeIds = campaign.ageRanges.map(ar => ar.ageRangeTypeId);

    // Make sure ageRangeTypes is defined
    if (!ageRangeTypes || !Array.isArray(ageRangeTypes)) {
      return "N/A";
    }

    const matchingAgeRanges = ageRangeTypes.filter(art => campaignAgeRangeTypeIds.includes(art.id));

    const ageGroups = matchingAgeRanges.map(ar => ar.displayName);

    // No need for .toString() after .join()
    return ageGroups.join(", ") || "N/A";
  };

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
    <div className="w-full mx-auto p-6 font-inter">
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
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-5 items-start justify-between mb-8">
        <div>
          <div className="flex md:gap-2 gap-1 md:items-center items-start">
            <h1 className="text-lg capitalize whitespace-nowrap text-nowrap  font-semibold text-foreground">
              {"adsfadf Campaign Details"}
            </h1>
            <Badge className="md:mt-0 mt-2 rounded-sm bg-yellow-100 pointer-events-none dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500">
              {campaign?.isLaunched ? "Launched" : "Pending"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            Submitted{" "}
            {campaign?.createdAt
              ? new Date(campaign.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectCampaignSheet(true)}
              className="w-fit py-6 px-3 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#EA3B1F] rounded-[16px] bg-transparent"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              className="w-fit py-6 px-3 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
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
              className="w-fit py-6 px-3 text-[16px] bg-[#3072C0] font-[400] rounded-[16px] border-none hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve Campaign
            </Button>
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="w-fit py-6 px-3 text-[16px] bg-[#2BAE82] font-[400] rounded-[16px] border-none hover:bg-[#2BAE82]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="text-muted-foreground font-medium">Campaign Name</span>
                  <span className="text-foreground dark:text-muted-foreground font-medium text-nowrap">
                    {campaign?.name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground font-medium">Campaign Type</span>
                  <span className="text-foreground dark:text-muted-foreground font-medium">
                    {campaign?.campaignType?.name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground font-medium">Call-To-Action</span>
                  <span className="text-foreground dark:text-muted-foreground font-medium">
                    {campaign?.callToActionType?.name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground font-medium">Campaign Duration</span>
                  <span className="text-foreground dark:text-muted-foreground font-medium">
                    {campaign?.startAt
                      ? new Date(campaign.startAt).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}{" "}
                    -{" "}
                    {campaign?.endAt
                      ? new Date(campaign.endAt).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-start flex-col gap-1 text-sm">
                <span className="text-muted-foreground font-medium">Campaign Objectives</span>
                <span className="text-muted-foreground">
                  {campaign?.objectives.map(obj => obj.objectiveType?.name).join(", ")}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Primary Headline</span>
                <span className="text-muted-foreground">{campaign?.primaryHeadline}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Description</span>
                <span className="text-muted-foreground">{campaign?.description}</span>
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
                  <span className="text-muted-foreground">Target Audience</span>
                  <span className="text-foreground">
                    {campaign?.targetAudiences.map(a => a?.name).join(", ") || "Nil"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Age Range</span>
                  <span className="text-foreground">{getAgeRange(campaign as ApiCampaign)}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="text-foreground">{campaign?.genderType?.name}</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Geographic Targeting</span>
                  <span className="text-foreground">
                    {campaign?.countries.map(c => c.countryType.name).join(", ")}
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col text-sm gap-1">
                <span className="text-muted-foreground">Interests & Behaviors</span>
                <span className="text-[#303444] dark:text-muted-foreground">
                  {campaign?.interests.map(i => i.interestType?.name).join(", ")}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex md:items-center items-start flex-col justify-between md:flex-row gap-1">
                <span className="text-muted-foreground text-sm">Platform Selection</span>
                <div className="flex items-center gap-3">
                  {campaign?.platforms.map(p => {
                    const name = p.platformType?.name.toLowerCase();
                    return (
                      <div key={`platform-${p.platformType?.name}`}>
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
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Content Planning
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex flex-col gap-2 text-sm" role="listitem">
                  <span className="text-muted-foreground">Primary Image/Video</span>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {campaign?.assets.map(
                        (asset, index) =>
                          asset?.assetType?.name === "PrimaryMedia" && (
                            <div key={index} className="w-[80] h-[80] aspect-square rounded-md overflow-hidden">
                              <Image
                                src={asset?.url}
                                width={80}
                                height={80}
                                alt="placeholder"
                                className="w-full h-full "
                              />
                            </div>
                          ),
                      )}
                      {/* {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="w-[80] h-[80] rounded-md overflow-hidden">
                          <Image
                            src={"/images/placeholder-img.webp"}
                            width={80}
                            height={80}
                            alt="placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm" role="listitem">
                  <span className="text-muted-foreground">Secondary Images</span>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {campaign?.assets.map(
                        (asset, index) =>
                          asset?.assetType?.name === "SecondaryImage" && (
                            <div key={index} className="w-[80] h-[80] aspect-square rounded-md overflow-hidden">
                              <Image
                                src={asset?.url}
                                width={80}
                                height={80}
                                alt="placeholder"
                                className="w-full h-full"
                              />
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start flex-col gap-1">
                  <span className="text-muted-foreground dark:text-[#CCCFDB]">
                    Publishing Schedule
                  </span>
                  <span className="text-foreground dark:text-[#CCCFDB]">
                    Start:{" "}
                    {campaign?.startAt
                      ? new Date(campaign.startAt).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </span>
                  <span className="text-foreground dark:text-[#CCCFDB]">
                    End:{" "}
                    {campaign?.endAt
                      ? new Date(campaign.endAt).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-start flex-col gap-1">
                  <span className="text-muted-foreground dark:text-[#CCCFDB]">
                    Content Variations
                  </span>
                  <span className="text-foreground dark:text-[#CCCFDB]">Nil</span>
                </div>
              </div>
            </section>
            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Budget Allocation
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-medium text-foreground dark:text-[#CCCFDB] text-right break-all">
                    {campaign?.currency ? campaign?.currency : "$"} {campaign?.totalBudget}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Daily Spend Limit</span>
                  <span className="font-medium text-foreground dark:text-[#CCCFDB] text-right">
                    {campaign?.currency ? campaign?.currency : "$"} {campaign?.dailySpendLimit} per
                    day
                  </span>
                </div>
                <h3>Budget Distribution</h3>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Google Ads</span>
                  <span className="font-medium text-foreground dark:text-[#CCCFDB] text-right block">
                    {(campaign?.budget as any)?.googleAds || "nil"}
                  </span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Facebook & Instagram</span>
                  <span className="font-medium text-foreground dark:text-[#CCCFDB] text-right block">
                    {(campaign?.budget as any)?.facebook || "nil"}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col items-start gap-1 text-sm" role="listitem">
                  <span className="text-muted-foreground">Bidding Strategy</span>
                  <span className=" text-foreground dark:text-[#CCCFDB] text-right block">
                    {campaign?.biddingStrategyType?.name || "nil"}
                  </span>
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
                <p className=" font-semibold">Campaign Under Review</p>
                <p className="text-sm dark:text-[#CCCFDB]">
                  This campaign is currently pending review. The team will assess and provide
                  feedback shortly.
                </p>
              </div>
            </div>
          </section>
          {/* timeline */}
          <div className="flex flex-col my-2">
            <h2 className="font-medium">Campaign Timeline</h2>
            <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
              <li className="mb-5 ms-6">
                <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <Target color="#3FD09F" size={16} />
                </span>
                <h3 className="flex items-center mb-1 text-md font-semibold text-[#303444] dark:text-[#CCCFDB]">
                  Campaign Created
                </h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  December 18, 2025 at 2:30 PM
                </p>
              </li>
              <li className="mb-5 ms-6">
                <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <Target color="#ECA338" size={16} />
                </span>
                <h3 className="mb-1 text-md font-semibold text-[#303444] dark:text-[#CCCFDB]">
                  Submitted for Review
                </h3>

                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  December 18, 2025 at 3:15 PM
                </p>
              </li>
              <li className="mb-5 ms-6">
                <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <Target color="#A0AEBA" size={16} />
                </span>
                <h3 className="mb-1 text-md font-semibold text-[#303444] dark:text-[#CCCFDB]">
                  Pending Approval
                </h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Expected by December 19, 2025
                </p>
              </li>
              <li className="ms-6">
                <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <Target color="#A0AEBA" size={16} />
                </span>
                <h3 className="mb-1 text-md font-semibold text-[#303444] dark:text-[#CCCFDB]">
                  Campaign Launch
                </h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Scheduled for December 20, 2025
                </p>
              </li>
            </ol>
          </div>

          <div className="flex flex-col my-2">
            <h2 className="font-medium mb-2">Launch Readiness Checklist</h2>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center gap-2">
                <Check className="bg-[#2BAE82] rounded-full p-[4px] text-white" />
                <p>Campaign objectives defined</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="bg-[#2BAE82] rounded-full p-[4px] text-white" />
                <p>Target audience configured</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="bg-[#2BAE82] rounded-full p-[4px] text-white" />
                <p>Budget allocation approvedd</p>
              </li>{" "}
              <li className="flex items-center gap-2">
                <Check className="bg-[#2BAE82] rounded-full p-[4px] text-white" />
                <p>Creative assets uploaded</p>
              </li>{" "}
              <li className="flex items-center gap-2">
                <Clock4 color="#D29A09" />
                <p>Schedule for later launch</p>
              </li>
            </ul>
          </div>
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
