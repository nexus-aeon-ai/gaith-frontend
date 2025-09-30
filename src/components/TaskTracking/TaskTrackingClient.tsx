"use client";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategoryModalStore, useTaskModalStore } from "@/lib/store/taskModalStore";

import { cn } from "../../lib/utils";

import { AddCategoryModal, AddTaskButton, AddTaskModal } from "./add-modal";
import TaskCalendar from "./components/TaskCalendar";
import TaskCard from "./components/TaskCard";
import TaskFilters from "./components/TaskFilters";
import TaskSidebar from "./components/TaskSidebar";
import { categories, Category, getNextTaskId, mockTasks, NewCategory, statuses, Task, updateCategoryCounts } from "./data/taskData";
import { CancelConfirmModal, CanceledModal, SuccessModal } from "./pop-modal";

const TaskTrackingClient = () => {
  // Use store for modal state management
  const { isOpen: isCreateTaskOpen, setOpen: setIsCreateTaskOpen } = useTaskModalStore();
  const { isOpen: isCreateCategoryOpen, setOpen: setIsCreateCategoryOpen } = useCategoryModalStore();
  
  const [selectedCategory, setSelectedCategory] = useState("Social Media Calendar");
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
        <AddTaskButton />
      </div>

      {/* Filters Section */}
      <TaskFilters />

      <div className={cn(
        "flex flex-col lg:flex-row",
        "gap-2 sm:gap-3 lg:gap-4 xl:gap-6",
      )}>
        {/* Left Column - Categories and Status */}
        <div className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0  ">
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
            </div>
            
            <Tabs defaultValue="list" className="rounded-3xl">
              <div className="flex justify-end ">
                <TabsList className=" h-12  rounded-3xl  bg-card border-1 border-border">
                  <TabsTrigger value="list" className="text-xs px-6 rounded-3xl h-11 data-[state=active]:bg-[#D29A09] data-[state=active]:text-primary-text">List</TabsTrigger>
                  <TabsTrigger value="calendar" className="text-xs px-6 rounded-3xl h-11 data-[state=active]:bg-[#D29A09] data-[state=active]:text-primary-text">Calendar</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="list">
                <div className="space-y-2 sm:space-y-3 lg:space-y-4 rounded-3xl p-4 pb-6 bg-card">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="calendar">
                <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-4 px-2 sm:px-3 md:px-4 rounded-3xl p-4 pb-6 bg-card">
                  <TaskCalendar 
                    tasks={tasks}
                    categories={categoriesList}
                    currentDate={currentDate}
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleCalendarEventSelect}
                  />
                </div>
              </TabsContent>
            </Tabs>
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
        <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-y-auto sm:w-auto sm:max-w-4xl">
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
