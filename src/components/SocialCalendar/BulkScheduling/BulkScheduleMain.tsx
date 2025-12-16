"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import StepBulkPostOverview from "@/components/SocialCalendar/BulkScheduling/Step3";
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
import { FormSchema } from "@/lib/schemas/new-campaign";
import { cn } from "@/lib/utils";

import StepUpload from "./Step1";
import StepConfiguration from "./Step2";

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
  postingFrequency: "every-other-day",
  preferredTimeSlots: ["15:00"],
};

export function BulkScheduleForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const isLast = step === totalSteps;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  async function handleNext() {
    // validate only the current step's fields

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
            <BreadcrumbLink className="text-[#3072C0] font-[500]" href="/social-media-calendar">
              Social Media Calendar
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-[500]">
              Bulk Post Scheduling
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6">
        <h1 className="text-balance text-[18px] font-[600] tracking-tight sm:text-2xl">
          Bulk Post Scheduling
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and schedule multiple social media posts at once to save time and improve
          efficiency.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border bg-card p-4 md:p-6"
        >
          <div className="mb-6 max-w-lg self-center w-full mx-auto rounded-lg  p-4 md:p-6">
            <Stepper
              total={totalSteps}
              current={step}
              labels={["Upload", "Configuration", "Final Confirmation"]}
            />
          </div>

          {/* Step content */}
          <div className="space-y-4">
            {step === 1 && <StepUpload form={form} />}
            {step === 2 && <StepConfiguration form={form} />}
            {step === 3 && <StepBulkPostOverview form={form} />}
          </div>
        </form>
      </Form>
      {/* Footer actions */}
      <div className="flex mt-4 flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex sm:flex-row flex-col items-center justify-between w-full gap-2">
          <div className="w-full">
            <Button
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-transparent rounded-2xl w-full sm:w-auto",
                "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500",
                "text-xs sm:text-sm lg:text-base",
                "border-gray-500 border",
              )}
              onClick={handlePrev}
            >
              <ChevronLeft/>
              <p>Back</p>
            </Button>
          </div>
          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto ">
            {!isLast && (
              <Button
                className={cn(
                  "flex items-center gap-1 sm:gap-2",
                  "bg-transparent rounded-2xl sm:w-auto",
                  "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                  "hover:bg-red-50 dark:hover:bg-gray-800 text-red-500",
                  "text-xs sm:text-sm lg:text-base",
                  "border-red-500 border",
                )}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}

            {isLast && (
              <Button
                className={cn(
                  "flex items-center gap-1 sm:gap-2",
                  "bg-transparent rounded-2xl  sm:w-auto",
                  "px-3 sm:px-4 min-w-[130px] lg:px-6 h-9 sm:h-10 lg:h-12",
                  "hover:bg-blue-50 dark:hover:bg-gray-800 text-blue-700",
                  "text-xs sm:text-sm lg:text-base",
                  "border-blue-700 border",
                )}
                onClick={handleSave}
              >
                Save as Draft
              </Button>
            )}
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
              {isLast ? "Schedule All Posts" : "Next"}
              {!isLast && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
