import TabBar from './TabBar.jsx'
import Toast from './Toast.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

export default function AppShell({ children }) {
  const { toast } = usePipeline()

  return (
    <div className="min-h-dvh w-full bg-[#ebebf2] flex justify-center">
      {/* Phone-frame container: mobile-first, capped at 390px */}
      <div className="relative w-full max-w-[390px] min-h-dvh bg-canvas flex flex-col shadow-[0_8px_40px_rgba(20,20,30,0.08)]">
        {/* App header */}
        <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-canvas">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid place-items-center h-8 w-8 rounded-xl bg-primary text-white font-bold text-[15px]"
            >
              P
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold text-ink tracking-tight">
                AI Content Creator
              </p>
              <p className="text-[10.5px] text-mute font-medium">
                4-agent pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Menu"
            className="grid place-items-center h-9 w-9 rounded-full bg-surface border border-line text-ink-2 hover:bg-primary-soft hover:text-primary hover:border-primary-ring transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="5" cy="12" r="1.6" fill="currentColor" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              <circle cx="19" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </button>
        </header>

        {/* Scrollable content area, padded for the fixed tab bar */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          {children}
        </main>

        {/* Bottom tab bar */}
        <TabBar />

        {/* Toast notification */}
        {toast && <Toast message={toast.message} tone={toast.tone} />}
      </div>
    </div>
  )
}
