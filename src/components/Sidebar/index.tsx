import React from "react";

const sidebarItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Task Tracking", icon: "📋" },
  { label: "Report & Analysis", icon: "📊" },
  { label: "Leads", icon: "👥" },
  { label: "Customers", icon: "🧑‍💼" },
  { label: "Employees", icon: "👔" },
  { label: "Employees Tasks", icon: "📝" },
  { label: "Quotations", icon: "💼" },
  { label: "Submitted", icon: "📤" },
  { label: "Support", icon: "🛠️" },
  { label: "Generate Pricing", icon: "💰", section: "AI Tools" },
  { label: "Social Media Calendar", icon: "🗓️", section: "AI Tools" },
  { label: "Blog & Articles", icon: "📰", section: "AI Tools" },
  { label: "AI Chatbot", icon: "🤖", section: "AI Tools" },
  { label: "Settings", icon: "⚙️" },
  { label: "Logout", icon: "🚪" },
];

const Sidebar = () => {
  return (
    <aside className="h-full w-64 bg-white shadow-md rounded-lg flex flex-col p-4 gap-2">
      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-gray-700">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 