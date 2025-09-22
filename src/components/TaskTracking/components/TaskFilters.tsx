import { CircleEllipsis, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { AddCategoryButton } from "../add-modal";

const TaskFilters = () => {

  return (
    <div className={cn(
      "bg-card rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 shadow-sm cursor-pointer",
    )}>
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between",
        "gap-2 sm:gap-3 mb-3 sm:mb-4",
      )}>
        <span className={cn(
          "text-xs sm:text-sm font-medium",
          "text-gray-700 dark:text-gray-300",
        )}>
          Filter By:
        </span>
        <div className="flex gap-1 sm:gap-2 md:gap-3">
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10 cursor-pointer ",
              "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
              "hover:bg-[#508CD3]",
            )}
          >
            <CircleEllipsis className="w-5 h-5 sm:w-5 sm:h-5" />
            <span className="sm:hidden">More</span>
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10 cursor-pointer",
              "hover:bg-[#508CD3]",
            )}
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10 cursor-pointer",
              "hover:bg-[#508CD3]",
            )}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>
      <div className={cn(
        "flex flex-col xl:flex-row items-start xl:items-center justify-between",
        "gap-3 sm:gap-4",
      )}>
        <div className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center",
          "gap-2 sm:gap-3 md:gap-4 w-full xl:w-auto",
        )}>
          <Select>
            <SelectTrigger className={cn(
              "w-72 p-3 sm:p-4 md:p-7 rounded-2xl cursor-pointer",
              "text-xs sm:text-sm",
            )}>
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="fashion-brand">Fashion Brand</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className={cn(
              "w-72 p-3 sm:p-4 md:p-7 rounded-2xl cursor-pointer",
              "text-xs sm:text-sm",
            )}>
              <SelectValue placeholder="Task Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="social-media">Social Media Calendar</SelectItem>
              <SelectItem value="blog">Blog Creation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <AddCategoryButton 
          className="w-full xl:w-60 h-10 sm:h-12 rounded-2xl bg-card cursor-pointer"
        >
          Add New Category
        </AddCategoryButton>
      </div>
    </div>
  );
};

export default TaskFilters; 
