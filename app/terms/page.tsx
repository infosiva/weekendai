export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px', fontFamily: 'system-ui', lineHeight: 1.7, color: '#1a1a1a' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>Last updated: June 2026</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Using WeekendAI</h2>
      <p>WeekendAI generates weekend plans and itineraries using AI. Suggestions are informational — always confirm hours, availability, and pricing directly with venues before you go.</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Your account</h2>
      <p>You're responsible for keeping your login details secure and for activity under your account. Don't use WeekendAI for anything illegal or to abuse the service (scraping, spamming the AI endpoints, etc).</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>No guarantees</h2>
      <p>WeekendAI is provided "as is." We don't guarantee that AI-generated plans are accurate, complete, or available at all times.</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Changes</h2>
      <p>We may update these terms as the product evolves. Continued use after changes means you accept the updated terms.</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32 }}>Contact</h2>
      <p>Questions? Email <a href="mailto:hello@weekendai.app" style={{ color: '#2563eb' }}>hello@weekendai.app</a></p>
    </main>
  )
}
