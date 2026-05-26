import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

export default function Calendar() {
  const { result, runPipeline, isRunning } = usePipeline()
  const calendar = Array.isArray(result?.calendar) ? result.calendar.slice(0, 5) : null
  const [openIndex, setOpenIndex] = useState(0)

  // Keep openIndex in range when data changes
  useEffect(() => {
    if (calendar && openIndex >= calendar.length) {
      setOpenIndex(0)
    }
  }, [calendar, openIndex])

  if (!calendar || calendar.length === 0) {
    return (
      <div className="rise">
        <PageHeader eyebrow="Calendar" title="Your week" />
        <EmptyState
          icon={<CalendarIconLg />}
          title="Run the pipeline first"
          description="Your 5-post weekly calendar will appear here once the pipeline finishes."
        />
      </div>
    )
  }

  const open = calendar[openIndex]

  return (
    <div className="rise">
      <PageHeader
        eyebrow="Calendar"
        title="One topic. Five hammers."
        kicker="Tap a day to see the hook and caption."
      />

      {/* Day strip */}
      <section className="px-5">
        <div className="flex gap-2">
          {calendar.map((d, i) => {
            const active = i === openIndex
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                className={[
                  'flex-1 rounded-2xl border py-3 text-center transition-colors',
                  active
                    ? 'bg-primary border-primary text-black'
                    : 'bg-surface border-line text-ink-2 hover:border-primary-ring',
                ].join(' ')}
              >
                <p
                  className={[
                    'text-[10px] font-semibold uppercase tracking-[0.18em]',
                    active ? 'text-black/70' : 'text-mute',
                  ].join(' ')}
                >
                  {shortDay(d.day, i)}
                </p>
                <p className="mt-1 text-[18px] font-semibold leading-none">
                  {i + 1}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Open day card */}
      {open && (
        <section className="px-5 mt-5 fade-in" key={openIndex}>
          <article className="rounded-2xl bg-surface border border-line p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
                {open.day}
              </span>
              {open.format && (
                <span className="inline-flex items-center rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10.5px] font-semibold">
                  {open.format}
                </span>
              )}
            </div>

            {open.hook && (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute mt-3">
                  Hook
                </p>
                <p className="mt-1 text-[17px] leading-snug text-ink font-medium">
                  “{open.hook}”
                </p>
              </>
            )}

            {open.caption && (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute mt-4">
                  Caption
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-2 whitespace-pre-line">
                  {open.caption}
                </p>
              </>
            )}
          </article>
        </section>
      )}

      {/* All days quick list */}
      <section className="px-5 mt-5 space-y-2">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-2 mb-2">
          Full week
        </h2>
        {calendar.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={[
              'w-full text-left rounded-2xl border p-3.5 transition-colors flex items-center gap-3',
              i === openIndex
                ? 'bg-primary-soft border-primary-ring'
                : 'bg-surface border-line hover:border-primary-ring',
            ].join(' ')}
          >
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-canvas border border-line text-ink-2 text-[12px] font-semibold shrink-0">
              {shortDay(d.day, i).slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-ink">
                  {d.day}
                </span>
                {d.format && (
                  <span className="text-[11px] text-primary font-semibold">
                    · {d.format}
                  </span>
                )}
              </div>
              {d.hook && (
                <p className="text-[12.5px] text-mute truncate mt-0.5">
                  {d.hook}
                </p>
              )}
            </div>
            <ChevronIcon />
          </button>
        ))}
      </section>

      {/* Generate next week */}
      <section className="px-5 mt-6">
        <button
          type="button"
          onClick={() => runPipeline()}
          disabled={isRunning}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-black py-3 text-[13px] font-semibold hover:bg-primary-hover active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isRunning ? (
            <>
              <Spinner />
              Generating…
            </>
          ) : (
            <>
              Generate next week
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 15.5-6.3M21 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </section>

      <p className="px-5 mt-5 text-[11px] text-mute">
        Calendar v1 · auto-built from pipeline output
      </p>
    </div>
  )
}

function shortDay(day, fallbackIndex) {
  if (typeof day !== 'string' || !day) {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][fallbackIndex] ?? `D${fallbackIndex + 1}`
  }
  return day.slice(0, 3)
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-mute" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIconLg() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 4v4M15 4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
