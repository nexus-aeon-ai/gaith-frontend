"use client";

import { Send, Menu, Sparkles, FileText, Users, Settings } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Chat } from "./page";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
}

export function ChatWindow({ chat, onSendMessage, onToggleSidebar }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleQuickAction = (action: string) => {
    onSendMessage(action);
  };

  return (
    <div className="flex flex-col h-full min-w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onToggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-foreground">{chat.title}</h1>
              <p className="text-sm text-muted-foreground">Client: {chat.client}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {chat.messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.sender === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted text-foreground",
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Generate Ad Copy")}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Generate Ad Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Write Blog Title")}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Write Blog Title
            </Button>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Let the magic begin. Ask a question..."
              className="flex-1 bg-input border-border"
            />
            <Button type="submit" size="sm" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center justify-center mt-3">
            <p className="text-xs text-muted-foreground">
              © 2025 GaIN · All rights reserved · Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
