"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Label } from "../ui/label";

interface PageSizeFilterProps {
  bgColor?: string;
}

export const PageSizeFilter: React.FC<PageSizeFilterProps> = ({ bgColor = "bg-card" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updatePageSize = (pageSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page_size", pageSize);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="page-size" className="whitespace-nowrap text-sm font-medium">
        Rows per page
      </Label>
      <Select
        value={searchParams.get("page_size") || PAGE_SIZE.toString()}
        onValueChange={(value: string) => updatePageSize(value)}
      >
        <SelectTrigger id="page-size" className={cn("min-w-[4.5rem] sm:min-w-24", bgColor)}>
          <SelectValue placeholder="Select number of results" />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((pageSize: number) => (
            <SelectItem key={pageSize} value={pageSize.toString()}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
