import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

export default function Hooks() {
  const { result, showToast } = usePipeline()
  const hooks = Array.isArray(result?.hooks) ? result.hooks : null

  if (!hooks || hooks.length === 0) {
    return (
      <div className="rise">
        <PageHeader eyebrow="Hooks" title="Hook generator" />
        <EmptyState
          icon={<BoltIconLg />}
          title="Run the pipeline first"
          description="Five hook variations with confidence scores will land here."
        />
      </div>
    )
  }

  // Determine recommended index — prefer Claude's pick, fall back to highest score
  let recommendedIndex = result?.recommendedHook?.index
  if (
    typeof recommendedIndex !== 'number' ||
    recommendedIndex < 0 ||
    recommendedIndex >= hooks.length
  ) {
    let best = 0
    hooks.forEach((h, i) => {
      if ((h.score ?? 0) > (hooks[best].score ?? 0)) best = i
    })
    recommendedIndex = best
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Hook copied to clipboard')
    } catch {
      showToast('Copy failed', 'error')
    }
  }

  return (
    <div className="rise">
      <PageHeader
        eyebrow="Hooks"
        title="Five tries. One winner."
        kicker="Pick the line that lands in under 4 seconds."
      />

      <section className="px-5 space-y-3">
        {hooks.map((h, i) => {
          const recommended = i === recommendedIndex
          const score = Number.isFinite(h.score) ? h.score : 0
          return (
            <article
              key={i}
              className={[
                'fade-in rounded-2xl border p-4 bg-surface',
                recommended
                  ? 'border-primary ring-4 ring-primary-soft'
                  : 'border-line',
              ].join(' ')}
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              <header className="flex items-center gap-2 mb-2.5">
                <span className="text-[11px] font-mono text-mute">
                  #{i + 1}
                </span>
                {h.pattern && (
                  <span className="inline-flex items-center rounded-full bg-canvas border border-line px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-2">
                    {h.pattern}
                  </span>
                )}
                {recommended && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary text-black px-2.5 py-1 text-[10.5px] font-semibold">
                    <StarIcon />
                    Recommended
                  </span>
                )}
              </header>

              <p className="text-[16px] leading-snug text-ink font-medium">
                “{h.text}”
              </p>

              <div className="mt-3 flex items-center gap-3">
                <ScoreBar value={score} />
                <span className="text-[12px] font-semibold tabular-nums text-ink shrink-0">
                  {score.toFixed(1)}
                  <span className="text-mute font-medium"> /10</span>
                </span>
              </div>

              {h.reason && (
                <p className="mt-2.5 text-[12.5px] text-mute leading-snug">
                  {h.reason}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleCopy(h.text)}
                className={[
                  'mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-[12.5px] font-semibold transition',
                  recommended
                    ? 'bg-primary text-black hover:bg-primary-hover'
                    : 'bg-canvas text-ink border border-line hover:border-primary-ring hover:text-primary',
                ].join(' ')}
              >
                <CopyIcon />
                Copy hook
              </button>
            </article>
          )
        })}
      </section>

      <p className="px-5 mt-5 text-[11px] text-mute">
        Rules · max 2 lines · speakable in &lt; 4s · plain English
      </p>
    </div>
  )
}

function ScoreBar({ value }) {
  const pct = Math.min(100, Math.max(0, (value / 10) * 100))
  return (
    <div className="flex-1 h-1.5 rounded-full bg-canvas border border-line overflow-hidden">
      <div
        className="h-full bg-primary transition-[width] duration-500"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      />
    </div>
  )
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function BoltIconLg() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 3 L5 14 H11 L10 21 L19 9 H13 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
