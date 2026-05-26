import { useCallback, useEffect, useState } from 'react'

// Persisted flag — once true, the install banner never shows again.
const DISMISSED_KEY = 'aicc:installDismissed'

/**
 * Captures the browser's `beforeinstallprompt` event and exposes a clean
 * API for triggering the native install dialog and tracking dismissal.
 *
 * Returns:
 *  - canInstall: true when the browser has fired BIP, the user has not
 *    dismissed before, and the app is not already running standalone.
 *  - promptInstall(): trigger the native install prompt. Returns the
 *    user's choice ({ outcome: 'accepted' | 'dismissed' }) or
 *    { outcome: 'unavailable' } if the prompt isn't ready.
 *  - dismiss(): permanently dismiss (sets the localStorage flag).
 *  - isStandalone: true if the app is already installed and running
 *    in standalone mode.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return (
        window.matchMedia?.('(display-mode: standalone)').matches ||
        // iOS Safari uses a non-standard property
        window.navigator.standalone === true
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleBIP = (e) => {
      // Stop the browser's mini-infobar so we can show our custom UI.
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleInstalled = () => {
      // The user accepted the install — clear the prompt and mark dismissed
      // so the banner never reappears.
      setDeferredPrompt(null)
      try {
        localStorage.setItem(DISMISSED_KEY, 'true')
      } catch {}
      setDismissed(true)
      setIsStandalone(true)
    }

    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(display-mode: standalone)')
        : null
    const handleStandaloneChange = (e) => setIsStandalone(e.matches)

    window.addEventListener('beforeinstallprompt', handleBIP)
    window.addEventListener('appinstalled', handleInstalled)
    mq?.addEventListener?.('change', handleStandaloneChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBIP)
      window.removeEventListener('appinstalled', handleInstalled)
      mq?.removeEventListener?.('change', handleStandaloneChange)
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true')
    } catch {}
    setDismissed(true)
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { outcome: 'unavailable' }
    }
    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      // The BIP event can only be used once. If accepted, `appinstalled`
      // will fire and set dismissed. If declined, leave dismissed alone
      // so the user can see the banner again on a future visit if the
      // browser re-fires BIP.
      setDeferredPrompt(null)
      return choice
    } catch (err) {
      return { outcome: 'error', error: err }
    }
  }, [deferredPrompt])

  return {
    canInstall: !!deferredPrompt && !dismissed && !isStandalone,
    isAvailable: !!deferredPrompt,
    isDismissed: dismissed,
    isStandalone,
    promptInstall,
    dismiss,
  }
}
