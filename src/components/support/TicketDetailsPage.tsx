"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Clock, MessageSquare, Paperclip, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TicketReply {
  id: string;
  author: string;
  role: "user" | "support";
  message: string;
  timestamp: string;
  attachments?: string[];
}

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

// Mock replies - replace with actual API data
const mockReplies: TicketReply[] = [
  {
    id: "1",
    author: "Support Team",
    role: "support",
    message:
      "Thank you for reaching out to us. We've received your ticket and our technical team is investigating the issue. We'll update you as soon as we have more information.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: "John Doe",
    role: "user",
    message:
      "Thanks for the quick response. I've tried clearing my cache and cookies but the issue persists. Is there anything else I should try?",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    author: "Support Team",
    role: "support",
    message:
      "We've identified the issue. It appears to be related to a recent update. Our development team is working on a fix and we expect to have it resolved within the next 24 hours. We'll notify you once it's fixed.",
    timestamp: "30 minutes ago",
  },
];

const TicketDetailsPage = ({ ticket, onBack, onClose, mode = "view" }: TicketDetailsPageProps) => {
  const [replies] = useState<TicketReply[]>(mockReplies);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageAreaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const handleSendReply = handleSubmit(
    async data => {
      setIsSubmittingReply(true);
      // TODO: API call to send reply
      console.log("Sending reply:", data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      reset();
      setIsSubmittingReply(false);
    },
    () => {
      // validation errors are surfaced via Controller fieldState
    },
  );

  const handleCloseTicket = () => {
    // TODO: API call to close ticket
    console.log("Closing ticket:", ticket.id);
    onClose?.(ticket);
  };

  return (
    <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6", "bg-background")}>
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
            {mode === "view" && (
              <div className="inline-flex items-center gap-2 rounded-[16px] bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                <MessageSquare className="h-4 w-4" />
                Viewing ticket
              </div>
            )}
            {mode === "reply" && (
              <div className="inline-flex items-center gap-2 rounded-[16px] bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-200">
                <MessageSquare className="h-4 w-4" />
                Replying to ticket
              </div>
            )}
            {ticket.status !== "Closed" && (
              <Button
                variant="outline"
                className="rounded-[16px]"
                onClick={handleCloseTicket}
              >
                Close Ticket
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {ticket.createdBy}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {ticket.createdDate}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap space-y-4">
                  <p>{ticket.description}</p>
                  <p>I&apos;ve been experiencing this issue since yesterday.</p>
                  <p>When I try to log in, I&apos;m successfully authenticated.</p>
                  <p>However, I then get redirected to a 404 page instead of the dashboard.</p>
                  <p>I&apos;ve tried different browsers and cleared my cache.</p>
                  <p>The problem persists.</p>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {ticket.attachments.map(attachment => (
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
          {replies.map(reply => (
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
                <div className="flex-1">
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
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {reply.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

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
                      placeholder="Type your message here..."
                      className="min-h-[150px] resize-none"
                      aria-invalid={fieldState.invalid}
                      ref={value => {
                        field.ref(value);
                        if (value) {
                          messageAreaRef.current = value;
                        }
                      }}
                    />
                    {fieldState.invalid && fieldState.error?.message ? (
                      <p className="text-sm text-red-500">{fieldState.error.message}</p>
                    ) : null}
                  </div>
                )}
              />
              <Controller
                name="attachments"
                control={control}
                render={({ field }) => {
                  const selectedFiles = Array.isArray(field.value) ? field.value : [];

                  return (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          ref={fileInputRef}
                          onChange={event => {
                            const files = event.target.files
                              ? Array.from(event.target.files)
                              : [];
                            field.onChange(files);
                            event.target.value = "";
                          }}
                          onBlur={field.onBlur}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-[16px]"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach File
                        </Button>
                        {selectedFiles.length > 0 ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedFiles.length} file(s) selected
                          </span>
                        ) : null}
                      </div>
                      <Button
                        type="submit"
                        className="rounded-[16px] bg-[#508CD3] hover:bg-blue-700"
                        disabled={isSubmittingReply}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmittingReply ? "Sending..." : "Send Reply"}
                      </Button>
                    </div>
                  );
                }}
              />
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
                <label htmlFor="category" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Category
                </label>
                <p className="text-gray-900 dark:text-white">{ticket.category}</p>
              </div>
              <div>
                <label htmlFor="priority" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Priority
                </label>
                <p className="text-gray-900 dark:text-white">{ticket.priority}</p>
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <p className="text-gray-900 dark:text-white">{ticket.status}</p>
              </div>
              <div>
                <label htmlFor="assignedTo" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Assigned To
                </label>
                <p className="text-gray-900 dark:text-white">
                  {ticket.assignedTo || "Not assigned"}
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
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    Status changed to In Progress
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">30 minutes ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    Support team replied
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    User replied
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    Support team replied
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    Ticket created
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ticket.createdDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;

