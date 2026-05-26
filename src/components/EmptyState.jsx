import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, description, ctaLabel = 'Run pipeline', ctaTo = '/pipeline' }) {
  return (
    <div className="px-5 pt-8 fade-in">
      <div className="rounded-3xl bg-surface border border-line p-8 flex flex-col items-center text-center">
        <div className="grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-4">
          {icon ?? <DefaultIcon />}
        </div>
        <h2 className="text-[18px] font-semibold text-ink leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-[13.5px] text-mute leading-snug max-w-[26ch]">
            {description}
          </p>
        )}
        <Link
          to={ctaTo}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-primary-hover transition-colors"
        >
          {ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function DefaultIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
