// Zentraler Figuren-Leser (V-394 Register CHARACTERS_R1): eine Stelle, an der das Spiel von einer beliebigen
// Figuren-, Karten- oder Varianten-ID zum Register-Datensatz kommt. Snapshot gepinnt per scripts/sync-characters.py.
// Nicht gesetzt (todo / PREFILL / DESIGN) = null – kein stiller Rückfall; wer einen braucht, entscheidet ihn sichtbar beim Aufrufer.
import SNAP from '../data/characters/registry.r1.json' with { type: 'json' }

export const REGISTRY_SOURCE = SNAP.source
const C = SNAP.characters
const lower = (s) => String(s).toLowerCase()

// Varianten-Suffix abtrennen: '<id>:<farbe>[:helm]' → '<id>' (Farbe/Helm sind Laufzeit-Varianten, keine eigenen Figuren)
export function splitVariant(id) {
  const [base, ...rest] = String(id ?? '').split(':')
  return { base, variant: rest.filter(Boolean) }
}

// id → kanonische Register-ID oder null. scope = Schlüssel aus aliases.scoped (z. B. 'S10.disco_street_01') für Kurzrollen.
export function resolveCharacterId(id, scope) {
  const { base } = splitVariant(id)
  if (!base) return null
  const sc = scope && SNAP.scoped[scope]
  if (sc && base in sc) { const v = sc[base]; return Array.isArray(v) ? null : v }
  for (const c of [base, lower(base), lower(base).replace(/-/g, '_')]) {
    if (C[c]) return c
    if (SNAP.aliases[c]) return SNAP.aliases[c]
    if (SNAP.qualified[c]) return SNAP.qualified[c]
  }
  // Fluffer-Sorten aus K15 ('alien', 'alien_healed') → q_<sorte>
  const q = 'q_' + lower(base).replace(/-/g, '_').replace(/_(healed|kfbeyes)$/, '')
  return C[q] ? q : null
}

// Datensatz (eingefroren) oder null. Felder: id, kind, name, displayName, aliases, chatter, voice, figureRefs, todoFields[, chatterPrefill]
export function characterOf(id, scope) {
  const c = resolveCharacterId(id, scope)
  return c ? C[c] : null
}

// Bequemlichkeit für WS-Audio: Chatter oder null (PREFILL nur, wenn ausdrücklich verlangt – dann mit Markierung)
export function chatterOf(id, { prefill = false } = {}) {
  const r = characterOf(id)
  if (!r) return null
  if (r.chatter) return { ...r.chatter, status: 'set' }
  if (prefill && r.chatterPrefill) return { family: null, instrument: null, style: null, ...r.chatterPrefill, status: 'prefill' }
  return null
}

export const voiceOf = (id) => characterOf(id)?.voice ?? null
export const isExcluded = (id) => SNAP.excluded.includes(splitVariant(id).base)
export const unresolvedCandidates = (id) => SNAP.unresolved[splitVariant(id).base] ?? null
export const characterIds = () => Object.keys(C)

for (const k in C) Object.freeze(C[k])
