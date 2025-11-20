import { CirclePlus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { useTaskModalStore } from "@/lib/store/taskModalStore";
import { cn } from "@/lib/utils";

interface AddTaskButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ 
  className,
  children = "Add New Task",
}) => {
  const { setOpen, setIsEdit } = useTaskModalStore();

  return (
    <Button 
      onClick={() => {
        setOpen(true);
        setIsEdit(false);
      }}
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        "bg-[#508CD3] rounded-[16px] w-full sm:w-auto cursor-pointer",
        "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
        "hover:bg-blue-700 text-white",
        "text-xs sm:text-sm lg:text-base",
        className,
      )}
    >
      <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">Add Task</span>
    </Button>
  );
};

export default AddTaskButton; 
