import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiClient } from "@/lib/api";
import { SimpleCategory } from "@/lib/api/tasks";
import { cn } from "@/lib/utils";

import { AddCategoryButton } from "../add-modal";

interface TaskFilterProps {
  clients: ApiClient[];
  filterType: string;
  categories: SimpleCategory[];
  onCategorySelect: (category: string) => void;
}

const TaskFilters = ({
  clients,
  filterType,
  categories,
  onCategorySelect,
}: TaskFilterProps) => {
  const { theme } = useTheme();
  useEffect(() => {
    console.log("clients in filter:", clients);
  }, [clients]);
  return (
    <div
      className={cn("bg-card rounded-[16px] p-2 sm:p-3 md:p-4 shadow-sm cursor-pointer font-inter")}
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between",
          "gap-2 sm:gap-3 mb-3 sm:mb-4",
        )}
      >
        <span className={cn("text-lg font-bold", "text-[#070913] dark:text-[#F6FBFE]")}>
          Filter By:
        </span>
        {/* buttons  */}
        <div className="flex gap-1 sm:gap-2 md:gap-2">
          {filterType === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 ",
                    "bg-card border-border text-xs h-auto",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500 rounded-[16px]",
                  )}
                >
                  <MenuIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive">
                  <EditIcon />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <DeleteIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2 font-inter",
              "bg-card border-border text-sm h-auto",
              "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
            )}
          >
            <ExcelIcon className="!w-5 !h-5" />
            <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
            <span className=" dark:text-white text-gray-900">Excel</span>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2 ",
              "bg-card border-border text-sm h-auto",
              "hover:bg-card hover:border-blue-500 rounded-[16px]",
            )}
          >
            <PdfIcon className="!w-5 !h-5" />
            <span className="hidden xl:inline dark:text-white text-gray-900">Export</span>
            <span className=" dark:text-white text-gray-900">PDF</span>
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col xl:flex-row items-start xl:items-center justify-between",
          "gap-3 sm:gap-4",
        )}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center",
            "gap-2 sm:gap-3 md:gap-4 w-full xl:w-auto",
          )}
        >
          <Select>
            <SelectTrigger
              className={cn(
                "w-72 p-3 px-4 py-6 rounded-[16px] cursor-pointer",
                "text-xs sm:text-sm dark:border-[#404663]",
              )}
            >
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client: ApiClient) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.clientName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={onCategorySelect}>
            <SelectTrigger
              className={cn(
                "w-72 p-3 px-4 py-6 rounded-[16px] cursor-pointer",
                "text-xs sm:text-sm dark:border-[#404663]",
              )}
            >
              <SelectValue placeholder="Task Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AddCategoryButton className="w-full xl:w-60 h-10 sm:h-12 rounded-[16px] bg-card cursor-pointer">
          Add New Category
        </AddCategoryButton>
      </div>
    </div>
  );
};

export default TaskFilters;
