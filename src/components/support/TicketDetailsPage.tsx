"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, FileText, Paperclip, Send, User, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadMultiImages } from "@/lib/api/storage";
import {
    createTicketReply,
    getTicketActivities,
    getTicketReplies,
    updateTicket,
} from "@/lib/api/support/support";
import { getAllUsers } from "@/lib/api/tasks";
import type { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

type TicketViewMode = "view" | "reply";

interface TicketDetailsPageProps {
  ticket: SupportTicket;
  onBack: () => void;
  onClose?: (ticket: SupportTicket) => void;
  mode?: TicketViewMode;
}

const replySchema = z.object({
  message: z.string().min(1, "Reply message is required"),
  attachments: z.array(z.instanceof(File)).optional(),
});

const TicketDetailsPage = ({ ticket, onBack, onClose, mode = "view" }: TicketDetailsPageProps) => {
  const queryClient = useQueryClient();
  const messageAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch ticket replies
  const { data: repliesData, isLoading: repliesLoading } = useQuery({
    queryKey: ["ticket-replies", ticket.id],
    queryFn: async () => {
      const response = await getTicketReplies(ticket.id);
      return response.data || [];
    },
  });

  console.log("Replies Data:", repliesData);

  // Fetch all users for assigned user lookup
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getAllUsers();
    },
  });

  // Fetch ticket activities
  const { data: activitiesData } = useQuery({
    queryKey: ["ticket-activities", ticket.id],
    queryFn: async () => {
      const response = await getTicketActivities(ticket.id);
      return response.data || [];
    },
  });

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: "",
      attachments: [],
    },
  });

  const { handleSubmit, reset, control } = form;

  useEffect(() => {
    if (mode === "reply") {
      const timeout = setTimeout(() => {
        messageAreaRef.current?.focus();
        messageAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [mode]);

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof replySchema>) => {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (data.attachments && data.attachments.length > 0) {
        try {
          const uploadResponse = await uploadMultiImages(data.attachments);
          if (uploadResponse.data) {
            attachmentUrls = uploadResponse.data.map(item => item.url);
            console.log("Uploaded reply attachment URLs:", attachmentUrls);
          }
        } catch (error) {
          console.error("Error uploading attachments:", error);
          throw new Error("Failed to upload attachments");
        }
      }

      return createTicketReply(ticket.id, {
        message: data.message,
        attachments: attachmentUrls,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-replies", ticket.id] });
      queryClient.invalidateQueries({ queryKey: ["ticket-activities", ticket.id] });
      reset();
    },
    onError: (error) => {
      console.error("Error sending reply:", error);
      // TODO: Show error toast
    },
  });

  // Update ticket mutation (for closing)
  const updateTicketMutation = useMutation({
    mutationFn: async () => {
      return updateTicket(ticket.id, { status: "Closed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-activities", ticket.id] });
      onClose?.(ticket);
    },
    onError: (error) => {
      console.error("Error closing ticket:", error);
      // TODO: Show error toast
    },
  });

  const handleSendReply = handleSubmit(
    async (data) => {
      createReplyMutation.mutate(data);
    },
    () => {
      // validation errors are surfaced via Controller fieldState
    },
  );

  const handleCloseTicket = () => {
    updateTicketMutation.mutate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const currentFiles = form.getValues("attachments") || [];
      const newFiles = [...currentFiles, ...Array.from(e.target.files)];
      form.setValue("attachments", newFiles, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const currentFiles = form.getValues("attachments") || [];
    const newFiles = currentFiles.filter(
      (f) => `${f.name}-${f.size}-${f.lastModified}` !== `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`
    );
    form.setValue("attachments", newFiles, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const replies = repliesData || [];
  const activities = activitiesData || [];

  return (
    <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-transparent")}>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700 hover:bg-transparent p-0 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {ticket.ticketId}
              </h1>
              {mode === "reply" && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  Replying to ticket
                </span>
              )}
              {mode === "view" && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full">
                  Viewing ticket
                </span>
              )}
              <span
                className={cn(
                  "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
                  ticket.status === "Open"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : ticket.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : ticket.status === "Closed"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                )}
              >
                {ticket.status}
              </span>
              <span
                className={cn(
                  "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
                  ticket.priority === "Critical"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : ticket.priority === "High"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      : ticket.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                )}
              >
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="text-xl text-gray-900 dark:text-white font-semibold mb-2">
              {ticket.subject}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{ticket.createdBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: {ticket.createdDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {ticket.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-[16px] bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
              disabled
            >
              Triage
            </Button>
            <Button
              variant="outline"
              className="rounded-[16px] bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
              disabled
            >
              Needs Updating
            </Button>
            {ticket.status !== "Closed" && (
              <Button
                variant="outline"
                className="rounded-[16px] bg-[#508CD3] hover:bg-blue-700 text-white border-none"
                onClick={handleCloseTicket}
                disabled={updateTicketMutation.isPending}
              >
                {updateTicketMutation.isPending ? "Closing..." : "Close Ticket"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation Thread */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {ticket.createdBy}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {ticket.createdDate}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all overflow-wrap-anywhere space-y-4">
                  <p className="break-all">{ticket.description}</p>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {ticket.attachments.map((attachment) => (
                      <div
                        key={attachment}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Replies */}
          {repliesLoading ? (
            <div className="bg-card rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading replies...</p>
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="bg-card rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      reply.role === "support"
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-blue-100 dark:bg-blue-900",
                    )}
                  >
                    <User
                      className={cn(
                        "w-5 h-5",
                        reply.role === "support"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {reply.author}
                      </span>
                      {reply.role === "support" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                          Support
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {reply.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                      {reply.message}
                    </p>
                  </div>
                </div>
                {reply.attachments && reply.attachments.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {reply.attachments.map((attachment) => (
                      <div
                        key={attachment}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Reply Composer */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Reply
            </h3>
            <form onSubmit={handleSendReply} className="space-y-4">
              <Controller
                name="message"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Textarea
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        messageAreaRef.current = e;
                      }}
                      placeholder="Type your message here..."
                      className="min-h-[150px] resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && fieldState.error?.message ? (
                      <p className="text-sm text-red-500">{fieldState.error.message}</p>
                    ) : null}
                  </div>
                )}
              />
              
              {/* File attachments display */}
              {form.watch("attachments")?.length ? (
                <div className="space-y-2">
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
                        onClick={() => handleRemoveFile(file)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors shrink-0"
                      >
                        <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div>
                  <input
                    ref={fileInputRef}
                    id="reply-file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[16px] bg-gray-100 hover:bg-gray-200 text-gray-800 border-none hover:text-gray-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="rounded-[16px] bg-[#508CD3] hover:bg-blue-700 text-white border-none"
                  disabled={createReplyMutation.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {createReplyMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Ticket Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ticket Information */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ticket Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</p>
                <p className="text-gray-900 dark:text-white">
                  {ticket.issueCategory?.name || ticket.issueCategoryId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Priority
                </p>
                <p className="text-gray-900 dark:text-white">{ticket.priority}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <p className="text-gray-900 dark:text-white">{ticket.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Assigned To
                </p>
                <p className="text-gray-900 dark:text-white">
                  {ticket.assignedToUserId
                    ? users?.find(user => user.id === ticket.assignedToUserId)?.fullName ||
                      "Not assigned"
                    : "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No activities yet</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
