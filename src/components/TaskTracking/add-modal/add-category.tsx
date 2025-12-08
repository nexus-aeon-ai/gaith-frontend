import { CirclePlus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { useCategoryModalStore } from "@/lib/store/taskModalStore";
import { cn } from "@/lib/utils";

interface AddCategoryButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ 
  className,
  children = "Add Catesgory",
}) => {
  const { setOpen, setIsEdit } = useCategoryModalStore();

  return (
    <Button 
      onClick={() => {
        setOpen(true);
        setIsEdit(false);
      }}
      variant="outline"
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        "border-1 border-[#508CD3] text-[#508CD3]",
        "rounded-3xl w-full sm:w-auto",
        "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
        "hover:bg-[#508CD3] hover:text-white",
        "text-xs sm:text-sm lg:text-base",
        className,
      )}
    >
      <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">Add Categsory</span>
    </Button>
  );
};

export default AddCategoryButton; 
