import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  createTask,
  CreateTaskDTO,
  deleteTask,
  getTaskById,
  getTasks,
  getTasksOverview,
  markTaskAsComplete,
  TasksCalendarFilters,
  updateTask,
  UpdateTaskDTO,
} from "@/lib/api/tasks";

/**
 * Hook to fetch all tasks with filters
 */
export function useTasks(filters?: TasksCalendarFilters) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch tasks overview/statistics
 */
export function useTasksOverview() {
  return useQuery({
    queryKey: ["tasks", "overview"],
    queryFn: getTasksOverview,
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task");
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) =>
      updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
}

/**
 * Hook to mark task as complete
 */
export function useMarkTaskAsComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markTaskAsComplete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
      toast.success("Task marked as complete");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark task as complete");
    },
  });
}

