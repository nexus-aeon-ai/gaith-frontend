"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { updateUser, type IUser } from "@/lib/api/user";
import { createUserSchema, type CreateUserFormData } from "@/lib/validations/user";

const EditUser = ({ closeNewUserForm, user }: { closeNewUserForm: () => void; user: IUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: Partial<IUser>) => {
      return updateUser(user.id, payload as any);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeNewUserForm();
    },
    onError: err => {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const handleSave = async (data: CreateUserFormData) => {
    setIsSubmitting(true);
    try {
      const result = createUserSchema.safeParse(data);
      if (!result.success) {
        return;
      }

      const payload: Partial<IUser> = {
        fullName: data.fullName,
        email: data.email,
        ...(data.password ? { password: data.password } : {}),
        phoneNumber: data.phoneNumber,
        role: data.userRole as string,
        jobTitle: data.jobTitle,
        accountRoleId: user.accountRoleId,
        languagePreference: user.languagePreference,
        isActive: data.accountActive,
        emailVerificationRequired: data.emailVerification,
        forcePasswordChange: data.forcePassChange,
        accountExpirationDate: data.accExpiryDate ? data.accExpiryDate.toISOString() : null,
        notes: data.notes || "",
      };

      mutation.mutate(payload);
    } catch (error) {
      console.error("Form submission error:", error);
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
            <BreadcrumbPage className="text-md">Edit User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit User</h1>
          <p className="text-muted-foreground">
            Update user information, permissions, and account settings for Sarah Anderson. 
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
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>

      <UserForm mode="edit" onSubmit={handleSave} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </div>
  );
};

export default EditUser;
