'use client'
import { useState } from 'react'
import { Twitter, Linkedin, Link, Check, Share2, X } from 'lucide-react'

interface ShareCardProps {
  title: string
  subtitle: string       // e.g. "London · Foodie · Sunny"
  highlights: string[]   // 3-4 bullet points from the plan
  url?: string           // defaults to window.location.href
  accentColor?: string   // hex, defaults to amber
  productName?: string   // "WeekendAI" or "WanderAI"
  productUrl?: string    // "weekendai.vercel.app"
  ctaText?: string       // pre-filled social text
}

export default function ShareCard({
  title,
  subtitle,
  highlights,
  url,
  accentColor = '#f59e0b',
  productName = 'WeekendAI',
  productUrl = 'weekendai.vercel.app',
  ctaText,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const pageUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  const shareText = ctaText ?? `Just planned my weekend with AI 🗓️\n\n${title}\n📍 ${subtitle}\n\n✅ ${highlights.slice(0, 3).join('\n✅ ')}\n\nTry it free → ${productUrl}`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`

  function copyLink() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: accentColor, color: '#fff' }}>
        <Share2 size={15} />
        Share this plan
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f0e1a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl animate-fadeUp">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Share2 size={16} style={{ color: accentColor }} />
                <span className="font-semibold text-white text-sm">Share your plan</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Preview card */}
            <div className="mx-5 mt-4 rounded-xl overflow-hidden border border-white/[0.08]">
              <div className="px-4 py-3" style={{ background: `${accentColor}18` }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>{productName}</div>
                <div className="font-bold text-white text-sm leading-snug">{title}</div>
                <div className="text-white/50 text-xs mt-0.5">{subtitle}</div>
              </div>
              <div className="bg-white/[0.03] px-4 py-3 space-y-1.5">
                {highlights.slice(0, 4).map((h, i) => (
                  <div key={i} className="flex gap-2 text-xs text-white/70">
                    <span style={{ color: accentColor }} className="flex-shrink-0">✓</span>
                    <span className="line-clamp-1">{h}</span>
                  </div>
                ))}
                <div className="text-xs text-white/30 pt-1 border-t border-white/[0.05] mt-2">
                  Try free → {productUrl}
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="p-5 grid grid-cols-3 gap-3 mt-1">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#1a1a2e] border border-white/[0.06] hover:border-[#1d9bf0]/40 hover:bg-[#1d9bf0]/10 transition-all">
                <Twitter size={18} className="text-[#1d9bf0]" />
                <span className="text-xs text-white/60">Twitter / X</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#1a1a2e] border border-white/[0.06] hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/10 transition-all">
                <Linkedin size={18} className="text-[#0a66c2]" />
                <span className="text-xs text-white/60">LinkedIn</span>
              </a>

              <button
                onClick={copyLink}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#1a1a2e] border border-white/[0.06] hover:border-white/20 transition-all">
                {copied
                  ? <Check size={18} className="text-emerald-400" />
                  : <Link size={18} className="text-white/50" />}
                <span className="text-xs text-white/60">{copied ? 'Copied!' : 'Copy text'}</span>
              </button>
            </div>

            {/* Pre-filled text preview */}
            <div className="mx-5 mb-5">
              <textarea
                readOnly
                rows={5}
                value={shareText}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white/50 resize-none font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
