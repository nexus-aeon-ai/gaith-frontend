"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import PopupModal from "@/components/PopupModal/Modal";
import AddNewUser from "@/components/Settings/UserManagement/AddUser";
import EditUser from "@/components/Settings/UserManagement/EditUser";
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
import type { Employee, PermissionItem, Permissions, RolePermissionUpdate } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createSettingsSchema,
  defaultFormData,
  type CreateSettingsFormData,
} from "@/lib/validations/settings";

// Function to transform IUser API response to Employee format
const transformUsersToEmployees = (users: IUser[]): Employee[] => {
  return users.map(user => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
    // Adding mandatory fields for Employee type
    roleLevel: "Mid-Senior",
    department: {
      name: "General",
      team: "General Team",
    },
    contactInfo: {
      email: user.email,
      number: "+1 (555) 000-0000",
    },
    performance: "95%",
    profilePicture: "",
    status: user.isActive ? "active" : "inactive",
  }));
};

// Fallback mock employees (used when API fails)
const mockEmployees: Employee[] = [
  {
    id: "1",
    fullName: "John Smith",
    email: "john.smith@example.com",
    role: "Software Engineer",
    status: "active",
    permissions: {
      delete: true,
      approve: false,
      edit: true,
      view: true,
    },
    roleLevel: "Senior",
    department: { name: "Engineering", team: "Frontend" },
    contactInfo: { email: "john.smith@example.com", number: "+1 555-0100" },
    performance: "98%",
    profilePicture: "",
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Product Manager",
    status: "active",
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
    roleLevel: "Lead",
    department: { name: "Product", team: "Core" },
    contactInfo: { email: "sarah.johnson@example.com", number: "+1 555-0101" },
    performance: "95%",
    profilePicture: "",
  },
  {
    id: "3",
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Designer",
    status: "inactive",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
    roleLevel: "Mid-Level",
    department: { name: "Design", team: "UI/UX" },
    contactInfo: { email: "michael.brown@example.com", number: "+1 555-0102" },
    performance: "90%",
    profilePicture: "",
  },
];

const roleStyles: Record<string, { bg: string; text: string }> = {
  Admin: { bg: "bg-[#3072C014]", text: "text-[#3072C0]" },
  Viewer: { bg: "bg-[#2BAE8214] dark:bg-[#2BAE8229]", text: "text-[#175E46] dark:text-[#68DAB3]" },
  Editor: { bg: "bg-[#853AA614] ", text: "text-[#853AA6] dark:text-[#C99DDD] dark:bg-[#C99DDD14]" },
  "Team Lead": { bg: "dark:bg-[#2BAE8229]", text: "dark:text-[#68DAB3]" },
  Employee: { bg: "bg-red-100", text: "text-red-800" },
};

// ----------- Types -----------
export type FormValues = CreateSettingsFormData;

export type UserManagementFormRef = {
  submitForm: () => Promise<boolean>;
  getValues: () => CreateSettingsFormData;
  isDirty: () => boolean;
  hasData: () => boolean;
  isValid: () => boolean;
  resetToDefaults: () => void;
};

interface UserManagementFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

// ----------- Component -----------
const UserManagementForm = forwardRef<UserManagementFormRef, UserManagementFormProps>(
  ({ onSubmit, isSubmitting: _isSubmitting }, ref) => {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [rolePermissions, setRolePermissions] = useState<PermissionItem[]>([]);
    const [currentView, setCurrentView] = useState<"list" | "add" | "edit">("list");
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const queryClient = useQueryClient();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    // Fetch users from API
    const {
      data: usersData,
      isLoading: isLoadingUsers,
      refetch: refetchUsers,
    } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const response = await getUsers();
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return [];
      },
    });

    console.log("users data:", usersData);

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

    // Update employees when API data is loaded
    useEffect(() => {
      if (usersData && usersData.length > 0) {
        console.log("📥 Received users from API:", usersData);
        const transformedEmployees = transformUsersToEmployees(usersData);
        console.log("🔄 Transformed to employees:", transformedEmployees);
        setEmployees(transformedEmployees);
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
      resetToDefaults: () => {
        form.reset(defaultFormData);
        setCurrentView("list");
        setSelectedUser(null);
        refetchUsers(); // Refresh the users list
      },
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

    const handleEmpPermissionChange = (id: string, permission: keyof Permissions) => {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === id
            ? {
                ...emp,
                permissions: { ...emp.permissions, [permission]: !emp.permissions[permission] },
              }
            : emp,
        ),
      );
    };

    const handleAddUser = () => {
      setCurrentView("add");
    };

    const handleEdit = (id: string) => {
      const user = usersData?.find(u => u.id === id);
      if (user) {
        setSelectedUser(user);
        setCurrentView("edit");
      }
    };

    const handleDelete = async (id: string) => {

      try {
        const response = await deleteUser(id);
        if (response.status === 200 || response.status === 204) {
          toast.success("User deleted successfully!");
          refetchUsers();
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user");
      }
    };

    const handleCloseUserForm = () => {
      setCurrentView("list");
      setSelectedUser(null);
      refetchUsers();
    };

    // Render Add User view
    if (currentView === "add") {
      return <AddNewUser closeNewUserForm={handleCloseUserForm} />;
    }

    // Render Edit User view
    if (currentView === "edit" && selectedUser) {
      return <EditUser closeNewUserForm={handleCloseUserForm} userData={selectedUser} />;
    }

    return (
      <>
        <Form {...form}>
          <form
            id="user-management-form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto m-0 font-inter"
          >
            {/* Team Members */}
            <Card className="m-0 pt-3 rounded-none shadow-none">
              <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="text-md font-bold">Team Members</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddUser}
                  className={cn(
                    "flex items-center gap-2",
                    "rounded-2xl px-4 h-10 border-none",
                    "bg-[#3072C0] hover:bg-[#3072c0]/80 text-white",
                  )}
                >
                  <CirclePlus className="w-4 h-4" />
                  Add User
                </Button>
              </CardHeader>

              <CardContent className="p-4">
                <div className="w-full overflow-x-auto">
                  <div className="border rounded-2xl overflow-hidden">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow className="bg-[#F8FBFA] dark:bg-[#06080F] border-b-[#DCE0E4] dark:border-b-[#404663]">
                          <TableHead>Employee Name</TableHead>
                          <TableHead className="text-center">Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingUsers
                          ? // Loading skeleton rows
                            Array.from({ length: 3 }).map((_, index) => (
                              <TableRow
                                key={`loading-${index}`}
                                className="border-b-[#DCE0E4] dark:border-b-[#404663]"
                              >
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
                                    {Array.from({ length: 4 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="h-4 w-4 bg-gray-200 rounded animate-pulse"
                                      />
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2 justify-center">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          : employees.map(emp => (
                              <TableRow
                                key={emp.id}
                                className="border-b-[#DCE0E4] dark:border-b-[#404663]"
                              >
                                <TableCell>
                                  <span
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                                  >
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#3072C014] text-[#3072C0] font-bold text-sm uppercase">
                                      {(() => {
                                        const words = emp.fullName
                                          .trim()
                                          .split(" ")
                                          .filter(Boolean);
                                        if (words.length === 1) {
                                          return words[0].slice(0, 2);
                                        } else {
                                          return words[0][0] + words[1][0];
                                        }
                                      })()}
                                    </span>
                                    <div className="flex flex-col ">
                                      <span>{emp.fullName}</span>
                                      <span className="text-[12px] text-[#687192] dark:text-[#CACCD6]">
                                        {emp.email}
                                      </span>
                                    </div>
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    className={cn(
                                      "p-2 rounded-xl font-normal text-[12px] px-3 w-[90px] text-center justify-center",
                                      roleStyles[emp.role]?.bg,
                                      roleStyles[emp.role]?.text,
                                    )}
                                  >
                                    {emp.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-[#2BAE8214] font-normal p-2 px-3 rounded-xl capitalize hover:bg-[#2BAE8214] dark:text-[#68DAB3] text-[#175E46]">
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
                                            handleEmpPermissionChange(emp.id, key)
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
                                      onClick={() => handleEdit(emp.id)}
                                      className="p-2 hover:bg-gray-100 rounded-md"
                                    >
                                      <EditIcon color="#2BAE82" />
                                    </button>
                                    <button
                                      // onClick={() => handleDelete(emp.id)}
                                      onClick={() => {
                                        setUserIdToDelete(emp.id);
                                        setShowDeletePopup(true);
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
                <div className="border rounded-2xl overflow-hidden">
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[500px]">
                      <TableHeader>
                        <TableRow className="bg-[#F8FBFA] dark:bg-[#06080F] border-b-[#DCE0E4] dark:border-b-[#404663]">
                          <TableHead>Permission</TableHead>
                          <TableHead className="text-center">Super Admin</TableHead>
                          <TableHead className="text-center">Admin</TableHead>
                          <TableHead className="text-center">Employee</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingRolePermissions
                          ? // Loading skeleton rows
                            Array.from({ length: 5 }).map((_, index) => (
                              <TableRow
                                key={`loading-${index}`}
                                className="border-b-[#DCE0E4] dark:border-b-[#404663]"
                              >
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
                            ))
                          : rolePermissions.map(permission => (
                              <TableRow
                                key={permission.permissionCode}
                                className="border-b-[#DCE0E4] dark:border-b-[#404663]"
                              >
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
        {showDeletePopup && (
          <PopupModal
            open={showDeletePopup}
            onOpenChange={setShowDeletePopup}
            title="Delete User?"
            iconComponent={<DeleteIcon width={70} height={70} color="#EA3B1F" />}
            description="Are you sure you want to Delete? This action cannot be undone."
            cancelButton={{
              label: "Yes, Delete",
              onClick: () => {
                setShowDeletePopup(false);
                handleDelete(userIdToDelete as string);
              },
            }}
            confirmButton={{ label: "No, Keep", onClick: () => setShowDeletePopup(false) }}
          />
        )}
      </>
    );
  },
);

UserManagementForm.displayName = "UserManagementForm";
export default UserManagementForm;
