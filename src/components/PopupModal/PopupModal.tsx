"use client";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

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
  closeOnAction?: boolean;
  className?: string;
  contentClassName?: string;
};

const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => (
  <button type={type} onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

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
  const [mounted, setMounted] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const hasTwo = !!confirmButton && !!cancelButton;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onOpenChange(false);
    }
  };

  const handleButtonClick = (action: ActionConfig) => {
    return async () => {
      if (action.onClick) {
        await action.onClick();
      }
      if (closeOnAction) {
        onOpenChange(false);
      }
    };
  };

  if (!mounted || !open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        role="presentation"
        tabIndex={-1}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={handleOverlayClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOverlayClick(e as unknown as React.MouseEvent);
          }
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={`relative z-10 animate-in fade-in zoom-in-95 duration-200 ${
          contentClassName || ""
        } rounded-xl sm:rounded-2xl font-inter border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-8 shadow-lg w-[min(92vw,440px)] max-h-[90vh] overflow-y-auto`}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded-full bg-[#e4ecf4] text-[#A0AEBA] hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 border shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className={`flex flex-col items-center text-center ${className || ""}`}>
          {iconComponent && (
            <div className="mb-5 flex items-center justify-center">{iconComponent}</div>
          )}
          <h2 id="modal-title" className="text-balance text-[20px] font-[700]">
            {title}
          </h2>
          {description && (
            <p
              id="modal-description"
              className="text-pretty text-center mt-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(confirmButton || cancelButton) && (
          <div className={`mt-4 grid gap-3 ${hasTwo ? "grid-cols-2" : "grid-cols-1"}`}>
            {/* Cancel button */}
            {cancelButton && (
              <Button
                type={cancelButton.type ?? "button"}
                onClick={handleButtonClick(cancelButton)}
                disabled={cancelButton.disabled}
                className={`p-3 px-6 hover:bg-[#EA3B1F] text-[16px] font-[400] border border-[#EA3B1F] text-[#ea3b1f] hover:text-white rounded-[16px] bg-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  cancelButton.className || ""
                }`}
              >
                {cancelButton.iconLeft}
                {cancelButton.label}
                {cancelButton.iconRight}
              </Button>
            )}

            {/* Confirm button */}
            {confirmButton && (
              <Button
                type={confirmButton.type ?? "button"}
                onClick={handleButtonClick(confirmButton)}
                disabled={confirmButton.disabled}
                className={`p-3 px-6 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmButton.className || ""
                }`}
              >
                {confirmButton.iconLeft}
                {confirmButton.label}
                {confirmButton.iconRight}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
