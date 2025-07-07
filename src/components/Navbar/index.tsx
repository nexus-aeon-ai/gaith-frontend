"use client";
import React from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";

const flagIcons = {
  EN: "🇺🇸",
  AR: "🇸🇦",
};

const Navbar = () => {
  const { user, language, theme, setTheme, setLanguage } = useAuthStore();

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "light");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm rounded-lg">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/public/images/globe.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl text-primary">G</span>
      </div>
      {/* Date Range */}
      <div className="text-gray-600 font-medium">JUN 23 - JUN 30, 2025</div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 font-semibold flex items-center gap-2">
              <span>{flagIcons[language as keyof typeof flagIcons]}</span>
              <span>{language}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("EN")}>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("AR")}>🇸🇦 العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* User */}
        <div className="flex items-center gap-2">
          <img src={user.avatar} alt="User Avatar" className="h-8 w-8 rounded-full" />
          <span className="font-medium">{user.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 