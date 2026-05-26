export default function PageHeader({ eyebrow, title, italic, kicker }) {
  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-flame pulse-dot" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
          {eyebrow}
        </p>
      </div>
      <h1 className="font-display text-[44px] leading-[0.95] tracking-tight text-bone">
        {title}
        {italic && (
          <>
            {' '}
            <span className="italic text-flame">{italic}</span>
          </>
        )}
      </h1>
      {kicker && (
        <p className="mt-3 text-sm text-paper/70 leading-relaxed max-w-[34ch]">
          {kicker}
        </p>
      )}
    </header>
  )
}
