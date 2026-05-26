# AI Content Creator

A mobile-first React app that runs the 4-agent AI content pipeline (Scraper → Validator → Script Writer → Hook Generator) for the AI tools and automation niche.

## Stack

- **Vite** + **React 18** + **React Router**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- Fonts: **Instrument Serif** (display), **DM Sans** (body), **JetBrains Mono** (data)

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/pipeline` | Pipeline | Topic input + the 4 agents queued up to run |
| `/script` | Script | Beat 1 → Beat 2 → Beat 3 → CTA structure |
| `/hooks` | Hooks | 5 hook variations with confidence scores + recommended pick |
| `/calendar` | Calendar | 5-post weekly content plan, one topic / five angles |

Navigation is a sticky bottom tab bar. The frame is capped at **390px** wide and centered on desktop, mobile-first.

## Design Direction

Editorial-brutalist. Deep ink black (`#0a0a0a`) with a single hot-orange accent (`#FF5A1F`). Display serif for emotional weight, mono for data and labels, clean sans for body. Subtle film-grain overlay and a top marquee strip for ambient texture.

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
