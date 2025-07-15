"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { IProfile } from "@/lib/types";
import { useTheme } from "next-themes";

// Simple spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface NavbarProps {
  user: IProfile; 
}
const Navbar = ({ user }: NavbarProps) => {
  const { setUser, setLanguage, language: languageStore  } = useAuthStore();
  const { theme: themeNext, setTheme: setThemeNext } = useTheme();
  const [avatar, setAvatar] = useState<string>(user?.profilePic || "/images/default-avatar.jpg");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);

  useEffect(() => {
    setUser(user);
    setAvatar(user?.profilePic || "/images/default-avatar.jpg");
    if (user?.profilePic) {
      setAvatarLoading(true);
    }else{
      setAvatarLoading(false);
    }
  }, [user, setUser]);

  const handleThemeChange = (theme: string) => {
    setThemeNext(theme as "light" | "dark");
    setCookie("theme", theme);
  }
  const handleLanguageChange = (language: string) => {
    setLanguage(language as "EN" | "AR");
    setCookie("language", language);
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-background rounded-xl text-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 h-10 w-10">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          className={`h-10 w-10`}
          width={40}
          height={40}
        />
      </div>
      {/* Date Range */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <div className="flex gap-2 bg-card rounded-[28px] px-2 py-1">
          <Button
            className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${themeNext === "light" ? "bg-[#FFD250] border-[#FFD250]" : "bg-transparent border-transparent"}`}
            onClick={() => handleThemeChange("light")}
            aria-label="Light mode"
          >
            <Sun className="w-7 h-7" color="#A97A00" fill={themeNext === "light" ? "#FFD250" : "none"} />
          </Button>
          <Button
            className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${themeNext === "dark" ? "bg-[#23272E] border-[#FFD250]" : "bg-transparent border-transparent"}`}
            onClick={() => handleThemeChange("dark")}
            aria-label="Dark mode"
          >
            <Moon className="w-7 h-7" color="#FFD250" fill={themeNext === "dark" ? "#23272E" : "none"} />
          </Button>
        </div>
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 bg-card rounded-[28px] px-4 py-2 cursor-pointer min-w-[60px]">
              <span className="text-lg text-foreground">{languageStore}</span>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent >
            <DropdownMenuItem onClick={() => handleLanguageChange("EN")}>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("AR")}>🇸🇦 العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 bg-card rounded-[28px] px-4 py-2 cursor-pointer min-w-[100px]">
              <div className="relative h-7 w-7">
                {avatarLoading && <Spinner />}
                <Image
                  src={avatar}
                  alt="User Avatar"
                  className={`h-7 w-7 rounded-full ${avatarLoading ? "hidden" : ""}`}
                  width={32}
                  height={32}
                  onLoad={() => setAvatarLoading(false)}
                  onError={() => {
                      setAvatar("/images/default-avatar.jpg");
                      setAvatarLoading(false);
                  }}
                />
              </div>
              <span className="text-lg text-foreground">{user?.fullName}</span>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar; 