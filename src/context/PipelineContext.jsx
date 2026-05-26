import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MOCK_RESULT } from '../data/mockResult.js'

const PipelineContext = createContext(null)

export const AGENT_KEYS = ['scraper', 'validator', 'script', 'hooks']

// NVIDIA NIM API — OpenAI-compatible chat completions endpoint
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const NVIDIA_MODEL = 'meta/llama-4-maverick-17b-128e-instruct'

const SYSTEM_PROMPT = `You are an AI content strategist and script writer.
Niche: AI tools, Claude Code, and automation.
Audience: beginner to intermediate creators and developers.
Style: English only. Short sentences. Conversational. No fluff.

When given a topic, return a JSON object with this exact structure:
{
  "validatedTopic": {
    "topic": "string",
    "avgViews": "string",
    "tag": "string"
  },
  "script": {
    "beat1": "string",
    "beat2": "string",
    "beat3": "string",
    "cta": "string"
  },
  "hooks": [
    {
      "text": "string",
      "pattern": "string",
      "score": number,
      "reason": "string"
    }
  ],
  "calendar": [
    {
      "day": "Monday",
      "format": "string",
      "hook": "string",
      "caption": "string"
    }
  ],
  "recommendedHook": {
    "index": number,
    "reason": "string"
  }
}

Script rules:
- Beat 1: relatable problem, 2-3 short lines
- Beat 2: the insight or solution, 2-3 short lines
- Beat 3: proof or example, 2-3 short lines
- CTA: always a comment trigger like "Comment X and I'll DM it to you"
- Never write the hook in the script

Hook rules:
- Max 2 lines each, speakable in under 4 seconds
- Never start with "In this video" or "Today I'm going to"
- 5 hooks using these patterns in order:
  1. Result Claim - specific number + result
  2. Pain Point - name a frustration they feel right now
  3. Exclusivity - "Most people don't know..."
  4. Aspirational - show the better version
  5. Curiosity Gap - question they can't answer without watching

Return only valid JSON. No markdown, no explanation, no extra text.`

const STORAGE_KEY = 'aicc:result:v1'
const TOPIC_KEY = 'aicc:topic:v1'
const MOCK_KEY = 'aicc:mockMode:v1'

const HAS_API_KEY = Boolean(import.meta.env.VITE_NVIDIA_API_KEY)

function loadResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadTopic() {
  try {
    return (
      localStorage.getItem(TOPIC_KEY) ||
      'How to build an AI agent with Claude Code in under 10 minutes'
    )
  } catch {
    return 'How to build an AI agent with Claude Code in under 10 minutes'
  }
}

function loadMockMode() {
  try {
    const raw = localStorage.getItem(MOCK_KEY)
    if (raw === 'true') return true
    if (raw === 'false') return false
    // No saved preference — default to mock if no API key, otherwise live
    return !HAS_API_KEY
  } catch {
    return !HAS_API_KEY
  }
}

function extractJson(text) {
  // Strip markdown fences if the model added them despite instructions
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  // Find the first { and last } as a safety net
  const first = candidate.indexOf('{')
  const last = candidate.lastIndexOf('}')
  if (first === -1 || last === -1) {
    throw new Error('No JSON object found in response')
  }
  return JSON.parse(candidate.slice(first, last + 1))
}

async function callNvidia({ topic, signal }) {
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY
  if (!apiKey) {
    throw new Error(
      'No API key. Add VITE_NVIDIA_API_KEY to .env.local or switch to Mock mode in Settings.',
    )
  }

  const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: topic },
      ],
      temperature: 0.5,
      top_p: 1,
      max_tokens: 4096,
      stream: false,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(
      `NVIDIA NIM ${res.status}: ${errBody.slice(0, 200) || res.statusText}`,
    )
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from NVIDIA NIM')
  return extractJson(text)
}

// Resolves to mock data after a small delay so the agent cascade has time
// to play. Cancellable via AbortSignal.
function fakeFetchMock({ signal, delayMs = 3600 }) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(() => {
      // Deep clone so consumers can't mutate the source
      resolve(JSON.parse(JSON.stringify(MOCK_RESULT)))
    }, delayMs)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

function initialAgentStates() {
  return {
    scraper: 'ready',
    validator: 'ready',
    script: 'ready',
    hooks: 'ready',
  }
}

export function PipelineProvider({ children }) {
  const [topic, setTopicState] = useState(() => loadTopic())
  const [result, setResult] = useState(() => loadResult())
  const [agentStates, setAgentStates] = useState(initialAgentStates)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [mockMode, setMockModeState] = useState(() => loadMockMode())
  const toastTimer = useRef(null)
  const cascadeTimers = useRef([])
  const abortRef = useRef(null)

  // Persist topic + result + mode
  useEffect(() => {
    try {
      localStorage.setItem(TOPIC_KEY, topic)
    } catch {}
  }, [topic])

  useEffect(() => {
    try {
      if (result) localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } catch {}
  }, [result])

  useEffect(() => {
    try {
      localStorage.setItem(MOCK_KEY, String(mockMode))
    } catch {}
  }, [mockMode])

  const showToast = useCallback((message, tone = 'success', duration = 2800) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }, [])

  const setTopic = useCallback((next) => {
    setTopicState(next)
  }, [])

  const setMockMode = useCallback(
    (next) => {
      setMockModeState(next)
      showToast(
        next ? 'Switched to Mock mode' : 'Switched to Live mode',
        'info',
        2000,
      )
    },
    [showToast],
  )

  const clearCascade = () => {
    cascadeTimers.current.forEach((t) => clearTimeout(t))
    cascadeTimers.current = []
  }

  const runPipeline = useCallback(
    async (overrideTopic) => {
      const t = (overrideTopic ?? topic ?? '').trim()
      if (!t) {
        showToast('Add a topic first', 'error')
        return
      }
      if (isRunning) return

      // Abort any in-flight request
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setError(null)
      setIsRunning(true)
      clearCascade()

      // Sequential agent cascade for visual feedback
      const sequence = [
        { key: 'scraper', delay: 0 },
        { key: 'validator', delay: 1100 },
        { key: 'script', delay: 2200 },
        { key: 'hooks', delay: 3300 },
      ]

      // Reset all to ready, then walk forward
      setAgentStates(initialAgentStates())
      sequence.forEach(({ key, delay }, i) => {
        const startTimer = setTimeout(() => {
          setAgentStates((prev) => ({ ...prev, [key]: 'running' }))
        }, delay)
        cascadeTimers.current.push(startTimer)
        if (i > 0) {
          const prevKey = sequence[i - 1].key
          const doneTimer = setTimeout(() => {
            setAgentStates((prev) => ({ ...prev, [prevKey]: 'done' }))
          }, delay)
          cascadeTimers.current.push(doneTimer)
        }
      })

      try {
        const data = mockMode
          ? await fakeFetchMock({ signal: controller.signal })
          : await callNvidia({ topic: t, signal: controller.signal })

        clearCascade()
        setAgentStates({
          scraper: 'done',
          validator: 'done',
          script: 'done',
          hooks: 'done',
        })
        setResult(data)
        showToast(
          mockMode ? 'Mock pipeline done!' : 'Pipeline done!',
          'success',
        )
      } catch (e) {
        if (e.name === 'AbortError') return
        clearCascade()
        setAgentStates(initialAgentStates())
        setError(e.message || 'Pipeline failed')
        showToast(e.message?.slice(0, 80) || 'Pipeline failed', 'error', 4500)
      } finally {
        setIsRunning(false)
      }
    },
    [topic, isRunning, mockMode, showToast],
  )

  const resetResult = useCallback(() => {
    setResult(null)
    setAgentStates(initialAgentStates())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    showToast('Workspace cleared', 'info', 1800)
  }, [showToast])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCascade()
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  const value = useMemo(
    () => ({
      topic,
      setTopic,
      result,
      agentStates,
      isRunning,
      error,
      toast,
      mockMode,
      setMockMode,
      hasApiKey: HAS_API_KEY,
      runPipeline,
      resetResult,
      showToast,
    }),
    [
      topic,
      setTopic,
      result,
      agentStates,
      isRunning,
      error,
      toast,
      mockMode,
      setMockMode,
      runPipeline,
      resetResult,
      showToast,
    ],
  )

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  )
}

export function usePipeline() {
  const ctx = useContext(PipelineContext)
  if (!ctx) {
    throw new Error('usePipeline must be used inside <PipelineProvider>')
  }
  return ctx
}
