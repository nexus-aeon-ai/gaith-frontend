"use client";

import { EllipsisVertical } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";

export function ActionsCell() {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <ViewIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
          <span className="hidden sm:inline dark:text-white text-gray-900">View</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EditIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
          <span className="hidden sm:inline dark:text-white text-gray-900">Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <DeleteIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
          <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
