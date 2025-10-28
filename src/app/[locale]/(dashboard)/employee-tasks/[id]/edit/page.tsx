"use client";

import { notFound } from "next/navigation";
import { use } from "react";

import EditTaskForm from "@/components/EmployeeTasks/EditTaskForm";
import { useTask } from "@/hooks/use-tasks";
import { transformTaskResponse } from "@/lib/utils/task-transformer";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const resolvedParams = use(params);
  const { data: taskData, isLoading } = useTask(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!taskData) {
    notFound();
  }

  const task = transformTaskResponse(taskData);

  return (
    <div className="p-6">
      <EditTaskForm task={task} />
    </div>
  );
}

