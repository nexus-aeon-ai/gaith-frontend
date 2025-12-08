
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
  progressPercent?: number;
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
  progressPercent?: number;
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
  progressPercent: number;
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

export interface TasksOverviewCategory {
  id: string;
  name: string;
  color: string; // hex color
  count: number;
  stages: Record<string, number>;
}

export interface TasksOverviewStatusBucket {
  status: "NotStarted" | "InProgress" | "AwaitingFeedback" | "Completed";
  count: number;
}

export interface TasksOverview {
  totals: {
    all: number;
    completed: number;
  };
  completionRate: number;
  categories: TasksOverviewCategory[];
  statusBreakdown: TasksOverviewStatusBucket[];
}

// Shared minimal types for enrichment
export interface SimpleCategory {
  id: string;
  name: string;
  color: string;
  count?: number;
  stages?: Record<string, number>;
}

export interface SimpleEmployee {
  id: string;
  fullName: string;
  email?: string;
}

export interface SimpleClient {
  id: string;
  clientName: string;
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
  console.log("Create Task Response:", response);
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

/**
 * Fetch categories list to enrich minimal task payloads
 */
export async function getAllCategories(): Promise<SimpleCategory[]> {
  const response = await fetchInstance<SimpleCategory[]>("/utils/categories", {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
}

/**
 * Create a new category
 */
export async function createCategory(data: { name: string; color: string }): Promise<SimpleCategory> {
  const response = await fetchInstance<SimpleCategory>("/utils/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to create category");
  }

  if (!response.data) {
    throw new Error("Create category returned empty response");
  }

  return response.data;
}

/**
 * Fetch employee by id (used to enrich account info in minimal payloads)
 */
export async function getUserById(id: string): Promise<SimpleEmployee> {
  const response = await fetchInstance<SimpleEmployee>(`/users/${id}`, {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch user");
  }
  return response.data;
}

/**
 * Fetch client by id
 */
export async function getClientById(id: string): Promise<SimpleClient> {
  const response = await fetchInstance<SimpleClient>(`/clients/${id}`, {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch client");
  }
  return response.data;
}

/**
 * Fetch all users (for select options)
 */
export async function getAllUsers(): Promise<SimpleEmployee[]> {
  const response = await fetchInstance<SimpleEmployee[]>("/users", {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
}

/**
 * Fetch all clients (for select options)
 */
export async function getAllClients(): Promise<SimpleClient[]> {
  const response = await fetchInstance<SimpleClient[]>("/clients", {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch clients");
  }
  return response.data;
}

/**
 * Fetch all employees (assignees)
 */

export interface BackendEmployee {
  id: string;
  user: {
    fullName: string;
  };
}
export async function getAllEmployees(): Promise<BackendEmployee[]> {
  const response = await fetchInstance<BackendEmployee[]>("/employees", {
    method: "GET",
  });
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch employees");
  }
  return (response.data as any).data;
}

