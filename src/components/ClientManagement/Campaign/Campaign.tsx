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
import { FormSchema } from "@/lib/schemas/new-campaign";
import { Client } from "@/lib/types";
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
  timezone: "EST",
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
    "timezone",
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
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
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
    // TODO: Implement final submission
    console.warn("Form submitted:", values);
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
                  onClick={handleCancel}
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
                  onClick={handleNext}
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
