"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

const Navbar = () => {
  const { user, language, theme, setTheme, setLanguage } = useAuthStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-background rounded-xl text-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/images/logo.svg" alt="Logo" className="h-10 w-10" width={40} height={40} />
      </div>
      {/* Date Range */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <div className="flex gap-2 bg-card rounded-[28px] px-2 py-1">
          <Button
            className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${theme === "light" ? "bg-[#FFD250] border-[#FFD250]" : "bg-transparent border-transparent"}`}
            onClick={() => setTheme("light")}
            aria-label="Light mode"
          >
            <Sun className="w-7 h-7" color="#A97A00" fill={theme === "light" ? "#FFD250" : "none"} />
          </Button>
          <Button
            className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${theme === "dark" ? "bg-[#23272E] border-[#FFD250]" : "bg-transparent border-transparent"}`}
            onClick={() => setTheme("dark")}
            aria-label="Dark mode"
          >
            <Moon className="w-7 h-7" color="#FFD250" fill={theme === "dark" ? "#23272E" : "none"} />
          </Button>
        </div>
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 bg-card rounded-[28px] px-4 py-2 cursor-pointer min-w-[60px]">
              <span className="text-lg text-foreground">{language}</span>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent >
            <DropdownMenuItem onClick={() => setLanguage("EN")}>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("AR")}>🇸🇦 العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 bg-card rounded-[28px] px-4 py-2 cursor-pointer min-w-[100px]">
              <Image src={user.avatar} alt="User Avatar" className="h-7 w-7 rounded-full" width={32} height={32} />
              <span className="text-lg text-foreground">{user.name}</span>
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