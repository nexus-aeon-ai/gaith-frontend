"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hooks/use-tasks";
import { getAllCategories, getAllClients, getAllUsers } from "@/lib/api/tasks";

const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().min(1, "Task description is required"),
  assignedTo: z.string().min(1, "Please select an assignee"),
  accountId: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]),
  status: z.enum(["NotStarted", "InProgress", "AwaitingFeedback", "Completed"]),
  populationStatus: z.enum(["Draft", "Review", "SentToClient", "ApprovedByClient"]),
  category: z.string().min(1, "Please select a category"),
  estimatedHours: z.string().optional(),
  additionalComments: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  onSubmit?: (data: TaskFormValues) => void;
}

export default function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const router = useRouter();
  const createMutation = useCreateTask();

  // used for setting minumum today's date for due date in form
  const today = new Date().toISOString().split("T")[0];
  const { theme } = useTheme();

  const { data: categories } = useQuery({
    queryKey: ["task-categories"],
    queryFn: getAllCategories,
  });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: getAllClients });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      accountId: "",
      dueDate: "",
      priority: "Medium",
      status: "NotStarted",
      populationStatus: "Draft",
      category: "",
      estimatedHours: "",
      additionalComments: "",
    },
  });

  const handleSubmit = async (data: TaskFormValues) => {
    try {
      if (onSubmit) {
        onSubmit(data);
      }

      // Convert form data to API format
      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate).toISOString(),
        category: data.category,
        status: data.status,
        populationStatus: data.populationStatus,
        priority: data.priority,
        assignedTo: data.assignedTo,
        accountId: data.accountId,
        estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : undefined,
        additionalComments: data.additionalComments,
      };

      await createMutation.mutateAsync(taskData);
      router.push("/en/employee-tasks");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDueDateClick = () => {
    const input = document.getElementById("date-due") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };


  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>&gt;</span>
        <Link href="/en/employee-tasks" className="text-primary hover:underline">
          Employee Tasks Management
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 dark:text-white">Create New Task</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Add information to create a new task</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={createMutation.isPending}
            className="cursor-pointer p-6 px-8 text-[16px] hover:bg-[#3072C0]/80 font-[400] rounded-[16px] border-[#3072C0]  bg-[#3072C0] text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Task Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                      placeholder="Task Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task Description"
                      className="min-h-[100px] resize-none dark:bg-[#0F1B29] pb-6 bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignee */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map(u => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client */}
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority Level */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      {/* <Input
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        type="date"
                        placeholder="--/--/---"
                        {...field}
                        min={today}
                      /> */}
                      <div className="relative w-full">
                        <Input
                          id="date-due"
                          type="date"
                          {...field}
                          min={today}
                          className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-6 pr-10
                          [&::-webkit-calendar-picker-indicator]:opacity-0 
                          [&::-webkit-calendar-picker-indicator]:absolute 
                          [&::-webkit-calendar-picker-indicator]:w-full 
                          [&::-webkit-calendar-picker-indicator]:h-full"
                        />

                        <button
                          type="button"
                          onClick={handleDueDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label="Select from date"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Task Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Hours */}
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Hours</FormLabel>
                    <FormControl>
                      <Input
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        type="number"
                        placeholder="--/--"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Comments */}
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-3">
                    Enter Any Additional Instructions Or Requirements
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional instructions or requirements"
                      className="min-h-[100px] resize-none dark:bg-[#0F1B29]  bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
