// WeekendAI logo: glyph + wordmark, key word in the hub-switchable accent.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, letterSpacing: '-0.02em', color: '#1c1410' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="color-mix(in oklab, var(--accent, #f97316) 18%, #fffbf5)" />
        <g fill="none" stroke="var(--accent, #f97316)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="14" r="5"/><path d="M9 21l-2-2M23 21l2-2M16 6V4M6 14H4M28 14h-2"/></g>
      </svg>
      <span>Weekend</span><span style={{ color: 'var(--accent, #f97316)' }}>AI</span>
    </span>
  )
}
