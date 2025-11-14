import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Category } from "../data/taskData";

// Zod schema for task validation
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string(),
  dueDate: z.string().min(1, "Due date is required"),
  assignee: z.string().min(1, "Assignee is required"),
  client: z.string().min(1, "Client is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  category: z.string().min(1, "Category is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskFormData) => void;
  categories: Category[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, categories }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
      client: "",
      priority: "Medium",
      status: "Not Started",
      category: "",
    },
  });

  const onSubmit = (data: TaskFormData) => {
    onAddTask(data);
    reset();
  };

  const footer = (
    <div className="flex justify-center items-center w-full gap-2 sm:gap-3 pt-3 sm:pt-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1 bg-card border-2 border-[#EA3B1F] text-[#EA3B1F] hover:bg-[#EA3B1F] hover:text-white p-3 sm:p-6 h-8 sm:h-12 rounded-2xl text-xs sm:text-sm"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="ml-2 sm:ml-4 flex-1 bg-[#508CD3] hover:bg-blue-700 text-white p-3 sm:p-6 h-8 sm:h-12 rounded-2xl text-xs sm:text-sm"
        onClick={handleSubmit(onSubmit)}
      >
        Create Task
      </Button>
    </div>
  );

  return (
    <ScrollableDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Create New Task"
      className="max-w-3xl bg-card"
      childrenWrapperClassName="space-y-3"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
        {/* Task Title */}
        <div>
          <Label htmlFor="task-title" className="text-primary-text text-xs sm:text-sm">
            Task Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="task-title"
            placeholder="Enter task title"
            className={cn(
              "bg-input mt-1 sm:mt-2 text-xs sm:text-sm h-8 sm:h-10",
              errors.title ? "border-red-500" : "",
            )}
            {...register("title")}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="task-description" className="text-primary-text text-xs sm:text-sm">
            Description
          </Label>
          <Input
            id="task-description"
            placeholder="Enter task description"
            className="bg-input text-center mt-1 sm:mt-2 text-xs sm:text-sm h-32 sm:h-40"
            {...register("description")}
          />
        </div>

        {/* Due Date */}
        <div>
          <Label htmlFor="due-date" className="text-primary-text text-xs sm:text-sm">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            id="due-date"
            className={cn(
              "bg-input mt-1 sm:mt-2 text-xs sm:text-sm h-8 sm:h-10",
              errors.dueDate ? "border-red-500" : "",
            )}
            {...register("dueDate")}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-primary-text text-xs sm:text-sm">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={value => setValue("category", value)}>
            <SelectTrigger
              className={cn(
                "bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
                errors.category ? "border-red-500" : "",
              )}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Assignee */}
        <div>
          <Label htmlFor="assignee" className="text-primary-text text-xs sm:text-sm">
            Assignee <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={value => setValue("assignee", value)}>
            <SelectTrigger
              className={cn(
                "bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
                errors.assignee ? "border-red-500" : "",
              )}
            >
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Emily Johnson">Emily Johnson</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
          {errors.assignee && (
            <p className="text-red-500 text-xs mt-1">{errors.assignee.message}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <Label htmlFor="client" className="text-primary-text text-xs sm:text-sm">
            Client <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={value => setValue("client", value)}>
            <SelectTrigger
              className={cn(
                "bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
                errors.client ? "border-red-500" : "",
              )}
            >
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fashion Brand">Fashion Brand</SelectItem>
              <SelectItem value="Tech Startup">Tech Startup</SelectItem>
              <SelectItem value="Restaurant Chain">Restaurant Chain</SelectItem>
            </SelectContent>
          </Select>
          {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client.message}</p>}
        </div>

        {/* Priority */}
        <div>
          <Label htmlFor="priority" className="text-primary-text text-xs sm:text-sm">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={value => setValue("priority", value as "High" | "Medium" | "Low")}>
            <SelectTrigger
              className={cn(
                "bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
                errors.priority ? "border-red-500" : "",
              )}
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="initial-status" className="text-primary-text text-xs sm:text-sm">
            Initial Status <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={value =>
              setValue("status", value as "Not Started" | "In Progress" | "Completed")
            }
          >
            <SelectTrigger
              className={cn(
                "bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
                errors.status ? "border-red-500" : "",
              )}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        {/* AI Task Input */}
        <hr className="text-2xl font-bold text-gray-900 dark:text-white" />
        <div className="bg-input border border-border rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4 text-[#508CD3]" />
            <span className="text-xs sm:text-sm font-medium text-[#94A2AB]">
              Create a New Task by using AI
            </span>
          </div>
          <Input
            placeholder="Describe your task and let AI create it for you..."
            className="bg-transparent border-none p-0 h-8 sm:h-10 text-xs sm:text-sm text-[#94A2AB] placeholder:text-[#94A2AB] focus:ring-0 focus:border-none"
          />
        </div>
      </form>
    </ScrollableDialog>
  );
};

export default AddTaskModal;
