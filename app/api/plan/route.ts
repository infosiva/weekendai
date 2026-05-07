/**
 * POST /api/plan
 * Body: { city, budget, vibe, people, date, extras }
 * Returns: WeekendPlan with activities, food, nightlife, tips
 */
import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export const maxDuration = 60

export interface Activity {
  time:        string   // e.g. "10:00 AM"
  title:       string
  description: string
  cost:        string   // e.g. "Free" or "£12/person"
  type:        'outdoor' | 'indoor' | 'food' | 'nightlife' | 'culture' | 'sport'
  bookingUrl?: string   // affiliate / real URL if known
  tip:         string   // insider tip
}

export interface WeekendPlan {
  title:       string
  city:        string
  vibe:        string
  weather:     string  // assumed or typical for season
  saturday:    Activity[]
  sunday:      Activity[]
  budgetBreakdown: { category: string; estimate: string }[]
  localTips:   string[]
  alternatives: string[]  // if plans don't suit, quick alternatives
}

const SYSTEM = `You are a brilliant local city guide with insider knowledge everywhere in the world.
You create specific, actionable weekend plans with REAL place names, real addresses, real costs.
Never generic. Always specific. Include hidden gems locals love.
Respond with valid JSON only.`

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { city, budget, vibe, people, date, extras } = body as {
    city:    string
    budget:  string
    vibe:    string
    people:  string
    date:    string
    extras?: string
  }

  if (!city || !vibe) {
    return NextResponse.json({ error: 'City and vibe required' }, { status: 400 })
  }

  const weekend = date || 'this weekend'

  const prompt = `Plan a weekend in ${city} for ${weekend}.
Group: ${people || '2 adults'}
Budget: ${budget || 'moderate (£50-100/person/day)'}
Vibe: ${vibe}
${extras ? `Special requests: ${extras}` : ''}

Create a detailed 2-day plan. Use REAL place names in ${city}. Real costs. Specific opening times.
Include hidden local gems not just tourist spots.

Return this exact JSON:
{
  "title": "catchy weekend plan title",
  "city": "${city}",
  "vibe": "${vibe}",
  "weather": "typical weather for this city/season",
  "saturday": [
    {
      "time": "9:00 AM",
      "title": "Specific Place Name",
      "description": "what you do there, why it's great",
      "cost": "£X per person or Free",
      "type": "outdoor|indoor|food|nightlife|culture|sport",
      "bookingUrl": "real URL if bookable or null",
      "tip": "insider tip locals know"
    }
  ],
  "sunday": [ ...same format, 4-5 activities... ],
  "budgetBreakdown": [
    { "category": "Food & drink", "estimate": "£40-60" },
    { "category": "Activities", "estimate": "£20-30" },
    { "category": "Transport", "estimate": "£15" }
  ],
  "localTips": ["3-4 insider tips for ${city}"],
  "alternatives": ["2-3 quick alternatives if main plan doesn't suit"]
}`

  try {
    const { text } = await callAI(SYSTEM, [{ role: 'user', content: prompt }], 2000, 'best')
    const clean = text.replace(/```json\n?|```\n?/g, '').trim()
    const plan: WeekendPlan = JSON.parse(clean)
    return NextResponse.json(plan)
  } catch (e: any) {
    console.error('[plan]', e.message)
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
  }
}
