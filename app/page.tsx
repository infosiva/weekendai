'use client'
import { useState, useEffect, useRef } from 'react'
import { MapPin, Wallet, Sparkles, Users, Calendar, ChevronDown, ChevronUp, Clock, ExternalLink, Lightbulb, Share2, RefreshCw } from 'lucide-react'
import VoiceButton from '@/components/VoiceButton'
import ShareCard from '@/components/ShareCard'

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

const VIBES = [
  { id: 'adventure', label: '🧗 Adventure', desc: 'Outdoors, active, thrilling' },
  { id: 'foodie', label: '🍽️ Foodie', desc: 'Best restaurants & markets' },
  { id: 'culture', label: '🎭 Culture', desc: 'Museums, art, history' },
  { id: 'chill', label: '☕ Chill', desc: 'Cafes, parks, slow pace' },
  { id: 'nightlife', label: '🎉 Nightlife', desc: 'Bars, clubs, live music' },
  { id: 'family', label: '👨‍👩‍👧 Family', desc: 'Kids-friendly, safe bets' },
  { id: 'romantic', label: '💑 Romantic', desc: 'Date ideas, scenic spots' },
  { id: 'budget', label: '💸 Budget', desc: 'Free & cheap hidden gems' },
]

const TYPE_COLORS: Record<string, string> = {
  outdoor:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  indoor:    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  food:      'bg-orange-500/20 text-orange-300 border-orange-500/30',
  nightlife: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  culture:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  sport:     'bg-red-500/20 text-red-300 border-red-500/30',
}

function ActivityCard({ act, index }: { act: Activity; index: number }) {
  const [open, setOpen] = useState(false)
  const color = TYPE_COLORS[act.type] ?? 'bg-white/10 text-white/60 border-white/20'
  return (
    <div className="reveal-3d glass-liquid rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all animate-fadeIn" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setOpen(v => !v)}>
        <div className="flex-shrink-0 text-center">
          <div className="text-xs text-amber-300/70 font-medium">{act.time}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h4 className="font-semibold text-white text-sm">{act.title}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>{act.type}</span>
              <span className="text-xs text-amber-300/60 font-medium">{act.cost}</span>
            </div>
          </div>
          <p className="text-white/55 text-xs mt-1 leading-snug line-clamp-2">{act.description}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-white/30 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-white/30 flex-shrink-0 mt-1" />}
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-2">
          <p className="text-white/65 text-xs leading-relaxed">{act.description}</p>
          {act.tip && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
              <Lightbulb size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200/80 text-xs">{act.tip}</p>
            </div>
          )}
          {act.bookingUrl && (
            <a href={act.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.10] text-white/60 hover:text-white transition-colors">
              <ExternalLink size={11} /> Book / View
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function WeekendAIPage() {
  const [city, setCity]       = useState('')
  const [budget, setBudget]   = useState('')
  const [vibe, setVibe]       = useState('')
  const [people, setPeople]   = useState('2 adults')
  const [extras, setExtras]   = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan]       = useState<WeekendPlan | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [day, setDay]         = useState<'saturday' | 'sunday'>('saturday')
  const [navScrolled, setNavScrolled] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setNavScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  async function generate(overrideCity?: string) {
    const c = overrideCity ?? city
    if (!c.trim() || !vibe) { setError('Enter a city and pick a vibe'); return }
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
        if (c) { setCity(c) }
      } catch {}
    })
  }

  const QUICK_CITIES = ['London', 'Manchester', 'Edinburgh', 'Bristol', 'Birmingham', 'New York', 'Paris', 'Barcelona', 'Tokyo', 'Dubai']

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-amber-950 via-gray-950 to-emerald-950">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="liquid-blob liquid-blob-1" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)' }} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-2" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.13), transparent 70%)', animationDelay: '-8s' }} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-3" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 70%)', animationDelay: '-14s' }} aria-hidden="true" />

      {/* Floating nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${navScrolled ? 'nav-scrolled glass-liquid border-b border-white/[0.08]' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">☀️</span>
          <span className="font-bold text-white text-lg">WeekendAI</span>
        </div>
        <span className="text-white/40 text-sm hidden sm:block">Plan your perfect weekend</span>
      </nav>

      {/* Sentinel for nav scroll detection */}
      <div ref={sentinelRef} className="absolute top-20 h-px w-full pointer-events-none" aria-hidden="true" />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative z-10">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              What's your vibe this{' '}
              <span className="text-iridescent">weekend</span>?
            </h1>
            <p className="text-white/55 text-lg max-w-lg mx-auto">
              Tell us your mood. AI builds a full 2-day itinerary.
            </p>
          </div>

          {/* Mood selector */}
          <div className="flex flex-wrap justify-center gap-3">
            {VIBES.map(v => (
              <button key={v.id} onClick={() => setVibe(v.id)}
                className={`pill-glass text-sm font-semibold transition-all duration-200 ${vibe === v.id ? 'border-amber-400/70 shadow-[0_0_16px_rgba(245,158,11,0.35)] text-amber-200' : 'text-white/70 hover:text-white'}`}>
                {v.label}
              </button>
            ))}
          </div>

          {/* City + budget row */}
          <div className="glass-liquid rounded-2xl p-4 space-y-3">
            <div className="flex gap-2">
              <input type="text" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && vibe && generate()}
                placeholder="City — e.g. London, Tokyo, Barcelona"
                className="flex-1 bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/50 transition-colors" />
              <button onClick={useMyLocation} title="Use my location"
                className="px-3 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white/50 hover:text-amber-300 hover:border-amber-500/30 transition-colors">
                <MapPin size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${city === c ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/60'}`}>{c}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select value={budget} onChange={e => setBudget(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/50 transition-colors appearance-none">
                <option value="">Any budget</option>
                <option value="tight (under £30/person)">Tight — under £30</option>
                <option value="moderate (£50-80/person)">Moderate — £50-80</option>
                <option value="comfortable (£100-150/person)">Comfortable — £100-150</option>
                <option value="splurge (£200+/person)">Splurge — £200+</option>
              </select>
              <select value={people} onChange={e => setPeople(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/50 transition-colors appearance-none">
                <option value="solo">Solo</option>
                <option value="2 adults">2 adults (couple)</option>
                <option value="group of friends">Group of friends</option>
                <option value="family with kids">Family with kids</option>
                <option value="family with teens">Family with teens</option>
              </select>
            </div>

            <input type="text" value={extras} onChange={e => setExtras(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="Anything specific? e.g. dog-friendly, no museums, love street food"
              className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/50 transition-colors" />

            {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

            <button onClick={() => generate()}
              className="btn-liquid w-full py-4 rounded-2xl font-bold text-white text-base">
              ✨ Plan my weekend
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['📅 Full 2-day plan', '💰 Budget breakdown', '🗺️ Local hidden gems', '📲 Shareable card'].map(f => (
              <span key={f} className="pill-glass text-xs text-white/60">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section className="relative z-10 flex flex-col items-center justify-center py-24 px-6">
          <div className="text-5xl mb-6 animate-pulse">🗺️</div>
          <p className="text-white/70 text-xl font-semibold mb-2">Planning your weekend…</p>
          <p className="text-white/35 text-sm">Finding hidden gems, checking local spots, crafting your itinerary</p>
        </section>
      )}

      {/* Plan results */}
      {plan && !loading && (
        <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24 space-y-6 animate-fadeIn">
          {/* Plan header */}
          <div className="glass-liquid rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-1">{plan.title}</h2>
            <p className="text-white/45 text-sm">{plan.city} · {plan.vibe} · {plan.weather}</p>
          </div>

          {/* Day toggle */}
          <div className="glass-liquid rounded-2xl p-1.5 flex items-center gap-2">
            <button onClick={() => setDay('saturday')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${day === 'saturday' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/50 hover:text-white'}`}>
              Saturday
            </button>
            <button onClick={() => setDay('sunday')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${day === 'sunday' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/50 hover:text-white'}`}>
              Sunday
            </button>
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {(plan[day] ?? []).map((act, i) => <ActivityCard key={i} act={act} index={i} />)}
          </div>

          {/* Budget breakdown */}
          {plan.budgetBreakdown?.length > 0 && (
            <div className="glass-liquid rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Wallet size={12} /> Estimated Budget</h3>
              <div className="space-y-2">
                {plan.budgetBreakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{b.category}</span>
                    <span className="text-white font-medium">{b.estimate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local tips */}
          {plan.localTips?.length > 0 && (
            <div className="glass-liquid rounded-2xl p-5 border-amber-500/20">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Lightbulb size={12} /> Local Insider Tips</h3>
              <ul className="space-y-2">
                {plan.localTips.map((t, i) => <li key={i} className="text-white/65 text-sm flex gap-2"><span className="text-amber-400 flex-shrink-0">→</span>{t}</li>)}
              </ul>
            </div>
          )}

          {/* Alternatives */}
          {plan.alternatives?.length > 0 && (
            <div className="glass-liquid rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">If This Doesn't Suit You</h3>
              <ul className="space-y-1.5">
                {plan.alternatives.map((a, i) => <li key={i} className="text-white/50 text-sm">• {a}</li>)}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => { setPlan(null); setError(null) }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-white/[0.06] border border-white/[0.10] text-white/60 hover:text-white transition-colors">
              <RefreshCw size={14} /> New plan
            </button>
            <ShareCard
              title={plan.title}
              subtitle={`${plan.city} · ${plan.vibe} · ${plan.weather}`}
              highlights={[
                ...(plan.saturday ?? []).slice(0, 2).map(a => `${a.time} ${a.title} (${a.cost})`),
                ...(plan.sunday ?? []).slice(0, 2).map(a => `${a.time} ${a.title} (${a.cost})`),
              ]}
              accentColor="#f59e0b"
              productName="WeekendAI"
              productUrl="weekendai.vercel.app"
            />
          </div>
        </section>
      )}

      <VoiceButton
        onTranscript={(text) => setCity(text)}
        color="#f59e0b"
        position="bottom-right"
      />
    </div>
  )
}
