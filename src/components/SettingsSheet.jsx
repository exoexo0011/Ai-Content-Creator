import { useEffect, useState } from 'react'
import { usePipeline } from '../context/PipelineContext.jsx'
import { useInstallPrompt } from '../hooks/useInstallPrompt.js'

// localStorage keys
const PLATFORM_KEY = 'aicc:platform'
const NICHES_KEY = 'aicc:niches'

// Defaults — Instagram + AI Tools per spec
const DEFAULT_PLATFORM = 'instagram'
const DEFAULT_NICHES = ['ai-tools']

// Settings is rendered as a FULL-FRAME overlay (not a bottom sheet) so it
// cannot be clipped at the bottom of the phone frame. The panel fills the
// entire app surface (`absolute inset-0`) and scrolls internally if its
// content exceeds the viewport. A `backdrop-blur-xl` on the panel itself
// preserves the blurred-page effect behind the 5% transparency, so the
// "backdrop blur" treatment is kept without a separate backdrop layer.
export default function SettingsSheet({ open, onClose }) {
  const { resetResult, showToast } = usePipeline()
  const { isAvailable, isStandalone, promptInstall } = useInstallPrompt()
  const [showInstallHint, setShowInstallHint] = useState(false)

  // Selected platform — single value, defaults to Instagram
  const [platform, setPlatform] = useState(() => {
    try {
      const raw = localStorage.getItem(PLATFORM_KEY)
      if (!raw) return DEFAULT_PLATFORM
      // Validate against known ids so a stale value can't break the UI
      return PLATFORMS.some((p) => p.id === raw) ? raw : DEFAULT_PLATFORM
    } catch {
      return DEFAULT_PLATFORM
    }
  })

  // Selected niches — array, multi-select, defaults to ['ai-tools']
  const [niches, setNiches] = useState(() => {
    try {
      const raw = localStorage.getItem(NICHES_KEY)
      if (!raw) return DEFAULT_NICHES
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return DEFAULT_NICHES
      const valid = parsed.filter((id) => NICHES.some((n) => n.id === id))
      return valid.length ? valid : DEFAULT_NICHES
    } catch {
      return DEFAULT_NICHES
    }
  })

  // Persist selections whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PLATFORM_KEY, platform)
    } catch {
      /* ignore quota / private mode */
    }
  }, [platform])

  useEffect(() => {
    try {
      localStorage.setItem(NICHES_KEY, JSON.stringify(niches))
    } catch {
      /* ignore quota / private mode */
    }
  }, [niches])

  const toggleNiche = (id) => {
    setNiches((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

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
          {/* Platform — single-select, 2x2 grid */}
          <section className="px-5 pt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Platform
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => {
                const selected = platform === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    aria-pressed={selected}
                    className={[
                      'flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-colors',
                      selected
                        ? 'bg-primary-soft text-ink'
                        : 'bg-surface border-line text-ink-2 hover:border-primary-ring hover:text-ink',
                    ].join(' ')}
                    style={
                      selected
                        ? { borderColor: '#00FF41' }
                        : undefined
                    }
                  >
                    <p.Icon />
                    <span className="text-[13px] font-semibold">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Niche — multi-select, 2x3 grid (2 cols × 3 rows) */}
          <section className="px-5 mt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute mb-2">
              Niche
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {NICHES.map((n) => {
                const selected = niches.includes(n.id)
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleNiche(n.id)}
                    aria-pressed={selected}
                    className={[
                      'flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-colors',
                      selected
                        ? 'bg-primary-soft text-ink'
                        : 'bg-surface border-line text-ink-2 hover:border-primary-ring hover:text-ink',
                    ].join(' ')}
                    style={
                      selected
                        ? { borderColor: '#00FF41' }
                        : undefined
                    }
                  >
                    <span className="text-[16px] leading-none" aria-hidden="true">
                      {n.emoji}
                    </span>
                    <span className="text-[13px] font-semibold">{n.label}</span>
                  </button>
                )
              })}
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

// ----------------------------------------------------------------------------
// Platform options — id, label, and a brand-accurate inline SVG logo. Icons
// render in full color so each platform reads instantly even at chip size.
// ----------------------------------------------------------------------------
const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: PlatformInstagramIcon },
  { id: 'youtube', label: 'YouTube', Icon: PlatformYouTubeIcon },
  { id: 'tiktok', label: 'TikTok', Icon: PlatformTikTokIcon },
  { id: 'twitter', label: 'Twitter/X', Icon: PlatformXIcon },
]

// ----------------------------------------------------------------------------
// Niche options — id, emoji, label. Multi-select.
// ----------------------------------------------------------------------------
const NICHES = [
  { id: 'ai-tools', emoji: '🤖', label: 'AI Tools' },
  { id: 'crypto', emoji: '💰', label: 'Crypto' },
  { id: 'fitness', emoji: '💪', label: 'Fitness' },
  { id: 'business', emoji: '📈', label: 'Business' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'lifestyle', emoji: '✨', label: 'Lifestyle' },
]

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

// ----------------------------------------------------------------------------
// Platform brand icons — full-color, rendered inline so no extra assets load.
// ----------------------------------------------------------------------------

// Instagram — real brand gradient (orange → magenta → purple) on a rounded
// square, with the white camera body and viewfinder dot on top.
function PlatformInstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FA7E1E" />
          <stop offset="50%" stopColor="#D62976" />
          <stop offset="100%" stopColor="#962FBF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-chip)" />
      <rect
        x="6.5"
        y="6.5"
        width="11"
        height="11"
        rx="3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="#fff" />
    </svg>
  )
}

// YouTube — red rounded rectangle with the white play triangle.
function PlatformYouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="5" width="22" height="14" rx="4" fill="#FF0000" />
      <path d="M10 9.2v5.6l5-2.8z" fill="#fff" />
    </svg>
  )
}

// TikTok — black rounded square with the iconic music-note silhouette.
// Cyan and magenta shadow copies are offset to recreate the brand glitch
// effect, with the white note rendered on top.
function PlatformTikTokIcon() {
  const note =
    'M14.7 6.6c.7 1.6 2 2.7 3.6 3v2.2c-1.4-.1-2.6-.6-3.6-1.4v4.4c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.3 0 .5 0 .8.05v2.3a2.3 2.3 0 1 0 1.5 2.15V5.6h2.2z'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#000" />
      <path d={note} fill="#25F4EE" transform="translate(-1,-0.6)" />
      <path d={note} fill="#FE2C55" transform="translate(1,0.6)" />
      <path d={note} fill="#fff" />
    </svg>
  )
}

// Twitter/X — black rounded square with the X mark.
function PlatformXIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#000" />
      <path
        d="M16.7 6.5h2.4l-5.25 6L20.2 19.5h-4.86l-3.6-4.7-4.13 4.7H5.2l5.6-6.4L4.9 6.5h4.98l3.27 4.31L16.7 6.5zm-.84 11.6h1.34L8.55 7.83H7.12l8.74 10.27z"
        fill="#fff"
      />
    </svg>
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
