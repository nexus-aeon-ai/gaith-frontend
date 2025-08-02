import React from "react";

import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  childrenWrapperClassName?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "max-w-md bg-card",
  childrenWrapperClassName = "space-y-3",
}) => {
  return (
    <ScrollableDialog
      open={isOpen}
      onOpenChange={onClose}
      title={title}
      className={className}
      childrenWrapperClassName={childrenWrapperClassName}
      footer={footer}
    >
      {children}
    </ScrollableDialog>
  );
};

export default BaseModal; 
