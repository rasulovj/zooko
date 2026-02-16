"use client";

/** Zooko Coin icon — small coin with "Z" */
export default function ZCIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="12" r="11" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="8.5" fill="#FBBF24" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill="#92400E"
        fontFamily="system-ui, sans-serif"
      >
        Z
      </text>
    </svg>
  );
}
