# AI Content Creator

A mobile-first React app that runs a 4-agent AI content pipeline (Scraper → Validator → Script Writer → Hook Generator) for the AI tools and automation niche, powered by the Claude API.

## Stack

- **Vite 5** + **React 18** + **React Router 6**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **Anthropic Messages API** — `claude-sonnet-4-20250514`
- Fonts: **DM Sans** (body/display) + **JetBrains Mono** (small meta)

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/pipeline` | Pipeline | Topic input + 4 agent cards + Run button |
| `/script` | Script | Beat 1 / 2 / 3 / CTA cards + Copy full script |
| `/hooks` | Hooks | 5 hook variations with confidence bars + recommended pick |
| `/calendar` | Calendar | 5-day week, tap-to-expand, Generate next week |

Mobile-first phone frame, capped at **390px** wide and centered on desktop. Floating bottom tab bar with a purple active indicator.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and paste your Anthropic API key
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## How the pipeline works

1. User types a topic on the Pipeline tab and hits **Run full pipeline**.
2. The four agent cards animate through `Ready → Running → Done` while the API call is in flight.
3. The app sends the topic + a fixed system prompt to Claude with `model: claude-sonnet-4-20250514`.
4. Claude returns a single JSON object containing the validated topic, script, hooks, calendar, and recommended-hook index.
5. The result is stored in React Context and persisted to `localStorage` so it survives a refresh.
6. The Script, Hooks, and Calendar tabs read from the same shared state.
7. A toast slides up: **"Pipeline done!"**

## ⚠️ Security note on the API key

`VITE_ANTHROPIC_API_KEY` is a Vite client-side environment variable. **It will be bundled into the JS sent to the browser.** That is fine for local dev, but if you host this app publicly, anyone can extract the key.

For production, replace the direct `fetch` in `src/context/PipelineContext.jsx` with a call to your own backend (a one-file Vercel / Cloudflare Worker / Lambda function works perfectly). The backend keeps the key in a server-side env var and forwards the request to Anthropic.

## Project structure

```
Ai-Content-Creator/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                 # Tailwind v4 + @theme tokens + animations
    ├── context/
    │   └── PipelineContext.jsx   # Shared state, Claude API call, persistence
    ├── components/
    │   ├── AppShell.jsx          # 390px frame, header, tab bar, toast slot
    │   ├── TabBar.jsx            # 4 tabs with inline SVG icons
    │   ├── PageHeader.jsx        # Reusable eyebrow + title
    │   ├── Toast.jsx             # Auto-dismissing toast
    │   └── EmptyState.jsx        # "Run pipeline first" component
    └── pages/
        ├── Pipeline.jsx
        ├── Script.jsx
        ├── Hooks.jsx
        └── Calendar.jsx
```
