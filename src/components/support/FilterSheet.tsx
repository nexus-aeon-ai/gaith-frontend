"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (filters: TicketFilters) => void;
}

interface TicketFilters {
  categories: string[];
  priorities: string[];
  statuses: string[];
}

const FilterSheet = ({ open, onOpenChange, onApplyFilters }: FilterSheetProps) => {
  const [filters, setFilters] = useState<TicketFilters>({
    categories: [],
    priorities: [],
    statuses: [],
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category),
    }));
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      priorities: checked
        ? [...prev.priorities, priority]
        : prev.priorities.filter(p => p !== priority),
    }));
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      statuses: checked ? [...prev.statuses, status] : prev.statuses.filter(s => s !== status),
    }));
  };

  const handleApply = () => {
    // TODO: API call with filters
    onApplyFilters?.(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      priorities: [],
      statuses: [],
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">Filter Tickets</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Category</Label>
            <div className="space-y-2">
              {["Technical", "Billing", "General", "Feature Request"].map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={checked => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Priority</Label>
            <div className="space-y-2">
              {["Low", "Medium", "High", "Critical"].map(priority => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={filters.priorities.includes(priority)}
                    onCheckedChange={checked => handlePriorityChange(priority, checked as boolean)}
                  />
                  <Label htmlFor={`priority-${priority}`} className="font-normal cursor-pointer">
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Status</Label>
            <div className="space-y-2">
              {["Open", "In Progress", "Closed", "Resolved"].map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={checked => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1 bg-[#508CD3] hover:bg-blue-700" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;

