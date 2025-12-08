"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MediaBuyingData } from "@/lib/api/reports";

interface ViewMediaBuyingPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: MediaBuyingData | null;
  isLoading?: boolean;
}

const renderList = (items?: string[] | string) => {
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return <p className="text-sm text-muted-foreground">No data available</p>;
  }

  if (!Array.isArray(items)) {
    return <p className="text-sm whitespace-pre-line">{items}</p>;
  }
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`}>{item}</li>
      ))}
    </ul>
  );
};

const ViewMediaBuyingPlanModal = ({ open, onOpenChange, data, isLoading = false }: ViewMediaBuyingPlanModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">View Media Buying Plan</DialogTitle>
          <DialogDescription>Review the media buying plan details below.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : data ? (
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-base font-semibold mb-2">Campaign Count</h3>
              <p>{data.campaign_count}</p>
            </section>

            <section>
              <h3 className="text-base font-semibold mb-2">Suggested Platforms</h3>
              <p>{data.suggested_platforms}</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-semibold">Target Audiences</h3>
              {data.target_audiences?.map((audience, idx) => (
                <div key={`${audience.audience_name}-${idx}`} className="rounded-xl border border-border p-4 space-y-2">
                  <p className="font-medium">{audience.audience_name}</p>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Demographics</p>
                    <p>{audience.demographics}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Platform Behavior</p>
                    <p>{audience.platform_behavior}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Interests</p>
                    {renderList(audience.interests)}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Pain Points</p>
                    {renderList(audience.pain_points)}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-semibold">Budget Breakdown</h3>
              <p>
                <span className="font-medium">Total Budget:</span>{" "}
                {data.estimated_budget_breakdown?.total_budget ?? "N/A"}
              </p>
              <div className="space-y-3">
                {data.estimated_budget_breakdown?.monthly_breakdown?.length ? (
                  data.estimated_budget_breakdown.monthly_breakdown.map((entry, idx) => (
                    <div key={`${entry.month}-${idx}`} className="rounded-xl border border-border p-3">
                      <p className="font-medium">{entry.month}</p>
                      <p>Amount: {entry.amount}</p>
                      <p className="text-muted-foreground text-sm">Focus: {entry.focus}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No monthly breakdown available</p>
                )}
              </div>
              <div className="rounded-xl border border-border p-4 space-y-2">
                <p className="font-medium">Platform Allocation</p>
                <p>Amount: {data.estimated_budget_breakdown?.platform_allocation?.amount ?? "N/A"}</p>
                <p>Percentage: {data.estimated_budget_breakdown?.platform_allocation?.percentage ?? "N/A"}</p>
                <p className="text-muted-foreground text-sm">
                  Reasoning: {data.estimated_budget_breakdown?.platform_allocation?.reasoning ?? "N/A"}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {(["awareness_campaigns", "consideration_campaigns", "conversion_campaigns"] as const).map((key) => (
                  <div key={key} className="rounded-xl border border-border p-3">
                    <p className="font-medium capitalize">{key.replace("_", " ")}</p>
                    <p>
                      Amount:{" "}
                      {data.estimated_budget_breakdown?.campaign_type_allocation?.[key]?.amount ?? "N/A"}
                    </p>
                    <p>
                      Percentage:{" "}
                      {data.estimated_budget_breakdown?.campaign_type_allocation?.[key]?.percentage ?? "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-semibold">Paid Ads Recommendations</h3>
              {(
                [
                  { key: "budget_pacing", label: "Budget Pacing" },
                  { key: "bidding_strategy", label: "Bidding Strategy" },
                  { key: "creative_rotation", label: "Creative Rotation" },
                  { key: "optimization_goal", label: "Optimization Goal" },
                  { key: "platform_specific_tips", label: "Platform Specific Tips" },
                  { key: "audience_targeting_approach", label: "Audience Targeting Approach" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs uppercase text-muted-foreground">{label}</p>
                  <p>{data.paid_ads_algorithm_recommendation[key]}</p>
                </div>
              ))}
            </section>

            <div className="flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No media buying plan data available</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMediaBuyingPlanModal;

