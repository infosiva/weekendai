# HANDOFF — weekendai warm orange theme redesign (§S)

**Date:** 2026-06-15  **Status:** IN PROGRESS
**Goal:** Redesign weekendai landing to warm white bg `#fffbf5` + orange accent `#ea580c` to differentiate from portfolio sites using `#060610` dark theme.

## Files to touch
- `app/globals.css` — `:root` vars (--background, --foreground, --theme-base, etc), aurora/grain dark-bg refs
- `app/layout.tsx` — inline `<style>` theme override block (currently injects dark `#0d0702` theme)
- `app/WeekendAIPage.tsx` — `T` theme constants object + inline `<style>` block (self-contained dark UI)
- `components/SharedNavbar.tsx` — white text / dark bg classes
- `components/SharedFooter.tsx` — white text classes
- `components/FloatingChatWrapper.tsx` — dark BG const + white text
- `components/ShareCard.tsx` — dark modal bg + white text
- `components/VoiceButton.tsx` — dark tooltip bg (minor)
- `components/BackToTop.tsx` — accentColor prop passed from layout (#f59e0b -> check)

## Steps
- [x] Read all files, map dark-theme refs
- [ ] Update globals.css :root vars to warm white theme
- [ ] Update layout.tsx inline theme override + aurora/grain
- [ ] Update WeekendAIPage.tsx T object + inline styles (bg, text, surfaces)
- [ ] Update SharedNavbar.tsx (white text -> dark text on light bg)
- [ ] Update SharedFooter.tsx (white text -> dark text)
- [ ] Update FloatingChatWrapper.tsx (dark panel -> light panel)
- [ ] Update ShareCard.tsx (dark modal -> light modal)
- [ ] npm run build (must pass)
- [ ] Playwright screenshots 375/1280
- [ ] Commit + push

## Success criteria
- bg #fffbf5, accent #ea580c, accent-2 warm complementary
- npm run build passes zero errors
- text readable (dark fg) on light bg throughout
- pushed to main

## Resume from here if interrupted
Starting edits now — globals.css first.

# DESIGN LOCK (2026-10-06)
- Archetype: weekend-lifestyle. Accent #f97316 on bg #fffbf5 (registered in design-system/tokens/palette-registry.json).
- Logo: sun-over-horizon mark + Weekend<AI accent> (app/icon.svg, apple-icon.tsx, components/Logo.tsx). app/icon.tsx renamed to icon.tsx.bak.
- Theme loader wired in layout (lib/theme-loader.ts). GA4 off until hub sets an ID.
- Removed: http:// tracker script, in-page duplicate nav, http:// stats fetch (route is now a stub), green accent tokens.
- Chat route: Groq -> Gemini -> Cerebras, always 200. Feedback route always ok.
- Build green. Screenshots 375/1280 of / read. Unverified: live AI itinerary generation, chat FAB overlap with feedback FAB (pre-existing).


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: lib/guard.ts present, NOT yet wired into routes; no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.


## ANIMATED SCOPE (gate items 19/21, derived from code 2026-10-07)
- Moves: AnimatedBg (ambient hero/background); CSS keyframes: badgeFloat, blink, borderSpin, drift-a, drift-b, drift-c, ds-float, ds-shift; transitions on interactive elements.
- Trigger: page load (ambient) and hover/press (interactive). Reduced motion: honoured via prefers-reduced-motion block.
- STATUS: scope documented from existing code only. Skill-stack passes (ui-ux-pro-max, emil-design-eng, impeccable critique, review-animations) and 375/1280 screenshot review are NOT yet run for this app. Item 21 stays OPEN until they are.
