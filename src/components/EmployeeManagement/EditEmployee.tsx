"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import EmployeeForm from "@/components/Forms/EmployeeForm";
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
import { getEmployeeById, updateEmployee, type EmployeeFormData } from "@/lib/api/employee";
import { createEmpSchema, type CreateEmpFormData } from "@/lib/validations/employee";

const EditEmployee = ({ employeeId, closeEmployeeForm }: { employeeId: string; closeEmployeeForm?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<CreateEmpFormData | undefined>(undefined);
  const queryClient = useQueryClient();
  const router = useRouter();
  const onClose = () => {
    if (closeEmployeeForm) return closeEmployeeForm();
    router.back();
  };

  const mapToApi = (data: CreateEmpFormData) => {
    const status =
      data.employeeStatus === "active"
        ? "Active"
        : data.employeeStatus === "inactive"
          ? "Inactive"
          : "On Leave";
    const employmentTypeMap: Record<string, "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN"> = {
      "Full-time": "FULL_TIME",
      "Part-time": "PART_TIME",
      Contract: "CONTRACT",
      Internship: "INTERN",
      Temporary: "CONTRACT",
      Volunteer: "CONTRACT",
      Other: "CONTRACT",
    };
    return {
      fullName: data.fullName,
      email: data.email,
      phone: data.primaryPhone || "",
      jobTitle: data.jobTitle,
      employeeId: data.employeeID,
      status,
      employmentType: employmentTypeMap[data.employementType] ?? "FULL_TIME",
      salary: data.salary ?? 0,
      notes: data.notes,
      address: data.address,
    };
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["employees", "update"],
    mutationFn: async (payload: { id: string; body: EmployeeFormData }) => {
      const res = await updateEmployee(payload.id, payload.body);
      if (!res.data) throw new Error("Update failed");
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated successfully");
    },
    onError: () => {
      toast.error("Failed to update employee");
    },
  });

  const { data: employeeData } = useQuery({
    queryKey: ["employees", employeeId],
    queryFn: async () => {
      const res = await getEmployeeById(employeeId);
      return res.data;
    },
    enabled: !!employeeId,
  });


  useEffect(() => {
    if (employeeData) {
      console.log(employeeData);
      const initialData = employeeData
        ? ({
          fullName: employeeData.fullName,
          email: employeeData.email,
          department: "Other",
          empRole: "Employee",
          jobTitle: employeeData.jobTitle || "",
          employeeID: employeeData.employeeId,
          userManagement: [],
          contentManagement: [],
          analyticsAndReports: [],
          primaryEmail: employeeData.email,
          primaryPhone: employeeData.phone,
          salary: employeeData.salary,
          employementType: "Full-time",
          address: employeeData.address || "",
          skills: employeeData.skills?.join(", ") || "",
          employeeStatus: employeeData.status === "Active" ? "active" : employeeData.status === "Inactive" ? "inactive" : "onleave",
          accountActive: true,
          emailVerification: false,
          forcePassChange: false,
          accExpiryDate: undefined,
          tempPassword: undefined,
          notes: employeeData.notes || "",
        } as CreateEmpFormData)
        : undefined;
  
      setInitialData(initialData);
    }
  }, [employeeData]);

  const handleSave = async (data: CreateEmpFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createEmpSchema.safeParse(data);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        return;
      }

      // If validation passes, proceed with update employee api
      await mutateAsync({ id: employeeId, body: mapToApi(result.data) as EmployeeFormData });
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while updating the employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    onClose();
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="#"
                className="text-blue-600 font-medium text-md"
                onClick={closeEmployeeForm}
              >
                Settings
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md">Edit Employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Employee</h1>
          <p className="text-muted-foreground">Update employee details and information</p>
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
            form="user-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0]/80 font-[400] rounded-[16px] border-[#3072C0]  bg-[#3072C0] text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <EmployeeForm
        mode="edit"
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        initialData={initialData}
      />
    </div>
  );
};

export default EditEmployee;
