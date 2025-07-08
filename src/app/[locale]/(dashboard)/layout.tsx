
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar />
        <div className="flex py-5 min-h-screen">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
    </>
  );
}
