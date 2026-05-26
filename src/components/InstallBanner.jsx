import { useInstallPrompt } from '../hooks/useInstallPrompt.js'

// Slim banner shown below the header the first time the browser fires
// `beforeinstallprompt`. Hidden once the user dismisses, installs, or is
// already running the app in standalone mode.
export default function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt()

  if (!canInstall) return null

  return (
    <div
      className="mx-3 mt-2 rounded-2xl flex items-center gap-3 p-3 fade-in"
      style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 255, 65, 0.25)',
      }}
      role="region"
      aria-label="Install AI Creator"
    >
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-ink leading-tight truncate">
          Add AI Creator to your home screen
        </p>
        <p className="text-[11px] text-mute leading-tight mt-0.5 truncate">
          Works offline · No app store needed
        </p>
      </div>
      <button
        type="button"
        onClick={() => promptInstall()}
        className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary text-black px-3 py-1.5 text-[12px] font-semibold hover:bg-primary-hover active:translate-y-px transition"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install banner"
        className="shrink-0 grid place-items-center h-7 w-7 rounded-full text-mute hover:text-ink hover:bg-white/5 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
