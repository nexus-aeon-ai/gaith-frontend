import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeeListSkeleton = () => {
  return (
    <div className="w-full p-2 sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Search and Actions Skeleton */}
      <div className="bg-card rounded-lg px-3 py-2 mb-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <Skeleton className="h-12 w-full sm:w-64" />
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="text-sm w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="dark:bg-[#06080F]">
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="px-4 py-3 hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center hidden md:table-cell">
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Skeleton className="h-6 w-16 mx-auto rounded-md" />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Skeleton className="h-8 w-8 mx-auto rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListSkeleton;

