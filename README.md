# AI Content Creator

A mobile-first React app that runs a 4-agent AI content pipeline (Scraper → Validator → Script Writer → Hook Generator) for the AI tools and automation niche, powered by **NVIDIA NIM** (Llama 4 Maverick).

## Stack

- **Vite 5** + **React 18** + **React Router 6**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **NVIDIA NIM API** — `meta/llama-4-maverick-17b-128e-instruct`
  - OpenAI-compatible chat completions at `https://integrate.api.nvidia.com/v1/chat/completions`
- Fonts: **DM Sans** (body/display) + **JetBrains Mono** (small meta)

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/pipeline` | Pipeline | Topic input + 4 agent cards + Run button |
| `/script` | Script | Beat 1 / 2 / 3 / CTA cards + Copy full script |
| `/hooks` | Hooks | 5 hook variations with confidence bars + recommended pick |
| `/calendar` | Calendar | 5-day week, tap-to-expand, Generate next week |

Mobile-first phone frame, capped at **390px** wide and centered on desktop. Floating bottom tab bar with a purple active indicator on a looping GIF + dark-glass card aesthetic.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and paste your NVIDIA API key (starts with nvapi-)
npm run dev
```

Get a key from [NVIDIA Build](https://build.nvidia.com/explore/discover).

If no key is set, the app automatically defaults to **Mock mode** so the UI is fully usable without an API key.

## Build

```bash
npm run build
npm run preview
```

## How the pipeline works

1. User types a topic on the Pipeline tab and hits **Run full pipeline**.
2. The four agent cards animate through `Ready → Running → Done` while the API call is in flight.
3. The app sends the topic + a fixed system prompt to NVIDIA NIM with `model: meta/llama-4-maverick-17b-128e-instruct`.
4. The model returns a single JSON object containing the validated topic, script, hooks, calendar, and recommended-hook index.
5. The result is stored in React Context and persisted to `localStorage` so it survives a refresh.
6. The Script, Hooks, and Calendar tabs read from the same shared state.
7. A toast slides up: **"Pipeline done!"**

## Mock vs Live mode

The Settings sheet (gear icon, top right) lets you toggle between two modes:

- **Live** — calls NVIDIA NIM with your API key. Real generations.
- **Mock** — returns canned demo data after a 3.6s simulated cascade. No API call, no token cost. Useful for UI dev, demos, or running the app without a key.

Default behavior:
- If `VITE_NVIDIA_API_KEY` is present → defaults to **Live**
- If it's missing → defaults to **Mock** (so the app never appears broken)
- Once the user toggles, their preference is saved to `localStorage`

## ⚠️ Security note on the API key

`VITE_NVIDIA_API_KEY` is a Vite client-side environment variable. **It will be bundled into the JS sent to the browser.** That is fine for local dev, but if you host this app publicly, anyone can extract the key.

For production, replace the direct `fetch` in `src/context/PipelineContext.jsx` with a call to your own backend (a one-file Vercel / Cloudflare Worker / Lambda function works perfectly). The backend keeps the key in a server-side env var and forwards the request to NVIDIA.

## Project structure

```
Ai-Content-Creator/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── public/
│   ├── bg.gif                    # Looping background GIF (inside the phone frame)
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                 # Tailwind v4 + @theme tokens + animations
    ├── context/
    │   └── PipelineContext.jsx   # Shared state, NVIDIA NIM API call, persistence
    ├── data/
    │   └── mockResult.js         # Canned data for Mock mode
    ├── components/
    │   ├── AppShell.jsx          # 390px frame, GIF bg, header, tab bar, toast slot
    │   ├── TabBar.jsx            # 4 tabs with inline SVG icons
    │   ├── PageHeader.jsx        # Reusable eyebrow + title
    │   ├── Toast.jsx             # Auto-dismissing toast
    │   ├── EmptyState.jsx        # "Run pipeline first" component
    │   └── SettingsSheet.jsx     # Bottom sheet with Live/Mock toggle
    └── pages/
        ├── Pipeline.jsx
        ├── Script.jsx
        ├── Hooks.jsx
        └── Calendar.jsx
```
