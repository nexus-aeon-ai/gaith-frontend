"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import PopupModal from "@/components/PopupModal/PopupModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import DeleteIcon from "@/components/ui/icons/options/delete-icon-v2";
import EditIcon from "@/components/ui/icons/options/edit-icon-v2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRolePermissions, updateRolePermissions } from "@/lib/api/settings";
import { deleteUser, getUsers, type IUser } from "@/lib/api/user";
import type {
  PermissionItem,
  RolePermissionUpdate,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createSettingsSchema,
  defaultFormData,
  type CreateSettingsFormData,
} from "@/lib/validations/settings";

// Employee type for UI representation
interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  permissions: {
    delete: boolean;
    approve: boolean;
    edit: boolean;
    view: boolean;
  };
}

// Function to transform API response to Employee format
const transformTeamMembersToEmployees = (users: IUser[]): Employee[] => {
  return users.map(user => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.isActive ? "active" : "inactive",
    permissions: {
      delete: user.accountRole.code === "admin" || user.isSuperuser,
      approve: user.accountRole.code === "admin" || user.isSuperuser,
      edit: user.accountRole.code === "admin" || user.accountRole.code === "employee",
      view: true,
    },
  }));
};


const roleStyles: Record<string, { bg: string; text: string }> = {
  Admin: { bg: "bg-blue-100", text: "text-blue-800" },
  Manager: { bg: "bg-green-100", text: "text-green-800" },
  Employee: { bg: "bg-purple-100", text: "text-purple-800" },
  Viewer: { bg: "bg-yellow-100", text: "text-yellow-800" },
};

// ----------- Types -----------
export type FormValues = CreateSettingsFormData;

export type UserManagementFormRef = {
  submitForm: () => Promise<boolean>;
  getValues: () => CreateSettingsFormData;
  isDirty: () => boolean;
  hasData: () => boolean;
  isValid: () => boolean;
};

interface UserManagementFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  setShowAddUserForm: (show: boolean) => void;
  setEditUser?: (user: IUser) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const UserManagementForm = forwardRef<UserManagementFormRef, UserManagementFormProps>(
  ({ onSubmit, isSubmitting: _isSubmitting, setShowAddUserForm, setEditUser }, ref) => {
    const [users, setUsers] = useState<Employee[]>([]);
    const [rolePermissions, setRolePermissions] = useState<PermissionItem[]>([]);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const queryClient = useQueryClient();

    // Fetch users from API
    const { data: usersData, isLoading: isLoadingTeamMembers } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const response = await getUsers();
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return [];
      },
    });

    // Fetch role permissions from API
    const { data: rolePermissionsData, isLoading: isLoadingRolePermissions } = useQuery({
      queryKey: ["role-permissions"],
      queryFn: async () => {
        const response = await getRolePermissions();
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return null;
      },
    });

    const form = useForm<CreateSettingsFormData>({
      resolver: zodResolver(createSettingsSchema),
      defaultValues: defaultFormData,
      mode: "onChange",
    });

    const { handleSubmit, getValues } = form;

    // Mutation for updating role permissions
    const updateRolePermissionsMutation = useMutation({
      mutationFn: async (updates: RolePermissionUpdate[]) => {
        console.log("📤 Sending role permissions update:", { permissions: updates });
        const response = await updateRolePermissions({ permissions: updates });
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to update role permissions");
        }
        return response.data;
      },
      onSuccess: () => {
        toast.success("Role permissions updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      },
      onError: error => {
        console.error("Error updating role permissions:", error);
        toast.error("Failed to update role permissions. Please try again.");
      },
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
      mutationFn: async (userId: string) => {
        const response = await deleteUser(userId);
        if (response.status !== 200) {
          throw new Error("Failed to delete user");
        }
        return response.data;
      },
      onSuccess: () => {
        toast.success("User deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setUserToDelete(null);
      },
      onError: error => {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      },
    });

    // Update users when API data is loaded
    useEffect(() => {
      if (usersData && usersData.length > 0) {
        console.log("📥 Received users from API:", usersData);
        const transformedEmployees = transformTeamMembersToEmployees(usersData);
        console.log("🔄 Transformed to users:", transformedEmployees);
        setUsers(transformedEmployees);
      }
    }, [usersData]);

    // Update role permissions when API data is loaded
    useEffect(() => {
      if (rolePermissionsData && rolePermissionsData.permissions) {
        console.log("📥 Received role permissions from API:", rolePermissionsData);
        setRolePermissions(rolePermissionsData.permissions);
      }
    }, [rolePermissionsData]);

    // Expose functions to parent
    // Helper function to check if form has meaningful data
    const hasFormData = () => {
      const values = getValues();
      return Object.keys(values.permissions || {}).length > 0;
    };

    useImperativeHandle(ref, () => ({
      submitForm: async (): Promise<boolean> => {
        const isValid = await form.trigger();
        if (!isValid) return false;

        try {
          await handleSubmit(onSubmit)();
          return true;
        } catch (error) {
          console.error("Form submission error:", error);
          return false;
        }
      },
      getValues: () => getValues(),
      isDirty: () => form.formState.isDirty,
      hasData: () => hasFormData(),
      isValid: () => form.formState.isValid,
    }));

    const handlePermissionChange = (
      permissionCode: string,
      roleCode: string,
      hasPermission: boolean,
    ) => {
      // Update local state immediately for UI responsiveness
      setRolePermissions(prev =>
        prev.map(permission =>
          permission.permissionCode === permissionCode
            ? {
              ...permission,
              roles: {
                ...permission.roles,
                [roleCode]: hasPermission,
              },
            }
            : permission,
        ),
      );

      // Send update to API
      const update: RolePermissionUpdate = {
        roleCode,
        permissionCode,
        hasPermission,
      };

      updateRolePermissionsMutation.mutate([update]);
    };

    const handleUserPermissionChange = (id: string, permission: "delete" | "approve" | "edit" | "view") => {
      setUsers(prev =>
        prev.map(emp =>
          emp.id === id
            ? {
              ...emp,
              permissions: {
                ...emp.permissions,
                [permission]: !emp.permissions[permission],
              },
            }
            : emp,
        ),
      );
    };


    return (
      <Form {...form}>
        <form
          id="user-management-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto m-0 font-inter"
        >
          <PopupModal
            open={!!userToDelete}
            onOpenChange={(open) => !open && setUserToDelete(null)}
            title="Delete User"
            iconComponent={
              <DeleteIcon
                width={75}
                height={75}
              />
            }
            description={`Are you sure you want to delete user ${userToDelete?.fullName}? This action cannot be undone.`}
            confirmButton={{
              label: "No, Keep",
              onClick: () => setUserToDelete(null),
            }}
            cancelButton={{
              label: "Yes, Delete",
              onClick: async () => {
                if (userToDelete) {
                  await deleteUserMutation.mutateAsync(userToDelete.id);
                }
              },
            }}
          />
          {/* Team Members */}
          <Card className="m-0 pt-3 rounded-none shadow-none">
            <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-md font-bold">Team Members</CardTitle>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center gap-2",
                  "rounded-[16px] px-6 py-6 border-none",
                  "bg-[#3072C0] hover:bg-[#3072c0]/80 text-white",
                )}
                onClick={() => setShowAddUserForm(true)}
              >
                <CirclePlus />
                <p>Add User</p>
              </Button>
            </CardHeader>

            <CardContent className="p-4">
              <div className="w-full overflow-x-auto">
                <div className="border rounded-lg">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingTeamMembers
                        ? // Loading skeleton rows
                        Array.from({ length: 3 }).map((_) => {
                          const loadingRowKey = `team-member-loading-${Date.now()}-${Math.random()}`;
                          return (
                            <TableRow key={loadingRowKey}>
                              <TableCell>
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              </TableCell>
                              <TableCell>
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              </TableCell>
                              <TableCell>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                              </TableCell>
                              <TableCell>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {Array.from({ length: 4 }).map(() => {
                                    const permLoadingKey = `perm-loading-${Date.now()}-${Math.random()}`;
                                    return (
                                      <div
                                        key={permLoadingKey}
                                        className="h-4 w-4 bg-gray-200 rounded animate-pulse"
                                      />
                                    );
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                        : users.map(emp => (
                          <TableRow key={emp.id}>
                            <TableCell>{emp.fullName}</TableCell>
                            <TableCell className="text-gray-600">{emp.email}</TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  "p-2 rounded-sm font-[400]",
                                  roleStyles[emp.role as string].bg,
                                  roleStyles[emp.role as string].text,
                                )}
                              >
                                {emp.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-[#2BAE8214] font-[400] p-2 rounded-sm capitalize hover:bg-[#2BAE8214] dark:text-[#68DAB3] text-[#175E46]">
                                {emp.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex md:flex-row flex-col gap-3">
                                {(["delete", "approve", "edit", "view"] as const).map(key => (
                                  <div key={key} className="flex items-center gap-2">
                                    <Checkbox
                                      checked={emp.permissions[key]}
                                      onCheckedChange={() =>
                                        handleUserPermissionChange(emp.id as string, key)
                                      }
                                      className="rounded-sm h-5 w-5 bg-card border border-[#3072C0]/50 data-[state=checked]:bg-[#3072C0]/30 data-[state=checked]:text-[#3072C0] data-[state=checked]:border-[#3072C0]/30"
                                    />
                                    <label className="text-sm cursor-pointer">{key}</label>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    if (typeof setEditUser === "function") {
                                      const user = usersData?.find(u => u.id === emp.id);
                                      if (user) setEditUser(user as IUser);
                                    }
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-md"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => {
                                    const user = usersData?.find(u => u.id === emp.id);
                                    if (user) setUserToDelete(user as IUser);
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-md"
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="pt-3 rounded-none shadow-none rounded-b-[12px]">
            <CardHeader className="px-3">
              <CardTitle className="text-md font-bold">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-[500px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead className="text-center">Super Admin</TableHead>
                        <TableHead className="text-center">Admin</TableHead>
                        <TableHead className="text-center">Employee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingRolePermissions
                        ? // Loading skeleton rows
                        Array.from({ length: 5 }).map((_) => {
                          const loadingRowKey = `role-perm-loading-${Date.now()}-${Math.random()}`;
                          return (
                            <TableRow key={loadingRowKey}>
                              <TableCell>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto" />
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto" />
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto" />
                              </TableCell>
                            </TableRow>
                          );
                        })
                        : rolePermissions.map(permission => (
                          <TableRow key={permission.permissionCode}>
                            <TableCell className="font-medium capitalize">
                              {permission.permissionName}
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={permission.roles.super_admin || false}
                                onCheckedChange={checked =>
                                  handlePermissionChange(
                                    permission.permissionCode,
                                    "super_admin",
                                      checked as boolean,
                                  )
                                }
                                className="rounded-sm h-5 w-5 bg-card border border-[#3072C0]/50 data-[state=checked]:bg-[#3072C0]/30 data-[state=checked]:text-[#3072C0] data-[state=checked]:border-[#3072C0]/30"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={permission.roles.admin || false}
                                onCheckedChange={checked =>
                                  handlePermissionChange(
                                    permission.permissionCode,
                                    "admin",
                                      checked as boolean,
                                  )
                                }
                                className="rounded-sm h-5 w-5 bg-card border border-[#3072C0]/50 data-[state=checked]:bg-[#3072C0]/30 data-[state=checked]:text-[#3072C0] data-[state=checked]:border-[#3072C0]/30"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={permission.roles.employee || false}
                                onCheckedChange={checked =>
                                  handlePermissionChange(
                                    permission.permissionCode,
                                    "employee",
                                      checked as boolean,
                                  )
                                }
                                className="rounded-sm h-5 w-5 bg-card border border-[#3072C0]/50 data-[state=checked]:bg-[#3072C0]/30 data-[state=checked]:text-[#3072C0] data-[state=checked]:border-[#3072C0]/30"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  },
);

UserManagementForm.displayName = "UserManagementForm";
export default UserManagementForm;
