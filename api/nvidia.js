// Vercel Serverless Function — proxy for NVIDIA NIM chat completions.
//
// Why this exists:
// Calling https://integrate.api.nvidia.com/v1/chat/completions directly from
// the browser fails CORS. NVIDIA's API doesn't return Access-Control-Allow-*
// headers, so the browser blocks the response. This proxy runs server-side
// on Vercel (no CORS check between server and NVIDIA), and the browser only
// talks to /api/nvidia on the same origin (no CORS check at all).
//
// Bonus: the API key never leaves the server. Anyone inspecting the deployed
// frontend bundle won't find it.
//
// Setup on Vercel:
//   Project Settings → Environment Variables → add NVIDIA_API_KEY = nvapi-...
//   (Note: NO `VITE_` prefix. That prefix is for Vite client vars.
//    Server env vars are read by Node at runtime.)
//
// Local dev:
//   `vercel dev` runs both the Vite dev server and these /api routes together.
//   Plain `npm run dev` only runs Vite, so /api/nvidia will 404.

const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Server missing NVIDIA_API_KEY. Add it in Vercel → Project Settings → Environment Variables, then redeploy.',
    })
  }

  try {
    const upstream = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body ?? {}),
    })

    const text = await upstream.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // Upstream returned non-JSON (rare — usually an HTML error page).
      // Pass it through as a string in the error field.
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json(
        data ?? {
          error: `NVIDIA upstream ${upstream.status}: ${text.slice(0, 200) || upstream.statusText}`,
        },
      )
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({
      error: 'Proxy fetch failed: ' + (err?.message || 'unknown'),
    })
  }
}
