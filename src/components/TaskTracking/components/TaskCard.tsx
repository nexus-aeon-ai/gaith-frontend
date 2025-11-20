import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import CalendarOuline from "@/components/ui/icons/options/calendar-outline";
import PersonIcon from "@/components/ui/icons/person";
import {PricingIcon} from "@/components/ui/icons/sidebar/pricing";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  client: string;
  status: string;
  priority: string;
  progress: number;
  category: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-[#ECA33814] text-[#F7C649]";
      case "Not Started":
        return "bg-[#DCE0E4] text-[#687192] dark:text-[#CACCD6] dark:bg-[#404663]";
      case "Completed":
        return "bg-[#2BAE8229] text-[#175E46] dark:text-[#68DAB3] dark:bg-[#2BAE8229]";
      default:
        return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-[#EA3B1F14] text-[#E02215]";
      case "Medium":
        return "bg-[#ECA33814] text-[#F7C649]";
      case "Low":
         return "bg-[#2BAE8229] text-[#175E46] dark:text-[#68DAB3] dark:bg-[#2BAE8229]";
      default:
        return "bg-[#2BAE8229] text-[#175E46]";
    }
  };

  return (
    <Card className={cn("mb-3 bg-card border-border")}>
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex sm:flex-row flex-col gap-2">
          <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 mt-[2px] data-[state=checked]:border-none data-[state=checked]:text-[#3072C0]" />

          <div className="w-full">
            <div
              className={cn(
                "flex flex-col sm:flex-row sm:items-start justify-between",
                "gap-2 sm:gap-3 mb-2 sm:mb-3",
              )}
            >
              <div className="flex items-center gap-2 min-w-0 ">
                <h3
                  className={cn(
                    "font-semibold text-gray-900 dark:text-white",
                    "text-sm sm:text-base truncate",
                  )}
                >
                  {task.title}
                </h3>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <Badge className={cn(getStatusColor(task.status), "text-xs pointer-events-none p-1 px-3 rounded-md")}>{task.status}</Badge>
                <Badge className={cn(getPriorityColor(task.priority), "text-xs pointer-events-none p-1 px-3 rounded-md")}>
                  {task.priority}
                </Badge>
              </div>
            </div>

            <p
              className={cn(
                "text-gray-600 dark:text-gray-300 text-xs sm:text-sm",
                "mb-2 sm:mb-3 line-clamp-2",
              )}
            >
              {task.description}
            </p>

            <div
              className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
                "text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3",
              )}
            >
              <div className="flex items-center gap-1">
                <CalendarOuline className="text-[#78A7DD]"/>
                <span className="truncate">
                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <PersonIcon className={cn("w-5 h-5 text-[#78A7DD] flex-shrink-0")} />
                <span className="truncate">{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <PricingIcon className=" text-[#78A7DD] w-5 h-5" />
                <span className="truncate">{task.client}</span>
              </div>
            </div>

            <div className="mb-2 sm:mb-3">
              <div className={cn("flex justify-between text-xs sm:text-sm mb-1")}>
                <span className="text-[#303444] dark:text-[#CCCFDB] font-semibold">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{task.progress}%</span>
              </div>
              <div
                className={cn(
                  "w-full bg-gray-200 dark:bg-gray-700 rounded-full",
                  "h-1.5 sm:h-2 border border-gray-300 dark:border-gray-600",
                )}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor:
                      task.status === "Completed"
                        ? "#2BAE82"
                        : task.status === "In Progress"
                          ? "#ECA338"
                          : "#3B82F6",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
