import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

const beatMeta = [
  { key: 'beat1', label: 'Beat 1', role: 'Problem' },
  { key: 'beat2', label: 'Beat 2', role: 'Solution' },
  { key: 'beat3', label: 'Beat 3', role: 'Proof' },
  { key: 'cta', label: 'CTA', role: 'Comment trigger' },
]

export default function Script() {
  const { result, showToast } = usePipeline()
  const script = result?.script

  if (!script) {
    return (
      <div className="rise">
        <PageHeader eyebrow="Script" title="Your script" />
        <EmptyState
          icon={<EditIconLg />}
          title="Run the pipeline first"
          description="Once your topic is processed, the four-beat script will appear here."
        />
      </div>
    )
  }

  const fullScript = beatMeta
    .map((b) => `[${b.label} — ${b.role}]\n${script[b.key] ?? ''}`)
    .join('\n\n')

  const wordCount = fullScript.split(/\s+/).filter(Boolean).length
  const seconds = Math.max(1, Math.round((wordCount / 150) * 60))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullScript)
      showToast('Script copied to clipboard')
    } catch {
      showToast('Copy failed', 'error')
    }
  }

  return (
    <div className="rise">
      <PageHeader
        eyebrow="Script"
        title="The four-beat script"
        kicker="Spoken, not written. Hook lives on the next tab."
      />

      {/* Meta strip */}
      <section className="px-5 flex items-center gap-2 flex-wrap">
        <Tag>{wordCount} words</Tag>
        <Tag>~{seconds}s spoken</Tag>
        <Tag tone="primary">No hook</Tag>
      </section>

      {/* Beats */}
      <section className="px-5 mt-5 space-y-3">
        {beatMeta.map((b, i) => {
          const isCta = b.key === 'cta'
          return (
            <article
              key={b.key}
              className={[
                'fade-in rounded-2xl border p-4 relative overflow-hidden',
                isCta
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-ink border-line',
              ].join(' ')}
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <header className="flex items-baseline justify-between mb-2">
                <h3
                  className={[
                    'text-[10.5px] font-semibold uppercase tracking-[0.18em]',
                    isCta ? 'text-white/80' : 'text-primary',
                  ].join(' ')}
                >
                  {b.label}
                </h3>
                <span
                  className={[
                    'text-[10.5px] font-medium uppercase tracking-[0.14em]',
                    isCta ? 'text-white/70' : 'text-mute',
                  ].join(' ')}
                >
                  {b.role}
                </span>
              </header>
              <p
                className={[
                  'text-[16px] leading-[1.45] whitespace-pre-line',
                  isCta ? 'font-semibold' : '',
                ].join(' ')}
              >
                {script[b.key]}
              </p>
            </article>
          )
        })}
      </section>

      {/* Actions */}
      <section className="px-5 mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white py-3 text-[13px] font-semibold hover:bg-primary-hover active:translate-y-px transition"
        >
          <CopyIcon />
          Copy full script
        </button>
      </section>

      <p className="px-5 mt-5 text-[11px] text-mute">
        Script rule · 2-3 lines per beat · spoken voice only
      </p>
    </div>
  )
}

function Tag({ children, tone }) {
  const primary = tone === 'primary'
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        primary
          ? 'bg-primary text-white'
          : 'bg-surface text-ink-2 border border-line',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EditIconLg() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
