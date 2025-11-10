import { useTheme } from "next-themes";
import React from "react";

const Twitterx = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center rounded-full bg-[#07091314] p-1 h-8 w-8">
      <svg
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.98667 8.27333L9.17334 12.5H13.84L8.60001 5.51333L12.96 0.5H11.1867L7.77334 4.42L4.84001 0.5H0.17334L5.17334 7.18L0.546673 12.5H2.30667L5.98667 8.27333ZM9.84001 11.1667L2.84001 1.83333H4.17334L11.1733 11.1667H9.84001Z"
          fill={theme === "dark" ? "#F6FBFE" : "#070913"}
        />
      </svg>
    </div>
  );
};

export default Twitterx;
