import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Skeleton } from "./skeleton";

export const ImageSkeleton: React.FC<React.ComponentProps<typeof Skeleton>> = props => {
  return (
    <>
      <Skeleton className={cn("size-full rounded-lg", props.className)} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary-500" />
      </div>
    </>
  );
};
