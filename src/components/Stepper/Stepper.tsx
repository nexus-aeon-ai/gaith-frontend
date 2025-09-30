"use client";

import { cn } from "@/lib/utils";

type StepperProps = {
  total: number;
  current: number; // 1-indexed
  className?: string;
  labels?: string[]; // optional short labels for each step
};

export function Stepper({ total, current, className, labels }: StepperProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className={cn("w-full mx-auto max-w-5xl", className)}>
      <div className="flex items-center justify-between">
        {steps.map(step => {
          const isActive = step === current;
          const isCompleted = step < current;
          const isLast = step === total;
          return (
            <div key={step} className={cn("flex-1 flex items-center", isLast && "flex-none")}>
              {/* Circle */}
              <div className="relative z-10 flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
                    isCompleted && "bg-primary text-primary-foreground border-primary",
                    isActive &&
                      !isCompleted &&
                      "bg-secondary text-secondary-foreground border-primary",
                    !isActive && !isCompleted && "bg-card text-muted-foreground border-border",
                  )}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Step ${step}`}
                >
                  {step}
                </div>
              </div>
              {/* Connector */}
              {!isLast && (
                <div
                  className={cn("mx-2 h-[2px] flex-1", isCompleted ? "bg-primary" : "bg-border")}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Optional labels grid */}
      {labels && labels.length === total && (
        <div className="mt-2 flex items-center justify-between gap-2 text-center text-xs text-muted-foreground">
          {labels.map((l, index) => (
            <div
              key={index}
              className={cn(index + 1 === current ? "text-foreground font-medium" : "")}
            >
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
