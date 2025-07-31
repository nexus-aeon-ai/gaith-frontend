import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CancelTaskIcon } from "@/components/ui/icons/task-tracking/cancelTask";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";

interface CanceledModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onThankYou: () => void;
}

const CanceledModal = ({ isOpen, onClose, type, onThankYou }: CanceledModalProps) => {
  const isTask = type === "task";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#06080F]">
        <div className="text-center p-6">
          <div className="flex justify-center mb-8">
           
                {isTask ? (
              <CancelTaskIcon className="w-16 h-16 text-[#EA3B1F]" />   
                ) : (
                  <CategoryIcon className="w-16 h-16 text-[#EA3B1F]" />
                )}
                
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isTask ? "Task Canceled" : "Category Canceled"}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The {isTask ? "task" : "category"} has been successfully canceled and removed from your active list.
          </p>
          
          <Button 
            onClick={onThankYou}
            className="w-full rounded-lg h-12 bg-[#508CD3] hover:bg-blue-700 text-white flex items-center gap-2"
          >
            Thank You
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanceledModal; 