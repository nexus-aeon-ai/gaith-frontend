"use client";

import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/ui/icons/chatbot/search";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/lib/types/ai-chat";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat;
  onChatSelect: (chat: Chat) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditChat: (chat: Chat) => void;
}

export function ChatSidebar({ chats, activeChat, onChatSelect, searchQuery, onSearchChange, onEditChat }: ChatSidebarProps) {

  return (
    <ScrollArea className="relative h-full pb-2 rounded-l-[12px] dark:bg-[#212945] bg-white border-r border-sidebar-border flex flex-col min-w-0">
      {/* Header */}
      <div className="p-3 sm:p-2 fixed bg-white dark:bg-[#212945] z-20 w-full lg:h-[120px] h-[190px]">
        <div className="flex items-center justify-between mb-3 sm:mb-4 pt-[70px] lg:pt-0">
          <h2 className="text-base sm:text-lg  mx-1 font-semibold text-sidebar-foreground truncate">
            Chat List
          </h2>
        </div>
        {/* Search */}
        <div className="relative flex items-center border-1 dark:border-gray-600 border-[#DCE0E4] p-2 px-3 dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]">
          <SearchIcon className="" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className=" border-none bg-transparent focus:ring-0 shadow-none focus:outline-none text-sidebar-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 z-10 h-0 lg:mt-[120px] mt-[200px]">
        <div className="px-2 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            chats.map(chat => (
              <div key={chat.id} className="relative group">
                <Button
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
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChat(chat);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
