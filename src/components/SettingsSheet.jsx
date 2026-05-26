import { useEffect, useState } from 'react'
import { usePipeline } from '../context/PipelineContext.jsx'
import { useInstallPrompt } from '../hooks/useInstallPrompt.js'

// Settings is rendered as a FULL-FRAME overlay (not a bottom sheet) so it
// cannot be clipped at the bottom of the phone frame. The panel fills the
// entire app surface (`absolute inset-0`) and scrolls internally if its
// content exceeds the viewport. A `backdrop-blur-xl` on the panel itself
// preserves the blurred-page effect behind the 5% transparency, so the
// "backdrop blur" treatment is kept without a separate backdrop layer.
export default function SettingsSheet({ open, onClose }) {
  const { mockMode, setMockMode, resetResult, showToast } = usePipeline()
  const { isAvailable, isStandalone, promptInstall } = useInstallPrompt()
  const [showInstallHint, setShowInstallHint] = useState(false)

  const handleInstallClick = async () => {
    if (isStandalone) return
    if (isAvailable) {
      const choice = await promptInstall()
      if (choice?.outcome === 'accepted') {
        showToast('Installed! 🎉', 'success', 2400)
        onClose()
      }
    } else {
      // No native prompt available (iOS Safari, or Chrome hasn't met
      // install criteria yet). Reveal the manual instruction inline.
      setShowInstallHint(true)
    }
  }

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

  // z-60 sits above the fixed TabBar (z-50) so the Settings overlay
  // still fully covers the tab bar when open.
  return (
    <div
      className="absolute inset-0 z-[60] fade-in"
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

          {/* Get the app */}
          <section className="px-5 mt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Get the app
            </h3>
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isStandalone}
              className="w-full text-left rounded-2xl bg-surface border border-line p-4 hover:border-primary-ring disabled:opacity-60 disabled:cursor-default transition-colors flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="grid place-items-center h-10 w-10 rounded-xl bg-primary-soft text-primary shrink-0"
              >
                <DownloadIcon />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink">
                  {isStandalone ? 'Already installed' : 'Add to Home Screen'}
                </p>
                <p className="text-[12.5px] text-mute mt-0.5 leading-snug">
                  {isStandalone
                    ? "You're running the installed app"
                    : 'Install as a mobile app'}
                </p>
              </div>
              {!isStandalone && (
                <ChevronRightIcon />
              )}
            </button>
            {showInstallHint && !isStandalone && (
              <p className="mt-2 text-[12px] text-mute leading-snug px-1">
                In your browser menu, tap{' '}
                <span className="text-ink font-semibold">
                  &lsquo;Add to Home Screen&rsquo;
                </span>
                .
              </p>
            )}
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

          {/* Connect — contact & social links. Each row is an <a> that
              opens in a new tab (rel=noopener noreferrer for security). */}
          <section className="px-5 mt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Connect
            </h3>
            <div className="space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-surface border border-line p-4 hover:border-primary-ring transition-colors flex items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="grid place-items-center h-10 w-10 rounded-xl shrink-0 overflow-hidden"
                    style={{
                      background: link.iconBg,
                      color: link.iconColor,
                    }}
                  >
                    <link.Icon />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink">
                      {link.label}
                    </p>
                    <p className="text-[12.5px] text-mute mt-0.5 leading-snug truncate">
                      {link.subtitle}
                    </p>
                  </div>
                  <ExternalLinkIcon />
                </a>
              ))}
            </div>
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

// Social/contact link entries. Icon backgrounds are set per-platform so
// each brand reads correctly: Email uses the app's green accent, Instagram
// gets its real magenta-orange gradient, GitHub and Threads get a near-black
// pill. The actual icons inside are inline SVGs so we never load extra assets.
const SOCIAL_LINKS = [
  {
    label: 'Email',
    subtitle: 'lordforpeace0011@gmail.com',
    href: 'mailto:lordforpeace0011@gmail.com',
    Icon: MailIcon,
    iconBg: 'rgba(0, 255, 65, 0.08)',
    iconColor: '#00FF41',
  },
  {
    label: 'Instagram',
    subtitle: '@akexo_ai',
    href: 'https://www.instagram.com/akexo_ai',
    Icon: InstagramIcon,
    iconBg:
      'linear-gradient(135deg, #FA7E1E 0%, #D62976 50%, #962FBF 100%)',
    iconColor: '#ffffff',
  },
  {
    label: 'GitHub',
    subtitle: '@exoexo0011',
    href: 'https://github.com/exoexo0011',
    Icon: GitHubIcon,
    iconBg: '#0e0e12',
    iconColor: '#ffffff',
  },
  {
    label: 'Threads',
    subtitle: '@akexo_ai',
    href: 'https://www.threads.com/@akexo_ai',
    Icon: ThreadsIcon,
    iconBg: '#0e0e12',
    iconColor: '#ffffff',
  },
]

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

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v12m0 0l-4-4m4 4l4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-mute shrink-0"
      aria-hidden="true"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-mute shrink-0"
      aria-hidden="true"
    >
      <path
        d="M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7L8 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 7.5l8.5 5.5 8.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Instagram brand mark — the rounded square camera icon. The gradient
// background lives on the icon container; this SVG just draws the white
// camera body, lens, and viewfinder dot on top.
function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// Threads brand mark — the @-style swirl. Single-path icon from Meta's
// brand guidelines (simplified for icon-size rendering).
function ThreadsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.745-1.757-.51-.586-1.297-.883-2.34-.89h-.018c-.815 0-1.974.21-2.71 1.31L8.84 9.388c.992-1.484 2.6-2.298 4.611-2.288 3.378.022 5.39 2.127 5.59 5.78.114.06.226.124.336.19 1.557.927 2.668 2.348 3.097 4.123.581 2.47-.002 5.435-1.881 7.288-1.834 1.808-4.113 2.499-7.39 2.519zm1.557-9.972c-.27-.014-.546-.022-.827-.022-.357 0-.713.014-1.066.043-1.844.156-2.987.999-2.815 2.247.181 1.305 1.622 1.913 3.016 1.836 1.298-.072 2.804-.575 3.038-3.83-.343-.084-.808-.169-1.346-.274z" />
    </svg>
  )
}
