import clsx from 'clsx';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

const SIZES = {
  sm: { icon: 28, text: 'text-xl' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-3xl' },
};

export default function NexusLogo({ size = 'md', showWordmark = true }: Props) {
  const s = SIZES[size];
  return (
    <div className="flex items-center gap-3">
      {/* Hexagon icon */}
      <div className="relative flex-shrink-0">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 48 48"
          fill="none"
          className="logo-glow"
        >
          {/* Hex background */}
          <path
            d="M24 2L44 14V34L24 46L4 34V14L24 2Z"
            fill="url(#lg1)"
            fillOpacity="0.15"
            stroke="url(#lg2)"
            strokeWidth="1.5"
          />
          {/* Inner geometric pattern */}
          <path
            d="M24 10L36 17V31L24 38L12 31V17L24 10Z"
            fill="url(#lg3)"
            fillOpacity="0.2"
          />
          {/* Centre dot */}
          <circle cx="24" cy="24" r="4" fill="url(#lg4)" />
          {/* Connecting lines */}
          <line x1="24" y1="20" x2="24" y2="12" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="24" y1="28" x2="24" y2="36" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="20.5" y1="22" x2="13.5" y2="18" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="27.5" y1="26" x2="34.5" y2="30" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="27.5" y1="22" x2="34.5" y2="18" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />
          <line x1="20.5" y1="26" x2="13.5" y2="30" stroke="url(#lg2)" strokeWidth="1" strokeOpacity="0.7" />

          <defs>
            <linearGradient id="lg1" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="lg2" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="lg3" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="1" stopColor="#0891b2" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="lg4" cx="50%" cy="50%" r="50%">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#10b981" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <span
          className={clsx('font-display font-bold tracking-tight', s.text)}
          style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
        >
          <span className="text-gradient-emerald">Nexus</span>
        </span>
      )}
    </div>
  );
}
