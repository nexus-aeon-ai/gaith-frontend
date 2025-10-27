"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { deleteEmployee, getEmployees } from "@/lib/api";
import type { Employee, EmployeeFilters, TGenericPaginatedResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

import PopupModal from "../PopupModal/Modal";

import EditEmployee from "./EditEmployee";
import EmployeeTableSection from "./EmployeeTableSection";
import HeaderSection from "./HeaderSection";
import NewEmployee from "./NewEmployee";
import SearchAndActionsSection from "./SearchAndActionsSection";
import useTableColumns from "./TableConfig";

const EmployeeManagementClient = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editEmployeeToggle, setEditEmployeeToggle] = useState<boolean>(false);
  const [newEmployeeToggle, setNewEmployeeToggle] = useState<boolean>(false);
  const [deleteEmployeeToggle, setDeleteEmployeeToggle] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  
  // Get table columns
  const columns = useTableColumns(setSelectedEmployee, setEditEmployeeToggle);

  // Get pagination params from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  // Fetch employees with filters
  const {
    data: employeesData,
    isLoading,
    error: _error,
  } = useQuery({
    queryKey: ["employees", filters, currentPage, pageSize],
    queryFn: async () => {
      const response = await getEmployees({
        ...filters,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
      setDeleteEmployeeToggle(false);
      setEmployeeToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete employee");
    },
  });

  // Use fetched data or fallback to mock data for now
  const data: TGenericPaginatedResponse<Employee> = employeesData || {
    results: [],
    count: 0,
    next: null,
    previous: null,
    page_count: 1,
  };

  // Ensure we always have valid results
  const tableData = data.results || [];

  // Memoize the delete handler to prevent re-renders
  const handleDeleteEmployee = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteEmployeeToggle(true);
  }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    },
    manualPagination: true,
    // Disable filtering since we're doing it server-side
    enableFilters: false,
    meta: {
      onDelete: handleDeleteEmployee,
    },
  });

  const confirmDeleteEmployee = () => {
    if (!employeeToDelete) return;
    deleteMutation.mutate(employeeToDelete.id);
  };


  if (newEmployeeToggle) {
    return <NewEmployee closeNewEmployeeForm={() => setNewEmployeeToggle(false)} />;
  }
  if (editEmployeeToggle && selectedEmployee) {
    return (
      <EditEmployee
        employee={selectedEmployee}
        closeEditEmployeeForm={() => setEditEmployeeToggle(false)}
      />
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-background overflow-x-hidden",
      )}
    >
      <HeaderSection setNewEmployeeToggle={setNewEmployeeToggle} />
      <SearchAndActionsSection 
        globalFilter={globalFilter} 
        setGlobalFilter={setGlobalFilter}
        filters={filters}
        setFilters={(newFilters) => setFilters(newFilters)}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-300">Loading employees...</p>
        </div>
      ) : _error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600 dark:text-red-300">Error loading employees</p>
        </div>
      ) : tableData.length > 0 ? (
        <EmployeeTableSection
          table={table}
          columns={columns}
          dataPagination={data}
        />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-300">No employees found</p>
        </div>
      )}
      <PopupModal
        open={deleteEmployeeToggle}
        onOpenChange={setDeleteEmployeeToggle}
        title="Delete Employee?"
        iconComponent={
          <X className="bg-red-200 rounded-full p-2" strokeWidth={3} size={40} color="#EA3B1F" />
        }
        description="Are you sure you want to Delete Employee? This action cannot be undone."
        cancelButton={{
          label: "Yes, Delete",
          onClick: () => {
            setDeleteEmployeeToggle(false);
            confirmDeleteEmployee();
          },
        }}
        confirmButton={{ label: "No, Keep", onClick: () => setDeleteEmployeeToggle(false) }}
      />
    </div>
  );
};

export default EmployeeManagementClient;

