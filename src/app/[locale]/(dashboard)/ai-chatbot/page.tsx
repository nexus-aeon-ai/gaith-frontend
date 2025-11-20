import Chatbot from "@/components/chatbot/chatbot";
import { getConversations } from "@/lib/api/ai-chat/ai-chat";

export default async function ChatbotPage() {
  // Fetch conversations server-side
  const conversationsResponse = await getConversations();
  const conversations = conversationsResponse.data ?? [];

  return <Chatbot initialConversations={conversations} />;
}
