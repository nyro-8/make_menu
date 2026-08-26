import { useId } from 'react';

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
  const uid = useId();
  const headGrad = `beaverHead${uid}`;
  const earGrad = `beaverEar${uid}`;
  const muzzleGrad = `beaverMuzzle${uid}`;
  const blushGrad = `beaverBlush${uid}`;
  return (
    <svg className={className} viewBox="0 0 200 200">
      <defs>
        <radialGradient id={headGrad} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#c08b57" />
          <stop offset="55%" stopColor="#a9713f" />
          <stop offset="100%" stopColor="#95602f" />
        </radialGradient>
        <radialGradient id={earGrad} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#a06f3c" />
          <stop offset="100%" stopColor="#7c4e26" />
        </radialGradient>
        <radialGradient id={muzzleGrad} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f7e6c4" />
          <stop offset="100%" stopColor="#e3c393" />
        </radialGradient>
        <radialGradient id={blushGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef9a5f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ef9a5f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 耳 */}
      <circle cx="56" cy="58" r="18" fill={`url(#${earGrad})`} />
      <circle cx="144" cy="58" r="18" fill={`url(#${earGrad})`} />
      <circle cx="56" cy="58" r="9" fill="#d9a468" />
      <circle cx="144" cy="58" r="9" fill="#d9a468" />

      {/* 頭 */}
      <circle cx="100" cy="102" r="58" fill={`url(#${headGrad})`} />

      {/* マズル */}
      <ellipse cx="100" cy="128" rx="36" ry="30" fill={`url(#${muzzleGrad})`} />

      {/* ほっぺ */}
      <circle cx="63" cy="118" r="17" fill={`url(#${blushGrad})`} />
      <circle cx="137" cy="118" r="17" fill={`url(#${blushGrad})`} />

      {/* 八の字眉 */}
      <path d="M84 80 Q74 84 65 92" stroke="#4a3626" strokeWidth="4.4" fill="none" strokeLinecap="round" />
      <path d="M116 80 Q126 84 135 92" stroke="#4a3626" strokeWidth="4.4" fill="none" strokeLinecap="round" />

      {/* 目 */}
      <circle cx="76" cy="100" r="7" fill="#3c2c1f" />
      <circle cx="124" cy="100" r="7" fill="#3c2c1f" />
      <circle cx="78.5" cy="97" r="2.3" fill="#fff" opacity="0.95" />
      <circle cx="126.5" cy="97" r="2.3" fill="#fff" opacity="0.95" />
      <circle cx="74" cy="103" r="1" fill="#fff" opacity="0.6" />
      <circle cx="122" cy="103" r="1" fill="#fff" opacity="0.6" />

      {/* 鼻 */}
      <ellipse cx="100" cy="118" rx="10" ry="7.5" fill="#3c2c1f" />
      <ellipse cx="97" cy="115.5" rx="2.4" ry="1.6" fill="#6a5138" opacity="0.7" />

      {/* 前歯 */}
      <rect x="90" y="132" width="9" height="14" rx="2.5" fill="#fffaf1" stroke="#e3cda3" strokeWidth="1" />
      <rect x="101" y="132" width="9" height="14" rx="2.5" fill="#fffaf1" stroke="#e3cda3" strokeWidth="1" />
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
