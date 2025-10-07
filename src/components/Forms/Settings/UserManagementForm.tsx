"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Path, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
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
import type { Employee, Permissions } from "@/lib/types";
import {
  createSettingsSchema,
  type CreateSettingsFormData,
  permissionsList,
  defaultFormData,
} from "@/lib/validations/settings";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Software Engineer",
    status: "active",
    permissions: {
      delete: true,
      approve: false,
      edit: true,
      view: true,
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product Manager",
    status: "active",
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Designer",
    status: "inactive",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Team Lead",
    status: "active",
    permissions: {
      delete: true,
      approve: true,
      edit: true,
      view: true,
    },
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Developer",
    status: "active",
    permissions: {
      delete: false,
      approve: false,
      edit: true,
      view: true,
    },
  },
];

const roleStyles: Record<string, { bg: string; text: string }> = {
  "Software Engineer": { bg: "bg-blue-100", text: "text-blue-800" },
  "Product Manager": { bg: "bg-green-100", text: "text-green-800" },
  Designer: { bg: "bg-purple-100", text: "text-purple-800" },
  "Team Lead": { bg: "bg-yellow-100", text: "text-yellow-800" },
  Developer: { bg: "bg-red-100", text: "text-red-800" },
};

type FormValues = CreateSettingsFormData;
type PermissionKey = keyof FormValues["permissions"];

interface ClientFormProps {
  onSubmit: (data: CreateSettingsFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const UserManagementForm = ({ onSubmit }: ClientFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handlePermissionChange = (
    permission: PermissionKey,
    role: "superadmin" | "admin" | "employee",
  ) => {
    setValue(`permissions.${permission}` as Path<FormValues>, role, {
      shouldValidate: true,
    });
  };

  const handleEmpPermissionChange = (id: number, permission: keyof Permissions) => {
    setEmployees(
      employees.map(emp =>
        emp.id === id
          ? {
              ...emp,
              permissions: { ...emp.permissions, [permission]: !emp.permissions[permission] },
            }
          : emp,
      ),
    );
  };

  const handleEdit = (id: number) => {
    alert(`Edit employee with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const form = useForm<CreateSettingsFormData>({
    resolver: zodResolver(createSettingsSchema),
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  const { watch, setValue } = form;
  const permissions = watch("permissions") || {};

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto m-0 font-inter"
      >
        {/* User profile */}
        <Card className="m-0 pt-3 rounded-none shadow-none">
          <CardHeader className="px-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-md font-bold">Team Members</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                "rounded-2xl px-4 h-10",
                "bg-[#3072C0] hover:bg-[#3072c0]/80 text-white",
              )}
            >
              <CirclePlus className="w-4 h-4" />
              Add User
            </Button>
          </CardHeader>

          <CardContent className="p-4">
            {/* ✅ Scrollable wrapper for small screens */}
            <div className="w-full overflow-x-auto">
              <div className="border rounded-lg">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Employee Name</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Permissions</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={"default"}
                            className={cn(
                              "p-2 rounded-sm font-[400]",
                              roleStyles[employee.role]?.bg,
                              roleStyles[employee.role]?.text,
                            )}
                          >
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={"default"}
                            className={
                              "bg-[#2BAE8214] font-[400] p-2 rounded-sm capitalize hover:bg-[#2BAE8214] dark:text-[#68DAB3] text-[#175E46]"
                            }
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex md:flex-row flex-col gap-3">
                            {(["delete", "approve", "edit", "view"] as const).map(key => (
                              <div key={key} className="flex items-center gap-2">
                                <Checkbox
                                  checked={employee.permissions[key]}
                                  onCheckedChange={() =>
                                    handleEmpPermissionChange(employee.id, key)
                                  }
                                  className="
                            rounded-sm h-5 w-5
                            bg-card border border-[#3072C0]/50     
                            data-[state=checked]:bg-[#3072C0]/30  
                            data-[state=checked]:text-[#3072C0]     
                            data-[state=checked]:border-[#3072C0]/30
                          "
                                />
                                <label className="text-sm cursor-pointer">{key}</label>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(employee.id)}
                              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                              title="Edit"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                              title="Delete"
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

        {/* Role permissions */}
        <Card className="pt-3 rounded-none shadow-none rounded-b-[12px]">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-bold">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Mobile-friendly container */}
            <div className="border rounded-lg overflow-hidden">
              {/* Scroll on very small screens */}
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[500px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Permission</TableHead>
                      <TableHead className="text-center font-semibold">Super Admin</TableHead>
                      <TableHead className="text-center font-semibold">Admin</TableHead>
                      <TableHead className="text-center font-semibold">Employee</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {permissionsList.map(permission => {
                      const currentValue = permissions[permission] || "employee";

                      return (
                        <TableRow key={permission}>
                          <TableCell className="font-medium">{permission}</TableCell>

                          <RadioGroup
                            value={currentValue}
                            onValueChange={value =>
                              handlePermissionChange(
                                permission,
                                value as "superadmin" | "admin" | "employee",
                              )
                            }
                            className="contents"
                          >
                            <TableCell className="text-center">
                              <RadioGroupItem
                                value="superadmin"
                                id={`${permission}-superadmin`}
                                className="border-blue-500 data-[state=checked]:border-blue-500 text-blue-500"
                              />
                            </TableCell>

                            <TableCell className="text-center">
                              <RadioGroupItem
                                value="admin"
                                id={`${permission}-admin`}
                                className="border-blue-500 data-[state=checked]:border-blue-500 text-blue-500"
                              />
                            </TableCell>

                            <TableCell className="text-center">
                              <RadioGroupItem
                                value="employee"
                                id={`${permission}-employee`}
                                className="border-blue-500 data-[state=checked]:border-blue-500 text-blue-500"
                              />
                            </TableCell>
                          </RadioGroup>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default UserManagementForm;
