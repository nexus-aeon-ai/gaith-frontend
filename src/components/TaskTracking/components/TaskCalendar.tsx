import { format, getDay, parse, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Button } from "@/components/ui/button";
import { SimpleCategory } from "@/lib/api/tasks";

interface Task {
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

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface TaskCalendarProps {
  tasks: Task[];
  categories: Category[] | SimpleCategory[];
  currentDate: Date;
  onNavigate: (newDate: Date) => void;
  onSelectEvent: (event: any) => void;
}

const TaskCalendar = ({ tasks, categories, currentDate, onNavigate, onSelectEvent }: TaskCalendarProps) => {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onNavigate(newDate);
  };

  // Group tasks by date
  const groupTasksByDate = () => {
    const groupedTasks: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
      if (!groupedTasks[dateKey]) {
        groupedTasks[dateKey] = [];
      }
      groupedTasks[dateKey].push(task);
    });

    return groupedTasks;
  };

  const groupedTasks = groupTasksByDate();

  // Create events for the calendar
  const createCalendarEvents = () => {
    const events: any[] = [];
    
    Object.entries(groupedTasks).forEach(([dateKey, tasksForDate]) => {
      // Always create grouped events, even for single tasks
      events.push({
        id: `group-${dateKey}`,
        title: tasksForDate.length === 1 ? tasksForDate[0].title : `${tasksForDate.length} tasks`,
        start: new Date(dateKey),
        end: new Date(dateKey),
        allDay: true,
        resource: { 
          tasks: tasksForDate, 
          isGrouped: true, 
          date: dateKey,
          count: tasksForDate.length,
          isSingleTask: tasksForDate.length === 1,
        },
      });
    });

    // Add today marker
    events.push({
      id: "today-marker",
      title: "Today",
      start: new Date(),
      end: new Date(),
      allDay: true,
      resource: { category: "Today" },
    });

    return events;
  };

  return (
    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">{formatMonthYear(currentDate)}</h3>
        <div className="flex gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 sm:p-2 bg-card border-gray-700 hover:bg-card hover:text-white h-8 sm:h-10"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1 sm:p-2 bg-card border-gray-700 hover:bg-card hover:text-white h-8 sm:h-10"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-2 sm:p-3 md:p-4">
        <BigCalendar
          localizer={dateFnsLocalizer({
            format,
            parse,
            startOfWeek,
            getDay,
            locales: {},
          })}
          events={createCalendarEvents()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "min(900px, 85vh)" }}
          views={["month"]}
          defaultView="month"
          eventPropGetter={(event) => {
            const task = event.resource;
            
            // Special handling for Today marker
            if (task?.category === "Today") {
              return {
                style: {
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  borderRadius: "0",
                  border: "none",
                  fontSize: "12px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                },
              };
            }
            
            // Handle grouped tasks (including single tasks)
            if (task?.isGrouped) {
              // For single tasks, use category colors
              if (task.isSingleTask) {
                const singleTask = task.tasks[0];
                const categoryData = categories.find(cat => cat.name === singleTask?.category);
                const colorMap: { [key: string]: { font: string, bg: string } } = {
                  "text-[#508CD3]": { font: "#508CD3", bg: "#3072c014" },
                  "text-[#2BAE82]": { font: "#2BAE82", bg: "#2BAE8214" }, 
                  "text-[#ECA338]": { font: "#ECA338", bg: "#ECA33814" },
                  "text-[#FBDAE7]": { font: "#FBDAE7", bg: "#FBDAE714" },
                  "text-[#C99DDD]": { font: "#C99DDD", bg: "#C99DDD14" },
                };
                const colors = categoryData ? colorMap[categoryData.color] || { font: "#3B82F6", bg: "#3B82F6" } : { font: "#3B82F6", bg: "#3B82F6" };
                
                return {
                  style: {
                    backgroundColor: colors.bg,
                    color: colors.font,
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: "500",
                    padding: "4px 8px",
                    margin: "2px 4px",
                    width: "calc(100% - 8px)",
                    textAlign: "center",
                  },
                };
              }
              
              // For multiple tasks, use the blue grouped style
              return {
                style: {
                  backgroundColor: "#3072c014",
                  color: "#508CD3",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "6px 10px",
                  margin: "2px 4px",
                  width: "calc(100% - 8px)",
                  textAlign: "center",
                },
              };
            }
            
            // Fallback for any other events
            return {
              style: {
                backgroundColor: "#3B82F6",
                color: "#FFFFFF",
                borderRadius: "6px",
                border: "none",
                fontSize: "11px",
                fontWeight: "500",
                padding: "4px 8px",
                margin: "2px 4px",
                width: "calc(100% - 8px)",
                textAlign: "center",
              },
            };
          }}
          onNavigate={onNavigate}
          date={currentDate}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
};

export default TaskCalendar; 

