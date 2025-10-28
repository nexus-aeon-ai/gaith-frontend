"use client";

import { useDeleteTask, useMarkTaskAsComplete, useTasks } from "@/hooks/use-tasks";
import { transformTasksResponse } from "@/lib/utils/task-transformer";

import EmployeeTasksTable from "./EmployeeTasksTable";

export default function EmployeeTasksClient() {
  const { data: tasksData, isLoading } = useTasks();
  const deleteMutation = useDeleteTask();
  const markCompleteMutation = useMarkTaskAsComplete();

  const tasks = tasksData ? transformTasksResponse(tasksData) : [];

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleMarkComplete = (taskId: string) => {
    markCompleteMutation.mutate(taskId);
  };

  return (
    <EmployeeTasksTable
      tasks={tasks}
      isLoading={isLoading}
      onDeleteTask={handleDeleteTask}
      onMarkComplete={handleMarkComplete}
    />
  );
}

