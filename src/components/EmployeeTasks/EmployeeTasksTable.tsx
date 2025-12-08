"use client";

import { format } from "date-fns";
import { ArrowDown, ArrowUp, CirclePlus, DeleteIcon, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
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
import { TasksCalendarFilters } from "@/lib/api/tasks";
import { EmployeeTask } from "@/lib/types/employee-task";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/utils/task-transformer";

interface EmployeeTasksTableProps {
  tasks: EmployeeTask[];
  isLoading?: boolean;
  filters?: TasksCalendarFilters;
  onFiltersChange?: (f: TasksCalendarFilters) => void;
  onOpenFilters?: () => void;
  onDeleteTask?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
}

export default function EmployeeTasksTable({
  tasks,
  isLoading,
  filters,
  onFiltersChange,
  onOpenFilters,
  onDeleteTask,
  onMarkComplete,
}: EmployeeTasksTableProps) {
  const [searchQuery, setSearchQuery] = useState(filters?.q ?? "");

  // Debounce search -> backend filter
  useEffect(() => {
    const t = setTimeout(() => {
      onFiltersChange?.({ ...(filters || {}), q: searchQuery || undefined });
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery, filters, onFiltersChange]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ascending/Descending sorting for tasks
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedTasks, setSortedTasks] = useState(tasks);

  const handleSortByName = () => {
    console.log("sorting");
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...sortedTasks].sort((a, b) => {
      const nameA = a?.title.toLowerCase();
      const nameB = b?.title.toLowerCase();
      if (newOrder === "asc") return nameA.localeCompare(nameB);
      else return nameB.localeCompare(nameA);
    });

    setSortedTasks(sorted);
  };

  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  // Backend-driven filtering: use server results; client search only updates filter `q`
  const filteredTasks = sortedTasks;

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const { theme } = useTheme();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectCampaign = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => (checked ? [...prev, taskId] : prev.filter(id => id !== taskId)));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-start",
          "gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-4 lg:mb-2",
        )}
      >
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Employee Tasks Management
          </h1>
          <p className={cn("text-xs sm:text-sm md:text-base", "text-gray-600 dark:text-gray-300")}>
            Track, assign, and manage tasks across your organization
          </p>
        </div>
        <Link href="/en/employee-tasks/create">
          <Button
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-[#3072C0] rounded-2xl w-full sm:w-auto",
              "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12  lg:w-42",
              "hover:bg-blue-700 text-white",
              "text-xs sm:text-sm lg:text-base",
            )}
          >
            <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add New Task</span>
            <span className="sm:hidden">Add Task</span>
          </Button>
        </Link>
      </div>

      {/* Search and Actions */}
      <div
        className={cn(" items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}
      >
        <div
          className={cn(
            "flex flex-col lg:flex-row items-start lg:items-center justify-between ",
            "gap-2 sm:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search employee tasks"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 xl:min-w-[350px] md:min-w-[250px] min-w-[100px]"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 ",
                    "bg-card border-border text-xs h-auto",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500 rounded-[16px]",
                  )}
                >
                  <MenuIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onClick={() => {}}>
                  <DeleteIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500 rounded-[16px] ",
              )}
              onClick={() => onOpenFilters?.()}
            >
              <FilterIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
              )}
              onClick={handleExportExcel}
            >
              <ExcelIcon />
              <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
              <span className=" dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px]",
              )}
              onClick={handleExportPDF}
            >
              <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
              <span className=" dark:text-white text-gray-900">PDF</span>
            </Button>
          </div>
        </div>
        {/* <ClientFilterSheet onOpenChange={setIsFilterSheetOpen} open={showFilterSheet} /> */}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="dark:bg-[#06080F] dark:border-b-[#404663]">
              <TableHead className="w-12">
                <CheckboxSquare
                  checked={
                    selectedTasks.length === filteredTasks.length && filteredTasks.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]" onClick={handleSortByName}>
                <div className="flex items-center gap-1">
                  Task
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]">Assignee</TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]">Due Date</TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]">Priority</TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]">Status</TableHead>
              <TableHead className="text-[#303444] dark:text-[#CCCFDB]">Progress</TableHead>
              <TableHead className="text-right text-[#303444] dark:text-[#CCCFDB]">
                Actions
              </TableHead>
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
              currentTasks.map(task => (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <CheckboxSquare
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={checked => handleSelectCampaign(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px]">
                        {task.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-11 h-11">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map(n => n[0])
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
                      <span className="text-sm font-medium min-w-[35px]">{task.progress}%</span>
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
                          <Link
                            href={`/en/employee-tasks/${task.id}/edit`}
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
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of{" "}
            {filteredTasks.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
