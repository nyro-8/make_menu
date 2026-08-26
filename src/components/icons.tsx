interface IconProps {
  className?: string;
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 4.5h5.5A3.5 3.5 0 0 1 13 8v12a2.6 2.6 0 0 0-2.6-2.6H4z" />
      <path d="M20 4.5h-5.5A3.5 3.5 0 0 0 11 8v12a2.6 2.6 0 0 1 2.6-2.6H20z" />
    </svg>
  );
}

export function JarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9.5 2.5h5v3l2 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 19V8l2-2.5z" />
      <line x1="7.5" y1="11" x2="16.5" y2="11" />
      <line x1="9.5" y1="2.5" x2="14.5" y2="2.5" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9.5" cy="20.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M1.5 2h2.7l2.3 12.4a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L21 6.5H5.3" />
    </svg>
  );
}
