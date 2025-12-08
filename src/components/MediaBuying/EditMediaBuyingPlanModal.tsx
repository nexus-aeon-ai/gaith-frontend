"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import type { MediaBuyingData, MediaBuyingAudience, MediaBuyingBudgetMonth } from "@/lib/api/reports";

const audienceSchema = z.object({
  audience_name: z.string().min(1, "Audience name is required"),
  interestsText: z.string().min(1, "Interests are required"),
  pain_pointsText: z.string().min(1, "Pain points are required"),
  demographics: z.string().min(1, "Demographics are required"),
  platform_behavior: z.string().min(1, "Platform behavior is required"),
});

const monthlyBreakdownSchema = z.object({
  month: z.string().min(1, "Month is required"),
  amount: z.string().min(1, "Amount is required"),
  focus: z.string().min(1, "Focus is required"),
});

const allocationSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  percentage: z.string().min(1, "Percentage is required"),
});

const mediaBuyingFormSchema = z.object({
  campaign_count: z.string().min(1, "Campaign count is required"),
  suggested_platforms: z.string().min(1, "Suggested platforms are required"),
  target_audiences: z.array(audienceSchema).min(1, "At least one target audience is required"),
  estimated_budget_breakdown: z.object({
    total_budget: z.string().min(1, "Total budget is required"),
    monthly_breakdown: z.array(monthlyBreakdownSchema).min(1, "At least one monthly breakdown entry is required"),
    platform_allocation: z.object({
      amount: z.string().min(1, "Platform allocation amount is required"),
      percentage: z.string().min(1, "Platform allocation percentage is required"),
      reasoning: z.string().min(1, "Platform allocation reasoning is required"),
    }),
    campaign_type_allocation: z.object({
      awareness_campaigns: allocationSchema,
      consideration_campaigns: allocationSchema,
      conversion_campaigns: allocationSchema,
    }),
  }),
  paid_ads_algorithm_recommendation: z.object({
    budget_pacing: z.string().min(1, "Budget pacing is required"),
    bidding_strategy: z.string().min(1, "Bidding strategy is required"),
    creative_rotation: z.string().min(1, "Creative rotation is required"),
    optimization_goal: z.string().min(1, "Optimization goal is required"),
    platform_specific_tips: z.string().min(1, "Platform specific tips are required"),
    audience_targeting_approach: z.string().min(1, "Audience targeting approach is required"),
  }),
});

type MediaBuyingFormValues = z.infer<typeof mediaBuyingFormSchema>;

const arrayToTextarea = (value?: string[] | string) => {
  if (Array.isArray(value)) {
    return value.join("\n");
  }
  return value || "";
};

const textareaToArray = (value: string): string[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const audienceToForm = (audience: MediaBuyingAudience): MediaBuyingFormValues["target_audiences"][number] => ({
  audience_name: audience.audience_name || "",
  interestsText: arrayToTextarea(audience.interests),
  pain_pointsText: arrayToTextarea(audience.pain_points),
  demographics: audience.demographics || "",
  platform_behavior: audience.platform_behavior || "",
});

const monthlyToForm = (entry: MediaBuyingBudgetMonth): MediaBuyingFormValues["estimated_budget_breakdown"]["monthly_breakdown"][number] => ({
  month: entry.month || "",
  amount: entry.amount || "",
  focus: entry.focus || "",
});

interface EditMediaBuyingPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MediaBuyingData;
  onSubmit: (data: MediaBuyingData) => void;
  isSubmitting?: boolean;
}

const EditMediaBuyingPlanModal = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: EditMediaBuyingPlanModalProps) => {
  const form = useForm<MediaBuyingFormValues>({
    resolver: zodResolver(mediaBuyingFormSchema),
    defaultValues: {
      campaign_count: "",
      suggested_platforms: "",
      target_audiences: [
        {
          audience_name: "",
          interestsText: "",
          pain_pointsText: "",
          demographics: "",
          platform_behavior: "",
        },
      ],
      estimated_budget_breakdown: {
        total_budget: "",
        monthly_breakdown: [
          {
            month: "",
            amount: "",
            focus: "",
          },
        ],
        platform_allocation: {
          amount: "",
          percentage: "",
          reasoning: "",
        },
        campaign_type_allocation: {
          awareness_campaigns: { amount: "", percentage: "" },
          consideration_campaigns: { amount: "", percentage: "" },
          conversion_campaigns: { amount: "", percentage: "" },
        },
      },
      paid_ads_algorithm_recommendation: {
        budget_pacing: "",
        bidding_strategy: "",
        creative_rotation: "",
        optimization_goal: "",
        platform_specific_tips: "",
        audience_targeting_approach: "",
      },
    },
  });

  const {
    fields: audienceFields,
    append: appendAudience,
    remove: removeAudience,
  } = useFieldArray({
    control: form.control,
    name: "target_audiences",
  });

  const {
    fields: monthlyFields,
    append: appendMonthly,
    remove: removeMonthly,
  } = useFieldArray({
    control: form.control,
    name: "estimated_budget_breakdown.monthly_breakdown",
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        campaign_count: initialData.campaign_count || "",
        suggested_platforms: initialData.suggested_platforms || "",
        target_audiences:
          initialData.target_audiences?.map((audience) => audienceToForm(audience)) || [
            {
              audience_name: "",
              interestsText: "",
              pain_pointsText: "",
              demographics: "",
              platform_behavior: "",
            },
          ],
        estimated_budget_breakdown: {
          total_budget: initialData.estimated_budget_breakdown.total_budget || "",
          monthly_breakdown:
            initialData.estimated_budget_breakdown.monthly_breakdown?.map((entry) => monthlyToForm(entry)) || [
              { month: "", amount: "", focus: "" },
            ],
          platform_allocation: {
            amount: initialData.estimated_budget_breakdown.platform_allocation.amount || "",
            percentage: initialData.estimated_budget_breakdown.platform_allocation.percentage || "",
            reasoning: initialData.estimated_budget_breakdown.platform_allocation.reasoning || "",
          },
          campaign_type_allocation: {
            awareness_campaigns: {
              amount: initialData.estimated_budget_breakdown.campaign_type_allocation.awareness_campaigns.amount || "",
              percentage:
                initialData.estimated_budget_breakdown.campaign_type_allocation.awareness_campaigns.percentage || "",
            },
            consideration_campaigns: {
              amount: initialData.estimated_budget_breakdown.campaign_type_allocation.consideration_campaigns.amount || "",
              percentage:
                initialData.estimated_budget_breakdown.campaign_type_allocation.consideration_campaigns.percentage || "",
            },
            conversion_campaigns: {
              amount: initialData.estimated_budget_breakdown.campaign_type_allocation.conversion_campaigns.amount || "",
              percentage:
                initialData.estimated_budget_breakdown.campaign_type_allocation.conversion_campaigns.percentage || "",
            },
          },
        },
        paid_ads_algorithm_recommendation: {
          budget_pacing: initialData.paid_ads_algorithm_recommendation.budget_pacing || "",
          bidding_strategy: initialData.paid_ads_algorithm_recommendation.bidding_strategy || "",
          creative_rotation: initialData.paid_ads_algorithm_recommendation.creative_rotation || "",
          optimization_goal: initialData.paid_ads_algorithm_recommendation.optimization_goal || "",
          platform_specific_tips: initialData.paid_ads_algorithm_recommendation.platform_specific_tips || "",
          audience_targeting_approach: initialData.paid_ads_algorithm_recommendation.audience_targeting_approach || "",
        },
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: MediaBuyingFormValues) => {
    const payload: MediaBuyingData = {
      campaign_count: values.campaign_count,
      suggested_platforms: values.suggested_platforms,
      target_audiences: values.target_audiences.map((audience) => ({
        audience_name: audience.audience_name,
        interests: textareaToArray(audience.interestsText),
        pain_points: textareaToArray(audience.pain_pointsText),
        demographics: audience.demographics,
        platform_behavior: audience.platform_behavior,
      })),
      estimated_budget_breakdown: {
        total_budget: values.estimated_budget_breakdown.total_budget,
        monthly_breakdown: values.estimated_budget_breakdown.monthly_breakdown.map((entry) => ({
          month: entry.month,
          amount: entry.amount,
          focus: entry.focus,
        })),
        platform_allocation: {
          amount: values.estimated_budget_breakdown.platform_allocation.amount,
          percentage: values.estimated_budget_breakdown.platform_allocation.percentage,
          reasoning: values.estimated_budget_breakdown.platform_allocation.reasoning,
        },
        campaign_type_allocation: {
          awareness_campaigns: {
            amount: values.estimated_budget_breakdown.campaign_type_allocation.awareness_campaigns.amount,
            percentage: values.estimated_budget_breakdown.campaign_type_allocation.awareness_campaigns.percentage,
          },
          consideration_campaigns: {
            amount: values.estimated_budget_breakdown.campaign_type_allocation.consideration_campaigns.amount,
            percentage: values.estimated_budget_breakdown.campaign_type_allocation.consideration_campaigns.percentage,
          },
          conversion_campaigns: {
            amount: values.estimated_budget_breakdown.campaign_type_allocation.conversion_campaigns.amount,
            percentage: values.estimated_budget_breakdown.campaign_type_allocation.conversion_campaigns.percentage,
          },
        },
      },
      paid_ads_algorithm_recommendation: {
        budget_pacing: values.paid_ads_algorithm_recommendation.budget_pacing,
        bidding_strategy: values.paid_ads_algorithm_recommendation.bidding_strategy,
        creative_rotation: values.paid_ads_algorithm_recommendation.creative_rotation,
        optimization_goal: values.paid_ads_algorithm_recommendation.optimization_goal,
        platform_specific_tips: values.paid_ads_algorithm_recommendation.platform_specific_tips,
        audience_targeting_approach: values.paid_ads_algorithm_recommendation.audience_targeting_approach,
      },
    };

    onSubmit(payload);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Media Buying Plan</DialogTitle>
          <DialogDescription>Update the media buying plan details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="campaign_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Count</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Number of campaigns"
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
                name="suggested_platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Platforms</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Meta, Google"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Target Audiences</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAudience({
                      audience_name: "",
                      interestsText: "",
                      pain_pointsText: "",
                      demographics: "",
                      platform_behavior: "",
                    })
                  }
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
                >
                  Add Audience
                </Button>
              </div>
              <div className="space-y-4">
                {audienceFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Audience {index + 1}</h4>
                      {audienceFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAudience(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Controller
                        control={form.control}
                        name={`target_audiences.${index}.audience_name`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Audience Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Audience name"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name={`target_audiences.${index}.demographics`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Demographics</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Demographics"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                          </FormItem>
                        )}
                      />
                    </div>
                    <Controller
                      control={form.control}
                      name={`target_audiences.${index}.platform_behavior`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Platform Behavior</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe how this audience behaves on platforms..."
                              className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`target_audiences.${index}.interestsText`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Interests (one per line)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Investment opportunities&#10;Fintech"
                              className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`target_audiences.${index}.pain_pointsText`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Pain Points (one per line)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Need reliable solutions&#10;High-risk concerns"
                              className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Budget Breakdown</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendMonthly({
                      month: "",
                      amount: "",
                      focus: "",
                    })
                  }
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
                >
                  Add Month
                </Button>
              </div>
              <FormField
                control={form.control}
                name="estimated_budget_breakdown.total_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Total budget"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                {monthlyFields.map((field, index) => (
                  <div key={field.id} className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Month {index + 1}</h4>
                      {monthlyFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMonthly(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Controller
                        control={form.control}
                        name={`estimated_budget_breakdown.monthly_breakdown.${index}.month`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., November 2025"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name={`estimated_budget_breakdown.monthly_breakdown.${index}.amount`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., AED 166,667"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                          </FormItem>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name={`estimated_budget_breakdown.monthly_breakdown.${index}.focus`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Focus</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Focus for this month"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimated_budget_breakdown.platform_allocation.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Allocation Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., AED 350,000"
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
                  name="estimated_budget_breakdown.platform_allocation.percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Allocation Percentage</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 70%"
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
                name="estimated_budget_breakdown.platform_allocation.reasoning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Allocation Reasoning</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain the allocation reasoning..."
                        className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-4">
                {(["awareness_campaigns", "consideration_campaigns", "conversion_campaigns"] as const).map(
                  (key) => (
                    <div key={key} className="space-y-3 rounded-xl border border-border p-4">
                      <h4 className="font-medium">
                        {key
                          .replace("_campaigns", "")
                          .replace("_", " ")
                          .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                        Campaigns
                      </h4>
                      <FormField
                        control={form.control}
                        name={`estimated_budget_breakdown.campaign_type_allocation.${key}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Amount"
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
                        name={`estimated_budget_breakdown.campaign_type_allocation.${key}.percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Percentage</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Percentage"
                                className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-base font-semibold">Paid Ads Algorithm Recommendations</h3>
              {(
                [
                  { name: "budget_pacing", label: "Budget Pacing" },
                  { name: "bidding_strategy", label: "Bidding Strategy" },
                  { name: "creative_rotation", label: "Creative Rotation" },
                  { name: "optimization_goal", label: "Optimization Goal" },
                  { name: "platform_specific_tips", label: "Platform Specific Tips" },
                  { name: "audience_targeting_approach", label: "Audience Targeting Approach" },
                ] as const
              ).map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={`paid_ads_algorithm_recommendation.${name}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={label}
                          className="min-h-[100px] dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </section>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
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

export default EditMediaBuyingPlanModal;

