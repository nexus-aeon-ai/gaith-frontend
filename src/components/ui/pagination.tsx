import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import LeftArrow from "@/components/ui/icons/left-arrow";
import RightArrow from "@/components/ui/icons/right-arrow";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  variant?: ButtonProps["variant"];
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  variant,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: variant ?? "ghost",
        size,
      }),
      isActive && "bg-[#3072C0] text-white hover:bg-[#205c9e] hover:text-white",
      className,
    )}
    {...props}
  >
    {props.children}
  </a>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    variant="outline"
    className={cn(
      "flex items-center justify-center",
      disabled
        ? "cursor-not-allowed opacity-50 text-gray-400"
        : "text-[#3072C0] hover:text-[#205c9e] hover:bg-card",
      className,
    )}
    {...props}
  >
    <LeftArrow size={28} color={disabled ? "gray" : "#3072C0"}/>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    variant="outline"
    className={cn(
      "flex items-center justify-center",
      disabled
        ? "cursor-not-allowed opacity-50 text-gray-400"
        : "text-[#3072C0] hover:text-[#205c9e] hover:bg-card",
      className,
    )}
    {...props}
  >
    <RightArrow size={32} color={disabled ? "gray" : "#3072C0"} />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex size-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
