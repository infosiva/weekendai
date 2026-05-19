import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

let _groq: Groq | null = null
function groq() { if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! }); return _groq }

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()
    const sysPrompt = system ?? 'You are WeekendAI — a weekend activity planner. Help users discover things to do, plan outings, find restaurants, events, and make the most of their weekend. Be fun and concise.'
    const res = await groq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: sysPrompt }, ...messages],
      max_tokens: 400,
    })
    return NextResponse.json({ text: res.choices[0]?.message?.content ?? 'Let me help plan your weekend!' })
  } catch {
    return NextResponse.json({ text: 'Tell me your city and I\'ll find weekend activities!' }, { status: 200 })
  }
}
