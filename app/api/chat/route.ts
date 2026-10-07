import { sanitizeUserInput } from '@/lib/guard'
import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'

const SYSTEM = 'You are WeekendAI, a weekend activity planner. Help users discover things to do, plan outings, find restaurants and events. Be fun and concise. If asked anything outside weekend planning, reply: "I\'m trained for WeekendAI. For that, try Google or ChatGPT!"'
const FALLBACK = "I'm having trouble connecting right now. Tell me your city and I'll try again in a moment!"

type Msg = { role: string; content: string }

async function openai(url: string, key: string | undefined, model: string, msgs: Msg[]): Promise<string | null> {
  if (!key) return null
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: msgs, max_tokens: 400, temperature: 0.7 }),
    })
    if (!r.ok) return null
    const d = await r.json()
    return d.choices?.[0]?.message?.content || null
  } catch { return null }
}

async function gemini(msgs: Msg[]): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: msgs[0].content }] },
        contents: msgs.slice(1).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      }),
    })
    if (!r.ok) return null
    const d = await r.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req); if (limited) return limited
  try {
    const body = await req.json()
    if (body && Array.isArray(body.messages)) for (const m of body.messages) if (m && typeof m.content === 'string') m.content = sanitizeUserInput(m.content).text
    if (body && typeof body.message === 'string') body.message = sanitizeUserInput(body.message).text
    const history: Msg[] = Array.isArray(body.messages) ? body.messages.slice(-10).map((m: Msg) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '').slice(0, 1000) })) : []
    const msgs: Msg[] = [{ role: 'system', content: SYSTEM }, ...history]
    const text =
      (await openai('https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY, 'llama-3.3-70b-versatile', msgs)) ??
      (await gemini(msgs)) ??
      (await openai('https://api.cerebras.ai/v1/chat/completions', process.env.CEREBRAS_API_KEY, 'llama3.1-8b', msgs))
    return NextResponse.json({ text: text ?? FALLBACK })
  } catch {
    return NextResponse.json({ text: FALLBACK })
  }
}
