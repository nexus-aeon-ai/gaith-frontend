"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

import UserForm from "@/components/Forms/UserForm";
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
import { createUser } from "@/lib/api/user";
import { createUserSchema, type CreateUserFormData } from "@/lib/validations/user";

const AddNewUser = ({ closeNewUserForm }: { closeNewUserForm: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data: CreateUserFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const result = createUserSchema.safeParse(data);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        toast.error("Please fix the validation errors");
        return;
      }

      // If validation passes, proceed with create user api
      const response = await createUser({
        fullName: data.fullName,
        email: data.email,
        username: data.email, // Use email as username
        role: data.userRole,
        status: data.accountActive ? "Active" : "Inactive",
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("User created successfully!");
        closeNewUserForm();
      } else {
        toast.error("Failed to create user");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while creating the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    closeNewUserForm();
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
              <Link href="#" className="text-blue-600 font-medium text-md" onClick={closeNewUserForm}>
                Settings
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-md">Add New User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Add New User</h1>
          <p className="text-muted-foreground">
            Create a new user account with appropriate permissions and settings.
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
            form="user-form"
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save User"}
          </Button>
        </div>
      </div>

      <UserForm mode="create" onSubmit={handleSave} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddNewUser;
