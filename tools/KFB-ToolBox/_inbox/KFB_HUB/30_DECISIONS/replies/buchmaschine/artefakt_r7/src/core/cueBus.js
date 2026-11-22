// N-120/N-124 (Q-067 S1) · Die Ereignis-Uhr: Ereignisse werden im Schritt gesammelt und nach der Logik EINMAL verteilt (flush), sortiert nach Zeit,
// dann Akteur, entdoppelt (gleicher Name + Akteur + Schlüssel im selben Schritt nur einmal). Was ein Zuhörer beim Verteilen auslöst, wirkt erst im
// nächsten flush. emit(name, daten, { sofort: true }) verteilt ohne Warten (nur für Dinge, die im selben Schritt gebraucht werden).
// marken(tAlt, tNeu, länge, schleife, liste): welche Zeit-Marken eines Clips/Rezepts im Intervall (tAlt, tNeu] liegen, auch über mehrere Schleifen.
// Rein, ohne three/React; Node-geprüft (test/unit/cueBus.mjs). Namen nach TRANSITIONS_R1: portal.cross, world.ready, zustand:betreten …
export function createCueBus({ maxLog = 64 } = {}) {
  const subs = new Map(), log = []
  let queue = [], n = 0
  const deliver = (e) => {
    log.push(e); if (log.length > maxLog) log.shift()
    for (const key of [e.name, '*']) for (const fn of subs.get(key) || []) { try { fn(e) } catch (err) { console.warn('[cueBus]', e.name, err) } }
  }
  return {
    on(name, fn) { const l = subs.get(name) || new Set(); l.add(fn); subs.set(name, l); return () => l.delete(fn) },
    emit(name, daten = null, { t = 0, akteur = '', schluessel = '', sofort = false } = {}) {
      const e = { name, daten, t, akteur, schluessel, i: n++ }
      if (sofort) deliver(e); else queue.push(e)
      return e
    },
    flush() {
      if (!queue.length) return 0
      const q = queue; queue = []
      const seen = new Set(), out = []
      for (const e of q) { const k = e.name + '|' + e.akteur + '|' + e.schluessel; if (e.schluessel !== null && seen.has(k)) continue; seen.add(k); out.push(e) }
      out.sort((a, b) => a.t - b.t || (a.akteur < b.akteur ? -1 : a.akteur > b.akteur ? 1 : 0) || a.i - b.i)
      for (const e of out) deliver(e)
      return out.length
    },
    pending: () => queue.length,
    log: () => log.slice(),
    clear() { queue = []; log.length = 0 },
  }
}

// Marken im halboffenen Intervall (tAlt, tNeu]; bei schleife wird über ganze Durchläufe gezählt (3 Schleifen in einem Schritt → 3-mal).
// liste: [{ t, name }] mit 0 ≤ t ≤ länge. Rückgabe in zeitlicher Folge.
export function marken(tAlt, tNeu, laenge, schleife, liste) {
  const out = []
  if (!(tNeu > tAlt) || !liste?.length) return out
  if (!schleife || !(laenge > 0)) { for (const m of liste) if (m.t > tAlt && m.t <= tNeu) out.push(m); return out.sort((a, b) => a.t - b.t) }
  const k0 = Math.floor(tAlt / laenge), k1 = Math.floor(tNeu / laenge)
  for (let k = k0; k <= k1; k++) for (const m of [...liste].sort((a, b) => a.t - b.t)) { const ta = k * laenge + m.t; if (ta > tAlt && ta <= tNeu) out.push({ ...m, runde: k }) }
  return out
}
