"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { deleteCookie, setCookie } from "cookies-next";
import { ChevronDown, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const { theme: themeNext, setTheme: setThemeNext, resolvedTheme } = useTheme();

  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount (fixes hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
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

  const handleLogout = () => {
    // Remove auth cookie and reset user in store, then redirect to login
    deleteCookie("authToken", { path: "/" });
    setUser({} as IProfile);
    router.push("/login");
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
    <header className="flex sticky top-0 z-50 min-w-full items-center px-4 ">
      <div className="flex h-[--header-height] min-w-full items-center gap-2 ">
        <div className="min-w-full flex items-center justify-between px-2 py-8 bg-background rounded-xl text-foreground shadow h-[85px]">
          <div className="flex flex-1 items-center justify-between w-full">
            {/* logo and collapse trigger */}
            <div className="flex w-full items-center gap-4">
              {/* Sidebar Trigger */}
              <div>
                <SidebarTrigger />
              </div>
              {/* Logo */}
              <div className="sm:block hidden">
                <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
              </div>
            </div>
            {/* Actions list */}
            <div className="flex w-full items-center md:justify-end justify-center ">
              <div className="flex items-center md:gap-4 gap-1">
                {/* Theme Toggle */}
                <div className="flex min-h-12 gap-2 bg-card border rounded-[24px] px-2 py-1">
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
                    className={`rounded-[24px] border-2 ${
                      themeNext === "dark" ? "bg-[#23272E] border-[#FFD250]" : "border-transparent"
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
                    <div className="flex items-center min-h-12 gap-2 bg-card rounded-[24px] px-4 py-2 cursor-pointer min-w-[60px]">
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
                    <div className="flex items-center gap-3 bg-card rounded-full px-2 md:px-4 min-h-12 cursor-pointer">
                      <div className="relative h-7 w-7">
                        {avatarLoading ? (
                          <Spinner />
                        ) : (
                          <UserRound
                            size={32}
                            className="bg-background p-1 dark:text-[#F0F2F8] text-[#0E1325] rounded-full border-2 border-[#F7C649]"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="md:hidden block text-base font-medium truncate">
                          {user?.fullName.slice(0, 1) || "User"}
                        </span>
                        <span className=" md:block hidden text-base font-medium truncate">
                          {user?.fullName || "User"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
