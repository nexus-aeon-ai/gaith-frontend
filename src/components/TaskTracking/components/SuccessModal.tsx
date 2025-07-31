import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";
import { TaskSuccessIcon } from "@/components/ui/icons/task-tracking/Tasksuccess";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onGoToList: () => void;
}

const SuccessModal = ({ isOpen, onClose, type, onGoToList }: SuccessModalProps) => {
  const isTask = type === "task";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#06080F]">
        <div className="text-center p-6">
          <div className="flex justify-center mb-8">
            {isTask ? (
             
                <TaskSuccessIcon className="w-16 h-16 text-[#2BAE82]" />
             
            ) : (
              <CategoryIcon className="w-16 h-16 text-[#2BAE82]" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isTask ? "Task Created Successfully" : "Category Created Successfully"}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {isTask 
              ? "Your task has been added and is now available in your task list."
              : "Your Category has been added and is now available in your Category list."
            }
          </p>
          
          <Button 
            onClick={onGoToList}
            className="w-full rounded-lg h-12 bg-[#508CD3] hover:bg-blue-700 text-white flex items-center gap-2"
          >
            Go To Task List
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal; 