// Pre-filled fake pipeline output. Used when mock mode is on so the UI can be
// demo'd, developed, or shown to people without burning Claude tokens.
//
// Shape mirrors the JSON schema Claude returns in live mode — see
// SYSTEM_PROMPT in src/context/PipelineContext.jsx.

export const MOCK_RESULT = {
  validatedTopic: {
    topic: 'How to build an AI agent with Claude Code in under 10 minutes',
    avgViews: '285K',
    tag: 'VIRAL',
  },
  script: {
    beat1:
      'Everyone keeps telling you building AI agents takes weeks.\nThat you need LangChain, vector DBs, a CS degree.\nIt’s a lie.',
    beat2:
      'Claude Code does 90% of the work for you.\nYou describe what you want in plain English. It writes the code, runs it, fixes it.\nYou barely touch the keyboard.',
    beat3:
      'I just built one that scans my inbox and replies to leads in my voice.\nTook 9 minutes. From empty folder to running agent.\nIt’s answering DMs while I sleep.',
    cta:
      'Want the exact prompt I used? Comment AGENT and I’ll DM it to you.',
  },
  hooks: [
    {
      text:
        'I built a working AI agent in 9 minutes with Claude Code. No frameworks. No tutorials.',
      pattern: 'Result Claim',
      score: 9.2,
      reason:
        'Specific number plus specific result, and it kills two common objections in one line.',
    },
    {
      text:
        'If your AI agent is taking longer than 10 minutes to build, you’re using the wrong tool.',
      pattern: 'Pain Point',
      score: 8.4,
      reason:
        'Every dev in this niche has felt the framework grind. Hits an emotional bullseye.',
    },
    {
      text:
        'Most devs building AI agents don’t know Claude Code already does the hard part.',
      pattern: 'Exclusivity',
      score: 8.1,
      reason:
        'Triggers the desire to be early. The audience prides itself on insider knowledge.',
    },
    {
      text: 'This is what building an AI agent should look like in 2026.',
      pattern: 'Aspirational',
      score: 7.0,
      reason:
        'Positions the viewer as ahead-of-the-curve. Slightly softer pull than a result claim.',
    },
    {
      text:
        'There’s one Claude Code command that makes every AI agent tutorial obsolete.',
      pattern: 'Curiosity Gap',
      score: 8.6,
      reason:
        'Forces the watch — they can’t guess the command without seeing the rest.',
    },
  ],
  calendar: [
    {
      day: 'Monday',
      format: 'Reel',
      hook:
        'I built a working AI agent in 9 minutes with Claude Code. No frameworks. No tutorials.',
      caption:
        '9 minutes. One prompt. A working AI agent. Save this for the next time someone tells you AI agents are hard. Comment AGENT for the exact prompt I used.',
    },
    {
      day: 'Tuesday',
      format: 'Carousel',
      hook: 'The 10-step playbook for building your first AI agent.',
      caption:
        'Saw yesterday’s reel? Here’s the actual playbook. 10 slides. One topic. Save it. Comment AGENT for the prompt.',
    },
    {
      day: 'Wednesday',
      format: 'Thread',
      hook:
        'Hot take: 90% of the AI agent tutorials on YouTube are now obsolete.',
      caption:
        'Claude Code already does what they’re teaching. Here’s why the framework era is over and what to learn instead. Reply AGENT for the prompt.',
    },
    {
      day: 'Thursday',
      format: 'Reel',
      hook: 'How devs built AI agents in 2024 vs how I build them in 2026.',
      caption:
        'Side-by-side comparison. 47 minute tutorials vs one prompt. Tag a friend who’s still fighting LangChain. Comment AGENT for the prompt.',
    },
    {
      day: 'Friday',
      format: 'Stories',
      hook: '47 emails. 12 leads. 4 sales calls booked.',
      caption:
        'Receipts from running my AI agent on my real inbox for 3 weeks. DM AGENT and I’ll send you the exact prompt that built it.',
    },
  ],
  recommendedHook: {
    index: 0,
    reason:
      'Result Claim wins this week — specific number, specific result, removes objections. Result-claim hooks dominated the AI tools feed in the last 7 days.',
  },
}
