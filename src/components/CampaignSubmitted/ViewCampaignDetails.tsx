"use client";
import { Check, Clock4, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import RejectCampaignSheet from "@/components/sheet/Campaign/RejectCampaignSheet";
import RequestChangesSheet from "@/components/sheet/Campaign/RequestChangesSheet";
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
import FbIcon from "@/components/ui/icons/social/fb";
import IgIcon from "@/components/ui/icons/social/instagram";
import LkIcon from "@/components/ui/icons/social/linkedin";
import TwIcon from "@/components/ui/icons/social/twitterx";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

export type QuotationCardProps = {
  className?: string;
  closeViewDetails: () => void;
};

const ViewQuoteDetails = ({ closeViewDetails }: QuotationCardProps) => {
  const [showRequestChangesSheet, setShowRequestChangesSheet] = useState(false);
  const [showRejectCampaignSheet, setShowRejectCampaignSheet] = useState(false);

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
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
            <h1 className="text-2xl font-semibold text-foreground">Holiday Season Sale 2025</h1>
            <Badge className="md:mt-0 mt-2 rounded-sm bg-yellow-100 pointer-events-none dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500">
              Pending
            </Badge>
          </div>
          <p className="text-muted-foreground">Submitted Dec 18, 2024</p>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              onClick={()=>setShowRejectCampaignSheet(true)}
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

      <Card
        className={cn("rounded-xl border bg-card ", "p-4")}
        role="region"
        aria-label="Quotation"
      >
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
                  <span className="text-muted-foreground">Campaign Name</span>
                  <span className="font-medium text-foreground text-right break-all">EMP001</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Campaign Type</span>
                  <span className="font-medium text-foreground text-right">Display Campaign</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Call-to-Action</span>
                  <span className="font-medium text-foreground text-right block">Shop Now</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Campaign Duration</span>
                  <span className="font-medium text-foreground text-right block">
                    December 20, 2024 - January 15, 2025
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Campaign Objectives</span>
                <span className="text-foreground ">
                  Increase brand awareness and drive holiday sales with targeted display advertising
                  across multiple platforms
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Primary Headline</span>
                <span className="text-foreground ">
                  Discover Amazing Holiday Deals - Up to 70% Off
                </span>
              </div>
              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Description</span>
                <span className="text-foreground ">
                  Comprehensive holiday marketing campaign targeting gift shoppers with compelling
                  offers and seasonal messaging to maximize conversions during peak shopping period
                </span>
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
                Targeting Settings
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Target Audience</span>
                  <span className="font-medium text-foreground text-right break-all">
                    Holiday Shoppers & Gift Buyers
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Age Range</span>
                  <span className="font-medium text-foreground text-right">25-45 years old</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium text-foreground text-right block">All Genders</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Geographic Targeting</span>
                  <span className="font-medium text-foreground text-right block">
                    United States, Canada
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col gap-1">
                <span className="text-muted-foreground">Interests & Behaviors</span>
                <span className="text-foreground ">
                  Online shopping, Holiday shopping, Gift giving, Fashion, Electronics, Home &
                  Garden
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-start flex-col justify-between md:flex-row gap-1">
                <span className="text-muted-foreground">Platform Selection</span>
                <div className="flex items-center gap-3">
                  <LkIcon />
                  <TwIcon />
                  <IgIcon />
                  <FbIcon />
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
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="w-[80] h-[80] rounded-md overflow-hidden">
                          <Image
                            src={"/images/placeholder-img.webp"}
                            width={80}
                            height={80}
                            alt="placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm" role="listitem">
                  <span className="text-muted-foreground">Secondary Images</span>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-[80] h-[80] rounded-md overflow-hidden">
                          <Image
                            src={"/images/placeholder-img.webp"}
                            width={80}
                            height={80}
                            alt="placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start flex-col gap-1">
                  <span className="text-muted-foreground">Publishing Schedule</span>
                  <span className="text-foreground ">Start: December 20, 2024 at 9:00 AM</span>
                  <span className="text-foreground ">End: January 15, 2025 at 11:59 PM</span>
                </div>
                <div className="flex items-start flex-col gap-1">
                  <span className="text-muted-foreground">Content Variations</span>
                  <span className="text-foreground ">5 ad variations with A/B testing enabled</span>
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
                  <span className="font-medium text-foreground text-right break-all">$25,000</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Daily Spend Limit</span>
                  <span className="font-medium text-foreground text-right">$500 per day</span>
                </div>
                <h3>Budget Distribution</h3>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Google Ads</span>
                  <span className="font-medium text-foreground text-right block">
                    60% ($15,000)
                  </span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Facebook & Instagram</span>
                  <span className="font-medium text-foreground text-right block">
                    40% ($10,000)
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1 text-sm" role="listitem">
                  <span className="text-muted-foreground">Bidding Strategy</span>
                  <span className=" text-foreground text-right block">
                    Cost Per Click (CPC) with automated bidding optimization
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
        aria-label="Quotation"
      >
        <div className="flex flex-col gap-2">
          <section aria-labelledby="selected-services-heading">
            <h3
              id="selected-services-heading"
              className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
            >
              Review & Launch
            </h3>

            <Separator className="my-2" />

            <div className="rounded-lg p-3 border border-[#ECA338] bg-[#ECA33814] flex flex-items-start gap-2 ">
              <Clock4 color="#D29A09" />
              <div className="flex flex-col gap-2">
                <h2 className="font-medium">Campaign Status: Coming Soon</h2>
                <p>Submitted on December 18, 2025 • Awaiting approval from marketing team</p>
              </div>
            </div>
            {/* timeline */}
            <div className="flex flex-col my-2">
              <h2 className="font-medium">Campaign Timeline</h2>
              <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
                <li className="mb-5 ms-6">
                  <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <Target color="#3FD09F" size={16} />
                  </span>
                  <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
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
                  <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
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
                  <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
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
                  <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                    Campaign Launch
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Scheduled for December 20, 2025
                  </p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col my-2">
              <h2 className="font-medium">Launch Readiness Checklist</h2>
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

export default ViewQuoteDetails;
