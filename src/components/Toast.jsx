export default function Toast({ message, tone = 'success' }) {
  const styles = {
    success: 'bg-ink text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
  }
  const icons = {
    success: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    ),
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute bottom-24 left-1/2 z-40 -translate-x-1/2 toast-in"
    >
      <div
        className={[
          'flex items-center gap-2 rounded-full px-4 py-2.5 shadow-[0_10px_30px_rgba(20,20,30,0.25)] text-[13px] font-medium',
          styles[tone] ?? styles.success,
        ].join(' ')}
      >
        <span className="grid place-items-center h-4 w-4">{icons[tone]}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
