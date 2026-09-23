export function Logo({ variant = 'dark', className = '' }: { variant?: 'dark' | 'light'; className?: string }) {
  return (
    <svg className={`logo logo--${variant} ${className}`} viewBox="0 0 220 70" role="img" aria-label="MultiCar">
      <g fill="#ff5a1f">
        <rect x="104" y="4" width="5" height="9" rx="1" transform="rotate(-30 106 8)" />
        <rect x="114" y="1" width="5" height="10" rx="1" transform="rotate(-12 116 6)" />
        <rect x="125" y="1" width="5" height="10" rx="1" transform="rotate(8 127 6)" />
        <rect x="135" y="3" width="5" height="10" rx="1" transform="rotate(26 137 8)" />
        <rect x="144" y="8" width="5" height="9" rx="1" transform="rotate(44 146 12)" fill="#ff2200" />
      </g>
      <path
        d="M8 44 C 30 26, 70 18, 110 20 C 140 21, 165 28, 190 38 C 200 42, 208 44, 214 48 C 196 42, 170 36, 140 32 C 100 27, 58 30, 22 44 Z"
        fill="#ff5a1f"
      />
      <path d="M40 36 C 70 24, 115 22, 150 30 C 120 26, 80 27, 48 38 Z" fill="currentColor" opacity=".9" />
      <text x="110" y="67" textAnchor="middle" fontSize="30">
        <tspan fill="currentColor">MULTI</tspan>
        <tspan fill="#ff2200">CAR</tspan>
      </text>
    </svg>
  );
}
