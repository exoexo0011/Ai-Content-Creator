import TabBar from './TabBar.jsx'

export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh w-full bg-black flex justify-center">
      {/* Phone-frame container: mobile-first, capped at 390px */}
      <div className="relative grain w-full max-w-[390px] min-h-dvh bg-ink overflow-hidden flex flex-col">
        {/* Top edge marquee — small ambient detail */}
        <div className="relative h-7 border-b border-line/60 overflow-hidden">
          <div className="marquee-track flex gap-8 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-mute py-2 font-mono">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-8 shrink-0">
                <span>● live signal</span>
                <span>claude code</span>
                <span>ai agents</span>
                <span>n8n automation</span>
                <span>vibe coding</span>
                <span>ai tools</span>
                <span>● live signal</span>
                <span>claude code</span>
                <span>ai agents</span>
                <span>n8n automation</span>
                <span>vibe coding</span>
                <span>ai tools</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content area, padded for the fixed tab bar */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          {children}
        </main>

        {/* Bottom tab bar */}
        <TabBar />
      </div>
    </div>
  )
}
