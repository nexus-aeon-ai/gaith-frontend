import { createLucideIcon, type LucideProps } from "lucide-react";

export const MoreOptionsLucideIcon = createLucideIcon("more-options", [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "1",
      key: "41hilf",
    },
  ],
  [
    "circle",
    {
      cx: "19",
      cy: "12",
      r: "1",
      key: "1wjl8i",
    },
  ],
  [
    "circle",
    {
      cx: "5",
      cy: "12",
      r: "1",
      key: "1pcz8c",
    },
  ],
]);

export type MoreOptionsIconProps = LucideProps;

export const MoreOptionsIcon = (props: MoreOptionsIconProps) => {
  return <MoreOptionsLucideIcon {...props} />;
};
