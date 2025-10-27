"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import RightArrowIcon from "@/components/ui/icons/options/right-arrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { EmployeeFilters } from "@/lib/types";

interface FilterState {
  statuses: string[];
  employmentTypes: string[];
  departments: string[];
  jobTitles: string[];
  minSalary: string;
  maxSalary: string;
  minPerformance: string;
  maxPerformance: string;
  skills: string[];
}

interface EmployeeFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
}

const statusOptions = ["Active", "Inactive", "On Leave"];
const employmentTypeOptions = ["Full Time", "Part Time", "Contract", "Intern"];
const departmentOptions = ["Marketing", "Engineering", "Design", "Sales", "HR", "Finance", "Operations"];
const jobTitleOptions = ["Marketing Specialist", "Senior Developer", "UI/UX Designer", "Sales Manager", "HR Coordinator"];
const skillOptions = ["Marketing", "Analytics", "Design", "Development", "Sales", "Management"];

export default function EmployeeFilterSheet({
  open,
  onOpenChange,
  filters: apiFilters,
  setFilters: setApiFilters,
}: EmployeeFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>({
    statuses: [],
    employmentTypes: [],
    departments: [],
    jobTitles: [],
    minSalary: "",
    maxSalary: "",
    minPerformance: "",
    maxPerformance: "",
    skills: [],
  });

  const handleCheckboxChange = (
    category: keyof Pick<FilterState, "statuses" | "employmentTypes" | "departments" | "jobTitles" | "skills">,
    value: string,
    checked: boolean,
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value),
    }));
  };

  const handleSelectAll = (
    category: keyof Pick<FilterState, "statuses" | "employmentTypes" | "departments" | "jobTitles" | "skills">,
    options: string[],
  ) => {
    const allSelected = options.every(option => localFilters[category].includes(option));
    setLocalFilters(prev => ({
      ...prev,
      [category]: allSelected ? [] : options,
    }));
  };

  const clearFilters = () => {
    const cleared = {
      statuses: [],
      employmentTypes: [],
      departments: [],
      jobTitles: [],
      minSalary: "",
      maxSalary: "",
      minPerformance: "",
      maxPerformance: "",
      skills: [],
    };
    setLocalFilters(cleared);
    setApiFilters({});
    onOpenChange(false);
  };

  const applyFilters = () => {
    const newFilters: EmployeeFilters = {};
    
    if (localFilters.statuses.length > 0) {
      newFilters.status = localFilters.statuses[0].toUpperCase().replace(" ", "_") as any;
    }
    if (localFilters.employmentTypes.length > 0) {
      newFilters.employmentType = localFilters.employmentTypes[0].toUpperCase().replace(" ", "_") as any;
    }
    if (localFilters.minSalary) {
      newFilters.minSalary = Number(localFilters.minSalary);
    }
    if (localFilters.maxSalary) {
      newFilters.maxSalary = Number(localFilters.maxSalary);
    }
    if (localFilters.minPerformance) {
      newFilters.minPerformance = Number(localFilters.minPerformance);
    }
    if (localFilters.maxPerformance) {
      newFilters.maxPerformance = Number(localFilters.maxPerformance);
    }
    if (localFilters.skills.length > 0) {
      newFilters.skillsToInclude = localFilters.skills;
    }
    
    setApiFilters(newFilters);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:p-4 sm:pt-0 p-2">
          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-statuses"
                  checked={statusOptions.every(option => localFilters.statuses.includes(option))}
                  onCheckedChange={() => handleSelectAll("statuses", statusOptions)}
                />
                <Label htmlFor="select-all-statuses" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`status-${status}`}
                    checked={localFilters.statuses.includes(status)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("statuses", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Employment Type Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Employment Type</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-employment-types"
                  checked={employmentTypeOptions.every(option => localFilters.employmentTypes.includes(option))}
                  onCheckedChange={() => handleSelectAll("employmentTypes", employmentTypeOptions)}
                />
                <Label htmlFor="select-all-employment-types" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {employmentTypeOptions.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`employment-type-${type}`}
                    checked={localFilters.employmentTypes.includes(type)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("employmentTypes", type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`employment-type-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Department Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Department</Label>
              <div className="flex items-center space-x-2">
                <CheckboxSquare
                  id="select-all-departments"
                  checked={departmentOptions.every(option => localFilters.departments.includes(option))}
                  onCheckedChange={() => handleSelectAll("departments", departmentOptions)}
                />
                <Label htmlFor="select-all-departments" className="text-sm text-muted-foreground">
                  Select All
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              {departmentOptions.map(dept => (
                <div key={dept} className="flex items-center space-x-2">
                  <CheckboxSquare
                    id={`dept-${dept}`}
                    checked={localFilters.departments.includes(dept)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("departments", dept, checked as boolean)
                    }
                  />
                  <Label htmlFor={`dept-${dept}`} className="text-sm">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Range Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Salary Range</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min Salary"
                  value={localFilters.minSalary}
                  onChange={e => setLocalFilters(prev => ({ ...prev, minSalary: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7]"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max Salary"
                  value={localFilters.maxSalary}
                  onChange={e => setLocalFilters(prev => ({ ...prev, maxSalary: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7]"
                />
              </div>
            </div>
          </div>

          {/* Performance Range Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Performance Range</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min Performance"
                  value={localFilters.minPerformance}
                  onChange={e => setLocalFilters(prev => ({ ...prev, minPerformance: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7]"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max Performance"
                  value={localFilters.maxPerformance}
                  onChange={e => setLocalFilters(prev => ({ ...prev, maxPerformance: e.target.value }))}
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t">
          <Button variant="ghost" onClick={clearFilters} className="flex-1 py-6">
            Clear Filters
          </Button>
          <Button
            onClick={applyFilters}
            className="flex items-center flex-1 py-6 bg-[#3072C0] text-white rounded-[16px] text-[16px] font-medium"
          >
            <p>Apply Filter</p>
            <RightArrowIcon className="text-[#F6FBFE] dark:text-[#F6FBFE]" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

