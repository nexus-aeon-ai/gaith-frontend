import React from "react";

export const SubmitedIcon = ({ className = "" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1.75C17.6539 1.75 22.25 6.34614 22.25 12C22.25 17.6539 17.6539 22.25 12 22.25C6.34614 22.25 1.75 17.6539 1.75 12C1.75 6.34614 6.34614 1.75 12 1.75ZM12 2.25C6.62386 2.25 2.25 6.62386 2.25 12C2.25 17.3761 6.62386 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62386 17.3761 2.25 12 2.25Z"
      fill="currentColor"
      stroke="currentColor"
    />
    <path
      d="M16.0742 8.98389C16.169 8.88915 16.332 8.88915 16.4268 8.98389C16.5214 9.07863 16.5215 9.24171 16.4268 9.33643L10.7568 15.0063C10.7095 15.0537 10.646 15.0806 10.5801 15.0806C10.5143 15.0805 10.4515 15.0535 10.4043 15.0063L7.57422 12.1763C7.4795 12.0815 7.47949 11.9185 7.57422 11.8237C7.66896 11.7291 7.83204 11.729 7.92676 11.8237L10.5801 14.4771L10.9336 14.1235L16.0742 8.98389Z"
      fill="currentColor"
      stroke="currentColor"
    />
  </svg>
);

// Usage example:
// <TaskTrackingIcon className="text-[#E6EFF9] dark:text-blue-800" />
// - Light mode: #E6EFF9 (light blue)
// - Dark mode: Blue 8 (e.g., Tailwind 'text-blue-800' or your custom class)
