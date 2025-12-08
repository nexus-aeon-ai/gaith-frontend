import * as React from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TagBadge } from "@/components/ui/tag-badge";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = "#000000",
  onChange,
  className,
  label,
  placeholder = "Select a color",
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setInputValue(color);
    setTouched(true);
    onChange?.(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setInputValue(color);
    setTouched(true);
    if (color.startsWith("#")) {
      onChange?.(color);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-black-0 bg-transparent hover:bg-transparent sm:h-10"
            >
              <TagBadge label={label || "Tag Preview"} color={inputValue} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <div className="space-y-4">
              <HexColorPicker
                color={inputValue}
                onChange={handleColorChange}
                className="!h-48 !w-full"
              />
              <div className="flex flex-wrap justify-between gap-2">
                {["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"].map(color => (
                  <button
                    key={color}
                    type="button"
                    style={{
                      backgroundColor: color,
                      border: color === inputValue ? "2px solid #333" : "1px solid #ccc",
                    }}
                    className="size-6 cursor-pointer rounded focus:outline-none"
                    aria-label={`Select color ${color}`}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Hex Color</Label>
                <HexColorInput
                  color={inputValue}
                  onChange={handleColorChange}
                  className={cn(
                    "h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    inputValue.startsWith("#") || !touched ? "border-input" : "border-red-500"
                  )}
                  prefixed
                  aria-invalid={!inputValue.startsWith("#") && touched ? true : undefined}
                />
                {!inputValue.startsWith("#") && touched && (
                  <span className="text-xs text-red-500">Invalid hex code</span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn("flex-1", inputValue.startsWith("#") || !touched ? "" : "border-red-500")}
          onBlur={() => setTouched(true)}
        />
      </div>
    </div>
  );
};
