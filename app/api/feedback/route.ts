import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { vote, text, page, ts } = await req.json()
    console.log('[feedback]', { vote, text: String(text ?? '').slice(0, 500), page, ts })
    const tok = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID
    if (tok && chat) {
      await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text: `WeekendAI feedback (${vote ?? '-'}): ${String(text ?? '').slice(0, 500)}` }),
      }).catch(() => {})
    }
  } catch { /* never fail the visitor */ }
  return NextResponse.json({ ok: true })
}
