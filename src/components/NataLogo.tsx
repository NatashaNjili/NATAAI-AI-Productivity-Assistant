interface Props {
  className?: string;
  size?: number;
}

export function NataLogo({ className = "", size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NATA logo"
    >
      <defs>
        <linearGradient id="nata-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="45%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="nata-grad-2" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#nata-grad)" />
      <path
        d="M18 48 V18 L42 44 V18"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="48" cy="16" r="2.4" fill="white" />
      <circle cx="52" cy="22" r="1.4" fill="white" opacity="0.8" />
    </svg>
  );
}
