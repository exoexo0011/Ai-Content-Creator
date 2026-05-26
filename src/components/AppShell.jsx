import { useState } from 'react'
import TabBar from './TabBar.jsx'
import Toast from './Toast.jsx'
import SettingsSheet from './SettingsSheet.jsx'
import InstallBanner from './InstallBanner.jsx'
import { usePipeline } from '../context/PipelineContext.jsx'

export default function AppShell({ children }) {
  const { toast, mockMode } = usePipeline()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-dvh w-full bg-black flex justify-center">
      {/* Phone-frame container: mobile-first, capped at 390px.
          The GIF + overlay live INSIDE this frame as absolute children, so
          they fill the app surface — not the whole webpage. */}
      <div className="relative w-full max-w-[390px] min-h-dvh flex flex-col overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
        {/* Looping GIF — fills the phone frame */}
        <img
          src="/bg.gif"
          alt=""
          aria-hidden="true"
          className="gif-bg"
          loading="eager"
          decoding="async"
        />
        {/* Dark overlay on top of the GIF */}
        <div className="gif-overlay" aria-hidden="true" />

        {/* Foreground stack — header, main, tab bar, sheet, toast */}
        <div className="relative z-[1] flex flex-col min-h-dvh">
          {/* App header */}
          <header className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="logo"
                style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
              />
              <div className="leading-tight">
                <p className="text-[15px] font-semibold text-ink tracking-tight">
                  AI Content Creator
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10.5px] text-mute font-medium">
                    4-agent pipeline
                  </p>
                  {mockMode && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warn/20 text-warn px-1.5 py-[1px] text-[9.5px] font-semibold uppercase tracking-[0.06em]">
                      <span className="h-1 w-1 rounded-full bg-warn" />
                      Mock
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
              className="grid place-items-center h-9 w-9 rounded-full bg-surface border border-line text-ink-2 hover:border-primary-ring hover:text-ink transition-colors"
            >
              <SettingsIcon />
            </button>
          </header>

          {/* Install banner — sits below the header, above main. Hidden
              by default; appears only the first time the browser fires
              `beforeinstallprompt` and disappears after dismiss/install. */}
          <InstallBanner />

          {/* Scrollable content area. 80px bottom padding clears the
              fixed tab bar (which is roughly 76px tall including its own
              outer padding). */}
          <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {children}
          </main>

          {/* Bottom tab bar */}
          <TabBar />

          {/* Toast notification */}
          {toast && <Toast message={toast.message} tone={toast.tone} />}

          {/* Settings sheet */}
          <SettingsSheet
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06A2 2 0 1 1 4.13 16.93l.06-.06A1.7 1.7 0 0 0 4.53 15a1.7 1.7 0 0 0-1.55-1.05H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.9 1.7 1.7 0 0 0 4.31 7.03l-.06-.06A2 2 0 1 1 7.07 4.14l.06.06a1.7 1.7 0 0 0 1.87.34H9A1.7 1.7 0 0 0 10.05 2.95V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1.05 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1.05H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1.05Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
