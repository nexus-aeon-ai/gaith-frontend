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
