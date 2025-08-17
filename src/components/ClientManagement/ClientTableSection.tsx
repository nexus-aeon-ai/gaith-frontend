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
}

const ClientTableSection = <T,>({ table, columns, dataPagination }: ClientTableSectionProps<T>) => {
  return (
    <DataTable 
      table={table} 
      colSpan={columns.length} 
      dataPagination={dataPagination} 
    />
  );
};

export default ClientTableSection;
