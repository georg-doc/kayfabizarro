// HUD-Telemetrie (WS1e, nur lesend): eine Umrechnung für die Tempo-Säule und die Flughöhe – Racer (M2Car) und Schwungflug zu Fuß (Elan in M1, Georg
// 25.10.: „Säule auch beim Fliegen zu Fuß“) liefern damit dasselbe Format. Beide Physiken rechnen in Welt-Einheiten; eine Welt-Einheit = WORLD_K / K
// J17-Meter (Standard 1, wscale=legacy 0,65). ms, Zonen, stall und agl in J17-Metern, kmh = ms × 3,6.
// Skalen-Ende = Höchsttempo ohne Boost (Boost läuft darüber hinaus, ein Effekt, keine Zone): Fahren FLOW.maxForward, Fliegen ELAN.sDive × J (bis dahin
// trägt die Schwerkraft). Grün bis 50 % (Fahren) bzw. bis sThrill (Fliegen, ab da laden die Fähigkeiten), Rot ab 85 % = am Limit. stall (nur Fliegen):
// unter sStall reißt die Strömung ab – das HUD zeigt das als eigenes Signal. agl = Höhe über Grund aus der Höhenfunktion der aktiven Welt (nicht abgetastet).
import { ELAN, elanSpeed } from './elan.js'
import { FLOW } from '../m2/k2t.js'
import { K } from './m1Scale.js'
import { WORLD_K } from '../worldScale.js'

export function speedScale(v, fly, J = 1) {
  const m = WORLD_K / K, top = fly ? ELAN.sDive * J : FLOW.maxForward
  const z = [['norm', fly ? ELAN.sThrill * J : 0.5 * top], ['fast', 0.85 * top], ['red', top]]
  return { ms: v * m, kmh: v * m * 3.6, zones: z.map(([n, x]) => [n, x * m]), stall: fly ? ELAN.sStall * J * m : null }
}
export const aglOf = (y, ground) => (ground == null || !Number.isFinite(ground) ? null : Math.max(0, (y - ground) * (WORLD_K / K)))

// Schwungflug zu Fuß: Elan-Zustand (ELAN_MEM.state) + Fußpunkt der Figur → gleiches Format wie M2STATE.telemetry im Racer-Flug
export function footFlightTelemetry(st, feet, groundAt) {
  if (!st) return null
  const v = elanSpeed(st)
  return { speed: v, fly: true, boosting: !!st.boosting, freeBoost: false, ...speedScale(v, true, st.J ?? 1), agl: feet ? aglOf(feet[1], groundAt(feet[0], feet[2])) : null, source: 'elan' }
}
