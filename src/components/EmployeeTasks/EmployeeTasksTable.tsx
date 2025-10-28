"use client";

import { format } from "date-fns";
import { File, FileText, Filter, MoreVertical, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeTask } from "@/lib/types/employee-task";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/utils/task-transformer";

interface EmployeeTasksTableProps {
  tasks: EmployeeTask[];
  isLoading?: boolean;
  onDeleteTask?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
}

export default function EmployeeTasksTable({ 
  tasks,
  isLoading,
  onDeleteTask,
  onMarkComplete,
}: EmployeeTasksTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const getPriorityBadgeColor = (priority: string) => {
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

  const getStatusBadgeColor = (status: string) => {
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

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
    // Implement Excel export logic
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    // Implement PDF export logic
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Employee Tasks Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Track, assign, and manage tasks across your organization
          </p>
        </div>
        <Link href="/en/employee-tasks/create">
          <Button  className={cn(
            "cursor-pointer",
            "flex items-center gap-1 sm:gap-2",
            "bg-[#3072C0] rounded-[16px] w-fit sm:w-auto",
            "px-3 sm:px-4 lg:px-6",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </Link>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className={cn(
            "cursor-pointer",
            "flex items-center gap-1 sm:gap-2",
            "bg-card border-border text-xs h-8 sm:h-10",
            "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
          )}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
            {/* Calendar icon placeholder */}
          </Button>
          <Button variant="outline" size="sm" className={cn(
            "cursor-pointer",
            "flex items-center gap-1 sm:gap-2",
            "bg-card border-border text-xs h-8 sm:h-10",
            "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
          )}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className={cn(
              "cursor-pointer",
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
            )}
          >
            <File className="w-4 h-4 mr-2 text-[#2BAE82]" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className={cn(
              "cursor-pointer",
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
            )}
          >
            <FileText className="w-4 h-4 mr-2 text-[#E02215]" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : currentTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              currentTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {task.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{task.assignee.name}</div>
                        <div className="text-xs text-gray-500">{task.assignee.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const today = new Date();
                          const due = new Date(task.dueDate);
                          const diffTime = due.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
                          if (diffDays === 0) return "Due today";
                          return `${diffDays} days left`;
                        })()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getPriorityBadgeColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getStatusBadgeColor(task.status))}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Progress value={task.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium min-w-[35px]">
                        {task.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/en/employee-tasks/${task.id}`} className="cursor-pointer">
                            <svg
                              className="w-4 h-4 mr-2 text-[#3B82F6]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/en/employee-tasks/${task.id}/edit`} className="cursor-pointer">
                            <svg
                              className="w-4 h-4 mr-2 text-[#2BAE82]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          Edit
                          </Link>
                        </DropdownMenuItem>
                        {task.status !== "Completed" && (
                          <DropdownMenuItem
                            onClick={() => onMarkComplete?.(task.id)}
                            className="cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 mr-2 text-[#2BAE82]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          Mark as complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDeleteTask?.(task.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "cursor-pointer",
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
              )}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10",
                  "cursor-pointer",
                  "flex items-center gap-1 sm:gap-2",
                  "bg-card border-border text-xs h-8 sm:h-10",
                  "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
                  currentPage === page && "bg-[#3072C0] text-white hover:bg-[#3072C0]/90",
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "cursor-pointer",
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500 hover:text-[#3072C0]",
                currentPage === totalPages && "bg-[#3072C0] text-white hover:bg-[#3072C0]/90",
              )}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

