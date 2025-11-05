"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  singleButton?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  icon,
  singleButton = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] !rounded-[24px] max-w-md sm:max-w-lg p-6 flex flex-col items-center text-center [&>button[type='button']]:hidden">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 cursor-pointer top-4 rounded-sm opacity-70 ring-transparent focus:ring-0 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          disabled={loading}
        >
          <X
            strokeWidth={3}
            color="#55616b"
            className="h-5 w-5 p-[2px] bg-[#A0AEBA] rounded-full"
          />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          {icon}
          <DialogTitle className="mt-6 text-[20px] text-[#070913] dark:text-[#F6FBFE] font-[700]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-center sm:max-w-[80%] text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Buttons */}
        <DialogFooter className="mt-6 w-full flex flex-col space-y-2">
          {singleButton ? (
            <Button
              className="w-full sm:max-w-[90%] mx-auto text-md font-[400] rounded-[16px] py-6 bg-[#3072C0] hover:bg-blue-700 text-white"
              onClick={() => {
                onConfirm?.();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmText}
            </Button>
          ) : (
            <div className="w-full flex gap-3">
              <Button
                variant="outline"
                className="w-full text-md font-[400] rounded-[16px] py-6 border-2 border-red-500  hover:bg-transparent bg-transparent text-red-500  hover:text-red-600"
                onClick={() => {
                  onCancel?.();
                  onOpenChange(false);
                }}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                className="w-full text-md font-[400] rounded-[16px] py-6 bg-[#3072C0] border-2 border-[#3072c0] hover:bg-blue-700 text-white"
                onClick={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
                disabled={loading}
              >
                {loading ? "Processing..." : confirmText}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}