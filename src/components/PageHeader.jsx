export default function PageHeader({ eyebrow, title, kicker }) {
  return (
    <header className="px-5 pt-4 pb-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-1.5">
        {eyebrow}
      </p>
      <h1 className="text-[28px] leading-[1.1] tracking-tight text-ink font-semibold">
        {title}
      </h1>
      {kicker && (
        <p className="mt-2 text-[14px] text-ink-2 leading-snug max-w-[34ch]">
          {kicker}
        </p>
      )}
    </header>
  )
}
