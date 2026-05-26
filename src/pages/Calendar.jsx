import PageHeader from '../components/PageHeader.jsx'

const week = [
  {
    day: 'Mon',
    date: '26',
    format: 'Reel + Short',
    angle: 'Speedrun proof',
    pattern: 'Result Claim',
    title: 'I built an AI agent in 9 minutes',
    goal: 'Reach',
    color: 'flame',
  },
  {
    day: 'Tue',
    date: '27',
    format: 'Carousel',
    angle: 'How-to playbook',
    pattern: 'Aspirational',
    title: '10 slides: the Claude Code playbook',
    goal: 'Saves',
    color: 'paper',
  },
  {
    day: 'Wed',
    date: '28',
    format: 'X Thread',
    angle: 'Contrarian take',
    pattern: 'Pain Point',
    title: 'Why 90% of agent tutorials are obsolete',
    goal: 'Engagement',
    color: 'paper',
  },
  {
    day: 'Thu',
    date: '29',
    format: 'Comparison Reel',
    angle: 'Old way vs new way',
    pattern: 'Curiosity Gap',
    title: 'Building agents in 2024 vs 2026',
    goal: 'Shares',
    color: 'paper',
  },
  {
    day: 'Fri',
    date: '30',
    format: 'Stories + LinkedIn',
    angle: 'Receipts / proof',
    pattern: 'Result Claim',
    title: '47 emails. 12 leads. 4 calls booked.',
    goal: 'Trust + DMs',
    color: 'paper',
  },
]

export default function Calendar() {
  return (
    <div className="rise">
      <PageHeader
        eyebrow="Calendar — Week 22"
        title="One topic."
        italic="Five hammers."
        kicker="By Friday, the niche thinks of you when they think of Claude Code agents."
      />

      {/* Day strip */}
      <section className="px-5">
        <div className="flex gap-2">
          {week.map((d, i) => (
            <div
              key={d.day}
              className={[
                'flex-1 rounded-xl border text-center py-3',
                i === 0
                  ? 'bg-flame border-flame text-ink'
                  : 'bg-ink-2 border-line text-paper',
              ].join(' ')}
            >
              <p
                className={[
                  'font-mono text-[9px] uppercase tracking-[0.25em]',
                  i === 0 ? 'text-ink/70' : 'text-mute',
                ].join(' ')}
              >
                {d.day}
              </p>
              <p className="font-display text-2xl leading-none mt-1">
                {d.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Day cards */}
      <section className="px-5 mt-6 space-y-3">
        {week.map((d, i) => (
          <article
            key={d.day}
            className="rise relative rounded-2xl border border-line bg-ink-2 p-4 overflow-hidden"
            style={{ animationDelay: `${100 + i * 70}ms` }}
          >
            {/* Diagonal accent */}
            <div
              className="absolute -right-8 -top-8 h-24 w-24 rotate-12 bg-flame/5 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-12 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute">
                  {d.day}
                </p>
                <p className="font-display text-3xl leading-none text-bone mt-1">
                  {d.date}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-flame">
                    {d.format}
                  </span>
                  <span className="font-mono text-[10px] text-mute">·</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70">
                    {d.angle}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-[20px] leading-[1.2] text-bone">
                  {d.title}
                </h3>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Pill>Hook · {d.pattern}</Pill>
                  <Pill tone="line">Goal · {d.goal}</Pill>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Footer summary */}
      <section className="px-5 mt-6">
        <div className="rounded-2xl border border-line bg-ink-3 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            Week summary
          </p>
          <p className="mt-2 font-display text-[22px] leading-tight text-bone">
            5 posts · 5 angles · 1 topic
          </p>
          <p className="mt-1 text-[12px] text-paper/70 leading-snug">
            Mon introduces. Tue proves. Wed picks a fight. Thu shows the
            contrast. Fri delivers the receipts.
          </p>
        </div>
      </section>

      <p className="px-5 mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        Calendar v1 · auto-built from pipeline output
      </p>
    </div>
  )
}

function Pill({ children, tone }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em]',
        tone === 'line'
          ? 'border border-line text-paper/80'
          : 'bg-flame/15 text-flame',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
