import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

const hooks = [
  {
    n: 1,
    pattern: 'Aspirational',
    text: 'This is what building an AI agent should look like in 2026.',
    score: 7,
    why: 'Positions the viewer as ahead-of-the-curve — what this niche craves.',
  },
  {
    n: 2,
    pattern: 'Pain Point',
    text:
      'If your AI agent is taking longer than 10 minutes to build, you’re using the wrong tool.',
    score: 8,
    why: 'Every dev has felt the framework grind. Instant gut-punch.',
  },
  {
    n: 3,
    pattern: 'Exclusivity',
    text:
      'Most devs building AI agents don’t know Claude Code already does the hard part.',
    score: 8,
    why: '“Most don’t know” triggers the desire to be early.',
  },
  {
    n: 4,
    pattern: 'Result Claim',
    text:
      'I built a working AI agent in 9 minutes with Claude Code. No frameworks. No tutorials.',
    score: 9,
    why: 'Specific number + specific result + kills two objections in one line.',
    recommended: true,
  },
  {
    n: 5,
    pattern: 'Curiosity Gap',
    text:
      'There’s one Claude Code command that makes every AI agent tutorial obsolete.',
    score: 8.5,
    why: 'Forces the watch — they can’t guess the command without seeing more.',
  },
]

export default function Hooks() {
  const [selected, setSelected] = useState(4)
  const recommended = hooks.find((h) => h.recommended)

  return (
    <div className="rise">
      <PageHeader
        eyebrow="04 — Hook Generator"
        title="Five tries."
        italic="One winner."
        kicker="Pick the one that hits hardest in 4 seconds or less."
      />

      {/* Recommended banner */}
      <section className="px-5">
        <div className="rounded-2xl border border-flame/60 bg-flame/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-flame">
              ★ Recommended
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-flame">
              {recommended.score}/10
            </span>
          </div>
          <p className="font-display text-[20px] leading-snug text-bone">
            “{recommended.text}”
          </p>
          <p className="mt-2 text-[12px] leading-snug text-paper/70">
            {recommended.why}
          </p>
        </div>
      </section>

      {/* All hooks */}
      <section className="px-5 mt-6 space-y-2">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute mb-3">
          All five variations
        </h2>
        {hooks.map((h, i) => {
          const active = selected === h.n
          return (
            <button
              key={h.n}
              type="button"
              onClick={() => setSelected(h.n)}
              className={[
                'rise w-full text-left rounded-2xl border p-4 transition-colors',
                active
                  ? 'border-flame bg-ink-3'
                  : 'border-line bg-ink-2 hover:border-paper/30',
              ].join(' ')}
              style={{ animationDelay: `${100 + i * 70}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl leading-none text-flame w-7 shrink-0">
                  {h.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute flex-1">
                  {h.pattern}
                </span>
                <Score value={h.score} />
              </div>
              <p className="mt-3 font-display text-[19px] leading-[1.25] text-bone">
                “{h.text}”
              </p>
              {active && (
                <p className="mt-2 text-[12px] leading-snug text-paper/70 border-t border-line pt-2">
                  <span className="font-mono uppercase tracking-[0.2em] text-flame text-[9px] mr-1">
                    Why
                  </span>
                  {h.why}
                </p>
              )}
            </button>
          )
        })}
      </section>

      <p className="px-5 mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        Rules · max 2 lines · speakable in &lt; 4s · plain english
      </p>
    </div>
  )
}

function Score({ value }) {
  const v = Number(value)
  const pct = Math.min(100, Math.max(0, (v / 10) * 100))
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 rounded-full bg-line overflow-hidden">
        <div
          className="h-full bg-flame"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-paper/80">
        {v.toFixed(1)}
      </span>
    </div>
  )
}
