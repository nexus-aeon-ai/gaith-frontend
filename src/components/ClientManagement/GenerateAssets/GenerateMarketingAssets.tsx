"use client";

import { Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

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
import MagicStarIcon from "@/components/ui/icons/magic-star";

import MediaBuyingPlanSheet from "../../sheet/BuyingPlanPreview";
import GeneratedAssetsSheet from "../../sheet/GenerateSelected";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Textarea } from "../../ui/textarea";
import { mockGeneratedAssets } from "../data/mockGeneratedAssets";

import AssetCard from "./AssetCard";
import BlogGenerationModal from "./BlogGenerationModal";
import CalendarGenerationModal from "./CalendarGenerationModal";
import GeneratePricing from "./GeneratePricing";
import MediaBuyingModal from "./MediaBuyingModal";

interface GeneratedResults {
  blog?: unknown;
  calendar?: unknown;
  marketingPlan?: unknown;
  mediaBuying?: unknown;
}

const GenerateMarketingAssets = ({ closePage }: { closePage: () => void }) => {
  const [showMediaBuyingSheet, setShowMediaBuyingSheet] = useState(false);
  const [showGeneratedAssetsSheet, setShowGeneratedAssetsSheet] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<GeneratedResults>({});
  
  // Modal states
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showMediaBuyingModal, setShowMediaBuyingModal] = useState(false);
  
  // Store collected data from modals
  const [blogData, setBlogData] = useState<{ platform: string; topic: string; company_website: string } | null>(null);
  const [calendarData, setCalendarData] = useState<{ start_date: Date; end_date: Date; post_per_week: number } | null>(null);
  const [mediaBuyingData, setMediaBuyingData] = useState<{ platform: string } | null>(null);
  
  // Try to get website URL from localStorage (saved from previous step)
  const getStoredWebsiteUrl = () => {
    try {
      const storedData = localStorage.getItem("clientFormData");
      if (storedData) {
        const data = JSON.parse(storedData);
        return data.websiteUrl || "";
      }
    } catch (error) {
      console.error("Error reading stored form data:", error);
    }
    return "";
  };

  const handleGenerateSelected = () => {
    const selected = Object.entries(selectedAssets).filter(([_, isSelected]) => isSelected);
    
    if (selected.length === 0) {
      toast.warning("Please select at least one asset to generate");
      return;
    }

    // Immediately open the sidebar with selected assets
    setShowGeneratedAssetsSheet(true);
  };

  const handleBlogSubmit = (data: { platform: string; topic: string; company_website: string }) => {
    setBlogData(data);
    setShowBlogModal(false);
    toast.success("Blog information saved");
  };

  const handleCalendarSubmit = (data: { start_date: Date; end_date: Date; post_per_week: number }) => {
    setCalendarData(data);
    setShowCalendarModal(false);
    toast.success("Calendar information saved");
  };

  const handleMediaBuyingSubmit = (data: { platform: string }) => {
    setMediaBuyingData(data);
    setShowMediaBuyingModal(false);
    toast.success("Media buying information saved");
  };

  if (showPricingForm) {
    return (
      <GeneratePricing
        closeEditCampaignPricingForm={() => setShowPricingForm(false)}
      />
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
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/client-management"
                className="text-blue-600 font-medium text-md"
                onClick={closePage}
              >
                Client Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Generate Marketing Assets</h1>
          <p className="text-muted-foreground">
            Generate marketing assets with all necessary information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPricingForm(true)}
            className="p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
          >
            <Tag />
            Generate Pricing
          </Button>
          <Button
            onClick={handleGenerateSelected}
            disabled={isGenerating}
            variant={"outline"}
            className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MagicStarIcon />
            {isGenerating ? "Generating..." : "Generate Selected"}
          </Button>
        </div>
      </div>

      {/* main component  */}
      <Card className="shadow-sm rounded-[16px]">
        <CardHeader className="gap-1">
          <div className="flex items-center justify-between mt-4">
            <CardTitle className="text-md">AI Prompt</CardTitle>
            <div className="gap-1 flex items-center">
              <Button
                variant="ghost"
                // onClick={() => setShowCancelModal(true)}
                className="!p-6 px-6 font-normal text-md rounded-[16px]"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                // onClick={() => setShowCancelModal(true)}
                className="!p-6 px-6 bg-[#3072C0] hover:bg-[#3072c0] text-white hover:text-white font-normal text-md rounded-[16px]"
              >
                Generate
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Enter your prompt for custom generation.."
            className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[16px]"
            rows={3}
          />
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 mt-5">
          {mockGeneratedAssets.map(asset => (
            <AssetCard
              key={asset.title}
              title={asset.title}
              description={asset.description}
              footerText={asset.footerText}
              setShowMediaBuyingSheet={setShowMediaBuyingSheet}
              checked={selectedAssets[asset.title] || false}
              onCheckedChange={(checked) => {
                setSelectedAssets(prev => ({
                  ...prev,
                  [asset.title]: checked
                }));
              }}
            />
          ))}
        </CardContent>
      </Card>
      <MediaBuyingPlanSheet onOpenChange={setShowMediaBuyingSheet} open={showMediaBuyingSheet} />
      <GeneratedAssetsSheet
        onOpenChange={setShowGeneratedAssetsSheet}
        open={showGeneratedAssetsSheet}
        selectedAssets={Object.keys(selectedAssets).filter(key => selectedAssets[key])}
        onOpenBlogModal={() => setShowBlogModal(true)}
        onOpenCalendarModal={() => setShowCalendarModal(true)}
        onOpenMediaBuyingModal={() => setShowMediaBuyingModal(true)}
        getStoredWebsiteUrl={getStoredWebsiteUrl}
        blogData={blogData}
        calendarData={calendarData}
        mediaBuyingData={mediaBuyingData}
      />
      
      {/* Generation Modals */}
      <BlogGenerationModal
        open={showBlogModal}
        onOpenChange={setShowBlogModal}
        onSubmit={handleBlogSubmit}
        defaultWebsite={getStoredWebsiteUrl()}
      />
      <CalendarGenerationModal
        open={showCalendarModal}
        onOpenChange={setShowCalendarModal}
        onSubmit={handleCalendarSubmit}
      />
      <MediaBuyingModal
        open={showMediaBuyingModal}
        onOpenChange={setShowMediaBuyingModal}
        onSubmit={handleMediaBuyingSubmit}
      />
    </div>
  );
};

export default GenerateMarketingAssets;
