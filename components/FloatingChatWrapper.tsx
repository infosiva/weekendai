'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCENT = '#ea580c'
const ACCENT_DARK = '#c2410c'
const ACCENT_RGB = '234,88,12'
const NAME = 'WeekendAI'
const EMOJI = '🌅'
const GREETING = "Hi! Tell me your city and what you're into — I'll plan your weekend 🎉"
const BG = 'rgba(255,251,245,0.97)'
const BOTTOM_OFFSET = 84

export default function FloatingChatWrapper() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: GREETING },
  ])
  const [input, setInput] = useState('')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  async function send() {
    if (!input.trim()) return
    const userMsg = input
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text || 'Happy to help!' }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Try again in a moment!' }])
    }
  }

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        width: '100%',
        height: `calc(100dvh - ${BOTTOM_OFFSET}px)`,
        borderRadius: '16px 16px 0 0',
        background: BG,
        border: `1px solid rgba(${ACCENT_RGB},0.25)`,
        boxShadow: '0 -8px 40px rgba(28,20,16,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        position: 'fixed',
        bottom: 88,
        right: 24,
        zIndex: 9998,
        width: 340,
        height: 460,
        borderRadius: 16,
        background: BG,
        border: `1px solid rgba(${ACCENT_RGB},0.25)`,
        boxShadow: '0 8px 40px rgba(28,20,16,0.16)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px rgba(${ACCENT_RGB},0.45)`,
          zIndex: 9999,
          fontSize: 20,
        }}
      >
        {open ? '✕' : EMOJI}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: isMobile ? 0.3 : 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={panelStyle}
          >
            {/* Header */}
            <div
              style={{
                flexShrink: 0,
                padding: '12px 16px',
                borderBottom: `1px solid rgba(${ACCENT_RGB},0.2)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{EMOJI}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1c1410' }}>{NAME} AI</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: 20,
                    background: `rgba(${ACCENT_RGB},0.12)`,
                    color: ACCENT,
                    border: `1px solid rgba(${ACCENT_RGB},0.3)`,
                  }}
                >
                  FREE
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(28,20,16,0.35)',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background:
                      m.role === 'user'
                        ? `rgba(${ACCENT_RGB},0.16)`
                        : 'rgba(28,20,16,0.05)',
                    padding: '8px 12px',
                    borderRadius:
                      m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    fontSize: 13,
                    color: '#1c1410',
                    maxWidth: '85%',
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                flexShrink: 0,
                padding: '10px 12px',
                borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`,
                display: 'flex',
                gap: 8,
                paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
              }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="City + vibe + budget — I'll plan your weekend"
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: `1px solid rgba(${ACCENT_RGB},0.25)`,
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: isMobile ? 16 : 13,
                  color: '#1c1410',
                  outline: 'none',
                }}
              />
              <button
                onClick={send}
                style={{
                  background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 14,
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
