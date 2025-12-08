"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import FilterSheet from "@/components/sheet/EmployeeFilter";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeftArrow from "@/components/ui/icons/left-arrow";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";
import RightArrow from "@/components/ui/icons/right-arrow";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteEmployee, getEmployees, type Employee as ApiEmployee } from "@/lib/api/employee";
import type { Employee as UiEmployee } from "@/lib/types";
import { cn } from "@/lib/utils";


const EmployeeList = () => {
  const [apiEmployees, setApiEmployees] = useState<ApiEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeFilters, setEmployeeFilters] = useState<Record<string, any>>({});
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ["employees", employeeFilters],
    queryFn: async () => {
      const res = await getEmployees(employeeFilters);
      return res.data?.results ?? [];
    },
    initialData: [],
  });

  useMemo(() => {
    setApiEmployees(data as ApiEmployee[]);
  }, [data]);

  const employees: UiEmployee[] = useMemo(() => {
    return apiEmployees.map(
      (emp: ApiEmployee): UiEmployee => ({
        id: emp.id,
        fullName: emp.fullName,
        email: emp.email,
        // UI expects these fields differently
        role: emp.role?.title,
        roleLevel: emp.role?.level,
        status: emp.status === "Active" ? "active" : "inactive",
        department: {
          name: emp.department?.name || "",
          team: emp.department?.subTeam || "",
        },
        contactInfo: { email: emp.email, number: emp.phone },
        performance: `${emp.performance}%`,
        permissions: { view: true, edit: true, approve: false, delete: false },
        profilePicture: emp.profilePicture || "",
      }),
    );
  }, [apiEmployees]);

  const { mutate: deleteEmployeeMutate } = useMutation({
    mutationKey: ["employees", "delete"],
    mutationFn: async (id: string) => {
      const res = await deleteEmployee(id);
      return res.status;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map(employee => employee.id.toString()));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectLead = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, clientId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== clientId));
    }
  };

  const filteredEmployees = employees.filter(
    employee =>
      (employee.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleApplyFilters = (filters: { dateFrom: string; dateTo: string; statuses: string[] }) => {
    const { dateFrom, dateTo, statuses } = filters;
    let statusParam: string | string[] | undefined = undefined;
    if (statuses && statuses.length > 0) {
      statusParam = statuses.length === 1 ? statuses[0] : statuses;
    }
    setEmployeeFilters({ status: statusParam, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
    setIsFilterSheetOpen(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (showAddEmployeeForm) {
    const base = pathname?.split("/employees")[0] || "";
    router.push(`${base}/employees/add`);
    return null;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div
      className={cn("min-h-fit w-full p-2 sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0", "overflow-x-hidden")}
    >
      {/* Header Section */}
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-start",
          "gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6",
        )}
      >
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Employee Management
          </h1>
          <p className={cn("text-xs sm:text-sm", "text-gray-600 dark:text-gray-300")}>
            Manage employee profiles, roles, and performance tracking
          </p>
        </div>

        <Button
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#3072C0] rounded-[16px] w-fit sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
          onClick={() => setShowAddEmployeeForm(true)}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add New Employee</span>
          <span className="sm:hidden">Add Employee</span>
        </Button>
      </div>

      {/* Search and Actions Section */}
      <div
        className={cn(" items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between",
            "gap-2 sm:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search employees"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 min-w-md"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card border-border text-xs h-8 sm:h-10",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500",
                  )}
                >
                  <MenuIcon style={{ color: "var(--icon-primary)" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    // Handle delete action here
                    // TODO: Implement delete functionality
                  }}
                >
                  <DeleteIcon style={{ color: "var(--icon-primary)" }} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500",
              )}
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <FilterIcon style={{ color: "var(--icon-primary)" }} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>

            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <ExcelIcon />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
              <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
              <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto sm:w-full w-[520px] ">
          <Table className="text-sm w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="dark:bg-[#06080F]">
                <TableHead className="px-4 py-3">
                  <CheckboxSquare
                    checked={employees.length > 0 && selectedEmployees.length === employees.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-left">
                  Employee
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center">
                  Department
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center">
                  Role
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center hidden md:table-cell">
                  Contact Info
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center">
                  Performance
                </TableHead>
                <TableHead className="px-4 py-3 text-[#303444] dark:text-[#CCCFDB] text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEmployees.map((employee: UiEmployee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {/* Checkbox */}
                  <TableCell className="px-4 py-3">
                    <CheckboxSquare
                      checked={selectedEmployees.includes(employee.id.toString())}
                      onCheckedChange={checked =>
                        handleSelectLead(employee.id.toString(), checked as boolean)
                      }
                    />
                  </TableCell>

                  {/* Employee */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center">
                      <Image
                        src={employee.profilePicture || "/images/default-avatar.jpg"}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {employee.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                          {employee.contactInfo.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Department */}
                  <TableCell className="px-4 py-3 text-center">
                    <p className="text-sm font-medium">{employee.department?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.department.team}
                    </p>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="px-4 py-3 text-center">
                    <p className="text-sm font-medium">{employee.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{employee.roleLevel}</p>
                  </TableCell>

                  {/* Contact Info (hidden on small screens) */}
                  <TableCell className="px-4 py-3 text-center hidden md:table-cell">
                    <p className="text-sm font-medium">{employee.contactInfo.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.contactInfo.number}
                    </p>
                  </TableCell>

                  {/* Status with Badge */}
                  <TableCell className="px-4 py-3 text-center">
                    <div className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex py-2 text-xs font-semibold rounded-md px-4",
                          employee.status === "active"
                            ? "bg-green-100 text-[#175E46] dark:bg-[#2BAE8229] dark:text-[#68DAB3]"
                            : "bg-red-100 text-red-800 dark:bg-[#EA3B1F14] dark:text-[#E02215]",
                        )}
                      >
                        {employee.status}
                      </span>
                    </div>
                  </TableCell>

                  {/* Performance */}
                  <TableCell className="px-4 py-3 text-center">
                    <div className="w-32 flex gap-2 items-center mx-auto">
                      <span className="text-xs font-medium">{employee.performance}</span>
                      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            parseInt(employee.performance) >= 80
                              ? "bg-green-500"
                              : parseInt(employee.performance) >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500",
                          )}
                          style={{ width: employee.performance }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            const base = pathname?.split("/employees")[0] || "";
                            router.push(`${base}/employees/${employee.id}`);
                          }}
                        >
                          <ViewIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            View
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Navigate to server-rendered edit page preserving locale and segment
                            const base = pathname?.split("/employees")[0] || "";
                            router.push(`${base}/employees/${employee.id}/edit`);
                          }}
                        >
                          <EditIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            Edit
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete this employee?",
                            );
                            if (confirmed) deleteEmployeeMutate(employee.id);
                          }}
                        >
                          <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="hidden sm:inline dark:text-white text-gray-900">
                            Delete
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Page info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {(() => {
              const startIndex = (currentPage - 1) * 5 + 1;
              const endIndex = Math.min(currentPage * 5, filteredEmployees.length);

              return startIndex === endIndex
                ? `Showing ${startIndex} of ${filteredEmployees.length}`
                : `Showing ${startIndex} to ${endIndex} of ${filteredEmployees.length}`;
            })()}
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <LeftArrow className="h-4 w-4" color={currentPage === 1 ? "gray" : "#3072C0"} />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getVisiblePages().map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 transition-all duration-200",
                    currentPage === page
                      ? cn(
                        "bg-[#3072C0] text-white border border-[#3072C0]",
                        "hover:bg-blue-700 hover:border-blue-700",
                        "dark:bg-blue-600 dark:border-blue-600",
                        "dark:hover:bg-blue-700 dark:hover:border-blue-700",
                      )
                      : cn(
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-gray-700 dark:hover:text-gray-200",
                      ),
                  )}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <RightArrow
                className="h-4 w-4"
                color={currentPage === totalPages ? "gray" : "#3072C0"}
              />
            </Button>
          </div>
        </div>
      </div>

      <FilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default EmployeeList;
