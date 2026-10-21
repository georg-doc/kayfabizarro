// V-391 · Figuren nur über ihre Karte (src/data/figures/<id>.figure.json, kfb.figure/1, WS0 FIGURES_R1). Eine Bühne fragt hier nach einer Figur und bekommt
// entweder die Darsteller-Optionen (Körper = Karten-GLB, Gesicht wie bisher über das Rezept) oder eine Ablehnung, die als rotes Schild erscheint.
// Figuren ohne Karte (rohe KayKit-Kandidaten) werden abgelehnt; nur der Casting-Vergleich (Hash uncarded=1, Test cast F-4) darf sie noch zeigen.
import { checkCard } from './figureCheck'
import { FB, KAYKIT, KAYKIT_CLIPS, CLASS_SCALE } from './stageCast'
import { FIGURE_FILES } from './figureFiles'
import SHA from '../data/figures/assets.sha.json'
const CARDS = Object.fromEntries(Object.entries(import.meta.glob('../data/figures/*.figure.json', { eager: true, import: 'default' })).map(([k, v]) => [k.split('/').pop().replace('.figure.json', ''), v]))
const VARIANTS = Object.fromEntries(Object.values(import.meta.glob('../data/figures/variants/*.json', { eager: true, import: 'default' })).map((v) => [v.base, v]))
const RECIPES = import.meta.glob('../data/figures/recipes/*.json', { eager: true, import: 'default' })
const GLBS = import.meta.glob('../assets/actors/**/*.glb', { eager: true, query: '?url', import: 'default' })
const urlOf = (id) => GLBS['../assets/actors/' + FIGURE_FILES[id]] || null
// Darsteller-Bausteine je Karten-id (Gesicht/Rezept wie bisher); der Körper kommt aus der Karte
// C2 (V-409/V-422): Kopfteil-Figuren (Aliens) laden ihren Körper zur Laufzeit über den Loader (feste Adresse, sha256 im Browser); Darsteller-Rezept
// aus der Karte, Gesichts-Besitzer = Loader. Variante (Sockelrand 80°) hängt an Karte und Karten-sha256.
const headpartRecipe = (c) => ({ schema: 'kfb.actor-recipe/0.2-candidate', primaryFormat: 'kfb.pets/1', source: { selectedId: c.id, rigFamily: 'Rig_Medium', label: c.displayName + ' (Figurenkarte)' },
  composition: { modelRef: { path: c.body.glb.path, revision: c.body.glb.commit, blob: c.body.glb.blob }, faceOwners: { face: 'vendor/figure/kfb-figure-loader.v1.js#headpart', eye: 'pet-eye-rig.v6 + E2 clay-skin-attach.v1', mouth: 'später (Karte: mouth decal-set)' } } })
const HEADPART = (id, x, yaw, a) => { const c = CARDS[id]
  return { recipe: headpartRecipe(c), faceDriver: 'KFB_NATIVE', card: c, variant: VARIANTS[id] || null, figureRecipe: RECIPES['../data/figures/recipes/' + c.body.recipe.path.split('/').pop()],
    clipsUrl: KAYKIT_CLIPS, motion: 'Idle_A', classScale: CLASS_SCALE, position: [x, 0, -1.4], yaw, anchorId: a } }
const BUILD = { frizzlebob: (x, yaw, a) => FB(x, yaw, a), gothgirl: (x, yaw, a) => ({ ...KAYKIT('gothgirl')(x, yaw, a), url: urlOf('gothgirl'), originals: CARDS.gothgirl?.originals }),
  lord_hunky: (x, yaw, a) => HEADPART('lord_hunky', x, yaw, a), lady_dory: (x, yaw, a) => HEADPART('lady_dory', x, yaw, a) }
export const figureCards = () => ({ ...CARDS })
export function figureFor(id, { where = 'stage', allowUncarded = false } = {}) {
  const card = CARDS[id]
  if (!card) return allowUncarded ? { ok: true, uncarded: true, build: KAYKIT(id) } : { ok: false, id, reason: 'keine Figurenkarte' }
  const runtime = card.eyeRig?.seat === 'headpart-socket' && !FIGURE_FILES[id] // Körper kommt zur Laufzeit, sha256 prüft der Loader beim Laden
  const chk = checkCard(card, { sha256: runtime ? card.body.glb.sha256 : SHA[id]?.sha256 || null, where })
  if (!chk.ok) return { ok: false, id, reason: chk.reason, card }
  return { ok: true, id, card, status: chk.status, build: BUILD[id] || null, reason: BUILD[id] ? null : 'kein Bühnen-Baustein' }
}
