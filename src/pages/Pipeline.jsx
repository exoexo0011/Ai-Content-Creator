import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

const agents = [
  {
    no: '01',
    name: 'Scraper',
    desc: 'Pulls viral posts from Reels, Shorts & X. Last 7 days, sorted by views.',
    eta: '~30s',
  },
  {
    no: '02',
    name: 'Validator',
    desc: 'Scores every post out of 100. Removes weak content. Clusters by topic.',
    eta: '~10s',
  },
  {
    no: '03',
    name: 'Script Writer',
    desc: 'Beat 1 → Beat 2 → Beat 3 → CTA. Written to be spoken, not read.',
    eta: '~15s',
  },
  {
    no: '04',
    name: 'Hook Generator',
    desc: '5 hooks. 5 patterns. Confidence scored. Recommended one flagged.',
    eta: '~8s',
  },
]

export default function Pipeline() {
  const [topic, setTopic] = useState(
    'How to build an AI agent with Claude Code in under 10 minutes',
  )
  const [running, setRunning] = useState(false)

  return (
    <div className="rise">
      <PageHeader
        eyebrow="01 — Pipeline"
        title="Run the"
        italic="full stack."
        kicker="Four agents. One topic. Camera-ready script in under a minute."
      />

      {/* Topic input */}
      <section className="px-5 mt-2">
        <label
          htmlFor="topic"
          className="block font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-2"
        >
          Today&apos;s topic
        </label>
        <div className="rounded-xl bg-ink-2 border border-line focus-within:border-flame/60 transition-colors">
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent p-4 text-[15px] leading-snug font-display text-bone placeholder:text-mute focus:outline-none"
            placeholder="What are we building today?"
          />
          <div className="flex items-center justify-between px-4 pb-3 -mt-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              {topic.length} chars
            </span>
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-ink font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-flame-soft active:translate-y-px transition"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              Run pipeline
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="-mr-1">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-5 mt-6">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Top topic" value="Claude Code" sub="speedruns" />
          <Stat label="Avg views" value="285K" sub="this week" />
          <Stat label="Viral ER" value="7.2%" sub="cluster avg" highlight />
        </div>
      </section>

      {/* Agents list */}
      <section className="px-5 mt-7">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            Agents
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            {running ? 'running…' : 'idle'}
          </span>
        </div>
        <ul className="space-y-2">
          {agents.map((a, i) => (
            <li
              key={a.no}
              className="rise relative flex items-start gap-4 rounded-xl border border-line bg-ink-2 p-4 hover:border-flame/40 transition-colors"
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              <div className="font-display text-3xl leading-none text-flame w-10 shrink-0">
                {a.no}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight text-bone">
                    {a.name}
                  </h3>
                  <span className="font-mono text-[10px] text-mute uppercase tracking-[0.18em]">
                    {a.eta}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-paper/70">
                  {a.desc}
                </p>
              </div>
              <div className="absolute right-3 top-3">
                <span
                  className={[
                    'block h-1.5 w-1.5 rounded-full',
                    running ? 'bg-flame pulse-dot' : 'bg-line',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Footnote */}
      <p className="px-5 mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        Pipeline v1 · niche locked: ai tools
      </p>
    </div>
  )
}

function Stat({ label, value, sub, highlight }) {
  return (
    <div
      className={[
        'rounded-xl border p-3',
        highlight
          ? 'bg-flame text-ink border-flame'
          : 'bg-ink-2 border-line text-bone',
      ].join(' ')}
    >
      <p
        className={[
          'font-mono text-[9px] uppercase tracking-[0.22em]',
          highlight ? 'text-ink/70' : 'text-mute',
        ].join(' ')}
      >
        {label}
      </p>
      <p className="font-display text-2xl leading-tight mt-1">{value}</p>
      <p
        className={[
          'font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5',
          highlight ? 'text-ink/70' : 'text-mute',
        ].join(' ')}
      >
        {sub}
      </p>
    </div>
  )
}
