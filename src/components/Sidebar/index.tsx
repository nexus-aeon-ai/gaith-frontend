"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { cn } from "@/lib/utils";

import {DashboardIcon} from "../ui/icons/dashboard";
import { AIChatbotIcon } from "../ui/icons/sidebar/AIChatbot";
import { BlogArticlesIcon } from "../ui/icons/sidebar/BlogArticles";
import { ClientManagmentIcon } from "../ui/icons/sidebar/clientManagment";
import  DashboardOutline from "../ui/icons/sidebar/dashboard-outline";
import { EmployeeIcon } from "../ui/icons/sidebar/Employee";
import { EmployeeTasksIcon } from "../ui/icons/sidebar/employeeTasks";
import { LeadsIcon } from "../ui/icons/sidebar/Leads";
import { LogoutIcon } from "../ui/icons/sidebar/logout";
import { PricingIcon } from "../ui/icons/sidebar/pricing";
import { QuotationsIcon } from "../ui/icons/sidebar/quotations";
import { ReportIcon } from "../ui/icons/sidebar/Report";
import { SettingsIcon } from "../ui/icons/sidebar/settings";
import { SocialMediaCalenderIcon } from "../ui/icons/sidebar/socialMediaCalender";
import { SubmitedIcon } from "../ui/icons/sidebar/submited";
import { SupportIcon } from "../ui/icons/sidebar/support";
import { TaskTrackingIcon } from "../ui/icons/sidebar/TaskTracking";

const mainItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon className="dark:text-[#CCCFDB]" />,
    href: "/",
  },
  {
    label: "Task Tracking",
    icon: <TaskTrackingIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/task-tracking",
  },
  {
    label: "Report & Analysis",
    icon: <ReportIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/reports",
  },
  {
    label: "Leads",
    icon: <LeadsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/leads",
  },
  {
    label: "Client Management",
    icon: <ClientManagmentIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/client-management",
  },
  {
    label: "Employees",
    icon: <EmployeeIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/employees",
  },
  {
    label: "Employees Tasks",
    icon: <EmployeeTasksIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/employee-tasks",
  },
  {
    label: "Quotations",
    icon: <QuotationsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/quotations",
  },
  {
    label: "Submitted",
    icon: <SubmitedIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/submitted",
  },
  {
    label: "Support",
    icon: <SupportIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/support",
  },
];

const aiToolsItems = [
  {
    label: "Generate Pricing",
    icon: <PricingIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/ai/pricing",
  },
  {
    label: "Social Media Calendar",
    icon: <SocialMediaCalenderIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/ai/social-media-calendar",
  },
  {
    label: "Blog & Articles",
    icon: <BlogArticlesIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/ai/blog-articles",
  },
  {
    label: "AI Chatbot",
    icon: <AIChatbotIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/ai-chatbot",
  },
];

const settingsItems = [
  {
    label: "Settings",
    icon: <SettingsIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/settings",
  },
  {
    label: "Logout",
    icon: <LogoutIcon className="text-[#303444] dark:text-[#CCCFDB]" />,
    href: "/logout",
  },
];
const SidebarUI = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.includes(href) || pathname.includes(`/${href}?`);
  };

  const activeClasses = "bg-muted text-foreground border dark:border-[#3072C0]";

  return (
    <Sidebar
      variant="inset"
      className="top-[calc(var(--header-height)+6px)] left-2 !h-[calc(100svh-var(--header-height))] border-none"
    >
      <SidebarContent className="h-full bg-background md:shadow-md rounded-2xl scrollbar-hide overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {mainItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "py-5",
                    isActive(item.href) && activeClasses, 
                  )}
                >
                  <Link href={item.href}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarMenu>
            {aiToolsItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={isActive(item.href) ? activeClasses : undefined}
                >
                  <Link href={item.href}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarMenu>
            {settingsItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  className={isActive(item.href) ? activeClasses : undefined}
                >
                  <Link href={item.href}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
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
