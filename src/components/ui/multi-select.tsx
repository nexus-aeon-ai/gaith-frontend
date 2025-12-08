import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, Sparkles, XCircle, XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/scrollable-popover";
import { Separator } from "@/components/ui/separator";
import { TagBadge } from "@/components/ui/tag-badge";
import { cn } from "@/lib/utils";

const multiSelectVariants = cva(
  "m-1 !flex transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-primary text-white hover:bg-primary/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
  selectAll?: boolean;
  refetchQuery?: () => void;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      className,
      selectAll = false,
      refetchQuery,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(defaultValue);
      }
    }, [defaultValue, selectedValues]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      if (refetchQuery && !isPopoverOpen) {
        refetchQuery();
      }
      setIsPopoverOpen(prev => !prev);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map(option => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-black-0 bg-background/15 p-1 hover:bg-background/15 focus:outline-none focus:ring-1 focus:ring-ring",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map(value => {
                    const option = options.find(o => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <TagBadge
                        key={value}
                        label={option?.label || ""}
                        color={option?.color || "#222"}
                        className={cn(
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && <IconComponent className="size-4" />}
                        <XCircle className="mr-1 size-4 cursor-pointer" />
                      </TagBadge>
                    );
                  })}
                  {selectedValues.length > maxCount &&
                    (() => {
                      const moreCount = selectedValues.length - maxCount;
                      return (
                        <div
                          className={cn(
                            "ml-1 flex items-center rounded-full border border-dashed border-foreground/30 bg-muted px-2 py-1 text-xs font-medium text-muted-foreground",
                            isAnimating ? "animate-bounce" : "",
                            multiSelectVariants({ variant })
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {`+${moreCount} more`}
                        </div>
                      );
                    })()}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={event => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-muted-foreground">{placeholder}</span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {selectAll && (
                  <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.length === options.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="size-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}
                {options.map(option => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      style={{ pointerEvents: "auto", opacity: 1 }}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="size-4" />
                      </div>
                      {option.color && (
                        <div
                          className="mr-2 size-3 rounded border border-gray-300"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      {option.icon && <option.icon className="mr-2 size-4 text-muted-foreground" />}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        style={{ pointerEvents: "auto", opacity: 1 }}
                        className="flex-1 cursor-pointer justify-center"
                      >
                        Clear
                      </CommandItem>
                      <Separator orientation="vertical" className="flex h-full min-h-6" />
                    </>
                  )}
                  <CommandSeparator />
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    style={{ pointerEvents: "auto", opacity: 1 }}
                    className="flex-1 cursor-pointer justify-center"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
          {animation > 0 && selectedValues.length > 0 && (
            <Sparkles
              className={cn(
                "my-2 size-3 cursor-pointer bg-background text-foreground",
                isAnimating ? "" : "text-muted-foreground"
              )}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
