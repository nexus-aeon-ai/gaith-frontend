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
      d="M16 29.335c7.364 0 13.333-5.97 13.333-13.334 0-7.363-5.97-13.333-13.333-13.333-7.364 0-13.333 5.97-13.333 13.333 0 7.364 5.97 13.334 13.333 13.334Z"
    />
    <path
      fill="currentColor"
      d="M16.44 22.669c-.24.08-.654.08-.894 0-2.08-.707-6.747-3.68-6.747-8.72 0-2.227 1.787-4.027 4-4.027a3.97 3.97 0 0 1 3.2 1.613 3.99 3.99 0 0 1 3.2-1.613c2.214 0 4 1.8 4 4.026 0 5.04-4.666 8.014-6.76 8.72Z"
    />
  </svg>
);

export default SvgComponent;
