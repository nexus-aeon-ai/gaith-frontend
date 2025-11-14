"use client";
import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

type ActionConfig = {
  label: string;
  onClick?: () => void | Promise<void>;
  variant?: ButtonVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export type InfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  iconComponent?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmButton?: ActionConfig;
  cancelButton?: ActionConfig;
  // If true, clicking confirm/cancel will close the modal automatically
  // Wraps the buttons in DialogClose when true
  closeOnAction?: boolean;
  className?: string;
  contentClassName?: string;
};

export default function PopupModal({
  open,
  onOpenChange,
  iconComponent,
  title,
  description,
  confirmButton,
  cancelButton,
  closeOnAction = true,
  className,
  contentClassName,
}: InfoModalProps) {
  const hasTwo = !!confirmButton && !!cancelButton;

  const ActionWrapper = React.useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return closeOnAction ? <DialogClose asChild>{children}</DialogClose> : <>{children}</>;
    },
    [closeOnAction],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-xl sm:rounded-2xl font-inter border bg-card text-card-foreground p-6 sm:p-8 shadow-lg",
          "w-[min(92vw,440px)]",
          "[&>button]:hidden", // Hide the default Radix close button
          contentClassName,
        )}
      >
        {/* custom close in top-right */}
        <div
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded-full",
            "bg-[#e4ecf4] text-[#A0AEBA] hover:bg-muted hover:text-foreground",
            "border shadow-xs transition-all cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          )}
          onClick={() => onOpenChange(false)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && onOpenChange(false)}
        >
          <X className="size-4" />
        </div>

        <DialogHeader className={cn("items-center text-center", className)}>
          {iconComponent ? <div className="mb-5">{iconComponent}</div> : null}
          <DialogTitle className="text-balance text-[20px] font-[700]">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-pretty text-center mt-2 text-sm">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {/* Actions */}
        {(confirmButton || cancelButton) && (
          <div className={cn("mt-4 grid gap-3", hasTwo ? "grid-cols-2" : "grid-cols-1")}>
            {/* Cancel (left when two) */}
            {cancelButton && (
              <ActionWrapper>
                <Button
                  type={cancelButton.type ?? "button"}
                  variant={cancelButton.variant ?? "outline"}
                  onClick={cancelButton.onClick}
                  disabled={cancelButton.disabled}
                  className={cn(
                    "p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent",
                    cancelButton.className,
                  )}
                >
                  {cancelButton.iconLeft}
                  {cancelButton.label}
                  {cancelButton.iconRight}
                </Button>
              </ActionWrapper>
            )}

            {/* Confirm (right when two or single full width) */}
            {confirmButton && (
              <ActionWrapper>
                <Button
                  type={confirmButton.type ?? "button"}
                  variant={confirmButton.variant ?? "default"}
                  onClick={confirmButton.onClick}
                  disabled={confirmButton.disabled}
                  className={cn(
                    "p-6 px-8 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed",
                    confirmButton.className,
                  )}
                >
                  {confirmButton.iconLeft}
                  {confirmButton.label}
                  {confirmButton.iconRight}
                </Button>
              </ActionWrapper>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
