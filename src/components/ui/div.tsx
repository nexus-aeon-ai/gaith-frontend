import { cva } from "class-variance-authority";

const DivVariant = cva("...", {
  variants: {
    align: {
      left: "text-left",
      right: "text-right",
      center: "text-center",
    },
    size: {
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
    },
    color: {
      white: "text-white",
      black: "text-black",
      red: "text-red-500",
      green: "text-green-500",
    },
  },
  defaultVariants: {
    align: "left",
    size: "xl",
    color: "black",
  },
});

export { DivVariant };
