// Vertrag §6: Debug-Zugang nur über window.__kfb* UND einen URL-Schalter (#debug, #hosttest).
export const DEBUG = typeof location !== 'undefined' && /debug|hosttest/.test(location.hash)
// setzt window.__kfb<name> nur mit Schalter
// DEVUI: Entwicklertexte im Spielbild (Abnahme-Schilder, Kit-Notizen) – nur im Testmodus, und nicht mit „clean“ (Kritiker-/Belegbilder wie für Spieler, Georg 22.10.)
// V-655 (Georg 22.10.): zusätzlich zur Laufzeit über die Settings (Zahnrad, Schalter „Entwickler-Infos“). DEVUI ist ein Live-Binding (export let):
// Importe sehen den neuen Wert sofort; wer Text schon gezeichnet hat, hört auf onDevUi. Wert = „clean“ ? immer aus : gespeicherte Wahl ?? Testmodus.
const CLEAN = /(^|[#,])clean(,|$)/.test(typeof location !== 'undefined' ? location.hash : '')
const DEVUI_KEY = 'kfb.devui.v1'
const stored = () => { try { const v = localStorage.getItem(DEVUI_KEY); return v === '1' ? true : v === '0' ? false : null } catch { return null } }
export let DEVUI = CLEAN ? false : (stored() ?? DEBUG)
const devSubs = new Set()
export function setDevUi(on) {
  if (CLEAN) on = false // Kritiker-/Belegbilder bleiben spielerrein
  on = !!on; try { localStorage.setItem(DEVUI_KEY, on ? '1' : '0') } catch { /* privates Fenster: nur für diese Sitzung */ }
  if (on === DEVUI) return DEVUI
  DEVUI = on; for (const fn of [...devSubs]) { try { fn(on) } catch (e) { console.warn('[devui]', e) } }
  return DEVUI
}
export function onDevUi(fn) { devSubs.add(fn); return () => devSubs.delete(fn) }
export const devUiLocked = () => CLEAN
export function expose(name, value) { if (DEBUG && typeof window !== 'undefined') window['__kfb' + name] = value }
