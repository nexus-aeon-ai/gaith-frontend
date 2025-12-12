import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = ({ width = 32, height = 32, ...props }: SVGProps<SVGSVGElement>) => (
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
      d="M16 29.335c7.364 0 13.333-5.97 13.333-13.334 0-7.363-5.97-13.333-13.333-13.333-7.364 0-13.333 5.97-13.333 13.333 0 7.364 5.97 13.334 13.333 13.334Z"
      opacity={0.4}
    />
    <path
      fill="currentColor"
      d="m21.533 17.107-2.307.773a2.117 2.117 0 0 0-1.346 1.347l-.774 2.306c-.653 1.987-3.453 1.947-4.066-.04l-2.6-8.373c-.507-1.667 1.026-3.2 2.666-2.693l8.387 2.6c1.987.626 2.013 3.426.04 4.08Z"
    />
  </svg>
);

export default SvgComponent;
