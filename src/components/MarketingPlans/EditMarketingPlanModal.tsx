"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MarketingPlanData } from "@/lib/api/reports";

const marketingPlanSchema = z.object({
  strategiesText: z.string().min(1, "Strategies are required"),
  review_process: z.string().min(1, "Review process is required"),
  target_audience: z.string().min(1, "Target audience is required"),
  metricsText: z.string().min(1, "Metrics & KPIs are required"),
  executive_summary: z.string().min(1, "Executive summary is required"),
  situation_analysis: z.string().min(1, "Situation analysis is required"),
  budget_and_resources: z.object({
    eventsOrWebinars: z.string().min(1, "Events/Webinars budget is required"),
    contentDevelopment: z.string().min(1, "Content development budget is required"),
    digitalAdvertising: z.string().min(1, "Digital advertising budget is required"),
    websiteOptimization: z.string().min(1, "Website optimization budget is required"),
  }),
  goalsText: z.string().min(1, "Goals & objectives are required"),
  tacticsText: z.string().min(1, "Tactics & action plan are required"),
});

type MarketingPlanFormData = z.infer<typeof marketingPlanSchema>;

const textArrayToString = (value?: string[] | string) => {
  if (Array.isArray(value)) {
    return value.join("\n");
  }
  return value || "";
};

const stringToArray = (value: string): string[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

interface EditMarketingPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MarketingPlanData;
  onSubmit: (data: MarketingPlanData) => void;
  isSubmitting?: boolean;
}

const EditMarketingPlanModal = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: EditMarketingPlanModalProps) => {
  const form = useForm<MarketingPlanFormData>({
    resolver: zodResolver(marketingPlanSchema),
    defaultValues: {
      strategiesText: "",
      review_process: "",
      target_audience: "",
      metricsText: "",
      executive_summary: "",
      situation_analysis: "",
      budget_and_resources: {
        eventsOrWebinars: "",
        contentDevelopment: "",
        digitalAdvertising: "",
        websiteOptimization: "",
      },
      goalsText: "",
      tacticsText: "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        strategiesText: textArrayToString(initialData.strategies),
        review_process: initialData.review_process || "",
        target_audience: initialData.target_audience || "",
        metricsText: textArrayToString(initialData.metrics_and_kpis),
        executive_summary: initialData.executive_summary || "",
        situation_analysis: initialData.situation_analysis || "",
        budget_and_resources: {
          eventsOrWebinars: initialData.budget_and_resources["events/webinars"] || "",
          contentDevelopment: initialData.budget_and_resources["content development"] || "",
          digitalAdvertising: initialData.budget_and_resources["digital advertising"] || "",
          websiteOptimization: initialData.budget_and_resources["website optimization"] || "",
        },
        goalsText: textArrayToString(initialData.goals_and_objectives),
        tacticsText: textArrayToString(initialData.tactics_and_action_plan),
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: MarketingPlanFormData) => {
    const payload: MarketingPlanData = {
      strategies: stringToArray(data.strategiesText),
      review_process: data.review_process,
      target_audience: data.target_audience,
      metrics_and_kpis: stringToArray(data.metricsText),
      executive_summary: data.executive_summary,
      situation_analysis: data.situation_analysis,
      budget_and_resources: {
        "events/webinars": data.budget_and_resources.eventsOrWebinars,
        "content development": data.budget_and_resources.contentDevelopment,
        "digital advertising": data.budget_and_resources.digitalAdvertising,
        "website optimization": data.budget_and_resources.websiteOptimization,
      },
      goals_and_objectives: stringToArray(data.goalsText),
      tactics_and_action_plan: stringToArray(data.tacticsText),
    };
    onSubmit(payload);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Marketing Plan</DialogTitle>
          <DialogDescription>Update the marketing plan details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="strategiesText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategies (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter strategies..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review_process"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Process</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the review process..."
                      className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the target audience..."
                      className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metricsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metrics & KPIs (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter metrics and KPIs..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="executive_summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Executive Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Executive summary..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="situation_analysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situation Analysis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Situation analysis..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget_and_resources.eventsOrWebinars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Events / Webinars</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budget for events/webinars"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget_and_resources.contentDevelopment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Development</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budget for content development"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget_and_resources.digitalAdvertising"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digital Advertising</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budget for digital advertising"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget_and_resources.websiteOptimization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Optimization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budget for website optimization"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="goalsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goals & Objectives (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter goals and objectives..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tacticsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tactics & Action Plan (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tactics and action items..."
                      className="min-h-[120px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-[12px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                {isSubmitting ? "Saving..." : "Update Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMarketingPlanModal;

