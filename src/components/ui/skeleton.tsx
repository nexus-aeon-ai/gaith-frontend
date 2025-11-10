import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  as: Component = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }) {
  return <Component className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
