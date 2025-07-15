
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getProfile } from "@/lib/api/auth";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userProfile = await getProfile();
  
  if (userProfile.status !== 200) {
    return <div>Error</div>;
  }
  return (
    <>
        <Navbar user={userProfile.data} />
        <div className="flex py-5 min-h-screen">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
    </>
  );
}
