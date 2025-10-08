import { fetchInstance } from "../clients";
import type { IResponse } from "../types/general";

const tasksEndpoint = "/tasks";

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  status: "NotStarted" | "InProgress" | "Completed" | string;
  populationStatus: "Draft" | "Published" | string;
  priority: "Low" | "Medium" | "High" | string;
  assignedTo: string;
  accountId: string; 
  estimatedHours: number;
  additionalComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create task
export const createTask = async (
  task: Omit<ITask, "id" | "createdAt" | "updatedAt">,
): Promise<IResponse<ITask>> => {
  const response = await fetchInstance(tasksEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response as IResponse<ITask>;
};

// Read - get all tasks
export const getTasks = async (): Promise<IResponse<ITask[]>> => {
  const response = await fetchInstance(tasksEndpoint, {
    method: "GET",
  });
  return response as IResponse<ITask[]>;
};

// Read - get task by ID
export const getTaskById = async (id: string): Promise<IResponse<ITask>> => {
  const response = await fetchInstance(`${tasksEndpoint}${id}/`, {
    method: "GET",
  });
  return response as IResponse<ITask>;
};

// Update task
export const updateTask = async (
  id: string,
  task: Partial<Omit<ITask, "id" | "createdAt" | "updatedAt">>,
): Promise<IResponse<ITask>> => {
  const response = await fetchInstance(`${tasksEndpoint}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response as IResponse<ITask>;
};

// Delete task
export const deleteTask = async (id: string): Promise<IResponse<unknown>> => {
  const response = await fetchInstance(`${tasksEndpoint}${id}/`, {
    method: "DELETE",
  });
  return response as IResponse<unknown>;
};
