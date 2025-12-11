"use client";
import { setCookie } from "cookies-next";
import { ChevronDown, UserRound } from "lucide-react";
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
import DownArrow from "@/components/ui/icons/down-arrow";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/lib/auth";
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
  const { theme: themeNext, setTheme: setThemeNext } = useTheme();

  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      setUser(user);
      setAvatarLoading(!!user?.profilePic);
    }
  }, [user, setUser]);

  // useeffect to check for mounting / hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (theme: string) => {
    setThemeNext(theme as "light" | "dark");
    setCookie("theme", theme);
  };

  const handleLanguageChange = (language: string) => {
    setLanguage(language as "EN" | "AR");
    setCookie("language", language);
  };

  const handleLogout = () => {
    setUser({} as any);
    logout();
  };
  return (
    <header className="flex sticky top-0 z-50 bg-[#E4E9F1] dark:bg-[#14182a] w-full items-center px-4">
      <div className="flex h-[--header-height] w-full items-center gap-2 ">
        <div className="min-w-full flex items-center justify-between px-2 py-8 bg-background rounded-xl text-foreground shadow h-[85px]">
          <div className="flex flex-1 items-center justify-between w-full">
            {/* logo and collapse trigger */}
            <div className="flex w-full items-center gap-4">
              {/* Sidebar Trigger */}
              <div>
                {
                  user ? (
                    <SidebarTrigger />
                  ) : null
                }
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
                {mounted ? (
                  <div className="flex min-h-12 gap-2 bg-card border rounded-[24px] px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full border-2 ${
                        themeNext === "light"
                          ? "bg-[#FFD250] border-[#FFD250] hover:bg-[#FFD250]"
                          : "border-transparent"
                      }`}
                      onClick={() => handleThemeChange("light")}
                      aria-label="Light Mode"
                    >
                      {themeNext === "dark" ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.99968 16.0418C6.66634 16.0418 3.95801 13.3335 3.95801 10.0002C3.95801 6.66683 6.66634 3.9585 9.99968 3.9585C13.333 3.9585 16.0413 6.66683 16.0413 10.0002C16.0413 13.3335 13.333 16.0418 9.99968 16.0418ZM9.99968 5.2085C7.35801 5.2085 5.20801 7.3585 5.20801 10.0002C5.20801 12.6418 7.35801 14.7918 9.99968 14.7918C12.6413 14.7918 14.7913 12.6418 14.7913 10.0002C14.7913 7.3585 12.6413 5.2085 9.99968 5.2085Z"
                            fill="#F0F2F8"
                          />
                          <path
                            d="M9.99968 19.1335C9.54134 19.1335 9.16634 18.7918 9.16634 18.3335V18.2668C9.16634 17.8085 9.54134 17.4335 9.99968 17.4335C10.458 17.4335 10.833 17.8085 10.833 18.2668C10.833 18.7252 10.458 19.1335 9.99968 19.1335ZM15.9497 16.7835C15.733 16.7835 15.5247 16.7002 15.358 16.5418L15.2497 16.4335C14.9247 16.1085 14.9247 15.5835 15.2497 15.2585C15.5747 14.9335 16.0997 14.9335 16.4247 15.2585L16.533 15.3668C16.858 15.6918 16.858 16.2168 16.533 16.5418C16.3747 16.7002 16.1663 16.7835 15.9497 16.7835ZM4.04967 16.7835C3.83301 16.7835 3.62467 16.7002 3.45801 16.5418C3.13301 16.2168 3.13301 15.6918 3.45801 15.3668L3.56634 15.2585C3.89134 14.9335 4.41634 14.9335 4.74134 15.2585C5.06634 15.5835 5.06634 16.1085 4.74134 16.4335L4.63301 16.5418C4.47467 16.7002 4.25801 16.7835 4.04967 16.7835ZM18.333 10.8335H18.2663C17.808 10.8335 17.433 10.4585 17.433 10.0002C17.433 9.54183 17.808 9.16683 18.2663 9.16683C18.7247 9.16683 19.133 9.54183 19.133 10.0002C19.133 10.4585 18.7913 10.8335 18.333 10.8335ZM1.73301 10.8335H1.66634C1.20801 10.8335 0.833008 10.4585 0.833008 10.0002C0.833008 9.54183 1.20801 9.16683 1.66634 9.16683C2.12467 9.16683 2.53301 9.54183 2.53301 10.0002C2.53301 10.4585 2.19134 10.8335 1.73301 10.8335ZM15.8413 4.99183C15.6247 4.99183 15.4163 4.9085 15.2497 4.75016C14.9247 4.42516 14.9247 3.90016 15.2497 3.57516L15.358 3.46683C15.683 3.14183 16.208 3.14183 16.533 3.46683C16.858 3.79183 16.858 4.31683 16.533 4.64183L16.4247 4.75016C16.2663 4.9085 16.058 4.99183 15.8413 4.99183ZM4.15801 4.99183C3.94134 4.99183 3.73301 4.9085 3.56634 4.75016L3.45801 4.6335C3.13301 4.3085 3.13301 3.7835 3.45801 3.4585C3.78301 3.1335 4.30801 3.1335 4.63301 3.4585L4.74134 3.56683C5.06634 3.89183 5.06634 4.41683 4.74134 4.74183C4.58301 4.9085 4.36634 4.99183 4.15801 4.99183ZM9.99968 2.5335C9.54134 2.5335 9.16634 2.19183 9.16634 1.7335V1.66683C9.16634 1.2085 9.54134 0.833496 9.99968 0.833496C10.458 0.833496 10.833 1.2085 10.833 1.66683C10.833 2.12516 10.458 2.5335 9.99968 2.5335Z"
                            fill="#F0F2F8"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.4"
                            d="M9.99996 15.8332C13.2216 15.8332 15.8333 13.2215 15.8333 9.99984C15.8333 6.77818 13.2216 4.1665 9.99996 4.1665C6.7783 4.1665 4.16663 6.77818 4.16663 9.99984C4.16663 13.2215 6.7783 15.8332 9.99996 15.8332Z"
                            fill="#070913"
                          />
                          <path
                            d="M10 19.1335C9.54171 19.1335 9.16671 18.7918 9.16671 18.3335V18.2668C9.16671 17.8085 9.54171 17.4335 10 17.4335C10.4584 17.4335 10.8334 17.8085 10.8334 18.2668C10.8334 18.7252 10.4584 19.1335 10 19.1335ZM15.95 16.7835C15.7334 16.7835 15.525 16.7002 15.3584 16.5418L15.25 16.4335C14.925 16.1085 14.925 15.5835 15.25 15.2585C15.575 14.9335 16.1 14.9335 16.425 15.2585L16.5334 15.3668C16.8584 15.6918 16.8584 16.2168 16.5334 16.5418C16.375 16.7002 16.1667 16.7835 15.95 16.7835ZM4.05004 16.7835C3.83337 16.7835 3.62504 16.7002 3.45837 16.5418C3.13337 16.2168 3.13337 15.6918 3.45837 15.3668L3.56671 15.2585C3.89171 14.9335 4.41671 14.9335 4.74171 15.2585C5.06671 15.5835 5.06671 16.1085 4.74171 16.4335L4.63337 16.5418C4.47504 16.7002 4.25837 16.7835 4.05004 16.7835ZM18.3334 10.8335H18.2667C17.8084 10.8335 17.4334 10.4585 17.4334 10.0002C17.4334 9.54183 17.8084 9.16683 18.2667 9.16683C18.725 9.16683 19.1334 9.54183 19.1334 10.0002C19.1334 10.4585 18.7917 10.8335 18.3334 10.8335ZM1.73337 10.8335H1.66671C1.20837 10.8335 0.833374 10.4585 0.833374 10.0002C0.833374 9.54183 1.20837 9.16683 1.66671 9.16683C2.12504 9.16683 2.53337 9.54183 2.53337 10.0002C2.53337 10.4585 2.19171 10.8335 1.73337 10.8335ZM15.8417 4.99183C15.625 4.99183 15.4167 4.9085 15.25 4.75016C14.925 4.42516 14.925 3.90016 15.25 3.57516L15.3584 3.46683C15.6834 3.14183 16.2084 3.14183 16.5334 3.46683C16.8584 3.79183 16.8584 4.31683 16.5334 4.64183L16.425 4.75016C16.2667 4.9085 16.0584 4.99183 15.8417 4.99183ZM4.15837 4.99183C3.94171 4.99183 3.73337 4.9085 3.56671 4.75016L3.45837 4.6335C3.13337 4.3085 3.13337 3.7835 3.45837 3.4585C3.78337 3.1335 4.30837 3.1335 4.63337 3.4585L4.74171 3.56683C5.06671 3.89183 5.06671 4.41683 4.74171 4.74183C4.58337 4.9085 4.36671 4.99183 4.15837 4.99183ZM10 2.5335C9.54171 2.5335 9.16671 2.19183 9.16671 1.7335V1.66683C9.16671 1.2085 9.54171 0.833496 10 0.833496C10.4584 0.833496 10.8334 1.2085 10.8334 1.66683C10.8334 2.12516 10.4584 2.5335 10 2.5335Z"
                            fill="#070913"
                          />
                        </svg>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-[24px] border-2 ${
                        themeNext === "dark"
                          ? "bg-[#D29A09] hover:bg-[#D29A09] border-transparent"
                          : "border-transparent"
                      }`}
                      onClick={() => handleThemeChange("dark")}
                      aria-label="Dark Mode"
                    >
                       {themeNext === "dark" ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.50025 15.8331C7.50025 16.5331 7.60858 17.2165 7.80858 17.8498C4.60858 16.7415 2.19191 13.7998 1.94191 10.3581C1.69191 6.69981 3.80024 3.28315 7.20858 1.84981C8.09191 1.48315 8.54191 1.74981 8.73358 1.94148C8.91691 2.12481 9.17524 2.56648 8.80858 3.40815C8.43358 4.27481 8.25024 5.19148 8.25024 6.14148C8.25858 7.84148 8.92525 9.41648 10.0086 10.6248C8.48358 11.8415 7.50025 13.7248 7.50025 15.8331Z"
                          fill="#070913"
                        />
                        <path
                          opacity="0.4"
                          d="M17.675 14.7667C16.025 17.0083 13.4083 18.325 10.6167 18.325C10.4833 18.325 10.35 18.3167 10.2167 18.3083C9.38333 18.275 8.575 18.1167 7.80833 17.85C7.60833 17.2167 7.5 16.5333 7.5 15.8333C7.5 13.725 8.48333 11.8417 10.0083 10.625C11.2333 12 12.9917 12.8917 14.9333 12.975C15.4583 13 15.9833 12.9583 16.5 12.8667C17.4333 12.7 17.8083 13.05 17.9417 13.275C18.0833 13.5 18.2333 13.9917 17.675 14.7667Z"
                          fill="#070913"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.3834 18.9584C10.2417 18.9584 10.1 18.9584 9.95837 18.9501C5.29171 18.7418 1.3917 14.9834 1.0667 10.4001C0.783372 6.46676 3.05837 2.79176 6.72504 1.2501C7.7667 0.816762 8.31671 1.1501 8.55004 1.39176C8.78337 1.6251 9.10837 2.16676 8.67504 3.15843C8.2917 4.04176 8.10004 4.98343 8.10837 5.9501C8.12504 9.64176 11.1917 12.7751 14.9334 12.9251C15.475 12.9501 16.0084 12.9084 16.525 12.8168C17.625 12.6168 18.0834 13.0584 18.2584 13.3418C18.4334 13.6251 18.6334 14.2334 17.9667 15.1334C16.2 17.5501 13.3917 18.9584 10.3834 18.9584ZM2.30837 10.3084C2.5917 14.2751 5.97504 17.5251 10.0084 17.7001C12.75 17.8334 15.35 16.5834 16.95 14.4001C17.075 14.2251 17.1334 14.1001 17.1584 14.0334C17.0834 14.0251 16.95 14.0168 16.7417 14.0584C16.1334 14.1668 15.5 14.2084 14.875 14.1834C10.475 14.0084 6.87504 10.3168 6.85004 5.96676C6.85004 4.81676 7.07504 3.70843 7.53337 2.66676C7.6167 2.48343 7.63337 2.35843 7.6417 2.29176C7.5667 2.29176 7.43337 2.30843 7.2167 2.4001C4.0417 3.73343 2.07504 6.91676 2.30837 10.3084Z"
                          fill="#0E1325"
                        />
                      </svg>
                    )}
                  
                    </Button>
                  </div>
                ) : (
                  // Loading skeleton for theme toggle
                  <div className="flex min-h-12 gap-2 bg-card border rounded-[24px] px-2 py-1">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                  </div>
                )}

                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center min-h-12 gap-2 bg-card rounded-[24px] px-4 py-2 cursor-pointer min-w-[60px]">
                      <span className="text-base font-medium">{languageStore}</span>
                      <DownArrow className="h-4 w-4 dark:text-[#F0F2F8]" />
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
                {user && (
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
