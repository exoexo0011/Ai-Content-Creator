import PageHeader from '../components/PageHeader.jsx'

const beats = [
  {
    label: 'Beat 1',
    role: 'Problem',
    lines: [
      'Everyone keeps telling you building AI agents takes weeks.',
      'That you need LangChain, vector DBs, a CS degree.',
      'It’s a lie.',
    ],
  },
  {
    label: 'Beat 2',
    role: 'Insight',
    lines: [
      'Claude Code does 90% of the work for you.',
      'You describe what you want in plain English. It writes the code, runs it, fixes it.',
      'You barely touch the keyboard.',
    ],
  },
  {
    label: 'Beat 3',
    role: 'Proof',
    lines: [
      'I just built one that scans my inbox and replies to leads in my voice.',
      'Took 9 minutes. From empty folder to running agent.',
      'It’s answering DMs while I sleep.',
    ],
  },
]

const cta = 'Want the exact prompt I used? Comment AGENT and I’ll DM it to you.'

export default function Script() {
  const wordCount =
    beats.reduce((acc, b) => acc + b.lines.join(' ').split(/\s+/).length, 0) +
    cta.split(/\s+/).length

  const seconds = Math.round((wordCount / 150) * 60)

  return (
    <div className="rise">
      <PageHeader
        eyebrow="03 — Script Writer"
        title="The 9-minute"
        italic="agent."
        kicker="Beat-by-beat. Spoken, not written. The hook lives on the next page."
      />

      {/* Meta strip */}
      <section className="px-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag>Reel · 30s</Tag>
          <Tag>{wordCount} words</Tag>
          <Tag>~{seconds}s spoken</Tag>
          <Tag tone="flame">No hook</Tag>
        </div>
      </section>

      {/* Beats */}
      <section className="px-5 mt-6 space-y-4">
        {beats.map((b, i) => (
          <article
            key={b.label}
            className="rise relative rounded-2xl border border-line bg-ink-2 overflow-hidden"
            style={{ animationDelay: `${100 + i * 90}ms` }}
          >
            {/* Side rail */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-flame/80" aria-hidden="true" />
            <header className="flex items-baseline justify-between px-5 pt-4 pb-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
                {b.label}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                {b.role}
              </span>
            </header>
            <div className="px-5 pb-5 space-y-2">
              {b.lines.map((line, j) => (
                <p
                  key={j}
                  className="font-display text-[20px] leading-[1.25] text-bone"
                >
                  {line}
                </p>
              ))}
            </div>
          </article>
        ))}

        {/* CTA */}
        <article className="rise relative rounded-2xl bg-flame text-ink p-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.28em]">
            CTA · Comment Trigger
          </h3>
          <p className="font-display text-[22px] leading-[1.2] mt-2">{cta}</p>
        </article>
      </section>

      {/* Action row */}
      <section className="px-5 mt-6 flex items-center gap-2">
        <button className="flex-1 rounded-full border border-line bg-ink-2 py-3 text-bone font-mono text-[11px] uppercase tracking-[0.22em] hover:border-flame/50 transition">
          Copy script
        </button>
        <button className="flex-1 rounded-full bg-bone text-ink py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-paper transition">
          Send to teleprompter
        </button>
      </section>

      <p className="px-5 mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        Script rule · 2-3 lines per beat · spoken voice only
      </p>
    </div>
  )
}

function Tag({ children, tone }) {
  const flame = tone === 'flame'
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]',
        flame
          ? 'bg-flame text-ink'
          : 'bg-ink-2 text-paper/80 border border-line',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
