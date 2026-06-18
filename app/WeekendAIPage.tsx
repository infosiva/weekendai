'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { MapPin, Wallet, Lightbulb, ExternalLink, Share2, RefreshCw, ChevronDown, ChevronUp, Clock, Users } from 'lucide-react'
import VoiceButton from '@/components/VoiceButton'
import type { ContentOverrides } from '@/lib/content'
import ShareCard from '@/components/ShareCard'
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'

interface Activity {
  time: string; title: string; description: string; cost: string
  type: string; bookingUrl?: string | null; tip: string
}
interface WeekendPlan {
  title: string; city: string; vibe: string; weather: string
  saturday: Activity[]; sunday: Activity[]
  budgetBreakdown: { category: string; estimate: string }[]
  localTips: string[]; alternatives: string[]
}

const T = {
  bg: '#fffbf5',
  s1: '#fff5e9',
  s2: '#ffece0',
  border: 'rgba(28,20,16,0.08)',
  border2: 'rgba(234,88,12,0.25)',
  text: '#1c1410',
  muted: 'rgba(28,20,16,0.45)',
  amber: '#ea580c',
  amber2: '#c2410c',
  orange: '#fb923c',
  green: '#16a34a',
}

const VIBES = [
  { id: 'adventure', label: '🧗 Adventure' },
  { id: 'foodie', label: '🍽️ Foodie' },
  { id: 'culture', label: '🎭 Culture' },
  { id: 'chill', label: '☕ Chill' },
  { id: 'nightlife', label: '🎉 Nightlife' },
  { id: 'family', label: '👨‍👩‍👧 Family' },
  { id: 'romantic', label: '💑 Romantic' },
  { id: 'budget', label: '💸 Budget' },
]

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  outdoor:   { bg: 'rgba(22,163,74,0.10)', color: '#15803d' },
  indoor:    { bg: 'rgba(37,99,235,0.10)', color: '#1d4ed8' },
  food:      { bg: 'rgba(234,88,12,0.10)', color: '#c2410c' },
  nightlife: { bg: 'rgba(168,85,247,0.10)', color: '#9333ea' },
  culture:   { bg: 'rgba(217,119,6,0.10)', color: '#b45309' },
  sport:     { bg: 'rgba(220,38,38,0.10)', color: '#dc2626' },
}

function ActivityCard({ act, index }: { act: Activity; index: number }) {
  const [open, setOpen] = useState(false)
  const tc = TYPE_COLORS[act.type] ?? { bg: 'rgba(28,20,16,0.06)', color: 'rgba(28,20,16,0.5)' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      style={{ background: T.s1, border: `1px solid ${open ? T.border2 : T.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.15s', display: 'flex' }}
    >
      {/* Left accent stripe — type color */}
      <div style={{ width: 3, flexShrink: 0, background: tc.color, opacity: 0.7, borderRadius: '0 0 0 0' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', cursor: 'pointer' }} onClick={() => setOpen(v => !v)}>
        <div style={{ fontSize: 11, color: T.amber, fontWeight: 700, minWidth: 36, paddingTop: 2, flexShrink: 0 }}>{act.time}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{act.title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: tc.bg, color: tc.color, fontWeight: 600 }}>{act.type}</span>
              <span style={{ fontSize: 11, color: T.amber, fontWeight: 700 }}>{act.cost}</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 3, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: open ? 'unset' : 1, WebkitBoxOrient: 'vertical' }}>{act.description}</p>
        </div>
        {open ? <ChevronUp size={13} color={T.muted} style={{ flexShrink: 0, marginTop: 4 }} /> : <ChevronDown size={13} color={T.muted} style={{ flexShrink: 0, marginTop: 4 }} />}
      </div>
      {open && (
        <div style={{ padding: '0 14px 12px', borderTop: `1px solid rgba(28,20,16,0.05)` }}>
          <p style={{ fontSize: 12, color: 'rgba(28,20,16,0.65)', lineHeight: 1.55, marginBottom: act.tip ? 10 : 0 }}>{act.description}</p>
          {act.tip && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(234,88,12,0.07)', border: '1px solid rgba(234,88,12,0.18)', borderRadius: 8, padding: '8px 10px', marginBottom: act.bookingUrl ? 10 : 0 }}>
              <Lightbulb size={11} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: 'rgba(28,20,16,0.7)' }}>{act.tip}</span>
            </div>
          )}
          {act.bookingUrl && (
            <a href={act.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '6px 10px', borderRadius: 7, background: 'rgba(28,20,16,0.04)', border: `1px solid ${T.border}`, color: T.muted, textDecoration: 'none', transition: 'color 0.15s' }}>
              <ExternalLink size={10} /> Book / View
            </a>
          )}
        </div>
      )}
      </div>
    </motion.div>
  )
}

export default function WeekendAIPage({ overrides = {} }: { overrides?: ContentOverrides }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate } = useGate('weekendai', 3)
  const [city, setCity]       = useState('')
  const [budget, setBudget]   = useState('')
  const [vibe, setVibe]       = useState('')
  const [people, setPeople]   = useState('2 adults')
  const [extras, setExtras]   = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan]       = useState<WeekendPlan | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [day, setDay]         = useState<'saturday' | 'sunday'>('saturday')

  async function generate(overrideCity?: string) {
    const c = overrideCity ?? city
    if (!c.trim() || !vibe) { setError('Enter a city and pick a vibe'); return }
    const allowed = await gateIncrement()
    if (!allowed) return
    setLoading(true); setError(null); setPlan(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: c.trim(), budget, vibe, people, extras }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setPlan(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } })
        const d = await r.json()
        const c = d.address?.city ?? d.address?.town ?? d.address?.county ?? ''
        if (c) setCity(c)
      } catch {}
    })
  }

  const QUICK_CITIES = ['London', 'Manchester', 'Edinburgh', 'Bristol', 'New York', 'Paris', 'Barcelona', 'Tokyo', 'Dubai']

  return (
    <>
      {showGate && (
        <RegisterGate
          freeUsed={gateCount}
          freeLimit={3}
          freeFeature="weekend plans"
          lockedFeature="unlimited weekend plans"
          accentColor={T.amber}
          site="weekendai"
          onSuccess={onRegistered}
          onDismiss={dismissGate}
        />
      )}
      <div style={{ background: T.bg, color: T.text, fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          a{text-decoration:none}
          .nav{position:sticky;top:0;z-index:50;background:rgba(255,251,245,0.9);backdrop-filter:blur(16px);border-bottom:1px solid ${T.border};padding:0 20px;height:50px;display:flex;align-items:center;justify-content:space-between}
          .logo{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:900;color:${T.text};letter-spacing:-0.3px}
          .w{max-width:720px;margin:0 auto;padding:0 18px}
          .hero{padding:28px 18px 0;max-width:720px;margin:0 auto}
          h1{font-size:clamp(20px,4vw,28px);font-weight:900;letter-spacing:-0.5px;color:${T.text};margin-bottom:6px}
          h1 span{background:linear-gradient(135deg,${T.amber},${T.amber2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
          .sub{font-size:13px;color:${T.muted};margin-bottom:20px}
          .vibes{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}
          .vibe-btn{padding:7px 13px;border-radius:100px;font-size:12px;font-weight:700;border:1px solid ${T.border};background:${T.s1};color:rgba(28,20,16,0.55);cursor:pointer;transition:all 0.15s;white-space:nowrap}
          .vibe-btn.sel{border-color:rgba(234,88,12,0.45);background:rgba(234,88,12,0.10);color:${T.amber};box-shadow:0 0 12px rgba(234,88,12,0.12)}
          .vibe-btn:hover:not(.sel){color:rgba(28,20,16,0.85);border-color:rgba(28,20,16,0.18)}
          .form-box{background:${T.s1};border:1px solid ${T.border};border-radius:14px;padding:14px;margin-bottom:20px}
          .city-row{display:flex;gap:8px;margin-bottom:10px}
          .inp{flex:1;background:#ffffff;border:1px solid ${T.border};border-radius:9px;padding:9px 12px;color:${T.text};font-size:13px;outline:none;transition:border-color 0.15s;font-family:inherit}
          .inp:focus{border-color:rgba(234,88,12,0.45)}
          .inp::placeholder{color:rgba(28,20,16,0.32)}
          .loc-btn{padding:9px 12px;border-radius:9px;background:#ffffff;border:1px solid ${T.border};color:${T.muted};cursor:pointer;transition:all 0.15s;display:flex;align-items:center}
          .loc-btn:hover{color:${T.amber};border-color:rgba(234,88,12,0.3)}
          .quick-cities{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
          .qc{padding:4px 10px;border-radius:100px;font-size:10px;font-weight:600;background:#ffffff;border:1px solid ${T.border};color:${T.muted};cursor:pointer;transition:all 0.15s}
          .qc.sel,.qc:hover{background:rgba(234,88,12,0.10);border-color:rgba(234,88,12,0.3);color:${T.amber}}
          .selects{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
          select.inp{appearance:none;cursor:pointer}
          .gen-btn{width:100%;padding:13px;border-radius:11px;font-size:14px;font-weight:900;border:none;cursor:pointer;background:linear-gradient(135deg,${T.amber},${T.amber2});color:#fff;transition:opacity 0.15s;letter-spacing:-0.2px}
          .gen-btn:hover{opacity:0.9}
          .gen-btn:disabled{opacity:0.4;cursor:not-allowed}
          .err{font-size:11px;color:#b91c1c;background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.18);border-radius:8px;padding:7px 10px;margin-bottom:10px}
          .feat-pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px}
          .fp{padding:5px 10px;background:${T.s1};border:1px solid ${T.border};border-radius:7px;font-size:11px;color:${T.muted}}
          .loading-box{text-align:center;padding:40px 20px}
          .spin{width:36px;height:36px;border:3px solid rgba(234,88,12,0.15);border-top-color:${T.amber};border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 14px}
          @keyframes spin{to{transform:rotate(360deg)}}
          .plan-header{background:${T.s1};border:1px solid ${T.border};border-radius:14px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:12px}
          .plan-emoji{font-size:28px}
          .plan-title{font-size:17px;font-weight:900;color:${T.text};margin-bottom:3px}
          .plan-meta{font-size:11px;color:${T.muted}}
          .day-toggle{background:${T.s1};border:1px solid ${T.border};border-radius:11px;padding:4px;display:flex;gap:4px;margin-bottom:14px}
          .day-btn{flex:1;padding:9px;border-radius:8px;font-size:13px;font-weight:800;border:none;cursor:pointer;transition:all 0.15s;background:transparent;color:${T.muted}}
          .day-btn.sel{background:linear-gradient(135deg,${T.amber},${T.amber2});color:#fff;box-shadow:0 2px 10px rgba(234,88,12,0.2)}
          .section-label{font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${T.amber};margin-bottom:10px;display:flex;align-items:center;gap:6px}
          .info-card{background:${T.s1};border:1px solid ${T.border};border-radius:12px;padding:14px;margin-bottom:12px}
          .budget-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(28,20,16,0.05);font-size:12px}
          .budget-row:last-child{border-bottom:none}
          .tip-item{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:rgba(28,20,16,0.65);margin-bottom:7px}
          .actions-row{display:flex;gap:8px;margin-top:4px;margin-bottom:28px}
          .act-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;font-size:12px;font-weight:700;border:1px solid ${T.border};background:#ffffff;color:${T.muted};cursor:pointer;transition:all 0.15s}
          .act-btn:hover{color:${T.text};border-color:rgba(28,20,16,0.18)}
          @media(max-width:480px){
            .selects{grid-template-columns:1fr}
            .quick-cities{gap:4px}
            h1{font-size:20px}
          }
        `}</style>

        {/* Nav */}
        <nav className="nav">
          <div className="logo">☀️ WeekendAI</div>
          <span style={{ fontSize: 11, color: T.muted }}>Plan your perfect weekend</span>
        </nav>

        {/* Hero + Form */}
        <div className="hero">
          <h1>{overrides.headline ?? <>Tell us who&apos;s coming and what you&apos;re into. Get your whole <span>weekend planned</span> in 10 seconds.</>}</h1>
          <p className="sub">{overrides.subheadline ?? 'Pick your group and vibe. AI builds your full 2-day itinerary instantly.'}</p>

          {/* Row 1: Group selector */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(28,20,16,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Who&apos;s coming?</p>
            <div className="vibes">
              {[
                { id: 'solo', label: '🙋 Solo' },
                { id: '2 adults', label: '💑 Couple' },
                { id: 'group of friends', label: '👥 Friends' },
                { id: 'family with kids', label: '👨‍👩‍👧 Family' },
              ].map(g => (
                <button key={g.id} className={`vibe-btn${people === g.id ? ' sel' : ''}`} onClick={() => setPeople(g.id)}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Vibe selector */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(28,20,16,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>What&apos;s the vibe?</p>
            <div className="vibes">
              {[
                { id: 'chill', label: '☕ Chill' },
                { id: 'adventure', label: '🧗 Active' },
                { id: 'culture', label: '🎭 Cultural' },
                { id: 'foodie', label: '🍽️ Foodie' },
              ].map(v => (
                <button key={v.id} className={`vibe-btn${vibe === v.id ? ' sel' : ''}`} onClick={() => setVibe(v.id)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="form-box">
            <div className="city-row">
              <input
                className="inp"
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && vibe && generate()}
                placeholder="City — e.g. London, Tokyo, Barcelona"
              />
              <button className="loc-btn" onClick={useMyLocation} title="Use my location">
                <MapPin size={15} />
              </button>
            </div>

            <div className="quick-cities">
              {QUICK_CITIES.map(c => (
                <button key={c} className={`qc${city === c ? ' sel' : ''}`} onClick={() => setCity(c)}>{c}</button>
              ))}
            </div>

            <div className="selects">
              <select className="inp" value={budget} onChange={e => setBudget(e.target.value)}>
                <option value="">Any budget</option>
                <option value="tight (under £30/person)">Tight — under £30</option>
                <option value="moderate (£50-80/person)">Moderate — £50-80</option>
                <option value="comfortable (£100-150/person)">Comfortable — £100-150</option>
                <option value="splurge (£200+/person)">Splurge — £200+</option>
              </select>
            </div>

            <input
              className="inp"
              type="text"
              value={extras}
              onChange={e => setExtras(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="Anything specific? dog-friendly, no museums, street food…"
              style={{ marginBottom: 10, width: '100%', display: 'block' }}
            />

            {error && <div className="err">{error}</div>}

            <button className="gen-btn" disabled={loading} onClick={() => generate()}>
              {loading ? 'Planning…' : '✨ Plan my weekend'}
            </button>
          </div>

          <div className="feat-pills">
            {['📅 Full 2-day plan','💰 Budget breakdown','🗺️ Hidden gems','📲 Shareable card'].map(f => (
              <span key={f} className="fp">{f}</span>
            ))}
          </div>
        </div>

        {/* Social proof + example plans — shown only when no plan loaded */}
        {!plan && !loading && (
          <div className="w" style={{ paddingBottom: 32 }}>
            {/* Example weekend cards */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: T.amber, marginBottom: 10 }}>✨ Example weekends</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {[
                  { emoji: '🎭', city: 'London', vibe: 'Culture', preview: 'Tate Modern → Borough Market → West End show' },
                  { emoji: '🍽️', city: 'Barcelona', vibe: 'Foodie', preview: 'La Boqueria → tapas crawl → sunset at Bunkers' },
                  { emoji: '🏔️', city: 'Edinburgh', vibe: 'Adventure', preview: 'Arthur\'s Seat hike → Royal Mile → whisky tasting' },
                  { emoji: '💑', city: 'Paris', vibe: 'Romantic', preview: 'Louvre → Seine walk → rooftop dinner, Montmartre' },
                ].map(ex => (
                  <button
                    key={ex.city}
                    onClick={() => { setCity(ex.city); setVibe(ex.vibe.toLowerCase()) }}
                    style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(234,88,12,0.35)')}
                    onMouseOut={e => (e.currentTarget.style.borderColor = T.border)}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{ex.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.text, marginBottom: 2 }}>{ex.city} · {ex.vibe}</div>
                    <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{ex.preview}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-box">
            <div className="spin" />
            <p style={{ color: 'rgba(28,20,16,0.65)', fontSize: 14, fontWeight: 700, marginBottom: 5 }}>Planning your weekend…</p>
            <p style={{ color: T.muted, fontSize: 12 }}>Finding hidden gems, crafting your itinerary</p>
          </div>
        )}

        {/* Plan results */}
        {plan && !loading && (
          <div className="w" style={{ paddingTop: 8, paddingBottom: 32 }}>
            <div className="plan-header">
              <div className="plan-emoji">🎉</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="plan-title">{plan.title}</div>
                <div className="plan-meta">{plan.city} · {plan.vibe} · {plan.weather}</div>
              </div>
            </div>

            {/* Weekend summary strip */}
            {(() => {
              const allActs = [...(plan.saturday ?? []), ...(plan.sunday ?? [])]
              const totalActs = allActs.length
              const freeActs = allActs.filter(a => a.cost === 'Free' || a.cost === '£0').length
              return (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  {[
                    { icon: '📋', label: `${totalActs} activities` },
                    { icon: '📅', label: '2-day plan' },
                    freeActs > 0 ? { icon: '🆓', label: `${freeActs} free` } : null,
                    { icon: '🌤', label: plan.weather },
                  ].filter(Boolean).map((s) => s && (
                    <div key={s.label} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 10, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 99,
                      background: 'rgba(234,88,12,0.08)',
                      border: '1px solid rgba(234,88,12,0.18)',
                      color: T.amber,
                    }}>
                      <span>{s.icon}</span> {s.label}
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* Day toggle */}
            <div className="day-toggle">
              <button className={`day-btn${day === 'saturday' ? ' sel' : ''}`} onClick={() => setDay('saturday')}>Saturday</button>
              <button className={`day-btn${day === 'sunday' ? ' sel' : ''}`} onClick={() => setDay('sunday')}>Sunday</button>
            </div>

            {/* Activities — grouped by Morning / Afternoon / Evening */}
            <div style={{ marginBottom: 14 }}>
              {(['Morning', 'Afternoon', 'Evening'] as const).map(slot => {
                const slotActivities = (plan[day] ?? []).filter(act => {
                  const h = parseInt(act.time?.split(':')[0] ?? '12', 10)
                  if (slot === 'Morning') return h < 12
                  if (slot === 'Afternoon') return h >= 12 && h < 17
                  return h >= 17
                })
                if (slotActivities.length === 0) return null
                const slotIcon = slot === 'Morning' ? '🌅' : slot === 'Afternoon' ? '☀️' : '🌙'
                return (
                  <div key={slot} style={{ marginBottom: 16 }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>
                      <span>{slotIcon}</span> {slot}
                    </div>
                    {slotActivities.map((act, i) => <ActivityCard key={i} act={act} index={i} />)}
                  </div>
                )
              })}
            </div>

            {/* Budget */}
            {plan.budgetBreakdown?.length > 0 && (
              <div className="info-card">
                <div className="section-label"><Wallet size={10} /> Estimated Budget</div>
                {plan.budgetBreakdown.map((b, i) => (
                  <div key={i} className="budget-row">
                    <span style={{ color: 'rgba(28,20,16,0.6)' }}>{b.category}</span>
                    <span style={{ color: T.text, fontWeight: 700 }}>{b.estimate}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Local tips */}
            {plan.localTips?.length > 0 && (
              <div className="info-card" style={{ borderColor: 'rgba(234,88,12,0.18)' }}>
                <div className="section-label"><Lightbulb size={10} /> Local Insider Tips</div>
                {plan.localTips.map((t, i) => (
                  <div key={i} className="tip-item">
                    <span style={{ color: T.amber, flexShrink: 0 }}>→</span> {t}
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="actions-row">
              <button className="act-btn" onClick={() => { setPlan(null); setError(null) }}>
                <RefreshCw size={13} /> New plan
              </button>
              <ShareCard
                title={plan.title}
                subtitle={`${plan.city} · ${plan.vibe} · ${plan.weather}`}
                highlights={[
                  ...(plan.saturday ?? []).slice(0, 2).map(a => `${a.time} ${a.title} (${a.cost})`),
                  ...(plan.sunday ?? []).slice(0, 2).map(a => `${a.time} ${a.title} (${a.cost})`),
                ]}
                accentColor={T.amber}
                productName="WeekendAI"
                productUrl="weekendai.vercel.app"
              />
            </div>
          </div>
        )}

        <VoiceButton
          onTranscript={(text) => setCity(text)}
          color={T.amber}
          position="bottom-right"
        />
      </div>
    </>
  )
}
