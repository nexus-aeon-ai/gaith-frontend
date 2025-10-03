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

export function PopupModal({
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
        showCloseButton={false}
        className={cn(
          "rounded-xl sm:rounded-2xl border bg-card text-card-foreground p-6 sm:p-8 shadow-lg",
          "w-[min(92vw,440px)]",
          contentClassName,
        )}
      >
        {/* custom close in top-right */}
        <DialogClose
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full",
            "bg-muted/70 text-foreground/70 hover:bg-muted hover:text-foreground",
            "border shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          )}
        >
          <X className="size-4" />
        </DialogClose>

        <DialogHeader className={cn("items-center text-center", className)}>
          {iconComponent ? <div className="mb-2">{iconComponent}</div> : null}
          <DialogTitle className="text-balance text-xl font-semibold">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-pretty mt-2 text-sm">
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
                  className={cn("w-full", cancelButton.className)}
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
                  className={cn("w-full", confirmButton.className)}
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

export default PopupModal;
