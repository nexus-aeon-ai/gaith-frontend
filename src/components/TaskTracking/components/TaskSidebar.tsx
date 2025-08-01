import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Status {
  name: string;
  count: number;
  color: string;
}

interface TaskSidebarProps {
  categories: Category[];
  statuses: Status[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const TaskSidebar = ({ categories, statuses, selectedCategory, onCategorySelect }: TaskSidebarProps) => {
  return (
    <div className="w-80 space-y-6">
      {/* Task Categories */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Categories</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index}>
                <button
                  type="button"
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors w-full text-left ${
                    selectedCategory === category.name
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onCategorySelect(category.name)}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className={`text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6 flex items-center justify-center ${category.color}`}>
                    {category.count}
                  </Badge>
                </button>
                {category.name === "Social Media Calendar" && selectedCategory === category.name && (
                  <div className="ml-5 space-y-1">
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Draft</span>
                      <Badge variant="secondary" className={`text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6 flex items-center justify-center ${category.color}`}>
                        4
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Review</span>
                      <Badge variant="secondary" className={`text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6 flex items-center justify-center ${category.color}`}>
                        5
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Sent To Client</span>
                      <Badge variant="secondary" className={`text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6 flex items-center justify-center ${category.color}`}>
                        7
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Approved By Client</span>
                      <Badge variant="secondary" className={`text-xs bg-[#3072C014] rounded-full px-2 py-1 w-8 h-6 flex items-center justify-center ${category.color}`}>
                        7
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Status */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Status</h3>
          <div className="space-y-2">
            {statuses.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{status.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {status.count}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">25%</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              5 of 40 tasks
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-[#3072C0] h-full rounded-full" style={{ width: "25%" }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSidebar; 
