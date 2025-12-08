import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = ({
  width = 16,
  height = 16,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width={width}
    height={height}
    fill="currentColor"
    {...props}
  >
    <path
      d="M10.32 8.82 7.793 5.453h-3.74c-.64 0-.96.773-.506 1.227L7 10.133a1.42 1.42 0 0 0 2.007 0L10.32 8.82Z"
      opacity={0.4}
    />
    <path d="M11.947 5.453H7.793L10.32 8.82l2.14-2.14a.721.721 0 0 0-.513-1.227Z" />
  </svg>
);

export default SvgComponent;
