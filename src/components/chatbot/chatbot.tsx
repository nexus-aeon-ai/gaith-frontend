"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  getClients,
  getConversationMessages,
  getConversations,
  getEmployees,
  sendMessage,
  updateConversation,
  assignEmployeesToConversation,
} from "@/lib/api";
import { getAIChatSocket, type SocketResponse } from "@/lib/api/ai-chat/socket";
import type { Chat, ChatMessage, Conversation, GetConversationsParams, Message } from "@/lib/types/ai-chat";
import { cn } from "@/lib/utils";

import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { EditConversationDialog } from "./edit-conversation-dialog";

// Helper to format timestamp
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper to format message timestamp
const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Helper to transform ChatMessage to Message
const transformChatMessage = (chatMessage: ChatMessage): Message => ({
  id: chatMessage.id,
  content: chatMessage.text,
  sender: chatMessage.sendBy === "AI" ? "assistant" : "user",
  timestamp: formatMessageTime(chatMessage.createdAt),
  attachmentUrls: chatMessage.attachments.map(att => att.url),
});

interface ChatbotProps {
  initialConversations: Conversation[];
}

export default function Chatbot({ initialConversations }: ChatbotProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Initialize websocket connection
  useEffect(() => {
    const socket = getAIChatSocket();
    
    // Connect to websocket (non-blocking)
    socket.connect().then(() => {
      console.log("[Chatbot] WebSocket connected successfully");
      setIsSocketConnected(true);
    }).catch((error) => {
      console.warn("[Chatbot] WebSocket connection failed, will use REST API fallback:", error);
      setIsSocketConnected(false);
    });

    // Handle incoming messages
    const unsubscribeMessage = socket.onMessage((response: SocketResponse) => {
      console.log("[Chatbot] Received websocket message:", response);
      
      // Clear optimistic messages and loading state
      setOptimisticMessages([]);
      setIsWaitingForResponse(false);
      
      // If this is a new conversation, select it
      if (response.conversationId && !selectedConversationId) {
        setSelectedConversationId(response.conversationId);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ 
        queryKey: ["conversation-messages", response.conversationId] 
      });
    });

    // Handle connection errors gracefully
    const unsubscribeError = socket.onError(() => {
      console.warn("[Chatbot] WebSocket error occurred, falling back to REST API");
      setIsSocketConnected(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeMessage();
      unsubscribeError();
      socket.disconnect();
      setIsSocketConnected(false);
    };
  }, [queryClient, selectedConversationId]);

  // Filter parameters with sensible defaults
  const filterParams: GetConversationsParams = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    orderBy: "lastMessageDate",
    orderDirection: "desc",
  }), [searchTerm]);

  // Fetch conversations with initial data and filters
  const { data: conversationsData } = useQuery({
    queryKey: ["conversations", filterParams],
    queryFn: async () => {
      const res = await getConversations(filterParams);
      return res.data ?? [];
    },
    initialData: initialConversations,
  });

  const conversations = useMemo(() => conversationsData ?? [], [conversationsData]);

  // Fetch clients for mapping client names
  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
  });

  const clients = useMemo(() => clientsData ?? [], [clientsData]);

  // Fetch employees for assignment
  const { data: employeesData } = useQuery({
    queryKey: ["employees", "assignment"],
    queryFn: async () => {
      const res = await getEmployees({ status: "ACTIVE" });
      return res.data?.results ?? [];
    },
  });

  const employees = useMemo(() => employeesData ?? [], [employeesData]);

  // Create client lookup map
  const clientsById = useMemo(() => {
    return clients.reduce(
      (acc, client) => {
        acc[client.id] = client.clientName || client.fullName || client.companyName || "Unknown";
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [clients]);

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["conversation-messages", selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      const res = await getConversationMessages(selectedConversationId);
      return res.data ?? [];
    },
    enabled: !!selectedConversationId,
  });

  const messages = useMemo(() => messagesData ?? [], [messagesData]);

  // Send message mutation
  const { mutate: sendMessageMutate, isPending: isSendingMessage } = useMutation({
    mutationFn: async ({
      conversationId,
      text,
      attachmentUrls,
    }: {
      conversationId: string;
      text: string;
      attachmentUrls?: string[];
    }) => {
      const res = await sendMessage(conversationId, { text, attachmentUrls });
      return res.data;
    },
    onSuccess: async () => {
      // Invalidate messages to refetch
      await queryClient.invalidateQueries({
        queryKey: ["conversation-messages", selectedConversationId],
      });
      // Invalidate conversations to update last message
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: error => {
      console.error("Error sending message:", error);
    },
  });
  // Transform conversations to Chat format
  const chats: Chat[] = useMemo(() => {
    return conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      client: conv.client?.clientName || (conv.clientId ? clientsById[conv.clientId] : null) || "No Client",
      clientId: conv.clientId ?? undefined,
      lastMessage: conv.lastMessageText || "No messages yet",
      timestamp: formatTimestamp(conv.lastMessageDate || conv.updatedAt),
      messages: [], // Messages loaded separately
      assignedEmployeeIds: conv.assignedEmployees.map(ae => ae.employee.id),
      assignedEmployees: conv.assignedEmployees.map(ae => ae.employee),
    }));
  }, [conversations, clientsById]);

  // Get active chat with messages (including optimistic messages)
  const activeChat: Chat | null = useMemo(() => {
    const chat = chats.find(c => c.id === selectedConversationId);
    if (!chat) return null;

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const transformedMessages = sortedMessages.map(transformChatMessage);
    
    // Append optimistic messages at the end
    const allMessages = [...transformedMessages, ...optimisticMessages];

    return {
      ...chat,
      messages: allMessages,
    };
  }, [chats, selectedConversationId, messages, optimisticMessages]);

  // Set first conversation as active if none selected
  useEffect(() => {
    if (!selectedConversationId && chats.length > 0) {
      setSelectedConversationId(chats[0].id);
    }
  }, [chats, selectedConversationId]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedConversationId(chat.id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleSendMessage = (content: string, attachmentUrls?: string[]) => {
    const socket = getAIChatSocket();
    
    // Create optimistic user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachmentUrls,
    };

    // Add user message to optimistic messages
    setOptimisticMessages([userMessage]);
    setIsWaitingForResponse(true);

    // Use websocket if connected, otherwise fall back to REST API
    if (isSocketConnected && socket.isConnected()) {
      try {
        const message = selectedConversationId
          ? { conversationId: selectedConversationId, text: content }
          : { text: content };
        
        socket.sendMessage(message);
        console.log("[Chatbot] Message sent via websocket");
      } catch (error) {
        console.error("[Chatbot] Failed to send via websocket, falling back to REST:", error);
        
        // Clear optimistic state and fallback to REST API
        setOptimisticMessages([]);
        setIsWaitingForResponse(false);
        
        if (selectedConversationId) {
          sendMessageMutate({
            conversationId: selectedConversationId,
            text: content,
            attachmentUrls,
          });
        }
      }
    } else {
      // Clear optimistic state for REST API (it has its own loading)
      setOptimisticMessages([]);
      setIsWaitingForResponse(false);
      
      // Use REST API if socket not connected
      if (selectedConversationId) {
        sendMessageMutate({
          conversationId: selectedConversationId,
          text: content,
          attachmentUrls,
        });
      }
    }
  };

  const handleEditChat = (chat: Chat) => {
    setEditingChat(chat);
    setIsEditModalOpen(true);
  };

  const handleSaveConversation = async (
    conversationId: string,
    data: { clientId?: string; assignedEmployeeIds?: string[] },
  ) => {
    console.log("handleSaveConversation called with:", { conversationId, data });
    try {
      const promises = [];

      // Update client if provided
      if (data.clientId !== undefined) {
        console.log("Updating client...");
        promises.push(updateConversation(conversationId, { clientId: data.clientId }));
      }

      // Assign employees if provided
      if (data.assignedEmployeeIds) {
        console.log("Assigning employees...", data.assignedEmployeeIds);
        promises.push(assignEmployeesToConversation(conversationId, { employeeIds: data.assignedEmployeeIds }));
      }

      const results = await Promise.all(promises);
      console.log("Save results:", results);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      console.error("Failed to update conversation:", error);
      throw error;
    }
  };

  // Show loading state if no conversations yet
  if (!activeChat) {
    return (
      <div className="flex p-3 h-[calc(100vh-var(--header-height))] w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex p-3 h-[calc(100vh-var(--header-height))] w-full overflow-hidden">
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
          "fixed lg:relative rounded-s-[16px] overflow-hidden inset-y-0 left-0 z-[40] w-full sm:w-80 lg:w-80 h-full transform transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full lg:translate-x-0": !isSidebarOpen,
          },
        )}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          onEditChat={handleEditChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full">
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isLoading={isLoadingMessages}
          isSending={isSendingMessage || isWaitingForResponse}
        />
      </div>

      <EditConversationDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        conversation={editingChat}
        clients={clientsById}
        employees={employees}
        onSave={handleSaveConversation}
      />
    </div>
  );
}
