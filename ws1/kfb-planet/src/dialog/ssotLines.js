// Gesprochene Kartenzeilen nach TRIPLET_SSOT_R1 (V-698–700, Georg 24.10.): Bühnen-Dialog ohne abgenommenes Triplet (Rückfall).
//   A = POOL-Opener + **Titel** als ein Satz (nur Fragen: ein Titel allein trägt keine Behauptung) · B = gedruckte Lore, bereinigt (clean_lore aus dem
//   Modul der Deck-Songs-Sitzung, R1.2): Klammerzusätze, Etiketten mit Doppelpunkt, Stat-Angaben („Power: 100“) fallen weg. Die Power wird nie gesprochen.
//   Gesperrte Karten (SSOT S12) werden nie gezogen. Fett nur in der Anzeige (V-699; Blasen-Kern-Syntax *…*), die Daten bleiben Klartext.
// Rein, ohne three/DOM – Node-geprüft (test/unit/ssotLines.mjs). Daten: src/data/spoken/ssot-lines.r1.json (scripts/sync-spoken-lines.py).
import DATA from '../data/spoken/ssot-lines.r1.json' with { type: 'json' }
import { lineStart, composeLine } from '../npc/tratschSim.js'   // tr1-Satzbau wie die Tratsch-SIM (SSOT S8): eine Quelle

export const SSOT_LINES_ON = typeof location !== 'undefined' && !/(^|[#,])lines=alt(,|$)/.test(location.hash)   // Georg 24.10.: Standard („schön so“); lines=alt = alte Blasen (Titel/Power, nur für die Alt-Tests d1stage/preview); ohne Browser (Node-Tests) alter Weg
export const SSOT_SOURCE = DATA.source
export const CALLS = Object.freeze({ bingo: 'Bingo!', boggle: 'Boggle...?', bongo: 'Bongo.', bloedsinn: 'Blödsinn!', humbug: 'Humbug?!' })   // V-699, genau so

const STAT = /\b(power|rage|attack|focus|hp|xp|score|level|lvl)\s*:?\s*[-+]?\d+(\.\d+)?\s*\.?/gi
const BRACKET = /\s*[([{][^)\]}]*[)\]}]/g
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 1:1 lore_fallback.py clean_lore (R1.2)
export function cleanLore(title, lore) {
  let s = String(lore || '').trim()
  s = s.replace(BRACKET, '')
  s = s.replace(STAT, '')
  s = s.replace(new RegExp(`^\\s*${esc(String(title || '').trim())}\\s*[:\\-–—]\\s*`, 'i'), '')
  s = s.replace(/^\s*[A-Z0-9][A-Z0-9 '&!?.\-]{2,}:\s*/, '')
  s = s.replace(/\s*:\s*/g, '. ')
  s = s.replace(/\.\s*\./g, '.')
  s = s.replace(/\s{2,}/g, ' ').replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')
  if (s && s[0] === s[0].toLowerCase() && s[0] !== s[0].toUpperCase()) s = s[0].toUpperCase() + s.slice(1)
  return s
}
// Titel ohne Klammerzusatz (S7), Kartentitel in der Anzeige fett (V-699)
export const spokenTitle = (name) => String(name || '').replace(BRACKET, '').replace(/\s{2,}/g, ' ').trim()

const BLOCKED = new Map(Object.entries(DATA.blocked).map(([d, nums]) => [d, new Set(nums)]))
export const isBlocked = (deckId, num) => !!BLOCKED.get(deckId)?.has(+num)

// Opener-Rotation je Szene: kein Opener zweimal, solange noch andere frei sind (S9); nur Frage-Opener (A im Rückfall)
export function createOpenerRotation(openers = DATA.openersA.filter((o) => o.q)) {
  const used = new Set(); let k = 0
  return {
    next() { if (used.size >= openers.length) used.clear(); for (let i = 0; i < openers.length; i++) { const o = openers[(k + i) % openers.length]; if (!used.has(o.id)) { used.add(o.id); k = (k + i + 1) % openers.length; return o } } return openers[0] },
    used: () => [...used],
  }
}

// A: „Have you heard of *The Heel Promoter*?“ (*…* = fett im Blasen-Kern) · B: bereinigte Lore (leer → null, dann schweigt B)
export function lineA(card, opener) { const t = spokenTitle(card.name); return t ? `${opener.text} *${t}*${opener.q ? '?' : '.'}` : null }
export function lineB(card) { const l = cleanLore(card.name, card.lore); return l || null }

// ---- tr1 (Tratsch-Triplets, Entwurf; Probe hinter lines=tr1): A = Satz-Opener + Triplet als ein Satz · B = Ruf (V-699) · bei Boggle legt A die Lore nach,
// die das Triplet nicht enthält (TRIPLET_SSOT: nie derselbe Text zweimal). Opener vor ganzen Sätzen nur clause_ok bzw. own_clause (S8).
export const TR1_ON = typeof location !== 'undefined' && /(^|[#,])lines=tr1(,|$)/.test(location.hash)
export const TR1_STATUS = DATA.tr1Status
export const tr1Line = (deckId, num) => DATA.tr1?.[deckId]?.[String(+num)] || null
// Satzanfang einer tr1-Zeile: 'title' (beginnt mit dem Kartentitel), 'func' (Artikel, Präposition …), 'other' (z. B. Imperativ „Collect …“)
export const tr1Start = (card) => { const t = tr1Line(card?.deck?.id, card?.num); return t ? lineStart(spokenTitle(card.name), t) : 'other' }
// Satz-Opener (into_title mit clause_ok) nur vor Titel oder Funktionswort; own_clause immer (SSOT S8). next(start) wählt passend, ohne start wie bisher
const fitsStart = (o, start) => start == null || o.slot === 'own_clause' || start !== 'other'
export function createSentenceOpenerRotation(openers = DATA.openersT) {
  const used = new Set(); let k = 0, lastQ = null
  return { next(start = null) { const fit = openers.filter((o) => fitsStart(o, start)); if (fit.every((o) => used.has(o.id))) for (const o of fit) used.delete(o.id)
    const pick = (wantQ) => { for (let i = 0; i < openers.length; i++) { const o = openers[(k + i) % openers.length]; if (!used.has(o.id) && fitsStart(o, start) && (wantQ == null || o.q === wantQ)) { used.add(o.id); k = (k + i + 1) % openers.length; return o } } return null }
    const o = pick(lastQ == null ? null : !lastQ) || pick(null) || fit[0] || openers[0]; lastQ = o.q; return o } }
}
const boldTitle = (t, title) => (title && t.includes(title) ? t.replace(title, `*${title}*`) : t)
// Opener + Triplet als ein Satz, gebaut wie in der Tratsch-SIM (composeLine): Satz-Opener + Zeile (klein nur nach Funktionswort), own_clause mit Punkt
// (Komma nur beim Szenenwechsel), Frage-Opener und „What if“ → „?“
export function lineT(card, opener, triplet) {
  const title = spokenTitle(card.name), t = triplet.trim(), start = lineStart(title, t)
  return boldTitle(composeLine({ opener: opener.text, slot: opener.slot, class: opener.q ? 'Q' : 'S', stance: opener.stance }, t, start), title)
}
const words = (s) => new Set(String(s).toLowerCase().match(/[a-z']{4,}/g) || [])
// Lore-Satz, der im Triplet noch nicht steckt (weniger als die Hälfte seiner Wörter schon gesagt); sonst null
export function boggleLore(card, triplet) {
  const said = words(triplet), sentences = cleanLore(card.name, card.lore).split(/(?<=[.!?])\s+/).filter(Boolean)
  for (const sn of sentences) { const w = [...words(sn)]; if (w.length && w.filter((x) => said.has(x)).length / w.length < 0.5) return sn }
  return null
}
