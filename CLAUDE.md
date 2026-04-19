# Asia Trip App — CLAUDE.md

## What This Is

A personal travel planning web app for an Asia trip (May 18 – June 7, 2026, 20 days, 5 cities). It is a **static, no-build, single-page app** — no npm, no bundler, no server. Open the HTML files directly in a browser.

## Trip Overview

- **Route**: Warsaw (WAW) → Hong Kong → Seoul → Shanghai → Xi'an → Beijing → Warsaw
- **Outbound**: Etihad EY160 + EY870, May 18 depart 11:50, arrive HKG May 19 09:00
- **Return**: depart Beijing June 6, arrive Warsaw June 7

| City | Dates | Nights |
|------|-------|--------|
| 🇭🇰 Hong Kong | May 19–22 | 4 |
| 🇰🇷 Seoul | May 23–27 | 5 |
| 🇨🇳 Shanghai | May 28–30 | 3 |
| 🏛️ Xi'an | May 30 – Jun 1 | 2 |
| 🏯 Beijing | Jun 2–6 | 5 |

## File Structure

```
index.html               — Main app (SPA, ~2000+ lines)
flight details.html      — Standalone flight details page
accommodation details.html — Standalone accommodation details page
city details.html        — Standalone city details page
tailwind.config.js       — Shared Tailwind config (loaded by all HTML files after CDN script)
day-plans/               — Source .txt files with day itinerary content
  HongKong.day-plan.1.txt … (4 files)
  Seoul.day-plan.1.txt … (5 files)
  Shanghai.day-plan.1.txt … (4 files)
  Xi'an.day-plan.1.txt … (2 files)
  Beijing.day-plan.1.txt … (5 files)
Claude Asia 2026.xlsx    — Source spreadsheet with trip data
```

## Tech Stack

- **Pure HTML/CSS/JS** — no framework, no build step
- **Tailwind CSS** via CDN: `https://cdn.tailwindcss.com?plugins=forms,container-queries`
- **Shared Tailwind config**: `tailwind.config.js` — loaded with `<script src="tailwind.config.js"></script>` after the CDN script in every HTML file
- **Google Fonts**: Plus Jakarta Sans (headlines), Inter (body/labels)
- **Material Symbols Outlined** (Google icon font)
- **Dark mode**: `darkMode: "class"` on `<html>` element

## Design System

Material Design 3 color tokens, configured in each file's inline `tailwind.config`. Primary color is `#24657e` (teal/blue).

Key color tokens:
- `primary` / `on-primary`
- `surface` / `on-surface` / `surface-container` / `surface-container-lowest` / `surface-container-low` / `surface-container-high`
- `secondary` / `on-secondary`
- `outline` / `outline-variant`

Font families:
- `font-headline` → Plus Jakarta Sans
- `font-body` / `font-label` → Inter

Border radius scale: DEFAULT=0.25rem, lg=0.5rem, xl=0.75rem, 2xl=1rem, 3xl=1.5rem

## Key UI Patterns in index.html

### Layout
- Fixed header (top-0, h-16) with trip title
- Fixed city tab bar (top-16) — horizontal scrollable pills
- Main content starts at `pt-32`

### City Switching
```js
switchCity(cityKey)  // 'hk' | 'seoul' | 'shanghai' | 'xian' | 'beijing'
```
Shows/hides `.city-panel` divs; toggles active state on `.city-tab` buttons.

### Day Switching
```js
switchDay(cityKey, dayNumber)
```
Shows/hides `.day-panel` divs within a city; toggles active state on `.day-tab` buttons.

### Bottom Drawer
```js
openDrawer(html)   // injects HTML into #drawer-content and animates in
closeDrawer()      // animates out, clears content
```
- Overlay: `#drawer-overlay` (z-60)
- Drawer: `#drawer` (z-70, slides up from bottom, max-h-[92dvh])
- Touch swipe-down to close is wired up

### Hotel Drawer
```js
showHotel(cityKey)  // builds hotel detail HTML and calls openDrawer()
```

### Flight Drawer
```js
showFlight(flightKey)
// flightKey: 'outbound' | 'hk_seoul' | 'seoul_shanghai' | 'shanghai_xian' | 'xian_beijing' | 'return'
```

### Weather Widget
```js
renderWeather(cityKey)  // returns HTML string injected into #weather-{cityKey}
```
Weather data is hardcoded historical forecast data per city.

## Style Conventions

- Use Tailwind utility classes exclusively — no custom CSS except the small global `<style>` block
- Interactive cards: `active:scale-[0.98] transition-transform` or `active:scale-95`
- Card containers: `rounded-3xl` with `shadow-sm` and `border border-surface-container`
- Section headings: `font-headline font-bold`
- Stat labels: `text-[10px] font-bold tracking-widest uppercase`
- Timeline dots: `w-2.5 h-2.5 rounded-full bg-primary`
- Timeline line: `w-px bg-surface-container-high` positioned absolute

## Important Notes

- **All itinerary content is already embedded** in index.html — the `day-plans/*.txt` files are source material used during development, not loaded at runtime.
- The Tailwind config lives in `tailwind.config.js` — edit it once and all pages pick up the change.
- No external API calls at runtime (weather data is static/hardcoded).
- The `city details.html`, `accommodation details.html`, and `flight details.html` files are **separate standalone pages**, not modals — they have their own full Tailwind config.
