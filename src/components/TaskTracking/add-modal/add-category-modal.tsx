import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Zod schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string(),
  color: z.string().min(1, "Color is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: {
    name: string;
    description?: string;
    color: string;
    pillColor: string;
  }) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}: AddCategoryModalProps) => {
  const [selectedColor, setSelectedColor] = useState("text-[#508CD3]");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "text-[#508CD3]",
    },
  });

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

  const onSubmit = (data: CategoryFormData) => {
    onAddCategory({
      ...data,
      color: selectedColor,
      pillColor: data.color,
    });
    reset();
    setSelectedColor("text-[#508CD3]");
  };

  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
    setValue("color", colorValue);
  };

  const footer = (
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
        onClick={handleSubmit(onSubmit)}
      >
        Create Category
      </Button>
    </div>
  );

  return (
    <ScrollableDialog
      open={isOpen}
      onOpenChange={onClose}
      title="Add New Category"
      className="w-full max-w-md bg-card sm:w-auto sm:max-w-md"
      childrenWrapperClassName="space-y-3"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="category-name" className="text-primary-text">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="category-name"
            placeholder="Enter category name"
            className={cn("bg-input", errors.name ? "border-red-500" : "")}
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="category-description" className="text-primary-text">
            Description (Optional)
          </Label>
          <Textarea
            id="category-description"
            placeholder="Enter category description"
            className="bg-input"
            {...register("description")}
          />
        </div>
        <div>
          <Label>
            Color <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2 mt-2">
            {colorOptions.map((color) => (
              <Button
                key={color.value}
                type="button"
                className={cn(
                  "w-8 h-8",
                  color.bg,
                  "border-2 cursor-pointer hover:scale-110 transition-transform",
                  selectedColor === color.value
                    ? "border-white ring-2 ring-blue-500"
                    : "border-gray-200",
                )}
                onClick={() => handleColorSelect(color.value)}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
        </div>
        <hr className="text-2xl font-bold text-gray-900 dark:text-white" />
        <div className="bg-input border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CirclePlus className="w-4 h-4 text-[#508CD3]" />
            <span className="text-sm font-medium text-primary-text">
              Create a New Category by using AI
            </span>
          </div>
          <Input
            placeholder="Describe your category and let AI create it for you..."
            className="bg-transparent border-none p-0 h-8 text-sm text-primary-text placeholder:text-primary-text focus:ring-0 focus:border-none"
          />
        </div>
      </form>
    </ScrollableDialog>
  );
};

export default AddCategoryModal;
