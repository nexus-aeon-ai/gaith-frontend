"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import ViewTaskDetails from "@/components/EmployeeTasks/ViewTaskDetails";
import { useTask } from "@/hooks/use-tasks";
import { getAllCategories, getClientById, getUserById } from "@/lib/api/tasks";
import { transformTaskResponse } from "@/lib/utils/task-transformer";

interface TaskDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const resolvedParams = use(params);
  const { data: taskData, isLoading } = useTask(resolvedParams.id);
  // Fetch auxiliary info only when we have a compact payload
  const { data: categories } = useQuery({
    queryKey: ["task-categories"],
    queryFn: getAllCategories,
  });

  const { data: assignee } = useQuery({
    queryKey: ["employee", taskData?.assignedTo],
    queryFn: () => getUserById(String(taskData?.assignedTo)),
    enabled: !!taskData?.assignedTo,
  });

  const { data: account } = useQuery({
    queryKey: ["client", taskData?.accountId],
    queryFn: () => getClientById(String(taskData?.accountId)),
    enabled: !!taskData?.accountId,
  });

  const categoriesById = useMemo(() => {
    if (!categories) return undefined;
    return categories.reduce<Record<string, {
      id: string; name: string; color: string }>>((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {});
  }, [categories]);

  const employeesById = useMemo(() => {
    const map: Record<string, { id: string; fullName: string; email?: string }> = {};
    if (assignee) map[assignee.id] = assignee;
    if (account) map[account.id] = { id: account.id, fullName: account.clientName };
    return Object.keys(map).length ? map : undefined;
  }, [assignee, account]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!taskData) {
    notFound();
  }

  const task = transformTaskResponse(taskData, { categoriesById, employeesById });

  return (
    <div className="p-6">
      <ViewTaskDetails task={task} />
    </div>
  );
}

