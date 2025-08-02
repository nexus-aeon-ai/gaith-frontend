import React from "react";

import { Button } from "@/components/ui/button";
import { CancelTaskIcon } from "@/components/ui/icons/task-tracking/cancelTask";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";

import BaseModal from "./base-modal";

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onConfirmCancel: () => void;
  onKeep: () => void;
}

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  onConfirmCancel, 
  onKeep, 
}: CancelConfirmModalProps) => {
  const isTask = type === "task";
  
  const footer = (
    <div className="flex gap-3 w-full">
      <Button 
        variant="outline"
        onClick={onConfirmCancel}
        className="flex-1 rounded-lg h-10 bg-navigation text-[#EA3B1F] border-[#EA3B1F] hover:bg-red-500 hover:text-white"
      >
        Yes, Cancel
      </Button>
      <Button 
        onClick={onKeep}
        className="flex-1 rounded-lg h-10 bg-[#508CD3] hover:bg-blue-700 text-white"
      >
        No, Keep
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={footer}
      className="max-w-[420px] !max-w-[420px] sm:!max-w-[420px] bg-navigation"
      childrenWrapperClassName="p-0"
    >
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          {isTask ? (
            <CancelTaskIcon className="w-16 h-16 text-[#EA3B1F]" />
          ) : (
            <CategoryIcon className="w-16 h-16 text-[#EA3B1F]" />
          )}
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Cancel {isTask ? "Task" : "Category"}?
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 p-4 px-8">
          Are you sure you want to cancel this {isTask ? "task" : "category"}? This action cannot be undone.
        </p>
      </div>
    </BaseModal>
  );
};

export default CancelConfirmModal; 
