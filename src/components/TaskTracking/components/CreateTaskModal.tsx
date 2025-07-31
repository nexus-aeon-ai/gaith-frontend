import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CirclePlus } from "lucide-react";
import { format } from "date-fns";
import { NewTask, Category } from "../data/taskData";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: NewTask) => void;
  categories: Category[];
}

const CreateTaskModal = ({ isOpen, onClose, onAddTask, categories }: CreateTaskModalProps) => {
  const [formData, setFormData] = useState<NewTask>({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    client: "",
    priority: "",
    status: "",
    category: ""
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.dueDate || !formData.category || !formData.assignee || !formData.client || !formData.priority || !formData.status) {
      alert("Please fill in all required fields");
      return;
    }

    onAddTask(formData);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
      client: "",
      priority: "",
      status: "",
      category: ""
    });
    setSelectedDate(undefined);
    setIsDatePickerOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        dueDate: format(date, "yyyy-MM-dd")
      }));
      setIsDatePickerOpen(false);
    }
  };

  const handleInputChange = (field: keyof NewTask, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card p-3">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between mb-3">
            Create New Task
          </DialogTitle>
        </DialogHeader>
        <hr className="text-2xl font-bold text-gray-900 dark:text-white"/>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="task-title" className="text-primary-text">Task Title *</Label>
            <Input 
              id="task-title" 
              placeholder="Enter task title" 
              className="bg-input mt-2"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="task-description" className="text-primary-text">Description</Label>
            <Input 
              id="task-description" 
              placeholder="Enter task description" 
              className="bg-input mt-2"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="due-date" className="text-primary-text">Due Date *</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full py-5.5 rounded-lg justify-start text-left font-normal bg-input mt-2 border-none text-[#94A2AB] hover:bg-input hover:text-[#94A2AB]">
                  <CalendarIcon className="h-4 w-4" />
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
          </div>
          
          <div>
            <Label htmlFor="category" className="text-primary-text">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="bg-input mt-2 text-[#94A2AB] py-5.5 rounded-lg">
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
          </div>
          
          <div>
            <Label htmlFor="assignee" className="text-primary-text">Assignee *</Label>
            <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
              <SelectTrigger className="bg-input mt-2 text-[#94A2AB] py-5.5 rounded-lg">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emily Johnson">Emily Johnson</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="client" className="text-primary-text">Client *</Label>
            <Select value={formData.client} onValueChange={(value) => handleInputChange("client", value)}>
              <SelectTrigger className="bg-input mt-2 text-[#94A2AB] py-5.5 rounded-lg">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fashion Brand">Fashion Brand</SelectItem>
                <SelectItem value="Tech Startup">Tech Startup</SelectItem>
                <SelectItem value="Restaurant Chain">Restaurant Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority" className="text-primary-text">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger className="bg-input mt-2 text-[#94A2AB] py-5.5 rounded-lg">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="initial-status" className="text-primary-text">Initial Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="bg-input mt-2 text-[#94A2AB] py-5.5 rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <hr className="text-2xl font-bold text-gray-900 dark:text-white"/>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CirclePlus className="w-4 h-4" />
              <span className="text-sm font-medium">Create a New Task by using AI</span>
            </div>
            <div className="flex gap-2">
            </div>
          </div>
          
          <div className="gap-3 pt-4 flex">
            <Button 
              type="button"
              variant="outline" 
              className="flex-1 bg-card border-2 border-[#EA3B1F] text-[#EA3B1F] hover:bg-[#EA3B1F] hover:text-white p-6 w-34 h-12 rounded-2xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="ml-4 flex-1 bg-[#508CD3] hover:bg-blue-700 text-white p-6 w-50 h-12 rounded-2xl"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal; 