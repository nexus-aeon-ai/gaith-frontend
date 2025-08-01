import { CirclePlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { NewCategory } from "../data/taskData";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: NewCategory) => void;
}

const CreateCategoryModal = ({ isOpen, onClose, onAddCategory }: CreateCategoryModalProps) => {
  const [formData, setFormData] = useState<NewCategory>({
    name: "",
    description: "",
    color: "text-[#508CD3]",
  });

  const [selectedColor, setSelectedColor] = useState("text-[#508CD3]");

  const colorOptions = [
    { name: "Blue", value: "text-[#508CD3]", bg: "bg-[#508CD3]" },
    { name: "Green", value: "text-[#2BAE82]", bg: "bg-[#2BAE82]" },
    { name: "Orange", value: "text-[#ECA338]", bg: "bg-[#ECA338]" },
    { name: "Pink", value: "text-[#FBDAE7]", bg: "bg-[#FBDAE7]" },
    { name: "Purple", value: "text-[#C99DDD]", bg: "bg-[#C99DDD]" },
    { name: "Red", value: "text-[#EA3B1F]", bg: "bg-[#EA3B1F]" },
    { name: "Yellow", value: "text-[#F7C649]", bg: "bg-[#F7C649]" },
    { name: "Teal", value: "text-[#20B2AA]", bg: "bg-[#20B2AA]" },
    { name: "Gray", value: "text-[#94A3B8]", bg: "bg-[#94A3B8]" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert("Please enter a category name");
      return;
    }

    onAddCategory({
      ...formData,
      color: selectedColor,
    });
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      color: "text-[#508CD3]",
    });
    setSelectedColor("text-[#508CD3]");
  };

  const handleInputChange = (field: keyof NewCategory, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add New Category
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </DialogTitle>
        </DialogHeader>
        <hr className="text-2xl font-bold text-gray-900 dark:text-white"/>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="category-name" className="text-[#CCCFDB]">Category Name *</Label>
            <Input 
              id="category-name" 
              placeholder="Enter category name" 
              className="bg-[#0F1B29]"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="category-description" className="text-[#CCCFDB]">Description (Optional)</Label>
            <Textarea 
              id="category-description" 
              placeholder="Enter category description" 
              className="bg-[#0F1B29]"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Color *</Label>
            <div className="flex gap-2 mt-2">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-8 h-8 ${color.bg} border-2 cursor-pointer hover:scale-110 transition-transform   ${
                    selectedColor === color.value ? "border-white ring-2 ring-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
          <hr className="text-2xl font-bold text-gray-900 dark:text-white"/>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CirclePlus className="w-4 h-4" />
              <span className="text-sm font-medium">Create a New Category by using AI</span>
            </div>
            <div className="flex gap-2" />
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
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal; 
