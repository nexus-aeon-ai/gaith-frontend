import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" color="red" {...props}>
    <path
      fill="#3072C0"
      d="M13.533 2.168H6.467c-2.3 0-3.134.833-3.134 3.175V15.66c0 2.341.834 3.175 3.134 3.175h7.058c2.308 0 3.142-.834 3.142-3.175V5.343c0-2.342-.834-3.175-3.134-3.175Z"
      opacity={0.4}
    />
    <path
      fill="#3072C0"
      d="M11.667 5.707H8.333a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h3.334a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625ZM10 16.585a1.458 1.458 0 1 0 0-2.917 1.458 1.458 0 0 0 0 2.917Z"
    />
  </svg>
);
export default SvgComponent;
