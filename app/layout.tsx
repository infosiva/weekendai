import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Weekend AI — What should I do this weekend?',
  description: 'Tell us your city, budget and vibe. AI plans your perfect weekend with real local events, restaurants and activities.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
