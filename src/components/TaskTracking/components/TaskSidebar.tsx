import { Ellipsis } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SimpleCategory } from "@/lib/api/tasks";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  pillColor: string;
  stages: Record<string, number>;
}

interface Status {
  name: string;
  count: number;
  color: string;
}

interface TaskSidebarProps {
  categories: Category[] | SimpleCategory[];
  statuses: Status[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  completionRate?: number;
  totals?: { all: number; completed: number };
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  categories,
  statuses,
  selectedCategory,
  onCategorySelect,
  completionRate = 0,
  totals = { all: 0, completed: 0 },
}) => {
  const [showSubCategory, setShowSubCategory] = React.useState(false);
  const [subCategoryIndex, setSubCategoryIndex] = React.useState<number | null>(null);
  console.log("Categories in Sidebar:", categories);
  return (
    <div className="w-full space-y-3 sm:space-y-3">
      {/* Task Categories */}
      <Card className="bg-card rounded-[16px]">
        <CardContent className="p-2 sm:p-3 md:p-4">
          <h3
            className={cn(
              "font-bold text-gray-900 dark:text-white",
              "mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm md:text-base",
            )}
          >
            Task Categories
          </h3>
          <div className="space-y-1 sm:space-y-2">
            {/* All Categories Option */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onCategorySelect("All Categories")}
              onKeyDown={() => onCategorySelect("All Categories")}
              className={`space-y-2 rounded-[16px] p-3 cursor-pointer hover:bg-[#3071c00f] ${selectedCategory === "All Categories" ? "bg-[#3072C014]" : ""}`}
            >
              <div className="flex flex-row justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-[10px] h-[10px] rounded-full bg-gray-500`} />
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-sm font-medium">All Categories</p>
                    <span className="text-xs">{totals.all} Tasks</span>
                  </div>
                </div>
              </div>
            </div>
            {categories.map((category, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => onCategorySelect(category.name)}
                onKeyDown={() => onCategorySelect(category.name)}
                className={`space-y-2 rounded-[16px] p-3 cursor-pointer hover:bg-[#3071c00f] ${category.name === selectedCategory ? "bg-[#3072C014]" : ""}`}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-[10px] h-[10px] rounded-full`} style={{backgroundColor:category.color}} />
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-sm font-medium">{category.name}</p>
                      <span className="text-xs">{category.count} Tasks</span>
                    </div>
                  </div>
                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      setSubCategoryIndex(index);
                      setShowSubCategory(!showSubCategory);
                    }}
                    className="bg-[#A0AEBA]/40 rounded-md shadow-none flex items-center justify-center w-6 h-6 px-0 cursor-pointer hover:bg-[#A0AEBA]/60 transition-all duration-300"
                  >
                    <Ellipsis color="#A0AEBA" size={16} />
                  </Button>
                </div>

                {/* sub category list  */}
                {showSubCategory &&
                  subCategoryIndex === index &&
                  Object.keys(category.stages as Record<string, number>).length > 0 &&
                  Object.entries(category.stages as Record<string, number>).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex flex-row justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-[10px] h-[10px] rounded-full bg-transparent" />
                          <p className="text-sm font-medium dark:text-[#CCCFDB]">{key}</p>
                        </div>
                        <div className="bg-[#3072C014] text-[#508CD3] text-xs px-3 rounded-md flex items-center justify-center w-7 h-6">
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Status */}
      <Card className="bg-card rounded-[16px]">
        <CardContent className="p-4">
          <h3 className={cn("font-semibold text-gray-900 dark:text-white mb-4")}>Task Status</h3>
          <div className="space-y-2">
            {statuses.map((status, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("w-3 h-3 rounded-full")}
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{status.name}</span>
                  </div>
                  <p className="text-sm">{status.count}</p>
                </div>
                <Separator />
              </div>
            ))}
          </div>

          <div className={cn("pt-4 ")}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completion Rate
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {completionRate}%
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {totals.completed} of {totals.all} tasks
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#3072C0] h-full rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSidebar;
