"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type StepperProps = {
  total: number;
  current: number;
  className?: string;
  labels?: string[];
};

export function Stepper({ total, current, className, labels }: StepperProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className={cn("w-full mx-auto max-w-5xl", className)}>
      <div className="flex items-start">
        {steps.map(step => {
          const isActive = step === current;
          const isCompleted = step < current;
          const isLast = step === total;
          return (
            <div key={step} className={cn("flex", !isLast && "flex-1")}>
              {/* Circle + Label */}
              <div className="relative flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
                    isCompleted &&
                      "bg-[#3072C0] text-primary-foreground border-[#3072C0] dark:border-accent-foreground",
                    isActive &&
                      !isCompleted &&
                      "bg-secondary text-[#3072C0] dark:border-primary border-[#3072C0]",
                    !isActive && !isCompleted && "bg-card text-muted-foreground border-border",
                  )}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${step}`}
                >
                  {isCompleted ? <Check /> : step}
                </div>
                {labels && (
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium text-center break-words max-w-[80px]",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {labels[step - 1]}
                  </p>
                )}
              </div>
              {/* Connector - positioned to align with circle center */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 border-1 flex-1 border-dashed self-start",
                    isCompleted ? "border-[#3072C0]" : "border-[#DCE0E4]",
                  )}
                  style={{ marginTop: "20px" }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
