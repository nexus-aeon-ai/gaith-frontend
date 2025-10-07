"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { deleteCookie, setCookie } from "cookies-next";
import { ChevronDown, Moon, Sun, UserRound } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  user?: IProfile | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const { setUser, setLanguage, language: languageStore } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
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
              {/* Sidebar Trigger (hidden on login page) */}
              <div>{pathname !== "/login" && <SidebarTrigger />}</div>
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
                      themeNext === "dark" ? "bg-[#FFD250] border-[#FFD250]" : "border-transparent"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                    aria-label="Dark Mode"
                  >
                    {currentTheme === "dark" ? (
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.50025 16.3331C7.50025 17.0331 7.60858 17.7165 7.80858 18.3498C4.60858 17.2415 2.19191 14.2998 1.94191 10.8581C1.69191 7.19981 3.80024 3.78315 7.20858 2.34981C8.09191 1.98315 8.54191 2.24981 8.73358 2.44148C8.91691 2.62481 9.17524 3.06648 8.80858 3.90815C8.43358 4.77481 8.25024 5.69148 8.25024 6.64148C8.25858 8.34148 8.92525 9.91648 10.0086 11.1248C8.48358 12.3415 7.50025 14.2248 7.50025 16.3331Z"
                          fill="#070913"
                        />
                        <path
                          opacity="0.4"
                          d="M17.675 15.2667C16.025 17.5083 13.4083 18.825 10.6167 18.825C10.4833 18.825 10.35 18.8167 10.2167 18.8083C9.38333 18.775 8.575 18.6167 7.80833 18.35C7.60833 17.7167 7.5 17.0333 7.5 16.3333C7.5 14.225 8.48333 12.3417 10.0083 11.125C11.2333 12.5 12.9917 13.3917 14.9333 13.475C15.4583 13.5 15.9833 13.4583 16.5 13.3667C17.4333 13.2 17.8083 13.55 17.9417 13.775C18.0833 14 18.2333 14.4917 17.675 15.2667Z"
                          fill="#070913"
                        />
                      </svg>
                    ) : (
                      <Moon
                        className="h-6 w-6"
                        color="#23272E"
                        fill={currentTheme === "dark" ? "#23272E" : "none"}
                      />
                    )}
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

                {/* User Menu (hidden on login page) */}
                {pathname !== "/login" && user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3 bg-card rounded-full px-2 md:px-4 min-h-12 cursor-pointer">
                        <div className="relative ">
                          {avatarLoading ? (
                            <Spinner />
                          ) : (
                            <UserRound
                              size={34}
                              className="bg-background p-[6px] dark:text-[#F0F2F8] text-[#0E1325] rounded-full border-2 border-[#F7C649]"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
