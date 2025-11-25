"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  createEmployee,
  type Employee as ApiEmployee,
  type EmployeeFormData,
} from "@/lib/api/employee";
import { uploadImage } from "@/lib/api/storage";
import { createEmpSchema, type CreateEmpFormData } from "@/lib/validations/employee";

const AddNewEmployee = ({ closeEmployeeForm }: { closeEmployeeForm?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    if (closeEmployeeForm) {
      closeEmployeeForm();
    } else {
      // Navigate back to employees list
      const base = pathname?.split("/employees")[0] || "";
      router.push(`${base}/employees`);
    }
  };

  const mapToApi = (data: CreateEmpFormData) => {
    const status: EmployeeFormData["status"] =
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

    const payload: any = {
      fullName: data.fullName,
      phone: data.primaryPhone || "",
      primaryEmail: data.primaryEmail,
      jobTitle: data.jobTitle,
      status,
      employmentType: employmentTypeMap[data.employementType] ?? "FULL_TIME",
      salary: data.salary ?? 0,
      accountRoleId: data.userRole,
      languagePreference: "EN",
      startDate: data.accStartDate,
      notes: data.notes,
      password: data.password,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      fullAddress: data.fullAddress,
      performanceRating: data.performanceRating,
      endDate: data.endDate,
      departmentId: data.departmentId,
    };

    // Only include profilePhotoURL if it's not empty
    if (data.profilePhotoURL && data.profilePhotoURL.trim() !== "") {
      payload.profilePhotoURL = data.profilePhotoURL;
    }

    return payload;
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["employees", "create"],
    mutationFn: async (payload: EmployeeFormData) => {
      const res = await createEmployee(payload);
      if (res.status === 409) toast.error("Employee with this email already exists.");
      if (!res.data) throw new Error("Create failed");
      if (res.status !== 201) throw new Error(JSON.stringify(res.data) || "Create failed");
      return res.data as ApiEmployee;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully");
    },
    onError: (error: { message: string; status: number }) => {
      if (error.status === 409) {
        toast.error("Employee with this email already exists.");
        return;
      }
      toast.error(error.message || "Failed to create employee");
    },
  });

  const handleSave = async (data: CreateEmpFormData) => {
    setIsSubmitting(true);

    try {
      // Validate password is provided in create mode
      if (!data.password || data.password.trim() === "") {
        toast.error("Password is required");
        setIsSubmitting(false);
        return;
      }

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

      // Upload primary image if present and is a File
      if (data.profilePhoto && data.profilePhoto instanceof File) {
        console.log("in try catch for image upload");
        try {
          const res = await uploadImage(data.profilePhoto);
          console.log("Primary image upload response:", res);
          if (res?.data) {
            result.data.profilePhotoURL = res.data.url;
          }
        } catch (err) {
          console.error("Primary image upload failed:", err);
          alert("Failed to upload primary image. Please try again.");
          return;
        }
      }

      // If validation passes, proceed with create employee api
      await mutateAsync(mapToApi(result.data));
      handleClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    handleClose();
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
                onClick={e => {
                  e.preventDefault();
                  handleClose();
                }}
              >
                Employee Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md">Add New Employees</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Add New Employees</h1>
          <p className="text-muted-foreground">Add fresh hires to the system</p>
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
            {isSubmitting ? "Saving..." : "Add Employee"}
          </Button>
        </div>
      </div>

      <EmployeeForm
        mode="create"
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddNewEmployee;

