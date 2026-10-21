// MVP-Site (V-618) · Nur im Site-Build (VITE_KFB_SITE): Repo-Abrufe gehen über die eigene Site (/raw/<ref>/<pfad>, functions/raw) statt direkt zu
// raw.githubusercontent.com bzw. jsDelivr – so funktionieren sie hinter dem Passwort und auch, wenn kayfabizarro privat wird (V-599).
// Lokal und in der öffentlichen Vorschau bleibt alles unverändert.
import { DefaultLoadingManager } from 'three'
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/', JSD = /^https:\/\/cdn\.jsdelivr\.net\/gh\/georg-doc\/kayfabizarro@([^/]+)\//
export const siteRawUrl = (u) => { if (typeof u !== 'string') return u; if (u.startsWith(RAW)) return '/raw/' + u.slice(RAW.length); const m = JSD.exec(u); return m ? `/raw/${m[1]}/${u.slice(m[0].length)}` : u }
export function installSiteRaw() {
  if (!import.meta.env.VITE_KFB_SITE || typeof window === 'undefined' || window.__kfbSiteRaw) return
  window.__kfbSiteRaw = true
  DefaultLoadingManager.setURLModifier(siteRawUrl)
  const f = window.fetch.bind(window)
  window.fetch = (input, init) => f(typeof input === 'string' ? siteRawUrl(input) : input instanceof Request && siteRawUrl(input.url) !== input.url ? new Request(siteRawUrl(input.url), input) : input, init)
}
installSiteRaw()
