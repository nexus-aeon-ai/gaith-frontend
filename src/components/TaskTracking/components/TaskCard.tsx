import { format } from "date-fns";
import { Building, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        return "bg-[#404663] text-[#CACCD6]";
      case "Completed":
        return "bg-[#2BAE8229] text-[#175E46]";
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
        return "bg-[#2BAE8229] text-[#175E46]";
      default:
        return "bg-[#2BAE8229] text-[#175E46]";
    }
  };

  return (
    <Card className={cn(
      "mb-2 sm:mb-3 lg:mb-4 bg-card border-border",
    )}>
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-start justify-between",
          "gap-2 sm:gap-3 mb-2 sm:mb-3",
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <input 
              type="checkbox" 
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0",
              )} 
            />
            <h3 className={cn(
              "font-semibold text-gray-900 dark:text-white",
              "text-sm sm:text-base truncate",
            )}>
              {task.title}
            </h3>
          </div>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <Badge className={cn(getStatusColor(task.status), "text-xs")}>
              {task.status}
            </Badge>
            <Badge className={cn(getPriorityColor(task.priority), "text-xs")}>
              {task.priority}
            </Badge>
          </div>
        </div>
        
        <p className={cn(
          "text-gray-600 dark:text-gray-300 text-xs sm:text-sm",
          "mb-2 sm:mb-3 line-clamp-2",
        )}>
          {task.description}
        </p>
        
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
          "text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3",
        )}>
          <div className="flex items-center gap-1">
            <Clock className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 text-[#78A7DD] flex-shrink-0",
            )} />
            <span className="truncate">Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 text-[#78A7DD] flex-shrink-0",
            )} />
            <span className="truncate">{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 text-[#78A7DD] flex-shrink-0",
            )} />
            <span className="truncate">{task.client}</span>
          </div>
        </div>
        
        <div className="mb-2 sm:mb-3">
          <div className={cn(
            "flex justify-between text-xs sm:text-sm mb-1",
          )}>
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">{task.progress}%</span>
          </div>
          <div className={cn(
            "w-full bg-gray-200 dark:bg-gray-700 rounded-full",
            "h-1.5 sm:h-2 border border-gray-300 dark:border-gray-600",
          )}>
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${task.progress}%`,
                backgroundColor: task.status === "Completed" ? "#2BAE82" : task.status === "In Progress" ? "#ECA338" : "#3B82F6",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 
