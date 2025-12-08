"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createIssueCategory } from "@/lib/api/support/issue-categories";
import { cn } from "@/lib/utils";

interface CreateIssueCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const issueCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

type IssueCategoryFormValues = z.infer<typeof issueCategorySchema>;

const CreateIssueCategoryModal = ({ open, onOpenChange }: CreateIssueCategoryModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<IssueCategoryFormValues>({
    resolver: zodResolver(issueCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { control, handleSubmit, reset, formState } = form;

  const createCategoryMutation = useMutation({
    mutationFn: createIssueCategory,
    onSuccess: () => {
      // Invalidate issue categories query to refetch
      queryClient.invalidateQueries({ queryKey: ["issue-categories"] });
      reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating issue category:", error);
      // TODO: Show error toast/notification
    },
  });

  const onSubmit = handleSubmit((data) => {
    createCategoryMutation.mutate(data);
  });

  const handleClose = () => {
    if (!createCategoryMutation.isPending) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Create Issue Category</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
              disabled={createCategoryMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Add a new category for organizing support tickets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {/* Category Name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="category-name" className="text-sm font-medium">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...field}
                  id="category-name"
                  placeholder="e.g., Technical Issues"
                  className={cn(
                    "w-full",
                    fieldState.invalid && "border-red-500 focus-visible:ring-red-500",
                  )}
                  disabled={createCategoryMutation.isPending}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error?.message && (
                  <p className="text-sm text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="category-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  {...field}
                  id="category-description"
                  placeholder="Describe this category (optional)"
                  className={cn(
                    "w-full min-h-[100px] resize-none",
                    fieldState.invalid && "border-red-500 focus-visible:ring-red-500",
                  )}
                  disabled={createCategoryMutation.isPending}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error?.message && (
                  <p className="text-sm text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={createCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#508CD3] hover:bg-blue-700"
              disabled={createCategoryMutation.isPending || !formState.isValid}
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueCategoryModal;

