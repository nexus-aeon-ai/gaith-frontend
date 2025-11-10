import { Card, CardContent, CardFooter } from "./card";
import { Skeleton } from "./skeleton";

export const CameraCardSkeleton = () => {
  return (
    <Card className="cursor-pointer overflow-hidden rounded-lg p-3 pb-0">
      <Skeleton className="h-48 w-full rounded-lg" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="mt-2 flex items-start">
          <Skeleton className="size-4" />
          <Skeleton className="ml-2 h-5 w-32" />
        </div>
        <div className="mt-2 flex items-start">
          <Skeleton className="size-4" />
          <Skeleton className="ml-2 h-5 w-32" />
        </div>
      </CardContent>
      <CardFooter className="w-full p-0 py-2">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};
