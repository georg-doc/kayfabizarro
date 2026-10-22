// Vertrag §6: Debug-Zugang nur über window.__kfb* UND einen URL-Schalter (#debug, #hosttest).
export const DEBUG = typeof location !== 'undefined' && /debug|hosttest/.test(location.hash)
// setzt window.__kfb<name> nur mit Schalter
// DEVUI: Entwicklertexte im Spielbild (Abnahme-Schilder, Kit-Notizen) – nur im Testmodus, und nicht mit „clean“ (Kritiker-/Belegbilder wie für Spieler, Georg 22.10.)
export const DEVUI = DEBUG && !/(^|[#,])clean(,|$)/.test(typeof location !== 'undefined' ? location.hash : '')
export function expose(name, value) { if (DEBUG && typeof window !== 'undefined') window['__kfb' + name] = value }
