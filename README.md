# AI Content Creator

A mobile-first React app that runs a 4-agent AI content pipeline (Scraper → Validator → Script Writer → Hook Generator) for the AI tools and automation niche, powered by **NVIDIA NIM** (Llama 4 Maverick).

## Stack

- **Vite 5** + **React 18** + **React Router 6**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **NVIDIA NIM API** — `meta/llama-4-maverick-17b-128e-instruct`
  - Reached via a Vercel serverless proxy at `api/nvidia.js`
- Fonts: **DM Sans** (body/display) + **JetBrains Mono** (small meta)

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/pipeline` | Pipeline | Topic input + 4 agent cards + Run button |
| `/script` | Script | Beat 1 / 2 / 3 / CTA cards + Copy full script |
| `/hooks` | Hooks | 5 hook variations with confidence bars + recommended pick |
| `/calendar` | Calendar | 5-day week, tap-to-expand, Generate next week |

Mobile-first phone frame, capped at **390px** wide and centered on desktop. Floating bottom tab bar with a purple active indicator on a looping GIF + dark-glass card aesthetic.

## How the request flow works

```
Browser ──► /api/nvidia (Vercel serverless function, same origin)
                │
                │  attaches Authorization: Bearer ${NVIDIA_API_KEY}
                ▼
            https://integrate.api.nvidia.com/v1/chat/completions
                │
                ▼
            JSON response back through the proxy to the browser
```

This avoids two problems:
1. **CORS** — NVIDIA NIM doesn't allow direct browser calls. The proxy is same-origin, so the browser is happy.
2. **Key exposure** — the API key lives only in the serverless function's environment, never in the client JS bundle.

## Setup

### Local dev (recommended path: `vercel dev`)

```bash
npm install
npm install -g vercel              # one-time
cp .env.example .env.local
# Edit .env.local and paste your NVIDIA key (starts with nvapi-)
vercel dev
```

`vercel dev` runs the Vite frontend AND the `/api/nvidia` serverless function on the same port, so Live mode works locally. Plain `npm run dev` only runs Vite — Live mode will 404 because the proxy isn't there.

If you don't want to install the Vercel CLI, `npm run dev` still works with **Mock mode** — just toggle it in Settings.

### Deploy to Vercel

1. Push your branch to GitHub.
2. On Vercel, add a Project Environment Variable:
   - **Key:** `NVIDIA_API_KEY` (no `VITE_` prefix — this is server-side)
   - **Value:** `nvapi-...` (your key)
   - **Environments:** Production, Preview, Development
3. Redeploy.

Get a key from [NVIDIA Build](https://build.nvidia.com/explore/discover).

## Build

```bash
npm run build
npm run preview
```

## Mock vs Live mode

The Settings sheet (gear icon, top right) lets you toggle between two modes:

- **Live** — POSTs to `/api/nvidia` which calls NVIDIA NIM with your server-side key. Real generations.
- **Mock** — returns canned demo data after a 3.6s simulated cascade. No API call, no token cost. Useful for UI dev, demos, or running the app without setting up the proxy.

Default behavior:
- New users default to **Live** (the proxy is the standard production path).
- If Live fails (proxy not configured, key missing on Vercel, NVIDIA upstream error), the toast shows the exact error so you can debug.
- Once the user toggles, their preference is saved to `localStorage`.

## Project structure

```
Ai-Content-Creator/
├── api/
│   └── nvidia.js                 # Vercel serverless proxy → NVIDIA NIM
├── index.html
├── package.json
├── vite.config.js
├── .env.example                  # NVIDIA_API_KEY (server-side)
├── public/
│   ├── bg.gif                    # Looping background GIF
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                 # Tailwind v4 + @theme tokens + animations
    ├── context/
    │   └── PipelineContext.jsx   # Shared state, /api/nvidia call, persistence
    ├── data/
    │   └── mockResult.js         # Canned data for Mock mode
    ├── components/
    │   ├── AppShell.jsx          # 390px frame, GIF bg, header, tab bar
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
