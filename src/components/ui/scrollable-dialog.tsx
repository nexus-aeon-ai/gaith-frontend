"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ScrollableDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  childrenWrapperClassName?: string;
}

export function ScrollableDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className = "",
  childrenWrapperClassName = "",
}: ScrollableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "flex w-full max-w-full flex-col gap-0 overflow-y-visible bg-white p-0 sm:max-w-xl",
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="border-b px-6 py-4">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className={cn("overflow-y-auto px-6 py-4", childrenWrapperClassName)}>{children}</div>
        {footer && <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
