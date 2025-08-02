import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";
import { TaskSuccessIcon } from "@/components/ui/icons/task-tracking/Tasksuccess";

import BaseModal from "./base-modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onGoToList: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  onGoToList, 
}: SuccessModalProps) => {
  const isTask = type === "task";
  
  const footer = (
    <Button 
      onClick={onGoToList}
      className="w-full rounded-lg h-10 bg-[#508CD3] hover:bg-blue-700 text-white"
    >
      Go to List
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
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
            <TaskSuccessIcon className="w-16 h-16 text-green-500" />
          ) : (
            <CategoryIcon className="w-16 h-16 text-green-500" />
          )}
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white ">
          {isTask ? "Task" : "Category"} Created Successfully
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 p-2 px-8 mb-3 ">
          Your {isTask ? "task" : "category"} has been added and is now available in your list..
        </p>
      </div>
    </BaseModal>
  );
};

export default SuccessModal; 
