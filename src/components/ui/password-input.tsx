"use client";

import { Eye, EyeOff, RefreshCw } from "lucide-react";
import React, { useState } from "react";

import { calculatePasswordStrength, generateStrongPassword } from "@/lib/functions";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Input } from "./input";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean;
  onPasswordChange?: (password: string) => void;
  enableGeneratePassword?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showStrengthIndicator = true,
      onPasswordChange,
      enableGeneratePassword = true,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState(props.value?.toString() || "");
    const strength = calculatePasswordStrength(password);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      onPasswordChange?.(newPassword);
      props.onChange?.(e);
    };

    const handleGeneratePassword = () => {
      const generatedPassword = generateStrongPassword();
      setPassword(generatedPassword);
      onPasswordChange?.(generatedPassword);

      // Create a synthetic event to trigger onChange
      const syntheticEvent = {
        target: { value: generatedPassword },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange?.(syntheticEvent);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className={cn("pr-20", className)}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {enableGeneratePassword && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGeneratePassword}
                className="size-8 p-0"
                title="Generate strong password"
              >
                <RefreshCw className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="size-8 p-0"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
        </div>

        {showStrengthIndicator && password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Password strength:</span>
              <span
                className={cn(
                  "font-medium",
                  strength.score >= 3 ? "text-green-600" : "text-orange-600"
                )}
              >
                {strength.label}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={cn("h-full rounded-full transition-all duration-300", strength.color)}
                style={{ width: `${strength.percentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {(password as string).length < 8 && "At least 8 characters required"}
              {(password as string).length >= 8 &&
                strength.score < 2 &&
                "Add uppercase, numbers, or symbols for better security"}
              {strength.score >= 3 && "Good password strength!"}
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
