export const siteConfig = {
  name: 'Uday Kumar Guduguntla',
  shortName: 'Uday',
  title: 'Uday Kumar Guduguntla | AI Engineer',
  description: 'AI engineer portfolio covering retrieval, conversational systems, semantic layers, and Python automation.',
  url: 'https://uday-guduguntla.vercel.app',
  locale: 'en_US',
  legacyHosts: ['my-profile-ten-brown.vercel.app'],
  googleVerification: 'OkEMApdkUk61DIdra9BpjxEbrxyUirzbBShDre_iHeo',
} as const

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}
