"use client";
import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  onSubmitTicket: () => void;
}

const HeaderSection = ({ onSubmitTicket }: HeaderSectionProps) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start",
        "gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-4 lg:mb-2",
      )}
    >
      <div className="flex-1 min-w-0">
        <h1
          className={cn(
            "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
            "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
          )}
        >
          My Ticket
        </h1>
        <p className={cn("text-xs sm:text-sm md:text-base", "text-gray-600 dark:text-gray-300")}>
          Get help, submit tickets, and access support resources
        </p>
      </div>
      <Button
        className={cn(
          "flex items-center gap-1 sm:gap-2",
          "bg-[#508CD3] rounded-2xl w-full sm:w-auto",
          "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-14 lg:w-60",
          "hover:bg-blue-700 text-white",
          "text-xs sm:text-sm lg:text-base",
        )}
        onClick={onSubmitTicket}
      >
        <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Submit New Ticket</span>
        <span className="sm:hidden">Submit Ticket</span>
      </Button>
    </div>
  );
};

export default HeaderSection;

