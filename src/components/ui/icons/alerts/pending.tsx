import React from "react";

export const PendingIcon = ({ className = "" }) => (
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
      d="M16 24.3334C20.6023 24.3334 24.3333 20.6025 24.3333 16.0001C24.3333 11.3977 20.6023 7.66675 16 7.66675C11.3976 7.66675 7.66663 11.3977 7.66663 16.0001C7.66663 20.6025 11.3976 24.3334 16 24.3334Z"
      fill="currentColor"
    />
    <path
      d="M19.0914 19.275C18.983 19.275 18.8747 19.25 18.7747 19.1833L16.1914 17.6416C15.5497 17.2583 15.0747 16.4166 15.0747 15.675V12.2583C15.0747 11.9166 15.358 11.6333 15.6997 11.6333C16.0414 11.6333 16.3247 11.9166 16.3247 12.2583V15.675C16.3247 15.975 16.5747 16.4166 16.833 16.5666L19.4164 18.1083C19.7164 18.2833 19.808 18.6666 19.633 18.9666C19.508 19.1666 19.2997 19.275 19.0914 19.275Z"
      fill="currentColor"
    />
  </svg>
);

// Usage example:
// <TaskTrackingIcon className="text-[#E6EFF9] dark:text-blue-800" />
// - Light mode: #E6EFF9 (light blue)
// - Dark mode: Blue 8 (e.g., Tailwind 'text-blue-800' or your custom class)
