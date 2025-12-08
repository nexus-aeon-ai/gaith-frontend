import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeViewSkeleton = () => {
  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-wrap flex-col xl:flex-row xl:gap-0 items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-5 w-16 rounded-sm" />
            </div>
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-2 xl:ml-5 ml-0">
          <div className="flex md:flex-row flex-col gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="flex md:flex-row flex-col gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="rounded-xl border bg-card p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            {/* Employee Details Section */}
            <section className="rounded-lg h-fit border p-4 md:p-5">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="flex flex-col gap-2 mt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 text-sm">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Metrics Section */}
            <section className="rounded-lg h-fit border p-4 md:p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="flex flex-col gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 text-sm">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2">
            {/* Contact Information Section */}
            <section className="rounded-lg h-fit border p-4 md:p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="flex flex-col gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section className="rounded-lg h-fit border p-4 md:p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-x-1 space-y-1 mt-2">
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-20 rounded-[8px]" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </Card>

      {/* Notes Card */}
      <Card className="rounded-xl mt-3 border bg-card p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </Card>
    </div>
  );
};

export default EmployeeViewSkeleton;

