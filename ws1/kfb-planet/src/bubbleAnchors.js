// S5a · Ankerpunkte für Sprechblasen (Host-Vertrag R1.2 §4). Module liefern `bubbleAnchors: [{ id, object3d, offset }]`
// im Rückgabeobjekt von create(); ModuleHost meldet sie hier an und beim Aushängen ab. Der Host darf eigene Anker
// mit fester Weltposition anmelden (z. B. die Spielfigur: `position` statt `object3d`).
const anchors = new Map()
export function registerAnchor({ id, object3d = null, position = null, offset = [0, 0, 0] }) {
  const a = { id, object3d, position, offset }
  anchors.set(id, a)
  return () => { if (anchors.get(id) === a) anchors.delete(id) }
}
// Weltposition des Ankers in `out`, oder null (unbekannt bzw. nicht in der Szene)
export function anchorAt(id, out) {
  const a = anchors.get(id)
  if (!a) return null
  if (a.object3d) { if (!a.object3d.parent) return null; a.object3d.getWorldPosition(out) } else if (a.position) out.copy(a.position)
  else return null
  return out.set(out.x + a.offset[0], out.y + a.offset[1], out.z + a.offset[2])
}
export const anchorIds = () => [...anchors.keys()]
// WS-NPC chat=syl (Lead 24.10., additiv): Fußpunkt des Ankers (object3d-Weltposition bzw. position ohne Versatz) – Figurenfläche, die Blasen meiden
export function anchorBaseAt(id, out) {
  const a = anchors.get(id)
  if (!a) return null
  if (a.object3d) { if (!a.object3d.parent) return null; return a.object3d.getWorldPosition(out) }
  return a.position ? out.copy(a.position) : null
}
