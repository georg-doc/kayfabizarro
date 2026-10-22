// MVP-Startseite (V-618) · Qualitätsstufe = Auflösungs-Deckel (dpr) der Spielwelt. Gemerkt je Browser (localStorage, mit try/catch), Hash q=fast|standard|sharp überschreibt.
// Standard entspricht dem bisherigen M1-Wert [1, 1,25]. Messung: dpr 2 auf 2880×1800 kostete 112 ms je Bild (MVP_SITE_STATUS R1).
export const QUALITY = Object.freeze({ fast: { label: 'Schnell', dpr: 1 }, standard: { label: 'Standard', dpr: [1, 1.25] }, sharp: { label: 'Scharf', dpr: [1, 1.5] } })
const KEY = 'kfb.quality'
export function qualityKey() {
  const h = typeof location !== 'undefined' ? /(^|[#,])q=(fast|standard|sharp)/.exec(location.hash) : null; if (h) return h[2]
  try { const v = localStorage.getItem(KEY); if (v && QUALITY[v]) return v } catch (e) { /* privat/gesperrt: Standard */ }
  return 'standard'
}
export const m1Dpr = () => QUALITY[qualityKey()].dpr
export function setQuality(k) { if (!QUALITY[k]) return; try { localStorage.setItem(KEY, k) } catch (e) { /* ohne Speicher gilt die Wahl nur jetzt */ } if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('kfb:quality', { detail: { key: k, dpr: QUALITY[k].dpr } })) }
