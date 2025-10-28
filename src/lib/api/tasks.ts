import { fetchInstance } from "../clients";

export interface CreateTaskDTO {
  title: string;
  description: string;
  dueDate: string;
  category: string;
  status: "NotStarted" | "InProgress" | "AwaitingFeedback" | "Completed";
  populationStatus: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedTo: string;
  accountId?: string;
  estimatedHours?: number;
  additionalComments?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  category?: string;
  status?: "NotStarted" | "InProgress" | "AwaitingFeedback" | "Completed";
  populationStatus?: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  assignedTo?: string;
  accountId?: string;
  estimatedHours?: number;
  additionalComments?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  categoryId: string;
  status: "NotStarted" | "InProgress" | "AwaitingFeedback" | "Completed";
  populationStatus: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  priority: "Low" | "Medium" | "High" | "Urgent";
  accountId: string | null;
  assignedTo: string;
  estimatedHours: number | null;
  additionalComments: string | null;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  account?: {
    id: string;
    fullName: string;
  };
  assignee: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface TasksByDayResponse {
  days: {
    date: string;
    tasks: TaskResponse[];
  }[];
}

export interface TasksCalendarFilters {
  startDate?: string;
  endDate?: string;
  status?: "NotStarted" | "InProgress" | "AwaitingFeedback" | "Completed";
  populationStatus?: "Draft" | "Review" | "SentToClient" | "ApprovedByClient";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  categoryId?: string;
  accountId?: string;
  assignedTo?: string;
  q?: string;
}

export interface TasksOverview {
  total: number;
  notStarted: number;
  inProgress: number;
  awaitingFeedback: number;
  completed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdueTasks: number;
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskDTO): Promise<TaskResponse> {
  const response = await fetchInstance<TaskResponse>("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200 && response.status !== 201 || !response.data) {
    throw new Error("Failed to create task");
  }

  return response.data;
}

/**
 * Get tasks with filters (calendar view)
 * Returns tasks grouped by day, then flattens them into a single array
 */
export async function getTasks(filters?: TasksCalendarFilters): Promise<TaskResponse[]> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const url = `/tasks${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetchInstance<TasksByDayResponse>(url, {
    method: "GET",
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch tasks");
  }

  // Flatten the days array to get all tasks
  const allTasks = response.data?.days.flatMap((day) => day.tasks) || [];
  return allTasks;
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<TaskResponse> {
  const response = await fetchInstance<TaskResponse>(`/tasks/${id}`, {
    method: "GET",
  });

  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch task");
  }

  return response.data;
}

/**
 * Update a task
 */
export async function updateTask(id: string, data: UpdateTaskDTO): Promise<TaskResponse> {
  const response = await fetchInstance<TaskResponse>(`/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to update task");
  }

  return response.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  const response = await fetchInstance<void>(`/tasks/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 200 && response.status !== 204) {
    throw new Error("Failed to delete task");
  }
}

/**
 * Get tasks overview/statistics
 */
export async function getTasksOverview(): Promise<TasksOverview> {
  const response = await fetchInstance<TasksOverview>("/tasks/overview", {
    method: "GET",
  });

  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch tasks overview");
  }

  return response.data;
}

/**
 * Mark task as complete
 */
export async function markTaskAsComplete(id: string): Promise<TaskResponse> {
  return updateTask(id, { status: "Completed" });
}

