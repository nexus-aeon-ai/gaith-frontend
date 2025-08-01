import { format, getDay, parse, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Button } from "@/components/ui/button";

interface Task {
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

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface TaskCalendarProps {
  tasks: Task[];
  categories: Category[];
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{formatMonthYear(currentDate)}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 bg-card border-gray-700 hover:bg-card hover:text-white"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 bg-card border-gray-700 hover:bg-card hover:text-white"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4">
        <BigCalendar
          localizer={dateFnsLocalizer({
            format,
            parse,
            startOfWeek,
            getDay,
            locales: {},
          })}
          events={[
            ...tasks.map(task => ({
              id: task.id.toString(),
              title: task.title,
              start: new Date(task.dueDate),
              end: new Date(task.dueDate),
              allDay: true,
              resource: task,
            })),
            {
              id: "today-marker",
              title: "Today",
              start: new Date(),
              end: new Date(),
              allDay: true,
              resource: { category: "Today" },
            },
          ]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={["month"]}
          defaultView="month"
          eventPropGetter={(event) => {
            const task = event.resource;
            
            // Special handling for Today marker
            if (task?.category === "Today") {
              return {
                style: {
                  backgroundColor: "transparent",
                  color: "#3072C0",
                  borderRadius: "0",
                  border: "none",
                  fontSize: "24px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                },
              };
            }
            
            const categoryData = categories.find(cat => cat.name === task?.category);
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

