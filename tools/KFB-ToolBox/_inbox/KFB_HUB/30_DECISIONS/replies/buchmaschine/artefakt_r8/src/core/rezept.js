// N-123/N-124 (Q-067 S2) · Übergangs-Rezepte nach TRANSITIONS_R1 §2.3: ein Rezept ist Daten (Phasen, Spuren, Marken mit Zeitspanne) und eine reine
// Funktion von t. Ein Lauf zählt t in Spielzeit (Gruppe welt der einen Uhr) und meldet über den Bus: <marke> beim Eintritt in die Spanne,
// <marke>:ende beim Austritt, phase:<id> beim Phasenwechsel, rezept:fertig am Ende. Marken mit requires warten auf das Ereignis (z. B. world.ready).
// spur(name) liest eine Schlüssel-Spur [[t, wert], …] linear; input.weight < 0,5 heißt: Eingaben gesperrt.
// Rein, ohne three/React; Node-geprüft (test/unit/kernUhr.mjs).
import { marken } from './cueBus.js'

export const keyWert = (keys, t) => {
  if (!keys?.length) return null
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return v0 + (v1 - v0) * ((t - t0) / (t1 - t0 || 1)) }
  return keys[keys.length - 1][1]
}
export const rezeptEnde = (R) => Math.max(0, ...(R.phases || []).map((p) => p.t?.[1] ?? 0), ...(R.markers || []).map((m) => m.span?.[1] ?? m.t ?? 0))

export function createRezeptLauf(R, { bus = null, akteur = 'rezept', daten = null } = {}) {
  const ende = rezeptEnde(R), start = Math.min(0, ...(R.phases || []).map((p) => p.t?.[0] ?? 0))
  const auf = (R.markers || []).map((m) => ({ t: (m.span?.[0] ?? m.t ?? 0) - start, name: m.id, requires: m.requires || null }))
  const zu = (R.markers || []).filter((m) => m.span).map((m) => ({ t: m.span[1] - start, name: m.id + ':ende' }))
  const L = { id: R.id, t: 0, ende: ende - start, phase: null, fertig: false, warten: new Set(), gehalten: 0, offen: [] }
  const melde = (name, extra) => bus?.emit(name, { rezept: R.id, ...daten, ...extra }, { akteur, schluessel: R.id + '|' + name })
  const phaseBei = (t) => (R.phases || []).find((p) => p.t && t + start >= p.t[0] && t + start < p.t[1])?.id ?? null
  if (bus) for (const m of auf) if (m.requires) { L.warten.add(m.requires); const off = bus.on(m.requires, () => { L.warten.delete(m.requires); off() }) }
  return {
    L,
    tick(dt) {
      if (L.fertig) return L
      // offene Marken mit requires: erst melden, wenn das Ereignis da war; bis dahin hält der Lauf an der Marke (höchstens maxHold)
      const halt = auf.find((m) => m.requires && L.warten.has(m.requires) && m.t <= L.t + dt && m.t > L.t - 1e-9)
      const maxHold = (R.phases || []).find((p) => p.maxHold)?.maxHold ?? 6
      if (halt && L.gehalten < maxHold) { L.gehalten += dt; return L }
      const t0 = L.t, t1 = Math.min(L.t + dt, L.ende); L.t = t1
      for (const m of marken(t0 - (t0 === 0 ? 1e-9 : 0), t1, L.ende, false, [...auf, ...zu])) melde(m.name, { t: +(m.t + start).toFixed(3) })
      const ph = phaseBei(t1); if (ph !== L.phase) { L.phase = ph; if (ph) melde('phase:' + ph) }
      if (t1 >= L.ende - 1e-9) { L.fertig = true; melde('rezept:fertig') }
      return L
    },
    spur: (name) => keyWert(R.tracks?.[name]?.weight ?? R.tracks?.[name]?.keys, L.t + start),
    gesperrt() { const w = keyWert(R.tracks?.input?.weight, L.t + start); return !L.fertig && w != null && w < 0.5 },
  }
}
