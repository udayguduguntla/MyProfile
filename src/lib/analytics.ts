type EventParams = Record<string, string>

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return
  const gtag = (window as Window & { gtag?: (command: 'event', eventName: string, parameters?: EventParams) => void }).gtag
  gtag?.('event', name, params)
}
