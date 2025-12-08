"use client";

import { AudioLines, CirclePlus, Mic } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";

import { Input } from "../ui/input";

interface AiChatInputProps {
  placeholder?: string;
  disabled?: boolean;
}

export function AiChatInput({ disabled = false }: AiChatInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log("[v0] Files selected:", files);
    }
  };

  // if we are in a chatbot page then we should not show the chat input
  const pathname = usePathname();
  const isChatbotPage = pathname.includes("/ai-chatbot");
  if (isChatbotPage) {
    return null;
  }

  return (
    <div className="w-full px-2 mx-auto">
      {/* Main input container */}
      <div className="bg-background border border-border rounded-3xl shadow-lg overflow-hidden">
        {/* Input area */}
        <div className="flex items-end gap-3 px-2 p-4 pt-0">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={handleTextareaChange as any}
              onKeyDown={handleKeyDown}
              placeholder={"Let the magic begin, Ask a question"}
              disabled={disabled}
              className="min-h-[24px] shadow-none focus:border-none focus:outline-none  max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-6 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center justify-between px-2 pb-4 pt-0">
          <div className="flex items-center gap-2">
            {/* File upload button */}
            <div className="cursor-pointer px-3">
              <CirclePlus
                size={20}
                onClick={handleFileUpload}
                className="dark:text-white text-black "
              />
            </div>
          </div>

          <div className="flex items-center">
            {/* Voice input */}
            <div className="cursor-pointer px-3">
              <Mic size={20} onClick={handleFileUpload} className="dark:text-white text-black " />
            </div>
            <div className="cursor-pointer pr-2">
              <AudioLines size={20} onClick={handleFileUpload} className="dark:text-white text-black " />
            </div>

           
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,text/*,.pdf,.doc,.docx"
      />

    </div>
  );
}
