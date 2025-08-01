import { CirclePlus, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFiltersProps {
  onCreateCategory: () => void;
}

const TaskFilters = ({ onCreateCategory }: TaskFiltersProps) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter By:</span>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-card border-[#404663]">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-card border-[#404663]">
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-70 p-7 rounded-2xl">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="fashion-brand">Fashion Brand</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-70 p-7 rounded-2xl">
              <SelectValue placeholder="Task Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="social-media">Social Media Calendar</SelectItem>
              <SelectItem value="blog">Blog Creation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={onCreateCategory}
          className="flex items-center gap-2 bg-card border-2 border-[#508CD3] text-[#508CD3] hover:bg-[#508CD3] hover:text-white w-60 h-12 rounded-2xl"
        >
          <CirclePlus className="w-4 h-4 " />
          Add New Category
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters; 
