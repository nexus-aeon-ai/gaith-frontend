"use client";

import { format } from "date-fns";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import { Progress } from "@/components/ui/progress";
import { EmployeeTask } from "@/lib/types/employee-task";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/utils/task-transformer";

interface ViewTaskDetailsProps {
  task: EmployeeTask;
}

const activityLog = [
  {
    id: "1",
    action: "Task Completed",
    timestamp: "2023-08-01",
    description: "Completed task description",
  },
  {
    id: "2",
    action: "Progress Updated To 90%",
    timestamp: "2023-08-02",
    description: "Progress update description",
  },
  {
    id: "3",
    action: "Files Added",
    timestamp: "2023-08-03",
    description: "Files uploaded description",
  },
  {
    id: "4",
    action: "Task Started",
    timestamp: "2023-08-04",
    description: "Comment added description",
  },
];

export default function ViewTaskDetails({ task }: ViewTaskDetailsProps) {
  const getActivityIcon = (action: string) => {
    if (action.includes("Completed")) {
      return (
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="35" height="35" rx="17.5" fill="#2BAE82" fillOpacity="0.08" />
          <path
            opacity="0.4"
            d="M17.5002 24.1673C21.1821 24.1673 24.1668 21.1825 24.1668 17.5007C24.1668 13.8188 21.1821 10.834 17.5002 10.834C13.8183 10.834 10.8335 13.8188 10.8335 17.5007C10.8335 21.1825 13.8183 24.1673 17.5002 24.1673Z"
            fill="#2BAE82"
          />
          <path
            d="M16.5535 19.8858C16.4201 19.8858 16.2935 19.8324 16.2001 19.7391L14.3135 17.8524C14.1201 17.6591 14.1201 17.3391 14.3135 17.1458C14.5068 16.9524 14.8268 16.9524 15.0201 17.1458L16.5535 18.6791L19.9801 15.2524C20.1735 15.0591 20.4935 15.0591 20.6868 15.2524C20.8801 15.4458 20.8801 15.7658 20.6868 15.9591L16.9068 19.7391C16.8135 19.8324 16.6868 19.8858 16.5535 19.8858Z"
            fill="#2BAE82"
          />
        </svg>
      );
    }
    if (action.includes("Progress")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#3B82F614] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M14 14.666H2C1.72667 14.666 1.5 14.4393 1.5 14.166C1.5 13.8927 1.72667 13.666 2 13.666H14C14.2733 13.666 14.5 13.8927 14.5 14.166C14.5 14.4393 14.2733 14.666 14 14.666Z"
              fill="#A0AEBA"
            />
            <path
              opacity="0.4"
              d="M12.6799 2.32043C11.3866 1.0271 10.1199 0.993764 8.79322 2.32043L7.98655 3.1271C7.91989 3.19376 7.89322 3.30043 7.91989 3.39376C8.42655 5.16043 9.83989 6.57376 11.6066 7.08043C11.6332 7.0871 11.6599 7.09376 11.6866 7.09376C11.7599 7.09376 11.8266 7.0671 11.8799 7.01376L12.6799 6.2071C13.3399 5.55376 13.6599 4.92043 13.6599 4.28043C13.6666 3.62043 13.3466 2.98043 12.6799 2.32043Z"
              fill="#3072C0"
            />
            <path
              d="M10.407 7.68654C10.2137 7.5932 10.027 7.49987 9.84704 7.3932C9.70038 7.30654 9.56038 7.2132 9.42038 7.1132C9.30704 7.03987 9.17371 6.9332 9.04704 6.82654C9.03371 6.81987 8.98704 6.77987 8.93371 6.72654C8.71371 6.53987 8.46704 6.29987 8.24704 6.0332C8.22704 6.01987 8.19371 5.9732 8.14704 5.9132C8.08038 5.8332 7.96704 5.69987 7.86704 5.54654C7.78704 5.44654 7.69371 5.29987 7.60704 5.1532C7.50038 4.9732 7.40704 4.7932 7.31371 4.60654C7.22038 4.40654 7.14704 4.2132 7.08038 4.0332L2.89371 8.21987C2.80704 8.30654 2.72704 8.4732 2.70704 8.58654L2.34704 11.1399C2.28038 11.5932 2.40704 12.0199 2.68704 12.3065C2.92704 12.5399 3.26038 12.6665 3.62038 12.6665C3.70038 12.6665 3.78038 12.6599 3.86038 12.6465L6.42038 12.2865C6.54038 12.2665 6.70704 12.1865 6.78704 12.0999L10.9737 7.9132C10.787 7.84654 10.607 7.7732 10.407 7.68654Z"
              fill="#3072C0"
            />
          </svg>
        </div>
      );
    }
    if (action.includes("Files")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#C99DDD29] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M8.00016 14.6673C11.6821 14.6673 14.6668 11.6825 14.6668 8.00065C14.6668 4.31875 11.6821 1.33398 8.00016 1.33398C4.31826 1.33398 1.3335 4.31875 1.3335 8.00065C1.3335 11.6825 4.31826 14.6673 8.00016 14.6673Z"
              fill="#853AA6"
            />
            <path
              d="M8.13302 11.586C7.66635 11.586 7.19301 11.406 6.83968 11.0526C6.49301 10.706 6.29968 10.246 6.29968 9.75931C6.29968 9.27264 6.49301 8.80597 6.83968 8.46597L7.77966 7.52597C7.973 7.33264 8.29299 7.33264 8.48633 7.52597C8.67966 7.71931 8.67966 8.0393 8.48633 8.23264L7.54635 9.17264C7.38635 9.33264 7.29968 9.53931 7.29968 9.75931C7.29968 9.97931 7.38635 10.1926 7.54635 10.346C7.87301 10.6726 8.39969 10.6726 8.72636 10.346L10.2063 8.86596C11.053 8.01929 11.053 6.64598 10.2063 5.79931C9.35967 4.95264 7.98636 4.95264 7.13969 5.79931L5.52633 7.41263C5.18633 7.75263 4.99967 8.19931 4.99967 8.67264C4.99967 9.14597 5.18633 9.5993 5.52633 9.93263C5.71966 10.126 5.71966 10.446 5.52633 10.6393C5.33299 10.8326 5.01299 10.8326 4.81966 10.6393C4.29299 10.1126 4.00635 9.41263 4.00635 8.66597C4.00635 7.9193 4.29299 7.21931 4.81966 6.69264L6.43302 5.0793C7.66636 3.84596 9.67967 3.84596 10.913 5.0793C12.1463 6.31263 12.1463 8.32596 10.913 9.5593L9.43302 11.0393C9.07302 11.406 8.60635 11.586 8.13302 11.586Z"
              fill="#853AA6"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-[#ECA33814] flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M7.98014 14.6673C11.662 14.6673 14.6468 11.6825 14.6468 8.00065C14.6468 4.31875 11.662 1.33398 7.98014 1.33398C4.29824 1.33398 1.31348 4.31875 1.31348 8.00065C1.31348 11.6825 4.29824 14.6673 7.98014 14.6673Z"
            fill="#D29A09"
          />
          <path
            d="M9.98024 6.81943L8.0469 5.70609C7.5669 5.42609 6.9869 5.42609 6.5069 5.70609C6.0269 5.98609 5.74023 6.47943 5.74023 7.03943V9.27276C5.74023 9.82609 6.0269 10.3261 6.5069 10.6061C6.7469 10.7461 7.01357 10.8128 7.27357 10.8128C7.54023 10.8128 7.80024 10.7461 8.04024 10.6061L9.97357 9.49276C10.4536 9.21276 10.7402 8.71943 10.7402 8.15943C10.7536 7.59943 10.4669 7.09943 9.98024 6.81943Z"
            fill="#D29A09"
          />
        </svg>
      </div>
    );
  };

  console.log("single task:", task);

  return (
    <div className="w-full space-y-6 font-inter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {task.description}
          </p>
        </div>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-1 sm:gap-2 ",
            "bg-card border-border text-xs h-auto",
            "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
          )}
        >
          <ExcelIcon className="!w-6 !h-6" />
          <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
          <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 bg-card border-border p-3 shadow-sm rounded-[16px]">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-[#F3F5F7] rounded-lg dark:border-[#404663] border border-border shadow-sm p-6 pt-2 dark:bg-[#0F1B29] space-y-2 h-full">
            {/* Status */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Status</span>
              <Badge
                //  className={cn("text-xs", getStatusColor(task.status))}
                className="text-xs dark:bg-[#2BAE8229] dark:text-[#68DAB3] bg-[#2BAE8214] text-[#175E46] p-2 pointer-events-none rounded-[8px]"
              >
                {getStatusLabel(task.status)}
              </Badge>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Priority</span>
              <Badge
                // className={cn("text-xs", getPriorityColor(task.priority))}
                className="text-xs dark:bg-[#2BAE8229] dark:text-[#68DAB3] bg-[#2BAE8214] text-[#175E46] p-2 pointer-events-none rounded-[8px]"
              >
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
              <span className="text-gray-900 dark:text-white font-medium">
                {task.category.name}
              </span>
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
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                <span className="text-[#2BAE82] font-semibold">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="mt-2 h-2 bg-gray-400" />
            </div>
          </div>
        </div>

        {/* Right Column - Assignee and Activity */}
        <div className="flex flex-col space-y-3 h-full">
          {/* Assignee Card */}
          <div className="bg-[#F3F5F7] dark:bg-[#0F1B29] dark:border-[#404663] rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-lg border-b pb-2 font-semibold text-gray-900 dark:text-white mb-4">
              Assignee
            </h3>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={"/images/girl-avatar.jpg"}
                  alt={task.assignee.name}
                  className=""
                />
                <AvatarFallback className="bg-gray-400">
                  {task.assignee.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-[2px]">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {task.assignee.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{task.category.name}</div>
                <div className="text-sm text-gray-500">{task.assignee.email}</div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="flex-1 flex flex-col bg-[#F3F5F7] dark:bg-[#0F1B29] dark:border-[#404663] rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-lg border-b pb-1 font-semibold text-gray-900 dark:text-white mb-4">
              Activity Log
            </h3>
            <div className="space-y-4">
              {activityLog.map(log => (
                <div key={log.id} className="flex gap-3">
                  {getActivityIcon(log.action)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{log.action}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(log.timestamp), "MMM dd, yyyy - h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
