import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" color="red" {...props}>
    <path
      fill="#EE4F8D"
      d="M18.308 5.843v5.417H1.667V5.843a3.681 3.681 0 0 1 3.675-3.675h9.291a3.681 3.681 0 0 1 3.675 3.675Z"
      opacity={0.4}
    />
    <path
      fill="#EE4F8D"
      d="M1.667 11.266v.166a3.676 3.676 0 0 0 3.675 3.675h3.2c.458 0 .833.375.833.834v.808a.836.836 0 0 1-.833.833H6.525a.624.624 0 1 0 0 1.25h6.958a.63.63 0 0 0 .625-.625.63.63 0 0 0-.625-.625h-2.016a.836.836 0 0 1-.834-.833v-.808c0-.459.375-.834.834-.834h3.175a3.676 3.676 0 0 0 3.675-3.675v-.166H1.667Z"
    />
  </svg>
);
export default SvgComponent;
