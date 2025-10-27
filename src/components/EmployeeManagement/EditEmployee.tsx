"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import { updateEmployee } from "@/lib/api";
import { Employee } from "@/lib/types";
import type { EmployeeFormData } from "@/lib/validations/employee";

import EmployeeForm from "./EmployeeForm";

interface EditEmployeeProps {
  employee: Employee | null;
  closeEditEmployeeForm: () => void;
}

const EditEmployee = ({ employee, closeEditEmployeeForm }: EditEmployeeProps) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) => updateEmployee(id, data),
    onSuccess: (response) => {
      if (response.status === 200 || response.status === 201) {
        toast.success("Employee updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        closeEditEmployeeForm();
      } else {
        toast.error("Failed to update employee");
      }
    },
    onError: () => {
      toast.error("An error occurred while updating the employee. Please try again.");
    },
  });

  const handleCancel = () => {
    closeEditEmployeeForm();
  };

  const handleSave = async (data: EmployeeFormData) => {
    if (!employee) return;
    updateMutation.mutate({ id: employee.id, data });
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/employees">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/employees" className="text-blue-600 font-medium text-md">
                Employee Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Employee</h1>
          <p className="text-muted-foreground">
            Update employee details and information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="employee-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <EmployeeForm
        mode="edit"
        employee={employee}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditEmployee;

