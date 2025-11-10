import type { Table } from "@tanstack/react-table";

import DataTable from "@/components/ui/data-table";

interface ClientTableSectionProps<T> {
  table: Table<T>;
  columns: any[];
  dataPagination: {
    results: T[];
    count: number;
    next?: string | null;
    previous?: string | null;
    page_count: number;
  };
  onDelete?: (row: T) => void;
}

const ClientTableSection = <T,>({
  table,
  columns,
  dataPagination,
  onDelete,
}: ClientTableSectionProps<T>) => {
  table.options.meta = { ...(table.options.meta ?? {}), onDelete };
  return <DataTable table={table} colSpan={columns.length} dataPagination={dataPagination} />;
};

export default ClientTableSection;
