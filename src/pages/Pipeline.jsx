import PageHeader from '../components/PageHeader.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

const agents = [
  {
    key: 'scraper',
    no: '01',
    name: 'Content Scraper',
    desc: 'Instagram, YouTube, Twitter',
    Icon: SearchIcon,
  },
  {
    key: 'validator',
    no: '02',
    name: 'Validator',
    desc: 'Scores + clusters topics',
    Icon: ChartIcon,
  },
  {
    key: 'script',
    no: '03',
    name: 'Script Writer',
    desc: 'Beat 1 + 2 + 3 + CTA',
    Icon: EditIcon,
  },
  {
    key: 'hooks',
    no: '04',
    name: 'Hook Generator',
    desc: '5 hooks + confidence scores',
    Icon: BoltIcon,
  },
]

export default function Pipeline() {
  const { topic, setTopic, runPipeline, isRunning, agentStates, result } =
    usePipeline()

  return (
    <div className="rise">
      <PageHeader
        eyebrow="Pipeline"
        title="Run the full stack"
        kicker="Four agents. One topic. Camera-ready script in under a minute."
      />

      {/* Topic input */}
      <section className="px-5">
        <label
          htmlFor="topic"
          className="block text-[12px] font-semibold text-ink-2 mb-2"
        >
          Today&apos;s topic
        </label>
        <div className="rounded-2xl bg-surface border border-line focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft transition">
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent p-4 text-[15px] leading-snug text-ink placeholder:text-mute focus:outline-none"
            placeholder="What are we creating today?"
            disabled={isRunning}
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-line/70">
            <span className="text-[11px] text-mute font-medium">
              {topic.length} chars
            </span>
            <button
              type="button"
              onClick={() => runPipeline()}
              disabled={isRunning || !topic.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white text-[13px] font-semibold hover:bg-primary-hover active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isRunning ? (
                <>
                  <Spinner />
                  Running…
                </>
              ) : (
                <>
                  Run full pipeline
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Validated topic strip (after run) */}
      {result?.validatedTopic && (
        <section className="px-5 mt-5 fade-in">
          <div className="rounded-2xl bg-primary-soft border border-primary-ring/60 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-primary">
                Validated topic
              </span>
              {result.validatedTopic.tag && (
                <span className="ml-auto inline-flex items-center rounded-full bg-primary text-white px-2 py-0.5 text-[10px] font-semibold">
                  {result.validatedTopic.tag}
                </span>
              )}
            </div>
            <p className="text-[15px] font-semibold text-ink leading-snug">
              {result.validatedTopic.topic}
            </p>
            {result.validatedTopic.avgViews && (
              <p className="mt-1 text-[12.5px] text-ink-2">
                Avg views — <span className="font-semibold">{result.validatedTopic.avgViews}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Agents list */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-semibold text-ink-2 uppercase tracking-[0.14em]">
            Agents
          </h2>
          <span className="text-[11px] text-mute font-medium">
            {isRunning ? 'Running…' : result ? 'Complete' : 'Idle'}
          </span>
        </div>
        <ul className="space-y-2.5">
          {agents.map((a, i) => (
            <AgentCard
              key={a.key}
              agent={a}
              status={agentStates[a.key]}
              delay={i * 60}
            />
          ))}
        </ul>
      </section>

      <p className="px-5 mt-6 text-[11px] text-mute">
        Niche locked: AI tools, Claude Code, automation
      </p>
    </div>
  )
}

function AgentCard({ agent, status, delay }) {
  const { Icon } = agent
  const running = status === 'running'
  const done = status === 'done'

  return (
    <li
      className="rise relative flex items-center gap-3.5 rounded-2xl bg-surface border border-line p-4 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Shimmer when running */}
      {running && (
        <div className="absolute inset-0 shimmer pointer-events-none" aria-hidden="true" />
      )}
      <div
        className={[
          'relative grid place-items-center h-11 w-11 rounded-xl shrink-0 transition-colors',
          done
            ? 'bg-primary text-white'
            : running
              ? 'bg-primary-soft text-primary'
              : 'bg-canvas text-ink-2',
        ].join(' ')}
      >
        <Icon />
      </div>
      <div className="relative flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-ink truncate">
            <span className="text-mute font-mono text-[11px] mr-1.5 align-middle">
              {agent.no}
            </span>
            {agent.name}
          </h3>
          <StatusBadge status={status} />
        </div>
        <p className="mt-0.5 text-[12.5px] text-mute truncate">{agent.desc}</p>
      </div>
    </li>
  )
}

function StatusBadge({ status }) {
  const map = {
    ready: {
      label: 'Ready',
      className: 'bg-canvas text-ink-2 border-line',
    },
    running: {
      label: 'Running',
      className: 'bg-primary-soft text-primary border-primary-ring',
    },
    done: {
      label: 'Done',
      className: 'bg-primary text-white border-primary',
    },
  }
  const s = map[status] ?? map.ready
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold shrink-0',
        s.className,
      ].join(' ')}
    >
      {status === 'running' && (
        <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
      )}
      {s.label}
    </span>
  )
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V11M11 19V5M17 19V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 3 L5 14 H11 L10 21 L19 9 H13 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
