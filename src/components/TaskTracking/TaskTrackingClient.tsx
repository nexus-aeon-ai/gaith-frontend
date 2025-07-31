'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import TaskCard from "./components/TaskCard";
import TaskFilters from "./components/TaskFilters";
import TaskSidebar from "./components/TaskSidebar";
import TaskCalendar from "./components/TaskCalendar";
import CreateTaskModal from "./components/CreateTaskModal";
import CreateCategoryModal from "./components/CreateCategoryModal";
import SuccessModal from "./components/SuccessModal";
import CancelConfirmModal from "./components/CancelConfirmModal";
import CanceledModal from "./components/CanceledModal";
import { mockTasks, categories, statuses, Task, Category, NewTask, NewCategory, getNextTaskId, updateCategoryCounts } from "./data/taskData";

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

  // Function to add a new task
  const addTask = (newTask: NewTask) => {
    const task: Task = {
      id: getNextTaskId(tasks),
      ...newTask,
      progress: newTask.status === "Completed" ? 100 : newTask.status === "In Progress" ? 50 : 0
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
      color: newCategory.color
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

  return (
    <div className="flex-1 p-6 bg-[#F9FBFA] dark:bg-[#0F1220]">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Task Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track, manage, and prioritize tasks efficiently.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateTaskOpen(true)}
          className="flex items-center gap-2 bg-[#508CD3] rounded-3xl w-40 h-12 hover:bg-blue-700 text-white"
        >
          <CirclePlus className="w-4 h-4" />
          Add New Task
        </Button>
      </div>

      {/* Filters Section */}
      <TaskFilters onCreateCategory={() => setIsCreateCategoryOpen(true)} />

      <div className="flex gap-6">
        {/* Left Column - Categories and Status */}
        <TaskSidebar 
          categories={categoriesList}
          statuses={statuses}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Right Column - Tasks */}
        <div className="flex-1">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCategory}
              </h2>
              <div className="flex border-2 border-[#404663] rounded-3xl p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-[#D29A09] hover:bg-yellow-600 rounded-l-3xl rounded-r-none w-16 h-12" : "w-16 h-12 bg-card rounded-l-3xl rounded-r-none border-none hover:bg-yellow-500 hover:text-white"}
                >
                  List
                </Button>
                <Button 
                  className={`bg-card border-none rounded-r-3xl w-24 h-12  rounded-l-none ${viewMode === "calendar" ? "bg-[#D29A09] hover:bg-yellow-600" : "hover:bg-yellow-500 hover:text-white"}`} 
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  Calendar
                </Button>
              </div>
            </div>
            
            {viewMode === "list" ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <TaskCalendar 
                tasks={tasks}
                categories={categoriesList}
                currentDate={currentDate}
                onNavigate={setCurrentDate}
                onSelectEvent={(event) => {
                  console.log('Task clicked:', event);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isCreateTaskOpen}
        onClose={() => handleCancelConfirm("task")}
        onAddTask={addTask}
        categories={categoriesList}
      />
      <CreateCategoryModal 
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
    </div>
  );
};

export default TaskTrackingClient; 