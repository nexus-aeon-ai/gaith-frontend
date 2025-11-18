import { io, Socket } from "socket.io-client";

import env from "@/env.mjs";
import { getAuthToken } from "@/lib/functions";

export interface SocketMessage {
  conversationId?: string;
  text: string;
}

export interface SocketResponse {
  conversationId: string;
  message: string;
  agent_id: string;
}

type MessageHandler = (response: SocketResponse) => void;
type ErrorHandler = (error: Error) => void;
type CloseHandler = () => void;

/**
 * AI Chat Socket.IO Client
 * Manages connection to the AI chat socket for real-time messaging
 */
export class AIChatSocket {
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private closeHandlers: Set<CloseHandler> = new Set();
  private isIntentionallyClosed = false;

  /**
   * Connect to the Socket.IO server
   */
  async connect(): Promise<void> {
    try {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error("No authentication token available");
      }

      console.log("[AIChatSocket] Connecting to Socket.IO server...");

      // Create Socket.IO connection
      this.socket = io(`${env.NEXT_PUBLIC_API_URL}/ai-chat`, {
        auth: {
          token: token,
        },
        query: {
          token: token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Connection events
      this.socket.on("connect", () => {
        console.log("[AIChatSocket] Connected to Socket.IO server");
        console.log("[AIChatSocket] Socket ID:", this.socket?.id);
      });

      this.socket.on("connect_error", (error) => {
        console.error("[AIChatSocket] Connection error:", error.message);
        this.errorHandlers.forEach(handler => handler(error));
      });

      this.socket.on("disconnect", (reason) => {
        console.log("[AIChatSocket] Disconnected:", reason);
        this.closeHandlers.forEach(handler => handler());
      });

      // Listen for message events
      this.socket.on("message", (data: SocketResponse) => {
        console.log("[AIChatSocket] Received message:", data);
        this.messageHandlers.forEach(handler => handler(data));
      });

      // Error handling
      this.socket.on("error", (error) => {
        console.error("[AIChatSocket] Socket error:", error);
        this.errorHandlers.forEach(handler => handler(error as Error));
      });

    } catch (error) {
      console.error("[AIChatSocket] Failed to connect:", error);
      throw error;
    }
  }

  /**
   * Send a message through Socket.IO
   */
  sendMessage(message: SocketMessage): void {
    if (!this.socket || !this.socket.connected) {
      throw new Error("Socket.IO is not connected");
    }

    // Emit the message
    this.socket.emit("message", message);
    console.log("[AIChatSocket] Sent message:", message);
  }

  /**
   * Register a handler for incoming messages
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Register a handler for errors
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Register a handler for connection close
   */
  onClose(handler: CloseHandler): () => void {
    this.closeHandlers.add(handler);
    
    return () => {
      this.closeHandlers.delete(handler);
    };
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }

  /**
   * Close the Socket.IO connection
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear all handlers
    this.messageHandlers.clear();
    this.errorHandlers.clear();
    this.closeHandlers.clear();
    
    console.log("[AIChatSocket] Disconnected");
  }
}

// Singleton instance
let socketInstance: AIChatSocket | null = null;

/**
 * Get the singleton socket instance
 */
export function getAIChatSocket(): AIChatSocket {
  if (!socketInstance) {
    socketInstance = new AIChatSocket();
  }
  return socketInstance;
}

/**
 * Clean up the socket instance
 */
export function cleanupAIChatSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

