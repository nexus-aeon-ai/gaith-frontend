"use client";

import { Quote, ShoppingBag, Sparkles, Target, Ticket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useUserPermissions } from "@/hooks/usePermission";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

import FileIcon from "../ui/icons/file";
import CalendarIcon from "../ui/icons/options/calendar-icon";
import SettingsFilled from "../ui/icons/settings-filled";
import { AIChatbotIcon } from "../ui/icons/sidebar/AIChatbot";
import AiChatbotFilled from "../ui/icons/sidebar/aichatbot-filled";
import { BlogArticlesIcon } from "../ui/icons/sidebar/BlogArticles";
import SubmitedFilled from "../ui/icons/sidebar/campaign-filled";
import ClientFilled from "../ui/icons/sidebar/client-filled";
import { ClientManagmentIcon } from "../ui/icons/sidebar/clientManagment";
import DashboarFilled from "../ui/icons/sidebar/dashboard-filled";
import DashboardOutline from "../ui/icons/sidebar/dashboard-outline";
import { EmployeeIcon } from "../ui/icons/sidebar/Employee";
import EmployeeFilled from "../ui/icons/sidebar/employee-filled";
import EmployeeTasksFilled from "../ui/icons/sidebar/employee-tasks-filled";
import { EmployeeTasksIcon } from "../ui/icons/sidebar/employeeTasks";
import { LeadsIcon } from "../ui/icons/sidebar/Leads";
import LeadsFilled from "../ui/icons/sidebar/leads-filled";
import { LogoutIcon } from "../ui/icons/sidebar/logout";
import QuotationsFilled from "../ui/icons/sidebar/quotation-filled";
import { QuotationsIcon } from "../ui/icons/sidebar/quotations";
import { ReportIcon } from "../ui/icons/sidebar/Report";
import ReportsFilled from "../ui/icons/sidebar/report-filled";
import { SettingsIcon } from "../ui/icons/sidebar/settings";
import { SocialMediaCalenderIcon } from "../ui/icons/sidebar/socialMediaCalender";
import { SubmitedIcon } from "../ui/icons/sidebar/submited";
import { TaskTrackingIcon } from "../ui/icons/sidebar/TaskTracking";
import TaskTrackingFilled from "../ui/icons/sidebar/tasktracking-filled";

const SidebarUI = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { setUser } = useAuthStore();

  const handleLogout = () => {
    setUser({} as any);
    logout();
  };

  const supportItems = [
    {
      label: "My Ticket",
      icon: <Ticket className="h-5 w-5 text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <Ticket className="h-5 w-5 text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/support",
    },
    {
      label: "FAQ's",
      icon: <Quote className="h-5 w-5 text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <Quote className="h-5 w-5 text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/support/faq",
    },
  ];

  const permissions = useUserPermissions();

  const hasPermission = (resource?: string) => {
    if (!resource) return true;
    return permissions.includes(`${resource}.read`);
  };

  const mainItems = [
    {
      label: "Dashboard",
      icon: <DashboardOutline className="dark:text-[#CCCFDB]" />,
      iconFilled: <DashboarFilled className="dark:text-[#CCCFDB]" />,
      href: "/",
      resource: "dashboard",
    },
    {
      label: "Task Tracking",
      icon: <TaskTrackingIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <TaskTrackingFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/task-tracking",
      resource: "tasks",
    },
    {
      label: "Report & Analysis",
      icon: <ReportIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <ReportsFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/reports",
      resource: "reports",
    },
    {
      label: "Leads",
      icon: <LeadsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <LeadsFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/leads",
      resource: "leads",
    },
    {
      label: "Client Management",
      icon: <ClientManagmentIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <ClientFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/client-management",
      resource: "clients",
    },
    {
      label: "Employees",
      icon: <EmployeeIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <EmployeeFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/employees",
      resource: "employees",
    },
    {
      label: "Employees Tasks",
      icon: <EmployeeTasksIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <EmployeeTasksFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/employee-tasks",
      resource: "employee_tasks",
    },
    {
      label: "Quotations",
      icon: <QuotationsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <QuotationsFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/quotations",
      resource: "quotations",
    },
    {
      label: "Submitted",
      icon: <SubmitedIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <SubmitedFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/submitted",
      resource: "submitted",
    },
  ];

  const aiToolsItems = [
    {
      label: "Generate Marketing Assets",
      icon: <Sparkles className="h-5 w-5 text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <Sparkles className="h-5 w-5 text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/generate-marketing-assets",
      resource: "marketing_assets",
    },
    {
      label: "Social Media Calendar",
      icon: <SocialMediaCalenderIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#265B99"} />,
      href: "/social-media-calendar",
      resource: "social_media",
    },
    {
      label: "Blog & Articles",
      icon: <BlogArticlesIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: (
        <FileIcon className=" h-6 w-6" color={theme === "dark" ? "#CCCFDB" : "#265B99"} />
      ),
      href: "/blog-articles",
      resource: "blog",
    },
    {
      label: "Marketing Plans",
      icon: <Target className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <Target className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/marketing-plans",
      resource: "marketing_plans",
    },
    {
      label: "Media Buying",
      icon: <ShoppingBag className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <ShoppingBag className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/media-buying",
      resource: "media_buying",
    },
    {
      label: "AI Chatbot",
      icon: <AIChatbotIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <AiChatbotFilled className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/ai-chatbot",
      resource: "chatbot",
    },
  ];

  const settingsItems = [
    {
      label: "Settings",
      icon: <SettingsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <SettingsFilled color={theme === "dark" ? "#CCCFDB" : "#265B99"} />,
      href: "/settings",
      resource: "settings",
    },
    {
      label: "Logout",
      icon: <LogoutIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
      iconFilled: <LogoutIcon className="text-[#265B99] dark:text-[#CCCFDB]" />,
      href: "/logout",
    },
  ];

  const filteredMainItems = mainItems.filter(item => hasPermission(item.resource));
  const filteredAiToolsItems = aiToolsItems.filter(item => hasPermission(item.resource));
  const filteredSettingsItems = settingsItems.filter(item => hasPermission(item.resource));

  const isActive = (href: string) => {
    if (!pathname) {
      return false;
    }

    if (href === "/") {
      return pathname === "/en";
    }

    if (href === "/support") {
      return pathname.includes("/support") && !pathname.includes("/support/faq");
    }
    if (href === "/support/faq") {
      return pathname.includes("/support/faq");
    }
    return pathname === href || pathname.includes(href) || pathname.includes(`/${href}?`);
  };

  const activeClasses =
    "bg-muted text-foreground border dark:border-[#3072C0] transition-all duration-300 ease-in-out";

  return (
    <Sidebar
      variant="inset"
      className="top-[calc(var(--header-height)+6px)] left-2 !h-[calc(100svh-var(--header-height))] border-none bg-transparent"
    >
      <SidebarContent className="h-full bg-background md:shadow-md rounded-[24px] scrollbar-hide overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {filteredMainItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "py-5 transition-all duration-500 ease-in-out",
                    isActive(item.href) && activeClasses,
                  )}
                >
                  <Link href={item.href}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {isActive(item.href) ? item.iconFilled : item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform",
                          isActive(item.href) ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                        style={{
                          background:
                            "linear-gradient(268.38deg, #F7C649 1.37%, #FFB257 26.94%, #29AD82 66.61%, #265B99 98.7%)",
                        }}
                      />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            {supportItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "py-5 transition-all duration-500 ease-in-out",
                    isActive(item.href) && activeClasses,
                  )}
                >
                  <Link href={item.href}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {isActive(item.href) ? item.iconFilled : item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform",
                          isActive(item.href) ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                        style={{
                          background:
                            "linear-gradient(268.38deg, #F7C649 1.37%, #FFB257 26.94%, #29AD82 66.61%, #265B99 98.7%)",
                        }}
                      />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarMenu>
            {filteredAiToolsItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={cn("py-5", isActive(item.href) && activeClasses)}
                >
                  <Link href={item.href}>
                   <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {isActive(item.href) ? item.iconFilled : item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform",
                          isActive(item.href) ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                        style={{
                          background:
                            "linear-gradient(268.38deg, #F7C649 1.37%, #FFB257 26.94%, #29AD82 66.61%, #265B99 98.7%)",
                        }}
                      />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarMenu>
            {filteredSettingsItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={isActive(item.href) ? activeClasses : undefined}
                  onClick={
                    item.label === "Logout"
                      ? e => {
                          e.preventDefault();
                          handleLogout();
                        }
                      : undefined
                  }
                >
                  <Link href={item.href}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {isActive(item.href) ? item.iconFilled : item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform",
                          isActive(item.href) ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                        style={{
                          background:
                            "linear-gradient(268.38deg, #F7C649 1.37%, #FFB257 26.94%, #29AD82 66.61%, #265B99 98.7%)",
                        }}
                      />
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* Optional: Add footer content here */}</SidebarFooter>
    </Sidebar>
  );
};

export default SidebarUI;
