"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MarketingPlanData } from "@/lib/api/reports";

interface ViewMarketingPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: MarketingPlanData | null;
  isLoading?: boolean;
}

const renderList = (items?: string[] | string) => {
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return <span className="text-muted-foreground">No data available</span>;
  }

  if (!Array.isArray(items)) {
    return <p className="text-sm whitespace-pre-line">{items}</p>;
  }

  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`} className="text-sm">
          {item}
        </li>
      ))}
    </ul>
  );
};

const ViewMarketingPlanModal = ({ open, onOpenChange, data, isLoading = false }: ViewMarketingPlanModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">View Marketing Plan</DialogTitle>
          <DialogDescription>Review the marketing plan details below.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : data ? (
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Strategies</h3>
              {renderList(data.strategies)}
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Review Process</h3>
              <p className="text-sm whitespace-pre-line">{data.review_process}</p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Target Audience</h3>
              <p className="text-sm whitespace-pre-line">{data.target_audience}</p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Metrics & KPIs</h3>
              {renderList(data.metrics_and_kpis)}
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Executive Summary</h3>
              <p className="text-sm whitespace-pre-line">{data.executive_summary}</p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Situation Analysis</h3>
              <p className="text-sm whitespace-pre-line">{data.situation_analysis}</p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Budget & Resources</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs uppercase mb-1">Events / Webinars</p>
                  <p>{data.budget_and_resources["events/webinars"]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase mb-1">Content Development</p>
                  <p>{data.budget_and_resources["content development"]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase mb-1">Digital Advertising</p>
                  <p>{data.budget_and_resources["digital advertising"]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase mb-1">Website Optimization</p>
                  <p>{data.budget_and_resources["website optimization"]}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Goals & Objectives</h3>
              {renderList(data.goals_and_objectives)}
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Tactics & Action Plan</h3>
              {renderList(data.tactics_and_action_plan)}
            </section>

            <div className="flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No marketing plan data available</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMarketingPlanModal;

