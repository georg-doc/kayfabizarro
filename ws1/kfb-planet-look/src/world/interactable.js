// Slice 1 · Interaktions-Vertrag `interactable` (F1-Kern, V-370; WS1_STATUS §62.1 F1b). Rein: ohne three, ohne DOM, Node-geprüft
// (test/unit/interactable.mjs). Module melden { id, pos, radius, label, action } an; der Host fragt je Bild nearest(spielerPos) und zeigt
// GENAU EINEN Hinweis (Prompt). Die Taste bleibt im einen Router (src/hostKeys.js, ACTION_KEYS.talk = KeyE): der Host-Handler ruft trigger().
// Keine eigenen Listener hier und in den Modulen (Host-Vertrag R1.2 §4).
// pos: [x, y, z] | { x, y, z } | () => eines davon (bewegte Ziele, z. B. NPC). Abstand 3D, oder nur xz mit flat: true.
// Hysterese: das aktuelle Ziel bleibt, solange es im Radius × keep liegt und kein anderes um mehr als margin Meter näher ist (kein Flackern
// zwischen zwei Nachbarn). Gleichstand: wer zuerst angemeldet wurde, gewinnt (stabil, unabhängig von Map-Reihenfolgen).
export const INTERACT = Object.freeze({ keep: 1.15, margin: 0.25, flat: false })

const xyz = (p) => { const q = typeof p === 'function' ? p() : p; if (!q) return null; return Array.isArray(q) ? q : [q.x, q.y, q.z] }

export function createInteractables(options = {}) {
  const O = { ...INTERACT, ...options }, items = new Map()
  let seq = 0, current = null
  const dist = (a, b, flat) => Math.hypot(a[0] - b[0], flat ? 0 : a[1] - b[1], a[2] - b[2])
  const api = {
    // Anmelden; gibt die Abmeldung zurück. Gleiche id ersetzt den alten Eintrag (Reihenfolge bleibt).
    register(it) {
      if (!it || it.id == null) throw new Error('INTERACTABLE_NO_ID')
      if (!(it.radius > 0)) throw new Error('INTERACTABLE_NO_RADIUS: ' + it.id)
      const old = items.get(it.id)
      items.set(it.id, { enabled: true, ...it, order: old ? old.order : seq++ })
      return () => api.unregister(it.id)
    },
    unregister(id) { const had = items.delete(id); if (current === id) current = null; return had },
    has: (id) => items.has(id),
    size: () => items.size,
    // nächstes Ziel in Reichweite oder null; mit Hysterese, merkt sich das Ergebnis
    nearest(playerPos, { hysteresis = true } = {}) {
      const pp = xyz(playerPos); if (!pp) { current = null; return null }
      let best = null
      for (const it of items.values()) {
        if (it.enabled === false || (it.when && !it.when())) continue
        const p = xyz(it.pos); if (!p) continue
        const d = dist(pp, p, it.flat ?? O.flat); if (d > it.radius) continue
        if (!best || d < best.d - 1e-9 || (Math.abs(d - best.d) <= 1e-9 && it.order < best.it.order)) best = { it, d }
      }
      if (hysteresis && current != null && items.has(current)) {
        const c = items.get(current), p = xyz(c.pos)
        if (p && c.enabled !== false && !(c.when && !c.when())) {
          const d = dist(pp, p, c.flat ?? O.flat)
          if (d <= c.radius * O.keep && (!best || best.it.id === current || best.d > d - O.margin)) { return api._pick(c, d) }
        }
      }
      return best ? api._pick(best.it, best.d) : ((current = null), null)
    },
    _pick(it, d) { current = it.id; return { id: it.id, label: it.label, distance: d, item: it } },
    current: () => current,
    // Aktion des aktuellen (bzw. jetzt nächsten) Ziels ausführen; true, wenn etwas passiert ist (dann ruft der Router e.preventDefault())
    trigger(playerPos) {
      const n = playerPos ? api.nearest(playerPos) : current != null && items.has(current) ? { item: items.get(current) } : null
      if (!n || typeof n.item.action !== 'function') return false
      n.item.action(n.item); return true
    },
    // Prompt-Daten für den Host (genau einer oder null)
    prompt(playerPos) { const n = api.nearest(playerPos); return n ? { id: n.id, label: n.label } : null },
    clear() { items.clear(); current = null },
  }
  return api
}
