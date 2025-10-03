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
    href: "/",
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
    href: "/client-management",
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
    href: "/ai-chatbot",
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
const SidebarUI  = () => (
  <Sidebar variant="inset" className="top-[calc(var(--header-height)+6px)] left-2 !h-[calc(100svh-var(--header-height))] border-none">
    <SidebarContent className="h-full bg-background md:shadow-md rounded-2xl scrollbar-hide overflow-y-auto">
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
