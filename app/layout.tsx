import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import DesignEffects from '@/components/DesignEffects'
import type { BrandConfig } from '@/components/SharedNavbar'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import BackToTop from '@/components/BackToTop'
import FeedbackWidget from '@/components/FeedbackWidget'
import { getSiteFlags } from '@/lib/flags'
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet } from '@/lib/theme-loader'

import { MotionProvider } from "@infosiva/shared-ui/modern";
const brand: BrandConfig = {
  name: 'WeekendAI',
  tagline: 'Your weekend, planned by AI — hidden gems, real costs, zero tourist traps.',
  icon: '🗓️',
  color: '#f97316',
  url: 'https://weekendai.app',
  navLinks: [],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getSiteFlags('weekendai')
  const theme = await loadSiteTheme('weekendai')
  const themeCss = buildThemeStyleTag(theme)
  const ga4 = buildGa4Snippet(theme)
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
                  crossOrigin="anonymous"
                  strategy="afterInteractive"
                />
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
        {ga4 && <script dangerouslySetInnerHTML={{ __html: ga4 }} />}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #f97316;
            --theme-secondary: #fdba74;
            --theme-base: #fffbf5;
            --background: #fffbf5;
            --surface-1: #fff5e9;
            --surface-2: #ffece0;
            --foreground: #1c1410;
            --text-2: #6b5d52;
            --border-default: rgba(249,115,22,0.15);
            --border-strong: rgba(249,115,22,0.3);
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; }
          h1, h2, h3 { font-family: 'Fraunces', serif !important; font-style: italic; }
          .glass { background: rgba(255,251,245,0.80) !important; border-color: rgba(249,115,22,0.12) !important; }
        ` }} />
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16"><MotionProvider>{children}</MotionProvider></main>
        <SharedFooter brand={brand} />
        {flags.chatbot && <FloatingChatWrapper />}
        <FeedbackWidget siteName="WeekendAI" />
        <BackToTop accentColor="#f97316" />
      </body>
    </html>
  )
}
