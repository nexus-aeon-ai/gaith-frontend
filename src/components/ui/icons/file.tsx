import * as React from "react";
import { SVGProps } from "react";

interface CustomSvgProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const SvgComponent = ({ color = "#175E46", ...props }: CustomSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
    {...props}
  >
    <path
      fill={color}
      d="M12.813 6.369h-1.807A2.691 2.691 0 0 1 8.32 3.68V1.875a.627.627 0 0 0-.625-.625h-2.65c-1.925 0-3.481 1.25-3.481 3.481v5.538c0 2.231 1.556 3.481 3.48 3.481h4.913c1.925 0 3.482-1.25 3.482-3.481V6.994a.627.627 0 0 0-.626-.625Z"
      opacity={0.4}
    />
    <path
      fill={color}
      d="M9.875 1.382c-.256-.257-.7-.082-.7.275v2.18c0 .913.775 1.67 1.719 1.67.593.006 1.418.006 2.125.006.356 0 .543-.419.293-.669-.9-.906-2.512-2.537-3.437-3.462ZM8.438 8.594h-3.75a.472.472 0 0 1-.47-.469c0-.256.213-.469.47-.469h3.75c.256 0 .468.213.468.469a.472.472 0 0 1-.469.469ZM7.188 11.094h-2.5a.472.472 0 0 1-.47-.469c0-.256.213-.469.47-.469h2.5c.256 0 .468.213.468.469a.472.472 0 0 1-.468.469Z"
    />
  </svg>
);

export default SvgComponent;
