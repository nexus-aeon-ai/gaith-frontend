"use client";

import Link from "next/link";

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

import { AIChatbotIcon } from "../ui/icons/sidebar/AIChatbot";
import { BlogArticlesIcon } from "../ui/icons/sidebar/BlogArticles";
import { ClientManagmentIcon } from "../ui/icons/sidebar/clientManagment";
import { DashboardListIcon } from "../ui/icons/sidebar/dashboard-list";
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
    icon: <DashboardListIcon className="dark:text-[#E6EFF9]" />,
    href: "/dashboard",
  },
  {
    label: "Task Tracking",
    icon: <TaskTrackingIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/task-tracking",
  },
  {
    label: "Report & Analysis",
    icon: <ReportIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/reports",
  },
  {
    label: "Leads",
    icon: <LeadsIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/leads",
  },
  {
    label: "Client Management",
    icon: <ClientManagmentIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/clients",
  },
  {
    label: "Employees",
    icon: <EmployeeIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/employees",
  },
  {
    label: "Employees Tasks",
    icon: <EmployeeTasksIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/employee-tasks",
  },
  {
    label: "Quotations",
    icon: <QuotationsIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/quotations",
  },
  {
    label: "Submitted",
    icon: <SubmitedIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/submitted",
  },
  {
    label: "Support",
    icon: <SupportIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/support",
  },
];

const aiToolsItems = [
  {
    label: "Generate Pricing",
    icon: <PricingIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/ai/pricing",
  },
  {
    label: "Social Media Calendar",
    icon: <SocialMediaCalenderIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/ai/social-media-calendar",
  },
  {
    label: "Blog & Articles",
    icon: <BlogArticlesIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/ai/blog-articles",
  },
  {
    label: "AI Chatbot",
    icon: <AIChatbotIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/ai/chatbot",
  },
];

const settingsItems = [
  {
    label: "Settings",
    icon: <SettingsIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/settings",
  },
  {
    label: "Logout",
    icon: <LogoutIcon className="text-[#265B99] dark:text-[#E6EFF9]" />,
    href: "/logout",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (path === "/logout") {
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Clear localStorage if used
      
      // Redirect to login page
      router.push("/login");
      toast.success("Logged out successfully");
      return;
    }
    if (path === "/dashboard") {
      router.push("/");
      return;
    }
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
     
      return pathname === "/" || 
             pathname === "/dashboard" || 
             pathname === "/en" || 
             pathname === "/ar" ||
             pathname === "/en/" ||
             pathname === "/ar/" ||
             pathname.endsWith("/dashboard") ||
             pathname.endsWith("/");
    }
    return pathname.includes(path);
  };

  return (
    <aside className="h-full w-64 bg-background shadow-md rounded-lg flex flex-col p-4 gap-2 text-sidebar-foreground">
      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item, idx) => ( 
            
            <React.Fragment key={idx}>
              <li 
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-blue-100 dark:bg-blue-900/20" 
                    : "hover:bg-accent"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={`text-lg ${isActive(item.path) ? "text-yellow-600" : "text-[#265B99] dark:text-[#E6EFF9]"}`}>
                  {item.icon}
                </span>
                <span className={`font-medium ${isActive(item.path) ? "text-yellow-600 dark:text-yellow-400" : "text-[#303444] dark:text-[#cccfdb84]"}`}>
                  {item.label}
                </span>
              </li>
              {item.label === "Report & Analysis" && (
                <>
                  <li key="divider" className="my-2 border-b border-gray-300 dark:border-gray-700"></li>
                  <li key="crm-label" className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none">CRM</li>
                </>
              )}
              {item.label === "Support" && (
                <>
                  <li key="divider" className="my-2 border-b border-gray-300 dark:border-gray-700"></li>
                  <li key="crm-label" className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400  tracking-wider select-none">Ai Tools</li>
                </>
              )}
              {item.label === "AI Chatbot" && (
                <>
                  <li key="divider" className="my-2 border-b border-gray-300 dark:border-gray-700"></li>
                </>
              )}
            </React.Fragment>
const SidebarUI  = () => (
  <Sidebar className="top-(--header-height) !h-[calc(100svh-var(--header-height))]">
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {mainItems.map(item => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
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
              <SidebarMenuButton asChild>
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
              <SidebarMenuButton asChild>
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

export default SidebarUI;
