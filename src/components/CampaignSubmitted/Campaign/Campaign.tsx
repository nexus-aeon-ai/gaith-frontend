"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ConfirmDialog } from "@/components/Popups/PopupModal";
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
import {
  createNewCampaign,
  getCampaignById,
  NewCampaignRequest,
  updateCampaign,
} from "@/lib/api/campaign/campaign";
import { FormSchema } from "@/lib/schemas/new-campaign";
import { cn } from "@/lib/utils";

import StepPersonal from "./Step1";
import StepAddress from "./Step2";
import StepPreferences from "./Step3";
import StepAccount from "./Step4";
import StepOverview from "./Step5";

export type FormValues = z.infer<typeof FormSchema>;

const DEFAULTS: FormValues = {
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
  mode: "create" | "edit";
  campaignId?: string;
}
export function CampaignSubmittedForm({
  setCampaignOpen,
  mode = "create",
  campaignId,
}: CampaignFormProps) {
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const totalSteps = 5;
  const isLast = step === totalSteps;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULTS,
    mode: "onSubmit",
  });

  const currentFields = useMemo(() => STEP_FIELDS[step] ?? [], [step]);

  async function handleNext() {
    // validate only the current step's fields
    const valid = await form.trigger(currentFields as (keyof FormValues)[], { shouldFocus: true });
    if (!valid) return;

    if (isLast) {
      // submit on last step
      await form.handleSubmit(onSubmit)();
    } else {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  }

  function handlePrev() {
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSave() {
    const values = form.getValues();
    // TODO: Implement save logic
    console.warn("Draft saved:", values);
  }

  function handleCancel() {
    form.reset(DEFAULTS);
    setStep(1);
    setCampaignOpen(false);
  }

  async function onSubmit(values: FormValues) {
    try {
      // Build payload that matches the update API contract
      const payload: NewCampaignRequest = {
        name: values.campaignName,
        description: values.description || "",
        primaryHeadline: values.headline || "",
        campaignTypeId: values.campaignType,
        targetAudienceTypeId: values.targetAudience,
        ageRangeTypeIds: [values.ageRange],
        genderTypeId: values.gender,
        countryTypeIds: values.country ? [values.country] : [],
        regionTypeIds: values.stateRegion ? [values.stateRegion] : [],
        callToActionTypeId: values.callToAction,
        totalBudget: values.totalBudget,
        dailySpendLimit: Number(values.dailySpendLimit) || 0,
        biddingStrategyTypeId: values.biddingStrategy,
        manualCpc: 0.25,
        startAt: values.startDate ? values.startDate.toISOString() : "",
        endAt: values.endDate ? values.endDate.toISOString() : "",
        scheduledAt: values.publishStartDate ? values.publishStartDate.toISOString() : "",
        launchOption:
          values.launchOptions === "immediate" ? "LAUNCH_IMMEDIATELY_AFTER_APPROVAL" : values.launchOptions === "scheduled" ? "SCHEDULE_FOR_LATER_LAUNCH" : "SAVE_AS_DRAFT_FOR_REVIEW",
        isTermsAgreed: false,
        objectiveTypeIds: values.objectives || [],
        interestTypeIds: values.interests || [],
        platformTypeIds: values.platforms || [],
        budgetAllocations: (values.budgetDistribution || []).map(b => ({
          channelTypeId: (b as any).channel,
          percentage: (b as any).percent ?? (b as any).percentage ?? 0,
          amount: Math.round(
            ((values.totalBudget || 0) * ((b as any).percent ?? (b as any).percentage ?? 0)) / 100,
          ),
        })),
      };

      if (mode === "create") {
        // create new campaign
        const resp = await createNewCampaign(payload);
        console.log("Create campaign response:", resp);
        if (resp?.status && resp.status >= 200 && resp.status < 300) {
          setCampaignOpen(false);
        }
      } else {
        // edit/update campaign
        if (!campaignId) {
          console.error("No campaignId provided for edit");
          return;
        }
        console.log("Update campaign payload:", payload);
        const resp = await updateCampaign(campaignId, payload);
        console.log("Update campaign response:", resp);
        await queryClient.invalidateQueries({ queryKey: ["campaign"] });
        if (resp?.status && resp.status >= 200 && resp.status < 300) {
          setCampaignOpen(false);
        }
      }
    } catch (err) {
      console.error("Error submitting campaign:", err);
    }
  }

  // Prefill form when editing
  useEffect(() => {
    const loadCampaign = async () => {
      if (mode !== "edit" || !campaignId) return;
      try {
        const resp = await getCampaignById(campaignId);
        if (resp?.data) {
          const data = resp.data;
          // Map API fields to form fields as best-effort
          form.reset({
            ...DEFAULTS,
            campaignName: data.name ?? DEFAULTS.campaignName,
            description: data.description ?? DEFAULTS.description,
            headline: data.primaryHeadline ?? DEFAULTS.headline,
            totalBudget: data.totalBudget ?? DEFAULTS.totalBudget,
            dailySpendLimit: String(data.dailySpendLimit ?? DEFAULTS.dailySpendLimit),
            startDate: data.startAt ? new Date(data.startAt) : DEFAULTS.startDate,
            endDate: data.endAt ? new Date(data.endAt) : DEFAULTS.endDate,
            publishStartDate: data.scheduledAt
              ? new Date(data.scheduledAt)
              : DEFAULTS.publishStartDate,
            platforms:
              data.platforms?.map((p: any) => p.platformType?.id ?? p.platformType?.name) ??
              DEFAULTS.platforms,
            objectives:
              data.objectives?.map((o: any) => o.objectiveType?.id ?? o.objectiveType?.name) ??
              DEFAULTS.objectives,
            interests:
              data.interests?.map((i: any) => i.interestType?.id ?? i.interestType?.name) ??
              DEFAULTS.interests,
            country:
              ((data as any).countries?.[0]?.countryType?.id ??
                (data as any).countries?.[0]?.countryType?.name) ??
              DEFAULTS.country,
            stateRegion:
              ((data as any).regions?.[0]?.regionType?.id ??
                (data as any).regions?.[0]?.regionType?.name) ??
              DEFAULTS.stateRegion,
            budgetDistribution:
              ((data as any).budgetAllocations ?? data.budget)?.map((b: any) => ({
                channel: b.channelTypeId,
                percent: b.percentage,
              })) ?? DEFAULTS.budgetDistribution,
          });
        }
      } catch (err) {
        console.error("Error loading campaign for edit:", err);
      }
    };

    loadCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, campaignId]);

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
            <BreadcrumbLink className="text-[#3072C0] font-[500]" href="/submitted">
              Campaign Submitted
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-[500]">
              {mode === "create" ? "Create" : "Edit"} Campaign
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6">
        <h1 className="text-balance text-[18px] font-[600] tracking-tight sm:text-2xl">
          {mode === "create" ? "Create New" : "Edit"} Campaign
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
                {step > 1 && (
                  <Button
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
                )}
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
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel
                </Button>
                <Button
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
                  type="button"
                  onClick={handleNext}
                >
                  {isLast ? (mode === "create" ? "Launch Campaign" : "Update Changes") : "Next"}
                  {!isLast && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {isLast && mode === "create" && (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onCancel={handleCancel}
        title="Cancel Campaign?"
        description="Are you sure you want to cancel? This action cannot be undone."
        confirmText="No, Keep"
        cancelText="Yes, Cancel"
        icon={
          <div>
            <X
              strokeWidth={3}
              color="#EA3B1F"
              className="h-[70px] w-[70px] p-3 bg-[#EA3B1F]/30 rounded-full"
            />
            <span className="sr-only">Close</span>
          </div>
        }
      />
    </div>
  );
}
