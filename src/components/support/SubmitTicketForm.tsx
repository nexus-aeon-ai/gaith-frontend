"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getIssueCategories } from "@/lib/api/support/issue-categories";
import type { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

import CreateIssueCategoryModal from "./CreateIssueCategoryModal";
import EmployeeSelect from "./EmployeeSelect";

const ticketSchema = z.object({
  issueCategoryId: z.string().min(1, "Please select an issue category"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  description: z.string().min(1, "Description is required"),
  attachments: z.array(z.instanceof(File)).optional(),
  isDraft: z.boolean(),
  assignedToUserId: z.string().nullable().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface SubmitTicketFormProps {
  ticket?: SupportTicket;
  onSubmit: (data: TicketFormValues) => void;
  onSaveDraft?: (data: TicketFormValues) => void;
}

const SubmitTicketForm = ({ ticket, onSubmit, onSaveDraft }: SubmitTicketFormProps) => {
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const isEditMode = !!ticket;

  // Fetch issue categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["issue-categories"],
    queryFn: async () => {
      const response = await getIssueCategories();
      return response.data ?? [];
    },
  });

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      issueCategoryId: ticket?.issueCategoryId || "",
      priority: ticket?.priority || "Low",
      subject: ticket?.subject || "",
      description: ticket?.description || "",
      attachments: [],
      isDraft: ticket?.isDraft || false,
      assignedToUserId: ticket?.assignedToUserId || null,
    },
  });

  const { control, handleSubmit, formState, setValue } = form;

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit({ ...data, isDraft: false });
  });

  const handleSaveDraftClick = () => {
    const data = form.getValues();
    onSaveDraft?.({ ...data, isDraft: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue("attachments", Array.from(e.target.files), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? "Edit Support Ticket" : "Submit A Support Ticket"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Issue Category */}
          <Controller
            name="issueCategoryId"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Issue Category <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger
                      className={cn("flex-1 dark:bg-[#0F1B29]", fieldState.invalid && "border-red-500")}
                    >
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData && categoriesData.length > 0 ? (
                        categoriesData.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="_empty" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCreateCategory(true)}
                    className="flex-shrink-0 dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {fieldState.error?.message && (
                  <p className="text-sm text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* Priority Level */}
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority Level</Label>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low" id="low"  className="data-[state=checked]:border-[#3072C0] data-[state=checked]:text-[#3072C0]"/>
                    <Label htmlFor="low" className="font-normal cursor-pointer">
                      Low - General questions or minor issues
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium"  className="data-[state=checked]:border-[#3072C0] data-[state=checked]:text-[#3072C0]"/>
                    <Label htmlFor="medium" className="font-normal cursor-pointer">
                      Medium - Important but not urgent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="high"  className="data-[state=checked]:border-[#3072C0] data-[state=checked]:text-[#3072C0]"/>
                    <Label htmlFor="high" className="font-normal cursor-pointer">
                      High - Urgent business impact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Critical" id="critical"  className="data-[state=checked]:border-[#3072C0] data-[state=checked]:text-[#3072C0]"/>
                    <Label htmlFor="critical" className="font-normal cursor-pointer">
                      Critical - System down or security issue
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          {/* assignedToUserId */}
          <Controller
            name="assignedToUserId"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-sm font-medium">
                  Assigned To
                </Label>
                <EmployeeSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select employee to assign"
                />
              </div>
            )}
          />

          {/* Subject */}
          <Controller
            name="subject"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...field}
                  id="subject"
                  placeholder="Brief description about issue type"
                  className={cn("w-full dark:bg-[#0F1B29]", fieldState.invalid && "border-red-500")}
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
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Detailed description of the issue"
                  className={cn(
                    "w-full min-h-[120px] dark:bg-[#0F1B29]",
                    fieldState.invalid && "border-red-500",
                  )}
                />
                {fieldState.error?.message && (
                  <p className="text-sm text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Attachments</Label>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("file-upload")?.click();
                }
              }}
              className={cn(
                "border-2 border-dashed dark:bg-[#0F1B29]  border-gray-300 dark:border-gray-700 rounded-lg",
                "p-8 text-center cursor-pointer hover:border-blue-500 transition-colors",
              )}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {form.watch("attachments")?.length ? (
              <div className="mt-3 space-y-2">
                {Array.from(form.watch("attachments") || []).map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#0A1525] rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentFiles = form.watch("attachments") || [];
                        const newFiles = Array.from(currentFiles).filter((f) => 
                          `${f.name}-${f.size}-${f.lastModified}` !== `${file.name}-${file.size}-${file.lastModified}`
                        );
                        setValue("attachments", newFiles, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors shrink-0"
                    >
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-[16px] bg-gray-100 hover:bg-gray-200 text-gray-800 border-none hover:text-gray-800"
              onClick={handleSaveDraftClick}
            >
              Save As Draft
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-[16px] bg-[#508CD3] hover:bg-blue-700 text-white border-none"
              disabled={!formState.isValid}
            >
              {isEditMode ? "Update Ticket" : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </div>

      {/* Create Issue Category Modal */}
      <CreateIssueCategoryModal open={showCreateCategory} onOpenChange={setShowCreateCategory} />
    </>
  );
};

export default SubmitTicketForm;
