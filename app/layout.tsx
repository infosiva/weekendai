import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import DesignEffects from '@/components/DesignEffects'
import type { BrandConfig } from '@/components/SharedNavbar'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import BackToTop from '@/components/BackToTop'

const brand: BrandConfig = {
  name: 'WeekendAI',
  tagline: 'AI plans your perfect weekend — real places, real costs, no tourist traps.',
  icon: '🗓️',
  color: '#f59e0b',
  url: 'https://weekendai.app',
  navLinks: [
    { label: 'How it works', href: '#how' },
    { label: 'Cities', href: '#cities' },
  ],
  cta: { label: 'Plan my weekend →', href: '/' },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://weekendai.app'),
  title: 'WeekendAI — What should I do this weekend? AI Weekend Planner',
  description: 'Tell us your city, budget and vibe. AI plans your perfect weekend with real local events, restaurants and activities — no tourist traps. Hidden gems, accurate costs.',
  keywords: ['weekend planner', 'AI travel planner', 'things to do this weekend', 'city guide', 'weekend activities', 'local events', 'hidden gems'],
  authors: [{ name: 'WeekendAI' }],
  openGraph: {
    title: 'WeekendAI — What should I do this weekend?',
    description: 'AI plans your perfect weekend with real local places, costs, and hidden gems.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeekendAI',
    url: 'https://weekendai.app',
    images: [{
      url: 'https://weekendai.app/og.png',
      width: 1200,
      height: 630,
      alt: 'WeekendAI - AI Weekend Planner'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeekendAI — What should I do this weekend?',
    description: 'AI plans your perfect weekend with real local places and hidden gems.',
    images: ['https://weekendai.app/og.png']
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
                "url": "https://weekendai.app",
                "description": "AI-powered weekend planner with real local places, costs and hidden gems.",
                "applicationCategory": "TravelApplication",
                "operatingSystem": "Web",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
              },
              {
                "@type": "WebSite",
                "name": "WeekendAI",
                "url": "https://weekendai.app",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://weekendai.app/?city={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          })}}
        />
      
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #ea580c;
            --theme-secondary: #f59e0b;
            --theme-base: #0d0702;
            --background: #0d0702;
            --surface-1: #1c1004;
            --surface-2: #2a1a07;
            --foreground: #fff7ed;
            --text-2: #fed7aa;
            --border-default: rgba(234,88,12,0.15);
            --border-strong: rgba(234,88,12,0.3);
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; }
          h1, h2, h3 { font-family: 'Fraunces', serif !important; font-style: italic; }
          .glass { background: rgba(13,7,2,0.72) !important; border-color: rgba(234,88,12,0.12) !important; }
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <FloatingChatWrapper />
        <BackToTop accentColor="#f59e0b" />
      </body>
    </html>
  )
}
