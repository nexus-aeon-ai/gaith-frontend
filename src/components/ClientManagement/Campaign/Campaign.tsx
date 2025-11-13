"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Stepper } from "@/components/Stepper/Stepper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DashboardListIcon } from "@/components/ui/icons/sidebar/dashboard-list";
import { Separator } from "@/components/ui/separator";
// remove z import (not used)
import { createNewCampaign, NewCampaignRequest } from "@/lib/api/campaign/campaign";
import { uploadImage } from "@/lib/api/storage";
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CampaignFormValues, createCampaignSchema } from "@/lib/validations/new-campaign";

import StepPersonal from "./Step1";
import StepAddress from "./Step2";
import StepPreferences from "./Step3";
import StepAccount from "./Step4";
import StepOverview from "./Step5";

export type FormValues = CampaignFormValues;

const DEFAULTS: FormValues = {
  clientId: "",
  campaignName: "",
  campaignType: "email",
  startDate: new Date(),
  endDate: new Date(),
  targetAudience: "existingCustomers",
  ageRange: "18-24",
  gender: "all",
  interests: [],
  objectives: [],
  country: "",
  stateRegion: "",
  totalBudget: 1000,
  dailySpendLimit: "51-100",
  budgetDistribution: [],
  biddingStrategy: "maximize_clicks",
  primaryImage: null,
  secondaryImages: [],
  headline: "",
  description: "",
  callToAction: "learn_more",
  publishStartDate: new Date(),
  publishEndDate: new Date(),
  platforms: [],
  launchOptions: "immediate",
};

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["campaignName", "campaignType", "startDate", "endDate", "objectives"],
  2: ["targetAudience", "ageRange", "gender", "interests", "country", "stateRegion"],
  3: ["totalBudget", "dailySpendLimit", "budgetDistribution", "biddingStrategy"],
  4: [
    "primaryImage",
    "secondaryImages",
    "headline",
    "description",
    "callToAction",
    "publishStartDate",
    "publishEndDate",
    "platforms",
  ],
  5: ["launchOptions"],
};

interface CampaignFormProps {
  setCampaignOpen: (open: boolean) => void;
  client: Client;
}
export function CampaignForm({ setCampaignOpen, client }: CampaignFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const isLast = step === totalSteps;
  const form = useForm<FormValues>({
    resolver: zodResolver(createCampaignSchema as unknown as z.ZodTypeAny),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const currentFields = useMemo(() => STEP_FIELDS[step] ?? [], [step]);

  async function handleNext() {
    // validate only the current step's fields
    const valid = await form.trigger(currentFields as (keyof FormValues)[], { shouldFocus: true });
    if (!valid) return;

    if (isLast && step === 5) {
      // Only submit on final step
      await form.handleSubmit(onSubmit)();
    } else {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  }

  function handlePrev() {
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSave() {
    // const values = form.getValues();
    // TODO: Implement save logic
  }

  function handleCancel() {
    form.reset(DEFAULTS);
    setStep(1);
    setCampaignOpen(false);
  }

  // Note: uploads are handled during final submit (onSubmit) using uploadImage

  async function onSubmit(values: FormValues) {
    // Before creating the campaign, upload any images and attach the returned keys/urls
    const uploadedAssets: Array<{
      assetTypeId: string;
      url: string;
    }> = [];
    try {
      // Upload primary image if present and is a File
      if (values.primaryImage && values.primaryImage instanceof File) {
        console.log("in try catch for image upload");
        try {
          const res = await uploadImage(values.primaryImage);
          console.log("Primary image upload response:", res);
          if (res?.data) {
            uploadedAssets.push({
              assetTypeId: "1bfcaea2-a490-4895-9089-fdb57bece656",
              url: res.data.url,
            });
          }
        } catch (err) {
          console.error("Primary image upload failed:", err);
          alert("Failed to upload primary image. Please try again.");
          return;
        }
      }

      // Upload secondary images (if any)
      const secondaryFiles = Array.isArray(values.secondaryImages) ? values.secondaryImages : [];
      if (secondaryFiles.length > 0) {
        // Upload in parallel
        const uploadPromises = secondaryFiles.map(async file => {
          if (!(file instanceof File)) return null;
          try {
            const res = await uploadImage(file);
            console.log("Secondary image upload response:", res);
            return res?.data
              ? { assetTypeId: "f9efe35c-1bb4-4e65-b348-54ad42e1c53e", url: res.data.url }
              : null;
          } catch (err) {
            console.error("Secondary image upload failed:", err);
            return null;
          }
        });

        const results = await Promise.all(uploadPromises);
        results.forEach(r => {
          if (r) uploadedAssets.push({ url: r.url, assetTypeId: r.assetTypeId });
        });
      }

      // Map form values to API payload
      let launchOptionValue = "SAVE_AS_DRAFT_FOR_REVIEW";
      if (values.launchOptions === "immediate") {
        launchOptionValue = "LAUNCH_IMMEDIATELY_AFTER_APPROVAL";
      } else if (values.launchOptions === "scheduled") {
        launchOptionValue = "SCHEDULE_FOR_LATER_LAUNCH";
      }

      const payload: NewCampaignRequest & {
        assets?: Array<{ key: string; url: string; type: string }>;
      } = {
        clientId: values.clientId,
        name: values.campaignName,
        description: values.description || "",
        primaryHeadline: values.headline || "",
        campaignTypeId: values.campaignType, // expects ID, update if needed
        targetAudienceTypeId: values.targetAudience, // expects ID, update if needed
        ageRangeTypeIds: [values.ageRange], // expects ID, update if needed
        genderTypeId: values.gender, // expects ID, update if needed
        countryTypeIds: values.country ? [values.country] : [],
        regionTypeIds: values.stateRegion ? [values.stateRegion] : [],
        callToActionTypeId: values.callToAction, // expects ID, update if needed
        totalBudget: values.totalBudget,
        dailySpendLimit: Number(values.dailySpendLimit) || 0,
        biddingStrategyTypeId: values.biddingStrategy, // expects ID, update if needed
        manualCpc: 0.25, // hardcoded for now
        startAt: values.startDate ? values.startDate.toISOString() : "",
        endAt: values.endDate ? values.endDate.toISOString() : "",
        scheduledAt: values.publishStartDate ? values.publishStartDate.toISOString() : "",
        launchOption: launchOptionValue,
        isTermsAgreed: false, // hardcoded for now
        objectiveTypeIds: values.objectives || [],
        interestTypeIds: values.interests || [],
        platformTypeIds: values.platforms || [],
        budgetAllocations: (values.budgetDistribution || []).map(b => ({
          channelTypeId: b.channel,
          percentage: b.percent,
          amount: Math.round((values.totalBudget * b.percent) / 100),
        })),
        // attach uploaded assets (if any) so backend can persist references
        assets: uploadedAssets,
      };

      // Call createNewCampaign with assets included
      const response = await createNewCampaign(payload as NewCampaignRequest);
      if (response.status >= 200 && response.status < 300) {
        alert("Campaign created successfully!");
        setCampaignOpen(false);
      } else {
        alert("Failed to create campaign. Please try again.");
        console.error("API error:", response);
      }
    } catch (error) {
      alert("An error occurred while creating the campaign.");
      console.error("API error:", error);
    }
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6 lg:p-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <DashboardListIcon fillColor="#3072C0" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-[#3072C0] font-[500]" href="/client-management">
              Client Management
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#3072C0] font-[500]">{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-[500]">Create Campaign</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6">
        <h1 className="text-balance text-[18px] font-[600] tracking-tight sm:text-2xl">
          Create New Campaign
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track, manage, and prioritize tasks efficiently.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border bg-card p-4 md:p-6"
        >
          <div className="mb-6 rounded-lg bg-card p-4 md:p-6">
            <Stepper
              total={totalSteps}
              current={step}
              labels={["Campaign Basics", "Targeting", "Budget", "Content", "Review & Launch"]}
            />
          </div>

          {/* Step content */}
          <div className="space-y-4">
            {step === 1 && <StepPersonal form={form} />}
            {step === 2 && <StepAddress form={form} />}
            {step === 3 && <StepPreferences form={form} />}
            {step === 4 && <StepAccount form={form} />}
            {step === 5 && <StepOverview form={form} values={form.getValues()} />}
          </div>

          <Separator className="my-6" />

          {/* Footer actions */}
          <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex sm:flex-row flex-col items-center justify-between w-full gap-2">
              <div className="w-full">
                <Button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card rounded-2xl w-full sm:w-auto",
                    "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500",
                    "text-xs sm:text-sm lg:text-base",
                    "border-gray-500 border",
                  )}
                  onClick={handlePrev}
                >
                  <ChevronLeft />
                  <p>Back</p>
                </Button>
              </div>
              <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto ">
                <Button
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card rounded-2xl sm:w-auto",
                    "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-red-50 dark:hover:bg-gray-800 text-red-500",
                    "text-xs sm:text-sm lg:text-base",
                    "border-red-500 border",
                  )}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card rounded-2xl  sm:w-auto",
                    "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-blue-50 dark:hover:bg-gray-800 text-blue-700",
                    "text-xs sm:text-sm lg:text-base",
                    "border-blue-700 border",
                  )}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-[#508CD3] rounded-2xl  sm:w-auto",
                    "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                    "hover:bg-blue-700  text-white",
                    "text-xs sm:text-sm lg:text-base",
                  )}
                  onClick={handleNext}
                  type={"button"}
                >
                  {isLast ? "Submit" : "Next"}
                  {!isLast && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
