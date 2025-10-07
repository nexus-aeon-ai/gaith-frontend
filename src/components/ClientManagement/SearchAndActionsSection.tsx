import { Download, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchAndActionsSectionProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

const SearchAndActionsSection = ({ globalFilter, setGlobalFilter }: SearchAndActionsSectionProps) => {
  return (
    <div className={cn(
      " items-center justify-center bg-card rounded-lg px-6 py-6 mb-3 shadow-sm",
    )}>
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between ",
        "gap-3 sm:gap-4 ",
      )}>
        <div className="relative flex-1 max-w-md">
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          {/* Input Field */}
          <Input
            placeholder="Search clients"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 bg-card min-h-14 text-base rounded-xl"
          />
        </div>
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-10 sm:h-12",
              "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
              "hover:bg-[#508CD3]",
            )}
          >
            <div className="w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm ml-0.5" />
            </div>
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-10 sm:h-12",
              "hover:bg-[#508CD3]",
            )}
          >
            <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 border-l-2 border-t-2 border-gray-400 transform rotate-45" />
            </div>
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-10 sm:h-12",
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
              "bg-card border-border text-xs h-10 sm:h-12",
              "hover:bg-[#508CD3]",
            )}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActionsSection;
