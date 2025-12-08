"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { updateEmployee, type EmployeeFormData , BackendEmployee } from "@/lib/api/employee";
import { uploadImage } from "@/lib/api/storage";
import { createEmpSchema, type CreateEmpFormData } from "@/lib/validations/employee";

interface EditEmployeeProps {
  employeeId: string;
  initialData?: BackendEmployee;
  closeEmployeeForm?: () => void;
}

const EditEmployee = ({ employeeId, initialData: serverData, closeEmployeeForm }: EditEmployeeProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      phone: data.primaryPhone || "",
      primaryEmail: data.primaryEmail,
      jobTitle: data.jobTitle,
      employeeId: data.employeeID,
      status,
      employmentType: employmentTypeMap[data.employementType] ?? "FULL_TIME",
      salary: data.salary ?? 0,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      fullAddress: data.fullAddress,
      accountRoleId: data.userRole,
      languagePreference: "EN",
      startDate: data.accStartDate,
      endDate: data.endDate,
      profilePhotoURL: data.profilePhotoURL as string,
      skills: data.skills,
      notes: data.notes,
      performanceRating: data.performanceRating,
      departmentId: data.departmentId,
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

  // Transform server-fetched data to form format
  const transformServerDataToForm = (data: BackendEmployee): CreateEmpFormData => {
    const employmentTypeMap: Record<string, string> = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACT: "Contract",
      INTERN: "Internship",
    };

    return {
      fullName: data.user?.fullName || "",
      primaryEmail: data.user?.email || "",
      primaryPhone: data.user?.phoneNumber || "",
      jobTitle: data.user?.jobTitle || "",
      employeeID: data.employeeId,
      departmentId: data.user?.departmentId || "",
      userRole: "", // Will need to be fetched separately or mapped
      profilePhotoURL: data.profilePicture || "",
      profilePhoto: undefined,
      userManagement: [],
      contentManagement: [],
      analyticsAndReports: [],
      salary: data.salary ? parseFloat(data.salary) : undefined,
      employementType: (employmentTypeMap[data.employmentType] || "Full-time") as "Full-time" | "Part-time" | "Contract" | "Internship",
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      zipCode: data.zipCode || "",
      fullAddress: data.fullAddress || "",
      skills: data.skills?.map(s => s.skill).join(", ") || "",
      employeeStatus:
        data.status === "ACTIVE"
          ? "active"
          : data.status === "INACTIVE"
            ? "inactive"
            : data.status === "TERMINATED"
              ? "inactive"
              : "onleave",
      accStartDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      notes: data.notes || "",
      performanceRating: data.performanceRating || undefined,
      password: "",
      confirmPassword: "",
    };
  };

  const formInitialData = serverData ? transformServerDataToForm(serverData) : undefined;

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

      // Upload primary image if present and is a File (same behavior as AddEmployee)
      if (result.data.profilePhoto && result.data.profilePhoto instanceof File) {
        try {
          const res = await uploadImage(result.data.profilePhoto);
          if (res?.data) {
            result.data.profilePhotoURL = res.data.url;
          }
        } catch (err) {
          console.error("Primary image upload failed:", err);
          toast.error("Failed to upload primary image. Please try again.");
          return;
        }
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

  if (!formInitialData) {
    return <div>Loading...</div>;
  }

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
              <Link href="#" className="text-blue-600 font-medium text-md" onClick={handleCancel}>
                Employee Management
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
        initialData={formInitialData}
      />
    </div>
  );
};

export default EditEmployee;

