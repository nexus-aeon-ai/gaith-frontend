export interface Task {
  id: string | number;
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
  pillColor: string;
  stages: Record<string, number>;
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
  pillColor: string;
}

export interface Subcategories {
  draft: number;
  review: number;
  sendToClient: number;
  clientApproved: number;
}

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Instagram Carousel: Summer Collection",
    description:
      "Create a 5-slide carousel showcasing the new summer collection with product details and pricing.",
    dueDate: "2025-07-05",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 60,
    category: "Social Media Calendar",
  },
  {
    id: 2,
    title: "Facebook Ad Campaign: Holiday Sale",
    description:
      "Design and launch Facebook ad campaign for the upcoming holiday season with special offers.",
    dueDate: "2025-07-10",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "High",
    progress: 100,
    category: "Social Media Calendar",
  },
  {
    id: 3,
    title: "Twitter Thread: Product Launch",
    description:
      "Create an engaging Twitter thread announcing the new product line with behind-the-scenes content.",
    dueDate: "2025-07-15",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "Not Started",
    priority: "High",
    progress: 0,
    category: "Social Media Calendar",
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
    category: "Social Media Calendar",
  },
  {
    id: 5,
    title: "Email Newsletter: Monthly Update",
    description:
      "Create and send monthly newsletter to subscribers with company updates and promotions.",
    dueDate: "2025-07-25",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    category: "Marketing Plan",
  },
  {
    id: 6,
    title: "Instagram Carousel: Summer Collection",
    description:
      "Create a 5-slide carousel showcasing the new summer collection with product details and pricing.",
    dueDate: "2025-08-05",
    assignee: "Emily Johnson",
    client: "Fashion Brand",
    status: "In Progress",
    priority: "Medium",
    progress: 60,
    category: "Blog Creation",
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
    category: "Social Media Calendar",
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
    category: "Blog Creation",
  },
];

export const categories: Category[] = [];

export const statuses: Status[] = [
  { name: "Not Started", count: 19, color: "bg-[#A0AEBA] " },
  { name: "In Progress", count: 19, color: "bg-[#D29A09] " },
  { name: "Completed", count: 19, color: "bg-[#2BAE82]" },
];

// Helper function to get next ID
export const getNextTaskId = (tasks: Task[]): number => {
  const numericIds = tasks.map(t => typeof t.id === 'number' ? t.id : Number(t.id)).filter(id => !isNaN(id));
  return Math.max(...numericIds, 0) + 1;
};

// Helper function to get next category ID
export const getNextCategoryId = (categories: Category[]): number => {
  return Math.max(...categories.map(cat => cat.id || 0), 0) + 1;
};

// Helper function to update category counts
export const updateCategoryCounts = (tasks: Task[], categories: Category[]): Category[] => {
  console.log("Updating category counts...", " tasks:", tasks, "categories:", categories);
  return categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.category === category.name).length,
  }));
};
