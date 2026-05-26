import { useEffect } from 'react'
import { usePipeline } from '../context/PipelineContext.jsx'

// Settings is rendered as a FULL-FRAME overlay (not a bottom sheet) so it
// cannot be clipped at the bottom of the phone frame. The panel fills the
// entire app surface (`absolute inset-0`) and scrolls internally if its
// content exceeds the viewport. A `backdrop-blur-xl` on the panel itself
// preserves the blurred-page effect behind the 5% transparency, so the
// "backdrop blur" treatment is kept without a separate backdrop layer.
export default function SettingsSheet({ open, onClose }) {
  const { mockMode, setMockMode, resetResult } = usePipeline()

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-40 fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Full-frame panel — covers the whole phone frame, never clipped */}
      <div className="absolute inset-0 bg-[#0e0e12]/95 backdrop-blur-xl flex flex-col">
        {/* Sticky header. Close button always reachable at the top right. */}
        <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b border-line">
          <h2 id="settings-title" className="text-[18px] font-semibold text-ink">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="grid place-items-center h-9 w-9 rounded-full bg-surface border border-line text-ink-2 hover:border-primary-ring hover:text-ink transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content area. If the device is short or the panel grows
            in the future, this area scrolls internally — the panel itself
            never gets cut off. */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {/* Pipeline mode */}
          <section className="px-5 pt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Pipeline mode
            </h3>

            <div className="rounded-2xl bg-surface border border-line overflow-hidden">
              <ModeOption
                active={!mockMode}
                onClick={() => setMockMode(false)}
                title="Live"
                description="Routes through the /api/nvidia serverless proxy to NVIDIA NIM (Llama 4 Maverick)."
                badge="Real"
              />
              <div className="border-t border-line" />
              <ModeOption
                active={mockMode}
                onClick={() => setMockMode(true)}
                title="Mock"
                description="Returns canned demo data. Safe for testing the UI."
                badge="Free"
              />
            </div>
          </section>

          {/* Workspace */}
          <section className="px-5 mt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Workspace
            </h3>
            <button
              type="button"
              onClick={() => {
                resetResult()
                onClose()
              }}
              className="w-full text-left rounded-2xl bg-surface border border-line p-4 hover:border-primary-ring transition-colors"
            >
              <p className="text-[14px] font-semibold text-ink">
                Clear last pipeline result
              </p>
              <p className="text-[12.5px] text-mute mt-0.5 leading-snug">
                Removes the saved topic and result from this browser.
              </p>
            </button>
          </section>

          {/* Footer meta */}
          <p className="px-5 mt-6 text-[11px] text-mute leading-snug">
            AI Content Creator · v0.1.0 · niche locked: AI tools, Claude Code,
            automation
          </p>
        </div>
      </div>
    </div>
  )
}

function ModeOption({ active, onClick, title, description, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'w-full text-left flex items-start gap-3 p-4 transition-colors',
        active ? 'bg-primary-soft' : 'hover:bg-canvas',
      ].join(' ')}
    >
      {/* Radio indicator */}
      <span
        aria-hidden="true"
        className={[
          'mt-0.5 grid place-items-center h-5 w-5 rounded-full border-2 shrink-0 transition-colors',
          active ? 'border-primary bg-primary' : 'border-line-strong bg-surface',
        ].join(' ')}
      >
        {active && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={[
              'text-[14.5px] font-semibold',
              active ? 'text-primary' : 'text-ink',
            ].join(' ')}
          >
            {title}
          </p>
          <span
            className={[
              'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              active
                ? 'bg-primary text-black'
                : 'bg-canvas text-ink-2 border border-line',
            ].join(' ')}
          >
            {badge}
          </span>
        </div>
        <p className="mt-0.5 text-[12.5px] text-mute leading-snug">
          {description}
        </p>
      </div>
    </button>
  )
}
