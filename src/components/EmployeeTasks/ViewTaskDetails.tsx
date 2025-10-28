"use client";

import { format } from "date-fns";
import { File } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmployeeTask } from "@/lib/types/employee-task";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/utils/task-transformer";

interface ViewTaskDetailsProps {
  task: EmployeeTask;
}

export default function ViewTaskDetails({ task }: ViewTaskDetailsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-[#E0221514] text-[#E02215] hover:bg-[#E0221514]";
      case "High":
        return "bg-[#EA3B1F14] text-[#E02215] hover:bg-[#EA3B1F14]";
      case "Medium":
        return "bg-[#ECA33814] text-[#F7C649] hover:bg-[#ECA33814]";
      case "Low":
        return "bg-[#2BAE8229] text-[#175E46] hover:bg-[#2BAE8229]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-[#2BAE8229] text-[#175E46] hover:bg-[#2BAE8229]";
      case "InProgress":
        return "bg-[#3B82F614] text-[#3B82F6] hover:bg-[#3B82F614]";
      case "AwaitingFeedback":
        return "bg-[#ECA33814] text-[#F7C649] hover:bg-[#ECA33814]";
      case "NotStarted":
        return "bg-[#A0AEBA14] text-[#A0AEBA] hover:bg-[#A0AEBA14]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes("Completed")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#2BAE8229] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#2BAE82]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
    if (action.includes("Progress")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#3B82F614] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    }
    if (action.includes("Files")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#C99DDD29] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#C99DDD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-[#ECA33814] flex items-center justify-center">
        <svg className="w-4 h-4 text-[#ECA338]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-5 h-5 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>&gt;</span>
        <Link href="/en/employee-tasks" className="text-primary hover:underline">
          Employee Tasks Management
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 dark:text-white">Task Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {task.taskTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {task.taskDescription}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <File className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Status</span>
              <Badge className={cn("text-xs", getStatusColor(task.status))}>
                {getStatusLabel(task.status)}
              </Badge>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Priority</span>
              <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                {task.priority} Priority
              </Badge>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Due Date</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </span>
            </div>

            {/* Created Date */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Created Date</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {format(new Date(task.createdDate), "MMM dd, yyyy")}
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Category</span>
              <span className="text-gray-900 dark:text-white font-medium">{task.category.name}</span>
            </div>

            {/* Estimated Hours */}
            {task.estimatedHours && (
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Estimated Hours
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {task.estimatedHours} Hours
                </span>
              </div>
            )}

            {/* Actual Hours */}
            {task.actualHours && (
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Actual Hours</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {task.actualHours} Hours
                </span>
              </div>
            )}

            {/* Progress */}
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                <span className="text-[#2BAE82] font-semibold">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Right Column - Assignee and Activity */}
        <div className="space-y-6">
          {/* Assignee Card */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Assignee
            </h3>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {task.assignee.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {task.assignee.department}
                </div>
                <div className="text-sm text-gray-500">{task.assignee.email}</div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          {task.activityLog && task.activityLog.length > 0 && (
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Activity Log
              </h3>
              <div className="space-y-4">
                {task.activityLog.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    {getActivityIcon(log.action)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {log.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), "MMM dd, yyyy - h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

