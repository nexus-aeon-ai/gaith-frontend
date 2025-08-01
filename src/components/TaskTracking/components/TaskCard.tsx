import { format } from "date-fns";
import { Building, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="mb-4 bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          </div>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(task.status)}`}>
              {task.status}
            </Badge>
            <Badge className={`${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{task.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#78A7DD]" />
            <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-[#78A7DD]" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className="w-4 h-4 text-[#78A7DD]" />
            <span>{task.client}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 border border-gray-300 dark:border-gray-600">
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
