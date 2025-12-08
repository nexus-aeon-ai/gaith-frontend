"use client";

import { useCallback, useState } from "react";

import FilterSheet from "@/components/sheet/Filter";
import { useDeleteTask, useMarkTaskAsComplete, useTasks } from "@/hooks/use-tasks";
import { TasksCalendarFilters } from "@/lib/api/tasks";
import { transformTasksResponse } from "@/lib/utils/task-transformer";

import EmployeeTasksTable from "./EmployeeTasksTable";

export default function EmployeeTasksClient() {
  const [filters, setFilters] = useState<TasksCalendarFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: tasksData, isLoading } = useTasks(filters);
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

  const handleFiltersChange = useCallback((next: TasksCalendarFilters) => {
    setFilters((prev) => {
      const prevStr = JSON.stringify(prev || {});
      const nextStr = JSON.stringify(next || {});
      if (prevStr === nextStr) return prev;
      return next;
    });
    setIsFilterOpen(false);
  }, []);

  return (
    <>
      <EmployeeTasksTable
        tasks={tasks}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenFilters={() => setIsFilterOpen(true)}
        onDeleteTask={handleDeleteTask}
        onMarkComplete={handleMarkComplete}
      />
      <FilterSheet open={isFilterOpen} onOpenChange={setIsFilterOpen} 
        value={filters as any} onApply={handleFiltersChange as any}
      />
    </>
  );
}

