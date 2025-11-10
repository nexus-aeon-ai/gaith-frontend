"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getConversationById, getConversations } from "@/lib/api/ai-chatbot";
import type { Conversation, Message } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";


// const mockChats: Chat[] = [
//   {
//     id: "1",
//     title: "MK Marketing Team Chat",
//     client: "Global Solutions Inc.",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

//     timestamp: "2h ago",
//     messages: [
//       {
//         id: "1",
//         content:
//           "Hello! I'm your AI Marketing Assistant. I can help you with campaign planning, content generation, and strategic insights. What would you like to work on today?",
//         sender: "assistant",
//         timestamp: "9:30 AM",
//       },
//       {
//         id: "2",
//         content: "I need help creating ad copy for our new seasonal coffee blend campaign",
//         sender: "user",
//         timestamp: "9:30 AM",
//       },
//       {
//         id: "3",
//         content:
//           "Perfect! I'd love to help you create compelling ad copy for your seasonal coffee blend. To craft the most effective copy, could you tell me:\n\n• What makes this seasonal blend unique?\n• Who is your target audience?\n• What platforms will you be advertising on?\n• Any specific tone or style preferences?",
//         sender: "assistant",
//         timestamp: "9:30 AM",
//       },
//       {
//         id: "4",
//         content: "I need help creating ad copy for our new seasonal coffee blend campaign",
//         sender: "user",
//         timestamp: "9:30 AM",
//       },
//     ],
//   },
//   {
//     id: "2",
//     title: "TechStart Campaign",
//     client: "TechStart",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Welcome to your TechStart campaign planning session!",
//         sender: "assistant",
//         timestamp: "10:15 AM",
//       },
//     ],
//   },
//   {
//     id: "3",
//     title: "HealthApp Marketing",
//     client: "HealthApp",
//     lastMessage: "Generate ad copy for new seasonal blend campaign",
//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Let's discuss your HealthApp marketing strategy.",
//         sender: "assistant",
//         timestamp: "2:45 PM",
//       },
//     ],
//   },
//   {
//     id: "4",
//     title: "E-commerce Strategy",
//     client: "Global Solutions Inc.",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",
//     timestamp: "2h ago",
//     messages: [
//       {
//         id: "1",
//         content: "Ready to optimize your e-commerce marketing approach?",
//         sender: "assistant",
//         timestamp: "11:20 AM",
//       },
//     ],
//   },
//   {
//     id: "5",
//     title: "Social Media Campaign",
//     client: "TechStart",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Let's create an engaging social media campaign!",
//         sender: "assistant",
//         timestamp: "3:30 PM",
//       },
//     ],
//   },
//   {
//     id: "6",
//     title: "Brand Positioning",
//     client: "HealthApp",
//     lastMessage: "Generate ad copy for new seasonal blend campaign",
//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Time to refine your brand positioning strategy.",
//         sender: "assistant",
//         timestamp: "4:15 PM",
//       },
//     ],
//   },
//   {
//     id: "7",
//     title: "Brand Positioning",
//     client: "HealthApp",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Time to refine your brand positioning strategy.",
//         sender: "assistant",
//         timestamp: "4:15 PM",
//       },
//     ],
//   },
//   {
//     id: "8",
//     title: "Brand Positioning",
//     client: "HealthApp",
//     lastMessage: "Generate ad copy for new seasonal blend campaign for the e-commerce website",

//     timestamp: "1d ago",
//     messages: [
//       {
//         id: "1",
//         content: "Time to refine your brand positioning strategy.",
//         sender: "assistant",
//         timestamp: "4:15 PM",
//       },
//     ],
//   },
// ];

const welcomeMessage: Conversation = {
  id: "welcome-chat",
  title: "Welcome Chat",
  client: "Getting Started",
  clientId: "welcome-client",
  lastMessageText: "Hello! I'm your AI Marketing Assistant. How can I assist you today?",
  lastMessageDate: new Date().toISOString(),
  lastMessageSender: "assistant",
  timestamp: "just now",
  organizationId: "",
  isActive: true,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: "welcome-msg",
      text:
        "Hello! I'm your AI Marketing Assistant. I can help you with campaign planning, content generation, and strategic insights. What would you like to work on today?",
      sendBy: "AI",
      timestamp: new Date().toISOString(),
    },
  ],
};
export default function Chatbot() {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<Conversation | null>(welcomeMessage);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [apiConversations, setApiConversations] = useState<Conversation[]>([]);

  // Fetch conversations
  const { data: conversations } = useQuery({
    queryKey: ["ai-chat"],
    queryFn: async () => {
      const res = await getConversations();
      return res.data ?? [];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["ai-chat"],
    queryFn: async () => {
      const res = await getConversationById("cdca8237-ca58-4a22-ab51-6ab254827345" );
      return res.data ?? [];
    },
  });

  console.log("Fetched messages:", messages);

  // useMemo(() => {
  //   setApiConversations(conversations as Conversation[]);
  // }, [conversations]);

  // console.log("Fetched conversations:", apiConversations);

  // const handleChatSelect = (chat: Chat) => {
  //   setActiveChat(chat);
  //   setIsSidebarOpen(false); // Close sidebar on mobile after selection
  // };

  // const handleChatSelect = async (chat: Conversation) => {
  //   setIsSidebarOpen(false); // close sidebar on mobile

  //   // If user clicks same chat again, ignore
  //   if (activeChat?.id === chat.id) return;

  //   // Set temporary loading chat
  //   setActiveChat({ ...chat, messages: [] });

  //   // Fetch full conversation (with messages)
  //   const { data } = await getConversationById(chat.id);

  //   if (data) {
  //     setActiveChat(data);
  //     // Optionally, cache it in react-query
  //     queryClient.setQueryData(["conversation", chat.id], data);
  //   }
  // };

  const handleChatSelect = async (chat: Conversation) => {
    setIsSidebarOpen(false);

    // If user clicks same chat again, ignore
    if (activeChat?.id === chat.id) return;

    // ✅ 1. Check cache first (React Query cache)
    const cachedChat = queryClient.getQueryData<Conversation>(["conversation", chat.id]);

    if (cachedChat) {
      console.log("💾 Loaded chat from cache:", cachedChat);
      setActiveChat(cachedChat);
      return;
    }

    // ✅ 2. Otherwise, set temporary loading state
    setActiveChat({ ...chat, messages: [] });

    // ✅ 3. Fetch full conversation (API call)
    const { data } = await getConversationById(chat.id);

    if (data) {
      console.log("🌐 Loaded chat from API:", data);
      setActiveChat(data);

      // ✅ 4. Store it in React Query cache for next time
      queryClient.setQueryData(["conversation", chat.id], data);
    }
  };


  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sendBy: "USER",
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
        text:
          "Thank you for your message! I'm processing your request and will provide a detailed response shortly.",
        sendBy: "AI",
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
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-[40] w-full sm:w-80 lg:w-80 h-full transform transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full lg:translate-x-0": !isSidebarOpen,
          },
        )}
      >
        <ChatSidebar
          chats={conversations}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
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
