import type { ColumnDef, Table } from "@tanstack/react-table";

import DataTable from "@/components/ui/data-table";

interface EmployeeTableSectionProps<T> {
  table: Table<T>;
  columns: ColumnDef<T>[];
  dataPagination: {
    results: T[];
    count: number;
    next?: string | null;
    previous?: string | null;
    page_count: number;
  };
}

const EmployeeTableSection = <T,>({
  table,
  columns,
  dataPagination,
}: EmployeeTableSectionProps<T>) => {
  return <DataTable table={table} colSpan={columns.length} dataPagination={dataPagination} />;
};

export default EmployeeTableSection;

