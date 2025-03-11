import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo = ({ size = 32, className = "" }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="64" cy="64" r="60" fill="#4B5EAA" />

      {/* Target/Crosshair */}
      <circle
        cx="64"
        cy="64"
        r="30"
        stroke="white"
        stroke-width="4"
        fill="none"
      />
      <circle cx="64" cy="64" r="10" fill="#FF6B6B" />
      <line
        x1="64"
        y1="24"
        x2="64"
        y2="44"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      />
      <line
        x1="64"
        y1="84"
        x2="64"
        y2="104"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      />
      <line
        x1="24"
        y1="64"
        x2="44"
        y2="64"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      />
      <line
        x1="84"
        y1="64"
        x2="104"
        y2="64"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
      />

      {/* Code Brackets */}
      <path
        d="M40 40L25 64L40 88"
        stroke="#A3E4FF"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M88 40L103 64L88 88"
        stroke="#A3E4FF"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Logo;
