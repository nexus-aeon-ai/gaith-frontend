"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks, useTasksOverview, useUpdateTask } from "@/hooks/use-tasks";
import { getClients } from "@/lib/api";
import { createTask, CreateTaskDTO, getAllCategories, createCategory, SimpleCategory } from "@/lib/api/tasks";
import { useCategoryModalStore, useTaskModalStore } from "@/lib/store/taskModalStore";
import { transformTasksResponse } from "@/lib/utils/task-transformer";

import { cn } from "../../lib/utils";

import { AddCategoryModal, AddTaskButton, AddTaskModal } from "./add-modal";
import TaskCalendar from "./components/TaskCalendar";
import TaskCard from "./components/TaskCard";
import TaskFilters from "./components/TaskFilters";
import TaskSidebar from "./components/TaskSidebar";
import {  Category, NewCategory, Task, statuses } from "./data/taskData";
import { CancelConfirmModal, CanceledModal, SuccessModal } from "./pop-modal";

const TaskTrackingClient = () => {
  // Use store for modal state management
  const { isOpen: isCreateTaskOpen, setOpen: setIsCreateTaskOpen } = useTaskModalStore();
  const { isOpen: isCreateCategoryOpen, setOpen: setIsCreateCategoryOpen } =
    useCategoryModalStore();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));

  // State for tasks and categories
  const [tasks, setTasks] = useState<Task[]>([]);

  const { data: categorieData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["task-categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res ?? [];
    },
  });

   const { data: clientsList } = useQuery({
      queryKey: ["clients"],
      queryFn: async () => {
        const res = await getClients();
        return res.data ?? [];
      },
      initialData: [],
    });

  const [categoriesList, setCategoriesList] = useState<SimpleCategory[]>(categorieData || []);
  const [completionRate, setCompletionRate] = useState<number>(0);

  const [totals, setTotals] = useState<{ all: number; completed: number }>({
    all: 0,
    completed: 0,
  });

  // Fetch tasks from backend and map to TaskTracking shape
  const { data: tasksData, isLoading } = useTasks(
    selectedCategoryId ? { categoryId: selectedCategoryId } : undefined,
  );
  const { data: overviewData } = useTasksOverview();

  const fetchedTasks: Task[] = useMemo(() => {
    if (!tasksData) return [];
    const employeeTasks = transformTasksResponse(tasksData);

    const toDisplayStatus = (status: string) => {
      switch (status) {
        case "NotStarted":
          return "Not Started";
        case "InProgress":
        case "AwaitingFeedback":
          return "In Progress";
        case "Completed":
          return "Completed";
        default:
          return "Not Started";
      }
    };

    const toDisplayPriority = (priority: string) => {
      // Urgent is treated as High for this UI set
      return priority === "Urgent" ? "High" : priority;
    };

    return employeeTasks.map((t) => ({
      id: t.id, // Use actual ID from API
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      assignee: t.assignee.name,
      client: t.client?.name || "-",
      status: toDisplayStatus(t.status),
      priority: toDisplayPriority(t.priority),
      progress: t.progress,
      category: t.category.name,
    }));
  }, [tasksData]);

  useEffect(() => {
    // Sync tasks with backend result (even when empty)
    setTasks(fetchedTasks);
  }, [fetchedTasks]);

 

  // When a category is selected, recompute status counts from the filtered tasks
  useEffect(() => {
    if (!selectedCategoryId) return;
    const byStatus: Record<string, number> = {
      NotStarted: 0,
      InProgress: 0,
      AwaitingFeedback: 0,
      Completed: 0,
    };
    (tasksData || []).forEach(t => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
    });
    const notStarted = byStatus.NotStarted || 0;
    const inProgress = (byStatus.InProgress || 0) + (byStatus.AwaitingFeedback || 0);
    const completed = byStatus.Completed || 0;
    statuses[0].count = notStarted;
    statuses[1].count = inProgress;
    statuses[2].count = completed;
  }, [selectedCategoryId, tasksData]);

  // Sync overview data into sidebar widgets (categories, status, completion)
  useEffect(() => {
    if (!overviewData) return;


     const mappedCategories: Category[] | SimpleCategory[] = overviewData.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      color: cat.color,
      stages: cat.stages,
    }));
    setCategoriesList(mappedCategories);

    // Status distribution
    const byStatus = new Map(overviewData.statusBreakdown.map(s => [s.status, s.count] as const));
    const notStarted = byStatus.get("NotStarted") || 0;
    const inProgress = (byStatus.get("InProgress") || 0) + (byStatus.get("AwaitingFeedback") || 0);
    const completed = byStatus.get("Completed") || 0;
    statuses[0].count = notStarted;
    statuses[1].count = inProgress;
    statuses[2].count = completed;

    // Completion rate and totals
    const all = overviewData.totals?.all || 0;
    const comp = overviewData.totals?.completed || 0;
    const rate = all > 0 ? Math.round((comp / all) * 100) : 0;
    setTotals({ all, completed: comp });
    setCompletionRate(rate);
  }, [overviewData, categorieData]);

  

  // Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] = useState(false);
  const [isCanceledModalOpen, setIsCanceledModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"task" | "category">("task");
  const [filterType, setFilterType] = useState<string>("list");

  // Grouped tasks modal state
  const [isGroupedTasksModalOpen, setIsGroupedTasksModalOpen] = useState(false);
  const [groupedTasks, setGroupedTasks] = useState<Task[]>([]);
  const [groupedTasksDate, setGroupedTasksDate] = useState<string>("");

  const { mutate: updateTask } = useUpdateTask();

  const handleProgressUpdate = (taskId: string | number, newProgress: number) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: newProgress } : t));
    
    // Call API
    updateTask({ id: String(taskId), data: { progressPercent: newProgress } });
  };

  if(isLoadingCategories){
    return <div>Loading...</div>;
  }

  // Function to add a new task
  const addTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    assignedTo: string;
    client: string;
    priority: string;
    status: string;
    populationStatus: string;
    category: string;
    estimatedHours?: number;
    additionalComments?: string;
  }) => {
    try {
      // Convert due date from YYYY-MM-DD to ISO string with time
      const dueDateObj = new Date(taskData.dueDate);
      dueDateObj.setHours(18, 0, 0, 0); // Set to 18:00 UTC
      const dueDateISO = dueDateObj.toISOString();

      // Map form data to API request
      const createTaskPayload: CreateTaskDTO = {
        title: taskData.title,
        description: taskData.description || "",
        dueDate: dueDateISO,
        category: taskData.category,
        status: taskData.status as "NotStarted" | "InProgress" | "Completed" | "AwaitingFeedback",
        populationStatus: taskData.populationStatus as
          | "Draft"
          | "Review"
          | "SentToClient"
          | "ApprovedByClient",
        priority: taskData.priority as "Low" | "Medium" | "High" | "Urgent",
        assignedTo: taskData.assignedTo,
        accountId: taskData.client,
        estimatedHours: taskData.estimatedHours ? Number(taskData.estimatedHours) : undefined,
        additionalComments: taskData.additionalComments || undefined,
      };

      // Call the API
      const response = await createTask(createTaskPayload);

      if (response) {
        // Invalidate queries to refresh list and counts
        queryClient.invalidateQueries({ queryKey: ["tasks"] });

        // Close the modal
        setIsCreateTaskOpen(false);

        // Set success modal
        setModalType("task");
        setIsSuccessModalOpen(true);

        // Refresh tasks data by triggering a re-fetch
        // You may need to invalidate the query cache if using react-query
        console.log("Task created successfully:", response);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      // You can add error handling here (e.g., show toast notification)
    }
  };

  // Function to add a new category (sends to backend)
  const addCategory = async (newCategory: NewCategory) => {
    try {
      const res = await createCategory({ name: newCategory.name, color: newCategory.color });
      // Append returned category to list
      setCategoriesList(prevCategories => [...prevCategories, res]);
      setIsCreateCategoryOpen(false);
      setModalType("category");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to create category:", error);
      // Optionally show error UI here
    }
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
  const handleCalendarEventSelect = (event: {
    resource?: { isGrouped?: boolean; tasks?: Task[]; date?: string; category?: string };
  }) => {
    if (event.resource?.isGrouped) {
      // Show grouped tasks modal
      setGroupedTasks(event.resource.tasks || []);
      setGroupedTasksDate(event.resource.date || "");
      setIsGroupedTasksModalOpen(true);
    } else if (event.resource?.category === "Today") {
      // Handle today marker click if needed
    } else {
      // Handle single task click
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

  if (isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "font-inter overflow-x-hidden space-y-3",
      )}
    >
      {/* Header Section */}
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-start",
          "gap-2 sm:gap-3 lg:gap-3 mb-6",
        )}
      >
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Task Tracking
          </h1>
          <p className={cn("text-xs sm:text-sm md:text-base", "text-gray-600 dark:text-gray-300")}>
            Track, manage, and prioritize tasks efficiently.
          </p>
        </div>
        <AddTaskButton />
      </div>

      {/* Filters Section */}
      <TaskFilters
        categories={categoriesList}
        filterType={filterType}
        clients={clientsList}
        onCategorySelect={name => {
          setSelectedCategory(name);
          if (name === "All Categories") {
            setSelectedCategoryId(undefined);
            return;
          }
          if (overviewData) {
            const match = overviewData.categories.find(c => c.name === name);
            setSelectedCategoryId(match?.id);
          } else {
            setSelectedCategoryId(undefined);
          }
        }}
      />

      <div className={cn("flex flex-col lg:flex-row", "gap-3")}>
        {/* Left Column - Categories and Status */}
        <div className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0">
          <TaskSidebar
            categories={categoriesList}
            statuses={statuses}
            selectedCategory={selectedCategory}
            onCategorySelect={name => {
              setSelectedCategory(name);
              if (name === "All Categories") {
                setSelectedCategoryId(undefined);
                return;
              }
              // find matching id from overview by name
              // We don't store id on Category, so derive via overview categories list name->id
              // Use overviewData if available
              if (overviewData) {
                const match = overviewData.categories.find(c => c.name === name);
                setSelectedCategoryId(match?.id);
              } else {
                setSelectedCategoryId(undefined);
              }
            }}
            completionRate={completionRate}
            totals={totals}
          />
        </div>

        {/* Right Column - Tasks */}
        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-[16px] p-2 sm:p-3 md:p-4 shadow-sm">
            <div
              className={cn(
                "flex flex-col sm:flex-row items-start sm:items-center justify-between",
                "gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4",
              )}
            >
              <h2
                className={cn(
                  "text-sm sm:text-base md:text-lg lg:text-xl font-semibold",
                  "text-gray-900 dark:text-white truncate",
                )}
              >
                {selectedCategory}
              </h2>
            </div>

            <Tabs defaultValue="list" className="rounded-[16px]" onValueChange={setFilterType}>
              <div className="flex justify-end ">
                <TabsList className=" h-12  rounded-[20px]  bg-card border-1 border-border">
                  <TabsTrigger
                    value="list"
                    className="text-xs px-6 rounded-[20px] h-11 data-[state=active]:bg-[#F7C649] dark:data-[state=active]:dark:bg-[#D29A09] data-[state=active]:text-[#070913]"
                  >
                    List
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="text-xs px-6 rounded-[20px] h-11 data-[state=active]:bg-[#F7C649] dark:data-[state=active]:dark:bg-[#D29A09] data-[state=active]:text-[#070913]"
                  >
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="list">
                <div className=" sm:space-y-1 rounded-[16px] p-4 ">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading tasks...</div>
                  ) : tasks.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No tasks found for the selected range.
                    </div>
                  ) : (
                    tasks.map(task => <TaskCard key={task.id} task={task} onProgressUpdate={handleProgressUpdate} />)
                  )}
                </div>
              </TabsContent>
              <TabsContent value="calendar">
                <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-4 px-2 sm:px-3 md:px-4 rounded-[16px] p-4 pb-6 bg-card">
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
            {groupedTasks.map(task => (
              <TaskCard key={task.id} task={task} onProgressUpdate={handleProgressUpdate} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskTrackingClient;
