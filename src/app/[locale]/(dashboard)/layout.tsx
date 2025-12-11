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
    <div className="[--header-height:85px]">
      <SidebarProvider className="flex flex-col min-h-screen">
        <Navbar user={userProfile.data} />

        <div className="flex flex-1 min-h-0 bg-[#E4E9F1] dark:bg-[#14182a]">
          <SidebarUI />

          <div className="flex-1 min-w-0 overflow-hidden p-4">
            {children}
            <div className="flex flex-col">
              <div className="px-2">
                <AiChatInput />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
