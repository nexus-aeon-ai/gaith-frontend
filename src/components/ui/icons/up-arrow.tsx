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
      d="m10.32 7.18-2.527 3.367h-3.74a.718.718 0 0 1-.506-1.227L7 5.867a1.42 1.42 0 0 1 2.007 0L10.32 7.18Z"
      opacity={0.4}
    />
    <path d="M11.946 10.547H7.793L10.32 7.18l2.14 2.14a.721.721 0 0 1-.514 1.227Z" />
  </svg>
);

export default SvgComponent;
