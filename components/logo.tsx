import React from 'react';

export function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-600"
    >
      <rect width="40" height="40" rx="8" fill="currentColor" />
      <path
        d="M10 15h20v2H10v-2zm0 4h20v2H10v-2zm0 4h12v2H10v-2z"
        fill="white"
      />
      <circle cx="28" cy="23" r="3" fill="white" />
      <path
        d="M10 27h20v2H10v-2zm0 4h20v2H10v-2z"
        fill="white"
      />
    </svg>
  );
}
