import React from "react";

export const EndingIcon = ({ className = "" }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="16" fill="currentColor" fillOpacity="0.08" />
    <path
      opacity="0.4"
      d="M24.9583 24.3333C24.9583 24.6749 24.675 24.9583 24.3333 24.9583H7.66663C7.32496 24.9583 7.04163 24.6749 7.04163 24.3333C7.04163 23.9916 7.32496 23.7083 7.66663 23.7083H24.3333C24.675 23.7083 24.9583 23.9916 24.9583 24.3333Z"
      fill="currentColor"
    />
    <path
      d="M23.5 18.5V23.7083H8.5V18.5C8.5 14.3583 11.8583 11 16 11C20.1417 11 23.5 14.3583 23.5 18.5Z"
      fill="currentColor"
    />
    <path
      opacity="0.4"
      d="M16 9.12508C15.6583 9.12508 15.375 8.84175 15.375 8.50008V7.66675C15.375 7.32508 15.6583 7.04175 16 7.04175C16.3417 7.04175 16.625 7.32508 16.625 7.66675V8.50008C16.625 8.84175 16.3417 9.12508 16 9.12508Z"
      fill="currentColor"
    />
    <path
      opacity="0.4"
      d="M10.1667 10.7917C10.0084 10.7917 9.85003 10.7334 9.72503 10.6084L8.8917 9.77503C8.65003 9.53336 8.65003 9.13337 8.8917 8.8917C9.13337 8.65003 9.53336 8.65003 9.77503 8.8917L10.6084 9.72503C10.85 9.9667"
      fill="currentColor"
    />
    <path
      opacity="0.4"
      d="M21.8334 10.7917C21.675 10.7917 21.5167 10.7334 21.3917 10.6084C21.15 10.3667 21.15 9.9667 21.3917 9.72503L22.225 8.8917C22.4667 8.65003 22.8667 8.65003 23.1084 8.8917C23.35 9.13337 23.35 9.53336 23.1084 9.77503L22.275 10.6084C22.15 10.7334 21.9917 10.7917 21.8334 10.7917Z"
      fill="currentColor"
    />
  </svg>
);

// Usage example:
// <TaskTrackingIcon className="text-[#E6EFF9] dark:text-blue-800" />
// - Light mode: #E6EFF9 (light blue)
// - Dark mode: Blue 8 (e.g., Tailwind 'text-blue-800' or your custom class)
