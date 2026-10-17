// V-391 · Figuren nur über ihre Karte (src/data/figures/<id>.figure.json, kfb.figure/1, WS0 FIGURES_R1). Eine Bühne fragt hier nach einer Figur und bekommt
// entweder die Darsteller-Optionen (Körper = Karten-GLB, Gesicht wie bisher über das Rezept) oder eine Ablehnung, die als rotes Schild erscheint.
// Figuren ohne Karte (rohe KayKit-Kandidaten) werden abgelehnt; nur der Casting-Vergleich (Hash uncarded=1, Test cast F-4) darf sie noch zeigen.
import { checkCard } from './figureCheck'
import { FB, KAYKIT } from './stageCast'
import { FIGURE_FILES } from './figureFiles'
import SHA from '../data/figures/assets.sha.json'
const CARDS = Object.fromEntries(Object.entries(import.meta.glob('../data/figures/*.figure.json', { eager: true, import: 'default' })).map(([k, v]) => [k.split('/').pop().replace('.figure.json', ''), v]))
const GLBS = import.meta.glob('../assets/actors/**/*.glb', { eager: true, query: '?url', import: 'default' })
const urlOf = (id) => GLBS['../assets/actors/' + FIGURE_FILES[id]] || null
// Darsteller-Bausteine je Karten-id (Gesicht/Rezept wie bisher); der Körper kommt aus der Karte
const BUILD = { frizzlebob: (x, yaw, a) => FB(x, yaw, a), gothgirl: (x, yaw, a) => ({ ...KAYKIT('gothgirl')(x, yaw, a), url: urlOf('gothgirl'), originals: CARDS.gothgirl?.originals }) }
export const figureCards = () => ({ ...CARDS })
export function figureFor(id, { where = 'stage', allowUncarded = false } = {}) {
  const card = CARDS[id]
  if (!card) return allowUncarded ? { ok: true, uncarded: true, build: KAYKIT(id) } : { ok: false, id, reason: 'keine Figurenkarte' }
  const chk = checkCard(card, { sha256: SHA[id]?.sha256 || null, where })
  if (!chk.ok) return { ok: false, id, reason: chk.reason, card }
  return { ok: true, id, card, status: chk.status, build: BUILD[id] || null, reason: BUILD[id] ? null : 'kein Bühnen-Baustein' }
}
