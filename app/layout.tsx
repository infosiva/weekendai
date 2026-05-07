import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import type { BrandConfig } from '@/components/SharedNavbar'

export const brand: BrandConfig = {
  name: 'WeekendAI',
  tagline: 'AI plans your perfect weekend — real places, real costs, no tourist traps.',
  icon: '🗓️',
  color: '#f59e0b',
  url: 'https://weekendai.vercel.app',
  navLinks: [
    { label: 'How it works', href: '#how' },
    { label: 'Cities', href: '#cities' },
  ],
  cta: { label: 'Plan my weekend →', href: '/' },
}

export const metadata: Metadata = {
  title: 'WeekendAI — What should I do this weekend?',
  description: 'Tell us your city, budget and vibe. AI plans your perfect weekend with real local events, restaurants and activities — not tourist traps.',
  keywords: ['weekend planner', 'AI travel', 'things to do', 'city guide', 'weekend activities'],
  openGraph: {
    title: 'WeekendAI — What should I do this weekend?',
    description: 'AI plans your perfect weekend with real local places and hidden gems.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeekendAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeekendAI — What should I do this weekend?',
    description: 'AI plans your perfect weekend with real local places and hidden gems.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "WeekendAI",
                "url": brand.url,
                "description": "AI-powered weekend planner with real local places, costs and hidden gems.",
                "applicationCategory": "TravelApplication",
                "operatingSystem": "Web",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
              },
              {
                "@type": "WebSite",
                "name": "WeekendAI",
                "url": brand.url,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${brand.url}/?city={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          })}}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
      </body>
    </html>
  )
}
