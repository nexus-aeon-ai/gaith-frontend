import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Status {
  name: string;
  count: number;
  color: string;
}

interface TaskSidebarProps {
  categories: Category[];
  statuses: Status[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  completionRate?: number;
  totals?: { all: number; completed: number };
}

const TaskSidebar:React.FC<TaskSidebarProps> = ({ 
  categories, statuses, selectedCategory, onCategorySelect, completionRate = 0, totals = { all: 0, completed: 0 },
}) => {
  return (
    <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Task Categories */}
      <Card className="bg-card">
        <CardContent className="p-2 sm:p-3 md:p-4">
          <h3 className={cn(
            "font-semibold text-gray-900 dark:text-white",
            "mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm md:text-base",
          )}>
            Task Categories
          </h3>
          <div className="space-y-1 sm:space-y-2">
            {categories.map((category, index) => (
              <div key={index}>
                <Button
                  type="button"
                  className={cn(
                    "flex items-center justify-between p-1.5 sm:p-2 rounded cursor-pointer",
                    "transition-colors w-full text-left bg-card border-none shadow-none",
                    selectedCategory === category.name
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  )}
                  onClick={() => onCategorySelect(category.name)}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <category.icon className={cn(
                      "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0",
                      category.color,
                    )} />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate",
                    )}>
                      {category.name}
                    </span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1",
                      "w-6 h-5 sm:w-8 sm:h-6 flex items-center justify-center flex-shrink-0",
                    )}
                    style={{
                      backgroundColor: `${category.color}22`,
                      color: category.color,
                    }}
                  >
                    {category.count}
                  </Badge>
                </Button>
                {category.name === "Social Media Calendar" && selectedCategory === category.name && (
                  <div className="ml-5 space-y-1">
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Draft</span>
                      <Badge variant="secondary" className={cn(
                        "text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6",
                        "flex items-center justify-center",
                        category.color,
                      )}>
                        4
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Review</span>
                      <Badge variant="secondary" className={cn(
                        "text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6",
                        "flex items-center justify-center",
                        category.color,
                      )}>
                        5
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Sent To Client</span>
                      <Badge variant="secondary" className={cn(
                        "text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6",
                        "flex items-center justify-center",
                        category.color,
                      )}>
                        7
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Approved By Client</span>
                      <Badge variant="secondary" className={cn(
                        "text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6",
                        "flex items-center justify-center",
                        category.color,
                      )}>
                        7
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Status */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <h3 className={cn(
            "font-semibold text-gray-900 dark:text-white mb-4",
          )}>
            Task Status
          </h3>
          <div className="space-y-2">
            {statuses.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    status.color,
                  )} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{status.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {status.count}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className={cn(
            "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
          )}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completionRate}%</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {totals.completed} of {totals.all} tasks
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-[#3072C0] h-full rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSidebar; 
