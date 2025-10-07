import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import { cn } from "@/lib/utils";

interface DotMenuProps {
  options: {
    label: string;
    action: () => void;
    icon: React.ReactNode;
  }[];
}

const DotMenu = ({ options }: DotMenuProps) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-card border-border text-xs h-12",
            "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
            "hover:bg-card hover:border-blue-500",
          )}
        >
          <MenuIcon style={{ color: "var(--icon-primary)" }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option, index) => (
          <DropdownMenuItem
            variant="default"
            onClick={option.action}
            key={index}
            className="flex items-center gap-2"
          >
            {option.icon}
            <span className="hidden sm:inline dark:text-white text-gray-900">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DotMenu;
