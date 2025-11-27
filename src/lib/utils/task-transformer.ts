import { SimpleCategory, SimpleEmployee, TaskResponse } from "@/lib/api/tasks";
import { EmployeeTask } from "@/lib/types/employee-task";

/**
 * Transform TaskResponse from API to EmployeeTask
 */
export function transformTaskResponse(task: TaskResponse, options?: {
  categoriesById?: Record<string, SimpleCategory>;
  employeesById?: Record<string, SimpleEmployee>;
}): EmployeeTask {
  // Calculate progress based on status
  let progress = task.progressPercent ?? 0;
  if (task.progressPercent === undefined || task.progressPercent === null) {
    switch (task.status) {
      case "NotStarted":
        progress = 0;
        break;
      case "InProgress":
        progress = 50;
        break;
      case "AwaitingFeedback":
        progress = 75;
        break;
      case "Completed":
        progress = 100;
        break;
    }
  }

  // Map status to display format
  const statusMap: Record<string, EmployeeTask["status"]> = {
    NotStarted: "NotStarted",
    InProgress: "InProgress",
    AwaitingFeedback: "AwaitingFeedback",
    Completed: "Completed",
  };

  // Map priority to display format
  const priorityMap: Record<string, EmployeeTask["priority"]> = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
    Urgent: "Urgent",
  };
  console.log(options);
  console.log(task);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assignee: {
      id: task.assignee?.id || task.assignedTo || "",
      name:
        task.assignee?.fullName ||
        (options?.employeesById && task.assignedTo ? 
          options.employeesById[task.assignedTo]?.fullName : undefined) ||
        "Unknown",
      email:
        task.assignee?.email ||
        (options?.employeesById && task.assignedTo ? options.employeesById[task.assignedTo]?.email || "" : ""),
    },
    client: task.accountId
      ? {
        id: task.accountId,
        name: task.account?.fullName || "",
      }
      : undefined,
    dueDate: task.dueDate,
    createdDate: task.createdAt,
    priority: priorityMap[task.priority] || "Medium",
    status: statusMap[task.status] || "NotStarted",
    populationStatus: task.populationStatus,
    progress,
    category: {
      id: task.categoryId,
      name:
        task.category?.name ||
        (options?.categoriesById ? options.categoriesById[task.categoryId]?.name : undefined) ||
        "Uncategorized",
    },
    estimatedHours: task.estimatedHours || undefined,
    additionalComments: task.additionalComments || undefined,
  };
}

/**
 * Transform multiple TaskResponse to EmployeeTask array
 */
export function transformTasksResponse(tasks: TaskResponse[], options?: {
  categoriesById?: Record<string, SimpleCategory>;
  employeesById?: Record<string, SimpleEmployee>;
}): EmployeeTask[] {
  return tasks.map((task) => transformTaskResponse(task, options));
}

/**
 * Get status display label
 */
export function getStatusLabel(status: EmployeeTask["status"]): string {
  const labels: Record<EmployeeTask["status"], string> = {
    NotStarted: "Not Started",
    InProgress: "In Progress",
    AwaitingFeedback: "Awaiting Feedback",
    Completed: "Completed",
  };
  return labels[status] || status;
}

/**
 * Get priority display label
 */
export function getPriorityLabel(priority: EmployeeTask["priority"]): string {
  return priority;
}

