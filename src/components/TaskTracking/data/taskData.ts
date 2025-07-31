import { SocialMediaCalenderIcon } from "@/components/ui/icons/sidebar/socialMediaCalender";
import { BlogArticlesIcon } from "@/components/ui/icons/sidebar/BlogArticles";
import { TaskTrackingIcon } from "@/components/ui/icons/sidebar/TaskTracking";
import { ReportIcon } from "@/components/ui/icons/sidebar/Report";
import { SettingsIcon } from "@/components/ui/icons/sidebar/settings";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  client: string;
  status: string;
  priority: string;
  progress: number;
  category: string;
}

export interface Category {
  id?: number;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface Status {
  name: string;
  count: number;
  color: string;
}

export interface NewTask {
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  client: string;
  priority: string;
  status: string;
  category: string;
}

export interface NewCategory {
  name: string;
  description?: string;
  color: string;
}

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Instagram Carousel: Summer Collection",
    description: "Create a 5-slide carousel showcasing the new summer collection with product details and pricing.",
    dueDate: "2025-07-05",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 60,
    category: "Social Media Calendar"
  },
  {
    id: 2,
    title: "Facebook Ad Campaign: Holiday Sale",
    description: "Design and launch Facebook ad campaign for the upcoming holiday season with special offers.",
    dueDate: "2025-07-10",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 100,
    category: "Social Media Calendar"
  },
  {
    id: 3,
    title: "Twitter Thread: Product Launch",
    description: "Create an engaging Twitter thread announcing the new product line with behind-the-scenes content.",
    dueDate: "2025-07-15",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "Not Started",
    priority: "High",
    progress: 0,
    category: "Social Media Calendar"
  },
  {
    id: 4,
    title: "LinkedIn Article: Industry Insights",
    description: "Write a thought leadership article about industry trends and company expertise.",
    dueDate: "2025-07-20",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 60,
    category: "Social Media Calendar"
  },
  {
    id: 5,
    title: "Email Newsletter: Monthly Update",
    description: "Create and send monthly newsletter to subscribers with company updates and promotions.",
    dueDate: "2025-07-25",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    category: "Marketing Plan"
  },
  {
    id: 6,
    title: "Instagram Carousel: Summer Collection",
    description: "Create a 5-slide carousel showcasing the new summer collection with product details and pricing.",
    dueDate: "2025-08-05",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "Medium",
    progress: 60,
    category: "Blog Creation"
  },
  {
    id: 7,
    title: "Test Task 1",
    description: "Test task for debugging",
    dueDate: "2025-07-01",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 50,
    category: "Social Media Calendar"
  },
  {
    id: 8,
    title: "Test Task 2",
    description: "Another test task",
    dueDate: "2025-07-15",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "Not Started",
    priority: "Medium",
    progress: 0,
    category: "Blog Creation"
  }
];

export const categories: Category[] = [
  { name: "Social Media Calendar", count: 19, icon: SocialMediaCalenderIcon, color: "text-[#508CD3]" },
  { name: "Blog Creation", count: 12, icon: BlogArticlesIcon, color: "text-[#2BAE82]" },
  { name: "Marketing Plan", count: 12, icon: TaskTrackingIcon, color: "text-[#ECA338]" },
  { name: "Media Buying Plan", count: 6, icon: ReportIcon, color: "text-[#FBDAE7]" },
  { name: "Graphic Designs", count: 6, icon: SettingsIcon, color: "text-[#C99DDD]" }
];

export const statuses: Status[] = [
  { name: "Not Started", count: 19, color: "bg-[#A0AEBA] " },
  { name: "In Progress", count: 19, color: "bg-[#D29A09] " },
  { name: "Completed", count: 19, color: "bg-[#2BAE82]" }
];

// Helper function to get next ID
export const getNextTaskId = (tasks: Task[]): number => {
  return Math.max(...tasks.map(task => task.id), 0) + 1;
};

// Helper function to get next category ID
export const getNextCategoryId = (categories: Category[]): number => {
  return Math.max(...categories.map(cat => cat.id || 0), 0) + 1;
};

// Helper function to update category counts
export const updateCategoryCounts = (tasks: Task[], categories: Category[]): Category[] => {
  return categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.category === category.name).length
  }));
}; 