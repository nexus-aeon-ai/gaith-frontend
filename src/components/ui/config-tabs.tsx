import * as React from "react";

import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn("flex flex-row gap-2 border-b border-muted", className)}>
      {React.Children.map(children, child => {
        if (!React.isValidElement<TabProps>(child)) return null;
        return React.cloneElement(child, {
          selected: child.props.value === value,
          onSelect: () => onValueChange(child.props.value),
        });
      })}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
}

export function Tab({ value: _value, children, selected, onSelect, icon }: TabProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-muted/30 text-primary"
          : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-primary"
      )}
      onClick={onSelect}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
}
