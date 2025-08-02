import { format } from "date-fns";
import { CalendarIcon, CirclePlus } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Category } from "../data/taskData";

import BaseModal from "./base-modal";

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

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, categories }: AddTaskModalProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    client: "",
    priority: "Medium",
    status: "Not Started",
    category: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const validation = taskSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onAddTask(validation.data);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
      client: "",
      priority: "Medium",
      status: "Not Started",
      category: "",
    });
    setSelectedDate(undefined);
    setIsDatePickerOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        dueDate: format(date, "yyyy-MM-dd"),
      }));
      setIsDatePickerOpen(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
        onClick={handleSubmit}
      >
        Create Task
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        <div>
          <Label htmlFor="task-title" className="text-primary-text text-xs sm:text-sm">
            Task Title <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="task-title" 
            placeholder="Enter task title" 
            className={cn("bg-input mt-1 sm:mt-2 text-xs sm:text-sm h-8 sm:h-10", errors.title ? "border-red-500" : "")}
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
          
        <div>
          <Label htmlFor="task-description" className="text-primary-text text-xs sm:text-sm">Description</Label>
          <Input 
            id="task-description" 
            placeholder="Enter task description"  
            className="bg-input text-center mt-1 sm:mt-2 text-xs sm:text-sm h-32 sm:h-40"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>
          
        <div>
          <Label htmlFor="due-date" className="text-primary-text text-xs sm:text-sm">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full py-2 sm:py-3 rounded-lg justify-start text-left font-normal bg-input mt-1 sm:mt-2 border-none text-[#94A2AB] hover:bg-input hover:text-[#94A2AB] h-8 sm:h-10 text-xs sm:text-sm", errors.dueDate ? "border-red-500" : "")}>
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar 
                mode="single" 
                selected={selectedDate}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>
          
        <div>
          <Label htmlFor="category" className="text-primary-text text-xs sm:text-sm">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className={cn("bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm", errors.category ? "border-red-500" : "")}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>
          
        <div>
          <Label htmlFor="assignee" className="text-primary-text text-xs sm:text-sm">
            Assignee <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
            <SelectTrigger className={cn("bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm", errors.assignee ? "border-red-500" : "")}>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Emily Johnson">Emily Johnson</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
          {errors.assignee && <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>}
        </div>
          
        <div>
          <Label htmlFor="client" className="text-primary-text text-xs sm:text-sm">
            Client <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.client} onValueChange={(value) => handleInputChange("client", value)}>
            <SelectTrigger className={cn("bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm", errors.client ? "border-red-500" : "")}>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fashion Brand">Fashion Brand</SelectItem>
              <SelectItem value="Tech Startup">Tech Startup</SelectItem>
              <SelectItem value="Restaurant Chain">Restaurant Chain</SelectItem>
            </SelectContent>
          </Select>
          {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client}</p>}
        </div>
          
        <div>
          <Label htmlFor="priority" className="text-primary-text text-xs sm:text-sm">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger className={cn("bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm", errors.priority ? "border-red-500" : "")}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
        </div>
          
        <div>
          <Label htmlFor="initial-status" className="text-primary-text text-xs sm:text-sm">
            Initial Status <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
            <SelectTrigger className={cn("bg-input mt-1 sm:mt-2 text-[#94A2AB] py-2 sm:py-3 rounded-lg h-8 sm:h-10 text-xs sm:text-sm", errors.status ? "border-red-500" : "")}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>
          
        <hr className="text-2xl font-bold text-gray-900 dark:text-white"/>
        <div className="bg-input border border-border rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4 text-[#508CD3]" />
            <span className="text-xs sm:text-sm font-medium text-[#94A2AB]">Create a New Task by using AI</span>
          </div>
          <Input 
            placeholder="Describe your task and let AI create it for you..."
            className="bg-transparent border-none p-0 h-8 sm:h-10 text-xs sm:text-sm text-[#94A2AB] placeholder:text-[#94A2AB] focus:ring-0 focus:border-none"
          />
        </div>
      </form>
    </BaseModal>
  );
};

export default AddTaskModal; 
