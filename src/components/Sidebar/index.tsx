import React from "react";
import { DashboardListIcon } from "../ui/icons/sidebar/dashboard-list";
import { TaskTrackingIcon } from "../ui/icons/sidebar/TaskTracking";
import { ReportIcon } from "../ui/icons/sidebar/Report";
import { ClientManagmentIcon } from "../ui/icons/sidebar/clientManagment";
import { LeadsIcon } from "../ui/icons/sidebar/Leads";
import { EmployeeIcon } from "../ui/icons/sidebar/Employee";
import { EmployeeTasksIcon } from "../ui/icons/sidebar/employeeTasks";
import { QuotationsIcon } from "../ui/icons/sidebar/quotations";
import { SubmitedIcon } from "../ui/icons/sidebar/submited";
import { SupportIcon } from "../ui/icons/sidebar/support";
import { PricingIcon } from "../ui/icons/sidebar/pricing";
import { SocialMediaCalenderIcon } from "../ui/icons/sidebar/socialMediaCalender";
import { BlogArticlesIcon } from "../ui/icons/sidebar/BlogArticles";
import { AIChatbotIcon } from "../ui/icons/sidebar/AIChatbot";
import { SettingsIcon } from "../ui/icons/sidebar/settings";
import { LogoutIcon } from "../ui/icons/sidebar/logout";


const sidebarItems = [
  { label: "Dashboard", icon: <DashboardListIcon  className=" dark:text-[#E6EFF9]" /> },
  { label: "Task Tracking", icon: <TaskTrackingIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Report & Analysis", icon: <ReportIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Leads", icon: <LeadsIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Client Management", icon: <ClientManagmentIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Employees", icon: <EmployeeIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Employees Tasks", icon: <EmployeeTasksIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Quotations", icon: <QuotationsIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Submitted", icon: <SubmitedIcon  className= "text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Support", icon: <SupportIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Generate Pricing", icon: <PricingIcon  className="text-[#265B99] dark:text-[#E6EFF9]" />, section: "AI Tools" },
  { label: "Social Media Calendar", icon: <SocialMediaCalenderIcon  className="text-[#265B99] dark:text-[#E6EFF9]" />, section: "AI Tools" },
  { label: "Blog & Articles", icon: <BlogArticlesIcon  className="text-[#265B99] dark:text-[#E6EFF9]" />, section: "AI Tools" },
    { label: "AI Chatbot", icon: <AIChatbotIcon  className="text-[#265B99] dark:text-[#E6EFF9]" />, section: "AI Tools" },
  { label: "Settings", icon: <SettingsIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
  { label: "Logout", icon: <LogoutIcon  className="text-[#265B99] dark:text-[#E6EFF9]" /> },
];

const Sidebar = () => {
  return (
    <aside className="h-full w-64 bg-background shadow-md rounded-lg flex flex-col p-4 gap-2 text-sidebar-foreground">
      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item, idx) => ( 
            
            <React.Fragment key={idx}>
              <li className="flex items-center gap-3 px-3 py-2 rounded hover:bg-accent cursor-pointer transition-colors">
                <span className="text-lg text-yellow-600 dark:text-[#E6EFF9]">{item.icon}</span>
                <span className="font-medium text-[#303444] dark:text-[#cccfdb84]">{item.label}</span>
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
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 