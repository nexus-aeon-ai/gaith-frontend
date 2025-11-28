// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { AudioLines, CirclePlus, Menu, Mic, Send } from "lucide-react";
// import { useTheme } from "next-themes";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Avatar } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import ChatbotIcon from "@/components/ui/icons/chatbot/chatbot";
// import EditPencilIcon from "@/components/ui/icons/chatbot/edit-pencil";
// import SettingsIcon from "@/components/ui/icons/chatbot/settings";
// import SpeakerIcon from "@/components/ui/icons/chatbot/speaker";
// import UserIcon from "@/components/ui/icons/chatbot/user-icon";
// import UsersIcon from "@/components/ui/icons/chatbot/users";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import type { Chat } from "@/lib/types";
// import { cn } from "@/lib/utils";

// import { Textarea } from "../ui/textarea";

// interface ChatWindowProps {
//   chat: Chat;
//   onSendMessage: (message: string, attachmentUrls?: string[]) => void;
//   onToggleSidebar: () => void;
//   isLoading?: boolean;
//   isSending?: boolean;
// }

// const formSchema = z.object({
//   message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
// });

// type FormValues = z.infer<typeof formSchema>;

// export function ChatWindow({
//   chat,
//   onSendMessage,
//   onToggleSidebar,
//   isLoading,
//   isSending,
// }: ChatWindowProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
//   const { theme: themeNext } = useTheme();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       message: "",
//     },
//   });

//   const { watch } = form;
//   const messageValue = watch("message");

//   const onSubmit = (data: FormValues) => {
//     onSendMessage(data.message, attachmentUrls.length > 0 ? attachmentUrls : undefined);
//     form.reset();
//     setAttachmentUrls([]);
//   };

//   const handleQuickAction = (action: string) => {
//     onSendMessage(action);
//   };

//   const handleAttachment = () => {
//     // Create a file input for general attachments
//     const input = document.createElement("input");
//     input.type = "file";
//     input.multiple = true;
//     input.accept = "*/*";
//     input.onchange = e => {
//       const files = (e.target as HTMLInputElement).files;
//       if (files) {
//         // console.log("Attachments selected:", files);
//         // Handle file upload logic here
//       }
//     };
//     input.click();
//   };

//   const handleVoiceRecording = () => {
//     setIsRecording(!isRecording);
//     if (!isRecording) {
//       // console.log("Starting voice recording...");
//       // Start recording logic here
//     } else {
//       // console.log("Stopping voice recording...");
//       // Stop recording logic here
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-[#eeeeee] rounded-[12px] dark:bg-background">
//       {/* Header - Non-scrollable */}
//       <div className="flex-shrink-0 flex items-start rounded-tr-[12px] rounded-t-[12px] lg:rounded-tl-none justify-between p-3 sm:p-4 border-b border-border dark:bg-[#212945] bg-white">
//         <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="lg:hidden flex-shrink-0"
//             onClick={onToggleSidebar}
//           >
//             <Menu className="h-4 w-4" />
//           </Button>

//           <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
//             <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
//               <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
//             </Avatar>
//             <div className="min-w-0 flex-1">
//               <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">
//                 {chat.title}
//               </h1>
//               <p className="text-xs sm:text-sm text-muted-foreground truncate">
//                 Client: {chat.client}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
//           <div className="hover:opacity-[70%] cursor-pointer">
//             <UsersIcon color={themeNext === "dark" ? "#CACCD6" : "#687192"} />
//           </div>
//           <div className="hover:opacity-[70%] cursor-pointer">
//             <SettingsIcon color={themeNext === "dark" ? "#CACCD6" : "#687192"} />
//           </div>
//         </div>
//       </div>

//       {/* Messages - Scrollable container */}
//       <div className="flex-1 min-h-0 overflow-hidden">
//         <ScrollArea className="h-full">
//           <div className="p-3 sm:p-4 sm:pb-2 space-y-3 sm:space-y-4">
//             {isLoading ? (
//               <div className="flex items-center justify-center h-full">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//               </div>
//             ) : (
//               <>
//                 {chat.messages.map(message => (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex gap-2 sm:gap-3 w-full",
//                       message.sender === "user" ? "justify-end" : "justify-start",
//                     )}
//                   >
//                     {message.sender === "assistant" && (
//                       <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
//                         <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
//                       </Avatar>
//                     )}

//                     <div
//                       className={cn(
//                         "flex flex-col max-w-[85%] sm:max-w-[70%] rounded-lg px-3 sm:px-4 py-2",
//                         message.sender === "user"
//                           ? " bg-[#3072C0] text-primary-foreground  ml-auto"
//                           : "dark:bg-[#212945] bg-white dark:text-[#CCCFDB] text-[#303444]",
//                       )}
//                     >
//                       <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
//                         {message.content}
//                       </p>
//                       <p
//                         className={`text-xs opacity-70 mt-1 ${
//                           message.sender === "user" ? "self-end" : "self-start"
//                         }`}
//                       >
//                         {message.timestamp}
//                       </p>
//                     </div>

//                     {message.sender === "user" && (
//                       <Avatar className="flex items-center justify-center dark:bg-[#212945] bg-white pt-[2px] h-9 w-9 flex-shrink-0">
//                         <UserIcon color={themeNext === "dark" ? "white" : "#687192"} />
//                       </Avatar>
//                     )}
//                   </div>

//                 ))}
//                 {isSending && (
//                   <div className="flex gap-2 sm:gap-3 w-full justify-start">
//                     <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
//                       <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
//                     </Avatar>
//                     <div className="flex items-center gap-2 dark:bg-[#212945] bg-white px-3 sm:px-4 py-2 rounded-lg">
//                       <div className="flex gap-1">
//                         <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
//                         <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
//                         <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {/* Scroll anchor */}
//               </>
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       {/* Input Area */}
//       <div className="flex-shrink-0 p-3 pt-1 sm:p-4 sm:pb-0 sm:pt-1 bg-[#eeeeee] dark:bg-background">
//         <div className="w-full pb-4">
//           {/* Quick Actions */}
//           <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleQuickAction("Generate Ad Copy")}
//               className="border-none dark:bg-[#0F1B29] dark:border-[#404663] dark:text-[#CCCFDB] dark:hover:opacity-[70%] hover:bg-gray-200 hover:text-dark"
//             >
//               <SpeakerIcon color={themeNext === "dark" ? "white" : "black"} />
//               Generate Ad Copy
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleQuickAction("Generate Ad Copy")}
//               className="border-none dark:bg-[#0F1B29] dark:border-[#404663] dark:text-[#CCCFDB] dark:hover:opacity-[70%] hover:bg-gray-200 hover:text-dark"
//             >
//               <EditPencilIcon color={themeNext === "dark" ? "white" : "black"} />
//               Write Blog Title
//             </Button>
//           </div>

//           {/* Message Input */}
//           <div className="space-y-3 p-1 border-1 dark:border-[#404663] rounded-[12px] text-sm dark:bg-[#0F1B29] bg-white dark:text-[#CCCFDB] focus-within:ring-1 focus-within:ring-blue-500">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
//                 <FormField
//                   control={form.control}
//                   name="message"
//                   render={({ field }) => (
//                     <FormItem className="flex-1 border-none outline-none ">
//                       <FormControl>
//                         <Textarea
//                           {...field}
//                           rows={2}
//                           placeholder="Let the magic begin, Ask a question"
//                           disabled={isSending}
//                           className="!shadow-none !focus:shadow-none !border-none bg-transparent !focus:!stroke-none
//                  !ring-0 !outline-none !focus:ring-0 !focus:outline-none disabled:opacity-50"
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </form>
//             </Form>

//             {/* Bottom Row - Attachment and Voice Controls */}
//             <div className="flex p-0 items-center justify-between">
//               <div className="flex items-center gap-3 p-0">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="p-2 h-auto hover:opacity-70 dark:text-[#CCCFDB] transition-opacity"
//                   onClick={handleAttachment}
//                   title="Attach files"
//                 >
//                   <CirclePlus className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="flex items-center pr-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className={cn(
//                     "p-2 h-auto transition-all duration-200", // base
//                     {
//                       "text-red-500 animate-pulse bg-red-50 dark:bg-red-950/20": isRecording,
//                       "hover:opacity-70 dark:text-[#CCCFDB]": !isRecording,
//                     },
//                   )}
//                   onClick={handleVoiceRecording}
//                   title={isRecording ? "Stop recording" : "Start voice recording"}
//                 >
//                   <Mic className={cn("h-4 w-4   ", isRecording && "fill-current")} />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className={cn("h-8 transition-all duration-200")}
//                   onClick={messageValue?.trim() ? form.handleSubmit(onSubmit) : handleVoiceRecording}
//                   disabled={isSending}
//                   title={
//                     messageValue?.trim()
//                       ? "Send message"
//                       : isRecording
//                         ? "Stop recording"
//                         : "Start voice recording"
//                   }
//                 >
//                   {messageValue?.trim() ? (
//                     <Send className="h-5 w-5" />
//                   ) : (
//                     <AudioLines className="h-8 w-4" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AudioLines, CirclePlus, Menu, Mic, Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ChatbotIcon from "@/components/ui/icons/chatbot/chatbot";
import EditPencilIcon from "@/components/ui/icons/chatbot/edit-pencil";
import SettingsIcon from "@/components/ui/icons/chatbot/settings";
import SpeakerIcon from "@/components/ui/icons/chatbot/speaker";
import UserIcon from "@/components/ui/icons/chatbot/user-icon";
import UsersIcon from "@/components/ui/icons/chatbot/users";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Textarea } from "../ui/textarea";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (message: string, attachmentUrls?: string[]) => void;
  onToggleSidebar: () => void;
  isLoading?: boolean;
  isSending?: boolean;
}

const formSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
});

type FormValues = z.infer<typeof formSchema>;

export function ChatWindow({
  chat,
  onSendMessage,
  onToggleSidebar,
  isLoading,
  isSending,
}: ChatWindowProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const { theme: themeNext } = useTheme();
  
  // Ref for the messages container to enable auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { watch } = form;
  const messageValue = watch("message");

  // Auto-scroll to bottom when messages change or when sending
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const onSubmit = (data: FormValues) => {
    onSendMessage(data.message, attachmentUrls.length > 0 ? attachmentUrls : undefined);
    form.reset();
    setAttachmentUrls([]);
    // Scroll after sending message
    setTimeout(scrollToBottom, 100);
  };

  const handleQuickAction = (action: string) => {
    onSendMessage(action);
    setTimeout(scrollToBottom, 100);
  };

  const handleAttachment = () => {
    // Create a file input for general attachments
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "*/*";
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        // console.log("Attachments selected:", files);
        // Handle file upload logic here
      }
    };
    input.click();
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // console.log("Starting voice recording...");
      // Start recording logic here
    } else {
      // console.log("Stopping voice recording...");
      // Stop recording logic here
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#eeeeee] rounded-[12px] dark:bg-background">
      {/* Header - Non-scrollable */}
      <div className="flex-shrink-0 flex items-start rounded-tr-[12px] rounded-t-[12px] lg:rounded-tl-none justify-between p-3 sm:p-4 border-b border-border dark:bg-[#212945] bg-white">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden flex-shrink-0"
            onClick={onToggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
              <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">
                {chat.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Client: {chat.client}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="flex items-center -space-x-2 overflow-hidden mr-2">
            {chat.assignedEmployees && chat.assignedEmployees.length > 0 ? (
              chat.assignedEmployees.map((emp) => (
                <Avatar 
                  key={emp.id} 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  title={emp.user?.fullName || emp.fullName}
                >
                  {emp.profilePicture || emp.user?.profilePic ? (
                    <img 
                      src={emp.profilePicture || emp.user?.profilePic || ""} 
                      alt={emp.user?.fullName || emp.fullName} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-xs text-primary-foreground">
                      {(emp.user?.fullName || emp.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
              ))
            ) : (
              <div className="hover:opacity-[70%] cursor-pointer">
                <UsersIcon color={themeNext === "dark" ? "#CACCD6" : "#687192"} />
              </div>
            )}
          </div>
          <div className="hover:opacity-[70%] cursor-pointer">
            <SettingsIcon color={themeNext === "dark" ? "#CACCD6" : "#687192"} />
          </div>
        </div>
      </div>

      {/* Messages - Scrollable container */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-3 sm:p-4 sm:pb-2 space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                {chat.messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3 w-full",
                      message.sender === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
                        <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "flex flex-col max-w-[85%] sm:max-w-[70%] rounded-lg px-3 sm:px-4 py-2",
                        message.sender === "user"
                          ? " bg-[#3072C0] text-primary-foreground  ml-auto"
                          : "dark:bg-[#212945] bg-white dark:text-[#CCCFDB] text-[#303444]",
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs opacity-70 mt-1 ${
                          message.sender === "user" ? "self-end" : "self-start"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="flex items-center justify-center dark:bg-[#212945] bg-white pt-[2px] h-9 w-9 flex-shrink-0">
                        <UserIcon color={themeNext === "dark" ? "white" : "#687192"} />
                      </Avatar>
                    )}
                  </div>

                ))}
                {isSending && (
                  <div className="flex gap-2 sm:gap-3 w-full justify-start">
                    <Avatar className="flex items-center justify-center bg-[linear-gradient(360deg,#2BAE82_0%,#266297_100%)]">
                      <ChatbotIcon color={themeNext === "light" ? "white" : "black"} />
                    </Avatar>
                    <div className="flex items-center gap-2 dark:bg-[#212945] bg-white px-3 sm:px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Scroll anchor - invisible element at the bottom */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-3 pt-1 sm:p-4 sm:pb-0 sm:pt-1 bg-[#eeeeee] dark:bg-background">
        <div className="w-full pb-4">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Generate Ad Copy")}
              className="border-none dark:bg-[#0F1B29] dark:border-[#404663] dark:text-[#CCCFDB] dark:hover:opacity-[70%] hover:bg-gray-200 hover:text-dark"
            >
              <SpeakerIcon color={themeNext === "dark" ? "white" : "black"} />
              Generate Ad Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Generate Ad Copy")}
              className="border-none dark:bg-[#0F1B29] dark:border-[#404663] dark:text-[#CCCFDB] dark:hover:opacity-[70%] hover:bg-gray-200 hover:text-dark"
            >
              <EditPencilIcon color={themeNext === "dark" ? "white" : "black"} />
              Write Blog Title
            </Button>
          </div>

          {/* Message Input */}
          <div className="space-y-3 p-1 border-1 dark:border-[#404663] rounded-[12px] text-sm dark:bg-[#0F1B29] bg-white dark:text-[#CCCFDB] focus-within:ring-1 focus-within:ring-blue-500">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1 border-none outline-none ">
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="Let the magic begin, Ask a question"
                          disabled={isSending}
                          className="!shadow-none !focus:shadow-none !border-none bg-transparent !focus:!stroke-none
                 !ring-0 !outline-none !focus:ring-0 !focus:outline-none disabled:opacity-50"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Bottom Row - Attachment and Voice Controls */}
            <div className="flex p-0 items-center justify-between">
              <div className="flex items-center gap-3 p-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-auto hover:opacity-70 dark:text-[#CCCFDB] transition-opacity"
                  onClick={handleAttachment}
                  title="Attach files"
                >
                  <CirclePlus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center pr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "p-2 h-auto transition-all duration-200", // base
                    {
                      "text-red-500 animate-pulse bg-red-50 dark:bg-red-950/20": isRecording,
                      "hover:opacity-70 dark:text-[#CCCFDB]": !isRecording,
                    },
                  )}
                  onClick={handleVoiceRecording}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  <Mic className={cn("h-4 w-4   ", isRecording && "fill-current")} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 transition-all duration-200")}
                  onClick={messageValue?.trim() ? form.handleSubmit(onSubmit) : handleVoiceRecording}
                  disabled={isSending}
                  title={
                    messageValue?.trim()
                      ? "Send message"
                      : isRecording
                        ? "Stop recording"
                        : "Start voice recording"
                  }
                >
                  {messageValue?.trim() ? (
                    <Send className="h-5 w-5" />
                  ) : (
                    <AudioLines className="h-8 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}