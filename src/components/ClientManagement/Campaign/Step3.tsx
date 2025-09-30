import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepFormProps } from "@/lib/types";

function StepPreferences({ form }: StepFormProps) {
  const { control, watch, setValue } = form;
  const contact = watch("contactMethod");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={control}
        name="newsletter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-3 rounded-md border p-3 sm:col-span-2">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-0.5">
              <FormLabel className="text-base">Subscribe to newsletter</FormLabel>
              <p className="text-sm text-muted-foreground">
                Get updates and tips delivered to your inbox.
              </p>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contactMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred contact</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={val =>
                  setValue("contactMethod", val as "email" | "phone", { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {contact === "phone" && (
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123‑4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

export default StepPreferences;
