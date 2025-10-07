"use client";
import { setCookie } from "cookies-next";
import { ChevronDown, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/store/authStore";
import { IProfile } from "@/lib/types";

// Spinner
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
  </div>
);

interface NavbarProps {
  user: IProfile | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const { setUser, setLanguage, language: languageStore } = useAuthStore();
  const { theme: themeNext, setTheme: setThemeNext, resolvedTheme } = useTheme();

  const [avatar, setAvatar] = useState<string>(user?.profilePic || "/images/default-avatar.jpg");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount (fixes hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
      setAvatar(user?.profilePic || "/images/default-avatar.jpg");
      setAvatarLoading(!!user?.profilePic);
    }
  }, [user, setUser]);

  const handleThemeChange = (theme: string) => {
    setThemeNext(theme as "light" | "dark");
    setCookie("theme", theme, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
  };

  const handleLanguageChange = (language: string) => {
    setLanguage(language as "EN" | "AR");
    setCookie("language", language, { maxAge: 60 * 60 * 24 * 365 });
  };

  // Use resolvedTheme for accurate theme detection (handles "system" theme)
  const currentTheme = resolvedTheme || themeNext;

  // Prevent hydration mismatch by not rendering theme buttons until mounted
  if (!mounted) {
    return (
      <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
        <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
          <NavigationMenu className="min-w-full w-full mx-auto flex items-center justify-between px-6 py-4 bg-background rounded-none text-foreground shadow max-h-16">
            <NavigationMenuList className="flex justify-between min-w-full !w-full items-center">
              <NavigationMenuItem>
                <SidebarTrigger />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div className="flex items-center gap-4">
                  {/* Placeholder to prevent layout shift */}
                  <div className="h-10 w-24 bg-card rounded-full" />
                  <div className="h-10 w-[60px] bg-card rounded-full" />
                  <div className="h-10 w-[120px] bg-card rounded-full" />
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
    );
  }

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <NavigationMenu className="min-w-full w-full mx-auto flex items-center justify-between px-6 py-4 bg-background rounded-none text-foreground shadow max-h-16">
          <NavigationMenuList className="flex justify-between min-w-full !w-full items-center">
            {/* Sidebar Trigger */}
            <NavigationMenuItem>
              <SidebarTrigger />
            </NavigationMenuItem>
            {/* Logo */}
            <NavigationMenuItem>
              <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
            </NavigationMenuItem>

            {/* Actions */}
            <NavigationMenuItem>
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <div className="flex gap-2 bg-card rounded-full px-2 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full border-2 transition-all ${
                      currentTheme === "light"
                        ? "bg-[#FFD250] border-[#FFD250]"
                        : "border-transparent"
                    }`}
                    onClick={() => handleThemeChange("light")}
                    aria-label="Light Mode"
                  >
                    <Sun
                      className="h-6 w-6"
                      color="#A97A00"
                      fill={currentTheme === "light" ? "#FFD250" : "none"}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full border-2 transition-all ${
                      currentTheme === "dark"
                        ? "bg-[#23272E] border-[#FFD250]"
                        : "border-transparent"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                    aria-label="Dark Mode"
                  >
                    <Moon
                      className="h-6 w-6"
                      color="#FFD250"
                      fill={currentTheme === "dark" ? "#23272E" : "none"}
                    />
                  </Button>
                </div>

                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 cursor-pointer min-w-[60px]">
                      <span className="text-base font-medium">{languageStore}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("EN")}>
                      🇺🇸 English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("AR")}>
                      🇸🇦 العربية
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 bg-card rounded-full px-4 py-2 cursor-pointer min-w-[120px]">
                      <div className="relative h-7 w-7">
                        {avatarLoading ? (
                          <Spinner />
                        ) : (
                          <Image
                            src={avatar}
                            alt="User Avatar"
                            className="rounded-full object-cover"
                            fill
                            onLoad={() => setAvatarLoading(false)}
                            onError={() => {
                              setAvatar("/images/default-avatar.jpg");
                              setAvatarLoading(false);
                            }}
                          />
                        )}
                      </div>
                      <span className="text-base font-medium truncate">
                        {user?.fullName || "User"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
