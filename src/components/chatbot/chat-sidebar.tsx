"use client";

import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/ui/icons/chatbot/search";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Chat } from "./chatbot";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat;
  onChatSelect: (chat: Chat) => void;
}

export function ChatSidebar({ chats, activeChat, onChatSelect }: ChatSidebarProps) {
  return (
    <ScrollArea className="h-full pb-2 rounded-l-[12px] dark:bg-[#212945] bg-white border-r border-sidebar-border flex flex-col min-w-0">
      {/* Header */}
      <div className="p-3 sm:p-2 ">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg  mx-1 font-semibold text-sidebar-foreground truncate">
            Chat List
          </h2>
          {/* <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
            <Plus className="h-4 w-4" />
          </Button> */}
        </div>

        {/* Search */}
        <div className="relative flex items-center border-1 dark:border-gray-600 border-[#DCE0E4] p-2 px-3 dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]">
          <SearchIcon className="" />
          <Input
            placeholder="Search conversations..."
            className=" border-none bg-transparent focus:ring-0 shadow-none focus:outline-none text-sidebar-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 h-0">
        <div className="px-2 space-y-2">
          {chats.map(chat => (
            <Button
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              variant="ghost"
              className={cn(
                "w-full cursor-pointer p-3 rounded-lg text-left dark:bg-[#0F1B29] bg-[#F3F5F7] transition-colors h-auto whitespace-normal break-words",
                "hover:opacity-40 transition-opacity",
                "justify-start",
                activeChat.id === chat.id
                  ? "dark:bg-gray-700 dark:text-sidebar-primary-foreground bg-[#d5e3f4]"
                  : "text-sidebar-foreground",
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-xs sm:text-sm truncate">
                      Client: {chat.client}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-1 sm:ml-2">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{chat.lastMessage}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
