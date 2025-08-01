

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CancelTaskIcon } from "@/components/ui/icons/task-tracking/cancelTask";
import { CategoryIcon } from "@/components/ui/icons/task-tracking/category";

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "task" | "category";
  onConfirmCancel: () => void;
  onKeep: () => void;
}

const CancelConfirmModal = ({ isOpen, onClose, type, onConfirmCancel, onKeep }: CancelConfirmModalProps) => {
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
            Cancel {isTask ? "Task" : "Category"}?
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Are you sure you want to cancel this {isTask ? "task" : "category"}? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onConfirmCancel}
              className="flex-1 rounded-lg h-12 bg-[#06080F] text-[#EA3B1F] border-[#EA3B1F] hover:bg-red-500 hover:text-white"
            >
              Yes, Cancel
            </Button>
            <Button 
              onClick={onKeep}
              className="flex-1 rounded-lg h-12 bg-[#508CD3] hover:bg-blue-700 text-white"
            >
              No, Keep
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmModal; 
