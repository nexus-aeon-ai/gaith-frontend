import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#25CD7E"
      d="m10.32 7.181-2.527 3.367h-3.74a.718.718 0 0 1-.506-1.227L7 5.868a1.42 1.42 0 0 1 2.007 0l1.313 1.313Z"
      opacity={0.4}
    />
    <path
      fill="#25CD7E"
      d="M11.946 10.546H7.793L10.32 7.18l2.14 2.14c.446.453.126 1.226-.514 1.226Z"
    />
  </svg>
);
export default SvgComponent;
