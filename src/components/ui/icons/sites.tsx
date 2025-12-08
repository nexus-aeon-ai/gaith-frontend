import { createLucideIcon, type LucideProps } from "lucide-react";

const SitesLucideIcon = createLucideIcon("sites", [
  [
    "path",
    {
      d: "M16.7857 12C16.5752 16.0749 15.0743 19.9772 12.5 23.1429C9.9257 19.9772 8.42481 16.0749 8.21429 12C8.42481 7.92519 9.9257 4.02287 12.5 0.857178C15.0743 4.02287 16.5752 7.92519 16.7857 12Z",
      key: "1mdsvu",
    },
  ],
  [
    "path",
    {
      d: "M23.6429 12C23.6429 14.9553 22.4689 17.7895 20.3792 19.8792C18.2895 21.9689 15.4553 23.1429 12.5 23.1429C9.5447 23.1429 6.7105 21.9689 4.6208 19.8792C2.5311 17.7895 1.3572 14.9553 1.3572 12",
      key: "2grbou",
    },
  ],
  [
    "path",
    {
      d: "M23.6429 12C23.6429 9.0448 22.4689 6.2105 20.3792 4.1209C18.2895 2.0311 15.4553 0.8572 12.5 0.8572C9.5447 0.8572 6.7105 2.0311 4.6208 4.1209C2.5311 6.2105 1.3572 9.0448 1.3572 12",
      key: "1ufc2e",
    },
  ],
  [
    "path",
    {
      d: "M23.6429 12H1.3572",
      key: "1dvz9l",
    },
  ],
]);

export type SitesIconProps = LucideProps;

export const SitesIcon = (props: SitesIconProps) => {
  return <SitesLucideIcon {...props} />;
};
