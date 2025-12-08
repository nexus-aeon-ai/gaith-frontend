import * as React from "react";
import { SVGProps } from "react";

interface CustomIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
}

const SvgComponent = ({
  color = "#2BAE82",
  width = 20,
  height = 20,
  viewBox = "0 0 20 20",
  ...props
}: CustomIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    {...props}
  >
    <path
      fill={color}
      opacity={0.4}
      d="M17.083 8.492h-2.408a3.588 3.588 0 0 1-3.583-3.584V2.5a.836.836 0 0 0-.834-.833H6.725c-2.567 0-4.642 1.666-4.642 4.641v7.384c0 2.975 2.075 4.641 4.642 4.641h6.55c2.567 0 4.642-1.666 4.642-4.641V9.325a.836.836 0 0 0-.834-.833Z"
    />
    <path
      fill={color}
      d="M13.166 1.842c-.341-.342-.933-.109-.933.366v2.909c0 1.216 1.033 2.225 2.292 2.225.791.008 1.891.008 2.833.008.475 0 .725-.558.392-.892-1.2-1.208-3.35-3.383-4.584-4.616ZM10.234 12.267a.629.629 0 0 0-.884 0l-.6.6V9.375a.63.63 0 0 0-.625-.625.63.63 0 0 0-.625.625v3.492l-.6-.6a.629.629 0 0 0-.883 0 .629.629 0 0 0 0 .883l1.667 1.667c.008.008.016.008.016.016.05.05.117.092.184.125a.818.818 0 0 0 .241.042.56.56 0 0 0 .234-.05.803.803 0 0 0 .208-.133l1.667-1.667a.629.629 0 0 0 0-.883Z"
    />
  </svg>
);

export default SvgComponent;
