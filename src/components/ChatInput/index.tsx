"use client";

import { AudioLines, CirclePlus, Mic } from "lucide-react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface AiChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend?: (data: { message: string }) => void;
}

export function AiChatInput({ disabled = false, onSend }: AiChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<{ message: string }>({
    defaultValues: {
      message: "",
    },
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
    }
  };

  const onSubmit = (data: { message: string }) => {
    if (data.message.trim() && !disabled) {
      onSend?.(data); // callback to parent if needed
      form.reset(); // clear the textarea
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-2 mx-auto">
        {/* Main input container */}
        <div className="bg-background border border-border rounded-3xl shadow-lg overflow-hidden">
          {/* Input area */}
          <div className="flex items-end gap-3 px-2 p-4 pt-0">
            <div className="flex-1 relative">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        placeholder="Let the magic begin, Ask a question"
                        disabled={disabled}
                        rows={2}
                        className="bg-transparent shadow-none focus:border-none focus:outline-none max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-6 placeholder:text-muted-foreground"
                      />
                    </FormControl>
                  </FormItem>
                )}
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
                  className="dark:text-white text-black"
                />
              </div>
            </div>

            <div className="flex items-center">
              {/* Voice input */}
              <div className="cursor-pointer px-3">
                <Mic size={20} onClick={handleFileUpload} className="dark:text-white text-black" />
              </div>
              <div className="cursor-pointer pr-2">
                <AudioLines
                  size={20}
                  onClick={handleFileUpload}
                  className="dark:text-white text-black"
                />
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
      </form>
    </Form>
  );
}
