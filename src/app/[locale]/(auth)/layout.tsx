import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/api/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getProfile();
  if (userProfile.status === 200) {
    redirect("/");
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="sticky top-0 left-0 right-0 w-full z-20">
        <Navbar user={userProfile.data} />
      </div>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/svgs/pattern.svg"
          alt="Background pattern"
          fill
          className="object-cover object-center select-none pointer-events-none"
          priority
        />
      </div>
      <div className="w-full flex flex-col items-center justify-center py-12 min-h-[calc(100vh-100px)] max-w-lg">
        {children}
      </div>
    </div>
  );
} 