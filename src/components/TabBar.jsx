import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/pipeline', label: 'Pipeline', icon: PipelineIcon },
  { to: '/script', label: 'Script', icon: ScriptIcon },
  { to: '/hooks', label: 'Hooks', icon: HookIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
]

export default function TabBar() {
  // Fixed to the viewport so the tab bar is always visible regardless of
  // page or container scroll. Constrained to the 390px phone frame width
  // and centered horizontally so it lines up with the frame on desktop.
  // z-50 keeps it above all normal content; the Settings overlay uses
  // z-60 to still cover the tab bar when open.
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50"
      style={{
        background: 'rgba(10, 10, 10, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                [
                  'group relative flex flex-col items-center justify-center gap-1 py-3 text-[10.5px] font-semibold transition-colors',
                  isActive ? 'text-primary' : 'text-mute hover:text-ink',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={[
                      'absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-b-full transition-all',
                      isActive ? 'w-8 bg-primary' : 'w-0 bg-transparent',
                    ].join(' ')}
                  />
                  <Icon active={isActive} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function iconClass(active) {
  return active
    ? 'text-primary'
    : 'text-mute group-hover:text-ink transition-colors'
}

function PipelineIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconClass(active)} aria-hidden="true">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 6h6a4 4 0 0 1 4 4v0M7 18h6a4 4 0 0 0 4-4v0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ScriptIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconClass(active)} aria-hidden="true">
      <path d="M6 4h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 4v5h5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function HookIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconClass(active)} aria-hidden="true">
      <path d="M13 3 L5 14 H11 L10 21 L19 9 H13 Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconClass(active)} aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 10h16" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 4v4M15 4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
