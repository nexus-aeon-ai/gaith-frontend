"use client";
import { Upload } from "lucide-react";
import { useState } from "react";

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
import { SubmitTicketForm as SubmitTicketFormType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SubmitTicketFormProps {
  onSubmit: (data: SubmitTicketFormType) => void;
  onSaveDraft?: (data: SubmitTicketFormType) => void;
}

const SubmitTicketForm = ({ onSubmit, onSaveDraft }: SubmitTicketFormProps) => {
  const [formData, setFormData] = useState<SubmitTicketFormType>({
    category: "",
    priority: "Low",
    subject: "",
    description: "",
    attachments: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to submit ticket
    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    // TODO: API call to save draft
    onSaveDraft?.(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, attachments: Array.from(e.target.files) });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Submit A Support Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Issue Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={value => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Feature Request">Feature Request</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority Level</Label>
          <RadioGroup
            value={formData.priority}
            onValueChange={value =>
              setFormData({ ...formData, priority: value as SubmitTicketFormType["priority"] })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Low" id="low" />
              <Label htmlFor="low" className="font-normal cursor-pointer">
                Low - General questions or minor issues
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medium" id="medium" />
              <Label htmlFor="medium" className="font-normal cursor-pointer">
                Medium - Important but not urgent
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High" id="high" />
              <Label htmlFor="high" className="font-normal cursor-pointer">
                High - Urgent business impact
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Critical" id="critical" />
              <Label htmlFor="critical" className="font-normal cursor-pointer">
                Critical - System down or security issue
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject
          </Label>
          <Input
            id="subject"
            placeholder="Brief description about issue type"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Brief description about issue type"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[120px]"
          />
        </div>

        {/* Attachments */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Attachments</Label>
          <div
            className={cn(
              "border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg",
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
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.attachments.length} file(s) selected
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-[16px]"
            onClick={handleSaveDraft}
          >
            Save As Draft
          </Button>
          <Button type="submit" className="flex-1 h-12 rounded-[16px] bg-[#508CD3] hover:bg-blue-700">
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitTicketForm;

