// Gesprochene Kartenzeilen nach TRIPLET_SSOT_R1 (V-698–700, Georg 24.10.): Bühnen-Dialog ohne abgenommenes Triplet (Rückfall).
//   A = POOL-Opener + **Titel** als ein Satz (nur Fragen: ein Titel allein trägt keine Behauptung) · B = gedruckte Lore, bereinigt (clean_lore aus dem
//   Modul der Deck-Songs-Sitzung, R1.2): Klammerzusätze, Etiketten mit Doppelpunkt, Stat-Angaben („Power: 100“) fallen weg. Die Power wird nie gesprochen.
//   Gesperrte Karten (SSOT S12) werden nie gezogen. Fett nur in der Anzeige (V-699; Blasen-Kern-Syntax *…*), die Daten bleiben Klartext.
// Rein, ohne three/DOM – Node-geprüft (test/unit/ssotLines.mjs). Daten: src/data/spoken/ssot-lines.r1.json (scripts/sync-spoken-lines.py).
import DATA from '../data/spoken/ssot-lines.r1.json' with { type: 'json' }

export const SSOT_LINES_ON = typeof location !== 'undefined' && /(^|[#,])lines=ssot(,|$)/.test(location.hash)   // Probe bis Georgs Blick
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
