type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "h-9 w-9" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="32" fill="#121826" />
      <path
        d="M18 44V36H26V28H34V20H46V28H38V36H30V44H18Z"
        fill="white"
      />
    </svg>
  );
}
