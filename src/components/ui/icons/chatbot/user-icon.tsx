import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      fill={props.color}
      d="M15 15.717h-.633c-.667 0-1.3.259-1.767.725l-1.425 1.409a1.685 1.685 0 0 1-2.358 0l-1.425-1.409a2.504 2.504 0 0 0-1.767-.725H5c-1.383 0-2.5-1.108-2.5-2.475V4.152c0-1.367 1.117-2.475 2.5-2.475h10c1.383 0 2.5 1.108 2.5 2.475v9.091c0 1.359-1.117 2.475-2.5 2.475Z"
      opacity={0.4}
    />
    <path
      fill={props.color}
      d="M10 8.676a1.942 1.942 0 1 0 0-3.883 1.942 1.942 0 0 0 0 3.883ZM12.234 12.553a.837.837 0 0 0 .691-1.309C12.36 10.403 11.26 9.836 10 9.836c-1.258 0-2.358.567-2.925 1.408a.837.837 0 0 0 .692 1.309h4.467Z"
    />
  </svg>
);
export default SvgComponent;
