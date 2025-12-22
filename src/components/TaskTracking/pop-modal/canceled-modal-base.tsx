import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/button";
import { CancelTaskIcon } from "@/components/ui/icons/task-tracking/cancelTask";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

interface CanceledModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onThankYou: () => void;
}

const CanceledModal: React.FC<CanceledModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  onThankYou, 
}: CanceledModalProps) => {
  const isTask = type === "task";
  
  const t = useTranslations("TaskTracking");
  const tModal = useTranslations("modal");
  
  const footer = (
    <Button 
      onClick={onThankYou}
      className="w-full rounded-lg h-10 bg-[#508CD3] hover:bg-blue-700 text-white"
    >
      {tModal("thankYou")}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <ScrollableDialog
      open={isOpen}
      onOpenChange={onClose}
      title=""
      className="w-full max-w-[420px] bg-navigation sm:w-auto sm:max-w-[420px]"
      childrenWrapperClassName="p-0"
      footer={footer}
    >
      <div className="text-center py-4">
        <div className="flex justify-center mt-6 mb-4">
          {isTask ? (
            <CancelTaskIcon className="w-16 h-16 text-[#EA3B1F]" />
          ) : (
            <CategoryIcon className="w-16 h-16 text-[#EA3B1F]" />
          )}
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-0">
          {isTask ? t("task") : t("category")} {tModal("canceled")}
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 p-2 px-8 mb-3 ">
          {isTask ? t("yourTask") : t("yourCategory")} {tModal("hasBeenCanceled")}
        </p>
      </div>
    </ScrollableDialog>
  );
};

export default CanceledModal; 
