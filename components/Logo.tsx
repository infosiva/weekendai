export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#fffbf5" />
        <rect x="1.5" y="1.5" width="29" height="29" rx="6.5" fill="none" stroke="#f97316" strokeWidth="2" />
        <circle cx="16" cy="14" r="5" fill="#f97316" />
        <path d="M5 23h22" stroke="#1c1410" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M9 19l-2-2M23 19l2-2M16 6.5V4.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#1c1410' }}>
        Weekend<span style={{ color: '#c2410c' }}>AI</span>
      </span>
    </span>
  )
}
