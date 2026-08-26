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

/**
 * オリジナルのビーバーマスコット(特定キャラクターを模したものではない、
 * 丸い頭・前歯・八の字眉のデザイン)。
 */
export function BeaverMascot({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none">
      {/* 耳 */}
      <circle cx="15" cy="14" r="7.5" fill="#8a5a30" />
      <circle cx="45" cy="14" r="7.5" fill="#8a5a30" />
      <circle cx="15" cy="14" r="3.6" fill="#c98f57" />
      <circle cx="45" cy="14" r="3.6" fill="#c98f57" />
      {/* 頭 */}
      <circle cx="30" cy="31" r="19" fill="#a9713f" />
      {/* マズル */}
      <ellipse cx="30" cy="36" rx="12" ry="10" fill="#e8cfa0" />
      {/* ほっぺ */}
      <circle cx="17" cy="34" r="3.6" fill="#e8a06a" opacity="0.6" />
      <circle cx="43" cy="34" r="3.6" fill="#e8a06a" opacity="0.6" />
      {/* 八の字眉 */}
      <path d="M25 20.5L16 25" stroke="#4a3626" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M35 20.5L44 25" stroke="#4a3626" strokeWidth="2.2" strokeLinecap="round" />
      {/* 目 */}
      <circle cx="23" cy="29.5" r="2.6" fill="#4a3626" />
      <circle cx="37" cy="29.5" r="2.6" fill="#4a3626" />
      <circle cx="22.1" cy="28.6" r="0.9" fill="#fff" />
      <circle cx="36.1" cy="28.6" r="0.9" fill="#fff" />
      {/* 鼻 */}
      <ellipse cx="30" cy="34.5" rx="2.6" ry="2" fill="#4a3626" />
      {/* 前歯 */}
      <rect x="27" y="37.5" width="2.6" height="4" rx="0.6" fill="#fff8ec" stroke="#d8c9a8" strokeWidth="0.5" />
      <rect x="30.4" y="37.5" width="2.6" height="4" rx="0.6" fill="#fff8ec" stroke="#d8c9a8" strokeWidth="0.5" />
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
