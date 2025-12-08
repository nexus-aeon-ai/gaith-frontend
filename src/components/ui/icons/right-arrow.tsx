import * as React from "react";
import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const SvgComponent = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="6 4 12 16"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="m13.23 8.52-5.05 3.79v5.61c0 .96 1.16 1.44 1.84.76l5.18-5.18c.83-.83.83-2.18 0-3.01l-1.97-1.97Z"
      opacity={0.4}
    />
    <path fill="currentColor" d="M8.18 6.08v6.23l5.05-3.79-3.21-3.21c-.68-.67-1.84-.19-1.84.77Z" />
  </svg>
);
export default SvgComponent;
