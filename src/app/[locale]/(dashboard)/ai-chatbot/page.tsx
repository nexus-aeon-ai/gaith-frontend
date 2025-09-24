"use client";

import { useState } from "react";

import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";

export interface Chat {
  id: string;
  title: string;
  client: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    title: "MK Marketing Team Chat",
    client: "Global Solutions Inc.",    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

    timestamp: "2h ago",
    messages: [
      {
        id: "1",
        content:
          "Hello! I'm your AI Marketing Assistant. I can help you with campaign planning, content generation, and strategic insights. What would you like to work on today?",
        sender: "assistant",
        timestamp: "9:30 AM",
      },
      {
        id: "2",
        content: "I need help creating ad copy for our new seasonal coffee blend campaign",
        sender: "user",
        timestamp: "9:30 AM",
      },
      {
        id: "3",
        content:
          "Perfect! I'd love to help you create compelling ad copy for your seasonal coffee blend. To craft the most effective copy, could you tell me:\n\n• What makes this seasonal blend unique?\n• Who is your target audience?\n• What platforms will you be advertising on?\n• Any specific tone or style preferences?",
        sender: "assistant",
        timestamp: "9:30 AM",
      },
      {
        id: "4",
        content: "I need help creating ad copy for our new seasonal coffee blend campaign",
        sender: "user",
        timestamp: "9:30 AM",
      },
    ],
  },
  {
    id: "2",
    title: "TechStart Campaign",
    client: "TechStart",    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Welcome to your TechStart campaign planning session!",
        sender: "assistant",
        timestamp: "10:15 AM",
      },
    ],
  },
  {
    id: "3",
    title: "HealthApp Marketing",
    client: "HealthApp",
    lastMessage: "Generate ad copy for new seasonal blend campaign",
    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Let's discuss your HealthApp marketing strategy.",
        sender: "assistant",
        timestamp: "2:45 PM",
      },
    ],
  },
  {
    id: "4",
    title: "E-commerce Strategy",
    client: "Global Solutions Inc.",
    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",
    timestamp: "2h ago",
    messages: [
      {
        id: "1",
        content: "Ready to optimize your e-commerce marketing approach?",
        sender: "assistant",
        timestamp: "11:20 AM",
      },
    ],
  },
  {
    id: "5",
    title: "Social Media Campaign",
    client: "TechStart",
    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Let's create an engaging social media campaign!",
        sender: "assistant",
        timestamp: "3:30 PM",
      },
    ],
  },
  {
    id: "6",
    title: "Brand Positioning",
    client: "HealthApp",
    lastMessage: "Generate ad copy for new seasonal blend campaign",
    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Time to refine your brand positioning strategy.",
        sender: "assistant",
        timestamp: "4:15 PM",
      },
    ],
  },
  {
    id: "7",
    title: "Brand Positioning",
    client: "HealthApp",
    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Time to refine your brand positioning strategy.",
        sender: "assistant",
        timestamp: "4:15 PM",
      },
    ],
  },
  {
    id: "8",
    title: "Brand Positioning",
    client: "HealthApp",    lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

    timestamp: "1d ago",
    messages: [
      {
        id: "1",
        content: "Time to refine your brand positioning strategy.",
        sender: "assistant",
        timestamp: "4:15 PM",
      },
    ],
  },
];

export default function ChatbotPage() {
  const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Add user message
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for your message! I'm processing your request and will provide a detailed response shortly.",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setActiveChat(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
      }));
    }, 1000);
  };

  return (
    <div className="flex p-3 h-[calc(100vh-var(--header-height))] w-full overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        // eslint-disable-next-line
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 md:z-0 w-full sm:w-80 lg:w-80 h-full
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <ChatSidebar chats={mockChats} activeChat={activeChat} onChatSelect={handleChatSelect} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full">
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
}
