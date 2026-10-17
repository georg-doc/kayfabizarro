// V-391 · Figurenkarten-Prüfung (kfb.figure/1, FIGURE_SCHEMA_R1 Regel 2 und 5). Rein, ohne three und ohne DOM, damit Bühne und QA-Test dieselbe Regel nutzen.
// checkCard(card, { sha256, where }) → { ok, reason }. where = 'stage' | 'proof' | 'workshop' (Status-Tor: approved überall, candidate auf Bühne/Beweis mit
// Vermerk außerhalb des Bildes, open-design nur in der Figuren-Werkstatt).
export const FIGURE_SCHEMA = 'kfb.figure/1'
export function checkCard(card, { sha256 = null, where = 'stage' } = {}) {
  if (!card) return { ok: false, reason: 'keine Karte' }
  if (card.schema !== FIGURE_SCHEMA) return { ok: false, reason: 'Schema ist nicht ' + FIGURE_SCHEMA }
  if (!card.eyeRig) return { ok: false, reason: 'eyeRig fehlt' }
  if (card.eyeRig.required === false && !card.eyeRig.none?.reason) return { ok: false, reason: 'eyeRig.required=false ohne none.reason' }
  if (!card.body?.glb?.sha256) return { ok: false, reason: 'body.glb.sha256 fehlt' }
  if (sha256 !== card.body.glb.sha256) return { ok: false, reason: sha256 ? 'Körper-GLB passt nicht zur Karte (sha256)' : 'kein lokaler Körper zur Karte' }
  if (!card.material) return { ok: false, reason: 'material fehlt' }
  if (!(card.material.sheenMax <= 0.05)) return { ok: false, reason: 'material.sheenMax > 0,05' }
  const st = card.approval?.status
  if (st === 'open-design' && where !== 'workshop') return { ok: false, reason: 'open-design: nur Figuren-Werkstatt' }
  if (!['approved', 'candidate', 'open-design'].includes(st)) return { ok: false, reason: 'approval.status fehlt' }
  return { ok: true, reason: null, status: st }
}
