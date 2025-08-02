"use client";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { cn } from "../../lib/utils";

import { AddCategoryModal, AddTaskModal } from "./add-modal";
import TaskCalendar from "./components/TaskCalendar";
import TaskCard from "./components/TaskCard";
import TaskFilters from "./components/TaskFilters";
import TaskSidebar from "./components/TaskSidebar";
import { categories, Category, getNextTaskId, mockTasks, NewCategory, statuses, Task, updateCategoryCounts } from "./data/taskData";
import { CancelConfirmModal, CanceledModal, SuccessModal } from "./pop-modal";

const TaskTrackingClient = () => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Social Media Calendar");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025
  
  // State for tasks and categories
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);

  // Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);
  const [isCanceledModalOpen, setIsCanceledModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"task" | "category">("task");

  // Grouped tasks modal state
  const [isGroupedTasksModalOpen, setIsGroupedTasksModalOpen] = useState(false);
  const [groupedTasks, setGroupedTasks] = useState<Task[]>([]);
  const [groupedTasksDate, setGroupedTasksDate] = useState<string>("");

  // Function to add a new task
  const addTask = (taskData: any) => {
    const task: Task = {
      id: getNextTaskId(tasks),
      ...taskData,
      progress: taskData.status === "Completed" ? 100 : taskData.status === "In Progress" ? 50 : 0,
    };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, task];
      // Update category counts
      setCategoriesList(prevCategories => updateCategoryCounts(updatedTasks, prevCategories));
      return updatedTasks;
    });
    
    setIsCreateTaskOpen(false);
    setModalType("task");
    setIsSuccessModalOpen(true);
  };

  // Function to add a new category
  const addCategory = (newCategory: NewCategory) => {
    const category: Category = {
      id: Math.max(...categoriesList.map(cat => cat.id || 0), 0) + 1,
      name: newCategory.name,
      count: 0,
      icon: categoriesList[0].icon, // Default icon, you might want to make this configurable
      color: newCategory.color,
    };
    
    setCategoriesList(prevCategories => [...prevCategories, category]);
    setIsCreateCategoryOpen(false);
    setModalType("category");
    setIsSuccessModalOpen(true);
  };

  // Handle cancel confirmation
  const handleCancelConfirm = (type: "task" | "category") => {
    setModalType(type);
    setIsCancelConfirmModalOpen(true);
  };

  // Handle confirmed cancellation
  const handleConfirmedCancel = () => {
    setIsCancelConfirmModalOpen(false);
    setIsCanceledModalOpen(true);
  };

  // Handle keep action
  const handleKeep = () => {
    setIsCancelConfirmModalOpen(false);
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  // Handle canceled modal close
  const handleCanceledClose = () => {
    setIsCanceledModalOpen(false);
    // Also close the original create modal
    setIsCreateTaskOpen(false);
    setIsCreateCategoryOpen(false);
  };

  // Handle calendar event selection
  const handleCalendarEventSelect = (event: any) => {
    if (event.resource?.isGrouped) {
      // Show grouped tasks modal
      setGroupedTasks(event.resource.tasks);
      setGroupedTasksDate(event.resource.date);
      setIsGroupedTasksModalOpen(true);
    } else if (event.resource?.category === "Today") {
      // Handle today marker click if needed
      console.log("Today marker clicked");
    } else {
      // Handle single task click
      console.log("Single task clicked:", event.resource);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric",
    });
  };

  return (
    <div className={cn(
      "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
      "bg-[#F9FBFA] dark:bg-[#0F1220] overflow-x-hidden",
    )}>
      {/* Header Section */}
      <div className={cn(
        "flex flex-col sm:flex-row justify-between items-start",
        "gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6",
      )}>
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
            "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
          )}>
            Task Tracking
          </h1>
          <p className={cn(
            "text-xs sm:text-sm md:text-base",
            "text-gray-600 dark:text-gray-300",
          )}>
            Track, manage, and prioritize tasks efficiently.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateTaskOpen(true)}
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#508CD3] rounded-3xl w-full sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Task</span>
          <span className="sm:hidden">Add Task</span>
        </Button>
      </div>

      {/* Filters Section */}
      <TaskFilters onCreateCategory={() => setIsCreateCategoryOpen(true)} />

      <div className={cn(
        "flex flex-col lg:flex-row",
        "gap-2 sm:gap-3 lg:gap-4 xl:gap-6",
      )}>
        {/* Left Column - Categories and Status */}
        <div className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0">
          <TaskSidebar 
            categories={categoriesList}
            statuses={statuses}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Right Column - Tasks */}
        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-lg p-2 sm:p-3 md:p-4 shadow-sm">
            <div className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between",
              "gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4",
            )}>
              <h2 className={cn(
                "text-sm sm:text-base md:text-lg lg:text-xl font-semibold",
                "text-gray-900 dark:text-white truncate",
              )}>
                {selectedCategory}
              </h2>
              <div 
                role="switch" 
                aria-checked={viewMode === "list"}
                aria-label="View mode toggle"
                tabIndex={0}
                className={cn(
                  "relative bg-card rounded-3xl p-0.5 w-full sm:w-auto",
                  "border border-[#404663] cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-[#D29A09] focus:ring-opacity-50",
                )}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const width = rect.width;
                  if (x < width / 2) {
                    setViewMode("list");
                  } else {
                    setViewMode("calendar");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setViewMode(viewMode === "list" ? "calendar" : "list");
                  }
                }}
              >
                <div 
                  className={cn(
                    "absolute top-0.5 bottom-0.5 w-1/2",
                    "bg-gradient-to-r from-[#D29A09] to-[#F7C649] rounded-3xl",
                    "transition-all duration-300 ease-in-out",
                    viewMode === "list" ? "left-0.5" : "left-[calc(50%-1px)]",
                  )}
                />
                <div className="relative flex pointer-events-none rounded-2xl">
                  <div className="flex-1 px-6 py-3 text-xs sm:text-sm font-medium text-center">
                    <span className={cn(
                      viewMode === "list" ? "text-black font-semibold" : "text-primary-text",
                    )}>
                      List
                    </span>
                  </div>
                  <div className="flex-1 px-6 py-3 text-xs sm:text-sm font-medium text-center">
                    <span className={cn(
                      viewMode === "calendar" ? "text-black font-semibold" : "text-primary-text",
                    )}>
                      Calendar
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {viewMode === "list" ? (
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-4 px-2 sm:px-3 md:px-4">
                <TaskCalendar 
                  tasks={tasks}
                  categories={categoriesList}
                  currentDate={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={handleCalendarEventSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal 
        isOpen={isCreateTaskOpen}
        onClose={() => handleCancelConfirm("task")}
        onAddTask={addTask}
        categories={categoriesList}
      />
      <AddCategoryModal 
        isOpen={isCreateCategoryOpen}
        onClose={() => handleCancelConfirm("category")}
        onAddCategory={addCategory}
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        type={modalType}
        onGoToList={handleSuccessClose}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmModal 
        isOpen={isCancelConfirmModalOpen}
        onClose={() => setIsCancelConfirmModalOpen(false)}
        type={modalType}
        onConfirmCancel={handleConfirmedCancel}
        onKeep={handleKeep}
      />

      {/* Canceled Modal */}
      <CanceledModal 
        isOpen={isCanceledModalOpen}
        onClose={handleCanceledClose}
        type={modalType}
        onThankYou={handleCanceledClose}
      />

      {/* Grouped Tasks Modal */}
      <Dialog open={isGroupedTasksModalOpen} onOpenChange={setIsGroupedTasksModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks for {formatDate(groupedTasksDate)} ({groupedTasks.length} tasks)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {groupedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskTrackingClient;
