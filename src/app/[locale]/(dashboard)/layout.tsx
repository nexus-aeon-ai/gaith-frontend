import { AiChatInput } from "@/components/ChatInput/index";
import Navbar from "@/components/Navbar";
import SidebarUI from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getProfile } from "@/lib/api/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getProfile();

  if (userProfile.status !== 200) {
    return <div>Error</div>;
  }

  return (
    <div className="[--header-height:calc(theme(spacing.16))]">
      <SidebarProvider className="flex flex-col">
        <Navbar user={userProfile.data} />
        <div className="flex flex-1">
          <SidebarUI />
          <div className="flex-1 flex flex-col">
            {children}
            <div className="px-2">
              <AiChatInput />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
