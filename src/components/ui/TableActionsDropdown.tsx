import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { MoreOptionsIcon } from "./icons";

export interface TableAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}

interface TableActionsDropdownProps {
  actions: TableAction[];
}

const TableActionsDropdown: React.FC<TableActionsDropdownProps> = ({ actions }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreOptionsIcon className="!size-6 transition-colors group-hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 space-y-1 rounded-xl border bg-white p-1 shadow-lg"
      >
        {actions.map((action, idx) => (
          <React.Fragment key={action.label}>
            {action.variant === "destructive" && idx !== 0 && (
              <DropdownMenuSeparator className="bg-muted" />
            )}
            <DropdownMenuItem
              onClick={action.onClick}
              className={cn(
                "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm",
                "text-muted-foreground hover:bg-muted focus:bg-muted focus:outline-none",
                action.variant === "destructive" &&
                  "font-semibold text-destructive hover:!text-destructive"
              )}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              <span>{action.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActionsDropdown;
