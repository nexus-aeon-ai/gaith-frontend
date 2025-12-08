import { createLucideIcon, type LucideProps } from "lucide-react";

const TextLucideIcon = createLucideIcon("text", [
  [
    "path",
    {
      d: "M0 0H24V24H0V0Z",
      key: "7imq4t",
    },
  ],
  [
    "path",
    {
      d: "M11 17H13",
      key: "qa7g1n",
    },
  ],
  [
    "path",
    {
      d: "M12 9V17",
      key: "998eal",
    },
  ],
  [
    "path",
    {
      d: "M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z",
      key: "krp3jh",
    },
  ],
  [
    "path",
    {
      d: "M8 9.5V8H16V9.5",
      key: "715708",
    },
  ],
]);

export type TextIconProps = LucideProps;

export const TextIcon = (props: TextIconProps) => {
  return <TextLucideIcon {...props} />;
};
