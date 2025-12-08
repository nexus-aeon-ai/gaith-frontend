import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeFormSkeleton = () => {
  return (
    <div className="w-full mx-auto p-6 space-y-4">
      {/* Basic Information Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="lg:min-w-[20%] flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact Information Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-24 w-full col-span-2" />
          </div>
        </CardContent>
      </Card>

      {/* Address Information Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
            <Skeleton className="h-24 w-full col-span-2" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>

      {/* Employee Status Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Profile Card */}
      <Card className="pt-3 rounded-[16px] shadow-none">
        <CardHeader className="px-3">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeFormSkeleton;

