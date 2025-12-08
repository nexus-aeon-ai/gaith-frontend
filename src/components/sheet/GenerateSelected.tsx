"use client";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import PDFIcon from "@/components/ui/icons/options/pdf-icon";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  generateBlog,
  generateCalendar,
  generateMarketingPlan,
  generateMediaBuying,
} from "@/lib/api/reports";
import { formatDateToDDMMYYYY } from "@/lib/utils";

import { Separator } from "../ui/separator";

interface BlogData {
  platform: string;
  topic: string;
  company_website: string;
  clientId?: string;
}

interface CalendarData {
  start_date: Date;
  end_date: Date;
  post_per_week: number;
  clientId?: string;
}

interface MediaBuyingData {
  platform: string;
  clientId?: string;
}
interface GeneratedResults {
  blog?: unknown;
  calendar?: unknown;
  marketingPlan?: unknown;
  mediaBuying?: unknown;
}

interface GeneratedAssetsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssets: string[];
  onOpenBlogModal: () => void;
  onOpenCalendarModal: () => void;
  onOpenMediaBuyingModal: () => void;
  getStoredWebsiteUrl: () => string;
  blogData: BlogData | null;
  calendarData: CalendarData | null;
  mediaBuyingData: MediaBuyingData | null;
}

export default function GeneratedAssetsSheet({
  open,
  onOpenChange,
  selectedAssets,
  onOpenBlogModal,
  onOpenCalendarModal,
  onOpenMediaBuyingModal,
  getStoredWebsiteUrl,
  blogData,
  calendarData,
  mediaBuyingData,
}: GeneratedAssetsSheetProps) {
  const router = useRouter();
  
  const [generatedResults, setGeneratedResults] = useState<GeneratedResults>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Check if asset has required data
  const isAssetComplete = (assetTitle: string): boolean => {
    switch (assetTitle) {
      case "Blogs & Articles":
        return !!blogData;
      case "Social Media Calendar":
        return !!calendarData;
      case "Media Buying Plan":
        return !!mediaBuyingData;
      case "Marketing Strategy":
        const websiteUrl = getStoredWebsiteUrl();
        return !!websiteUrl;
      default:
        return false;
    }
  };

  // Check if all selected assets are complete
  const allAssetsComplete = selectedAssets.every(asset => isAssetComplete(asset));

  // Extract message from nested response structure
  const extractMessage = (data: any): string => {
    if (!data) return "";
    
    // Try to get message from details.message.message
    if (data.details?.message?.message) {
      return data.details.message.message;
    }
    
    // Fallback to other possible structures
    if (data.message) {
      return typeof data.message === "string" ? data.message : JSON.stringify(data.message);
    }
    
    return JSON.stringify(data);
  };

  const handleCompleteInfo = (assetTitle: string) => {
    switch (assetTitle) {
      case "Blogs & Articles":
        onOpenBlogModal();
        break;
      case "Social Media Calendar":
        onOpenCalendarModal();
        break;
      case "Media Buying Plan":
        onOpenMediaBuyingModal();
        break;
      case "Marketing Strategy":
        toast.error("Company website is required. Please provide it in the client form.");
        break;
    }
  };

  const handleContinue = () => {
    // Navigate based on the first generated asset (priority order)
    if (generatedResults.blog) {
      router.push("/blog-articles");
      onOpenChange(false);
    } else if (generatedResults.calendar) {
      router.push("/social-media-calendar");
      onOpenChange(false);
    } else if (generatedResults.mediaBuying) {
      router.push("/reports"); // Navigate to reports page
      onOpenChange(false);
    } else if (generatedResults.marketingPlan) {
      router.push("/reports"); // Navigate to reports page
      onOpenChange(false);
    }
  };

  const handleGenerate = async () => {
    if (!allAssetsComplete) {
      toast.warning("Please complete all required information before generating");
      return;
    }

    setIsGenerating(true);
    const results: GeneratedResults = {};

    try {
      // Generate for each selected asset
      for (const assetTitle of selectedAssets) {
        switch (assetTitle) {
          case "Blogs & Articles":
            if (blogData) {
              const response = await generateBlog(blogData);
              if (response.status >= 200 && response.status < 300) {
                results.blog = response.data;
              }
            }
            break;

          case "Social Media Calendar":
            if (calendarData) {
              const formattedData = {
                start_date: formatDateToDDMMYYYY(calendarData.start_date),
                end_date: formatDateToDDMMYYYY(calendarData.end_date),
                post_per_week: calendarData.post_per_week,
                clientId: calendarData.clientId,
              };
              const response = await generateCalendar(formattedData);
              if (response.status >= 200 && response.status < 300) {
                results.calendar = response.data;
              }
            }
            break;

          case "Media Buying Plan":
            if (mediaBuyingData) {
              const response = await generateMediaBuying(mediaBuyingData);
              if (response.status >= 200 && response.status < 300) {
                results.mediaBuying = response.data;
              }
            }
            break;

          case "Marketing Strategy":
            const websiteUrl = getStoredWebsiteUrl();
            if (websiteUrl) {
              const response = await generateMarketingPlan({ 
                company_website: websiteUrl,
                clientId: blogData?.clientId || calendarData?.clientId || mediaBuyingData?.clientId,
              });
              if (response.status >= 200 && response.status < 300) {
                results.marketingPlan = response.data;
              }
            }
            break;
        }
      }

      setGeneratedResults(results);
      setHasGenerated(true);
      toast.success("All assets generated successfully!");
    } catch (error) {
      console.error("Error generating assets:", error);
      toast.error("An error occurred while generating assets");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card font-inter w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Generated Marketing Assets</SheetTitle>
        </SheetHeader>
        
        <div className="w-full px-2 py-4">
          {/* Pricing & Scope Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">Pricing & Scope of Work</h3>
            <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
              <p className="text-sm text-muted-foreground">
                View your pricing proposal in the dedicated pricing section.
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Selected Assets Status */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">Selected Assets</h3>
            <div className="space-y-3">
              {selectedAssets.map(assetTitle => {
                const isComplete = isAssetComplete(assetTitle);
                
                return (
                  <div
                    key={assetTitle}
                    className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F5F7] dark:bg-[#0F1B29]"
                  >
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{assetTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {isComplete ? "Ready to generate" : "Incomplete information"}
                        </p>
                      </div>
                    </div>
                    {!isComplete && (
                      <Button
                        variant="link"
                        onClick={() => handleCompleteInfo(assetTitle)}
                        className="text-[#3072C0] hover:text-[#184a86] p-0 h-auto font-medium text-sm"
                      >
                        Complete Info →
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Results */}
          {hasGenerated && (
            <>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Generated Results</h3>
                
                {!!generatedResults.blog && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    <h4 className="font-semibold mb-2">Blog Post</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {extractMessage(generatedResults.blog)}
                    </p>
                  </div>
                )}

                {!!generatedResults.calendar && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    <h4 className="font-semibold mb-2">Social Media Calendar</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {extractMessage(generatedResults.calendar)}
                    </p>
                  </div>
                )}

                {!!generatedResults.mediaBuying && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    <h4 className="font-semibold mb-2">Media Buying Plan</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {extractMessage(generatedResults.mediaBuying)}
                    </p>
                  </div>
                )}

                {!!generatedResults.marketingPlan && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    <h4 className="font-semibold mb-2">Marketing Strategy</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {extractMessage(generatedResults.marketingPlan)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <SheetFooter className="p-0 sticky bottom-0 bg-card">
          <div className="self-end flex gap-3 p-4 border-t w-full">
            <div className="flex w-full gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="p-6 px-8 hover:bg-gray-200 dark:hover:bg-gray-800 text-[16px] font-[400] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] rounded-[16px] bg-transparent"
              >
                <PDFIcon fill="#3072C0" />
                Export PDF
              </Button>
              <Button
                onClick={hasGenerated ? handleContinue : handleGenerate}
                disabled={!hasGenerated && (!allAssetsComplete || isGenerating)}
                className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : hasGenerated ? "Continue" : "Generate"}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
