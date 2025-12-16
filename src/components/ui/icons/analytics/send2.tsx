import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = ({
  width = 32,
  height = 32,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      opacity={0.4}
      d="m9.48 7.948 12.027-4.013c5.4-1.8 8.333 1.147 6.547 6.547L24.04 22.508c-2.693 8.094-7.12 8.094-9.813 0l-1.187-3.573-3.573-1.187c-8.08-2.68-8.08-7.093.013-9.8Z"
    />
    <path
      fill="currentColor"
      d="m16.16 15.507 5.08-5.093ZM16.16 16.508a.989.989 0 0 1-.707-.293 1.006 1.006 0 0 1 0-1.414l5.066-5.093a1.006 1.006 0 0 1 1.414 0 1.006 1.006 0 0 1 0 1.413l-5.067 5.094c-.2.186-.453.293-.707.293Z"
    />
  </svg>
);

export default SvgComponent;
