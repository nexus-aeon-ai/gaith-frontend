"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/lib/api/employee";
import type { Chat } from "@/lib/types";

interface EditConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Chat | null;
  clients: Record<string, string>; // id -> name map
  employees: Employee[];
  onSave: (
    conversationId: string,
    data: { clientId?: string; assignedEmployeeIds?: string[] },
  ) => Promise<void>;
}

export function EditConversationDialog({
  open,
  onOpenChange,
  conversation,
  clients,
  employees,
  onSave,
}: EditConversationDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isClientDisabled, setIsClientDisabled] = useState(false);

  useEffect(() => {
    if (conversation && open) {
      setSelectedClientId(conversation.clientId || "");
      setSelectedEmployeeIds(conversation.assignedEmployeeIds || []);
      // Disable client selection if a client is already assigned
      setIsClientDisabled(!!conversation.clientId);
    }
  }, [conversation, open]);

  const handleSave = async () => {
    if (!conversation) return;

    try {
      setIsSaving(true);
      await onSave(conversation.id, {
        clientId: selectedClientId || undefined,
        assignedEmployeeIds: selectedEmployeeIds,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save conversation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const employeeOptions = employees.map(emp => ({
    label: emp.fullName,
    value: emp.id, // Using internal UUID id
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>Edit Conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select 
              value={selectedClientId} 
              onValueChange={setSelectedClientId} 
              disabled={isClientDisabled}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(clients).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="employees">Assigned Employees</Label>
            <MultiSelect
              options={employeeOptions}
              onValueChange={setSelectedEmployeeIds}
              defaultValue={selectedEmployeeIds}
              placeholder="Select employees"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving} className="bg-red-500 text-white border-none">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
