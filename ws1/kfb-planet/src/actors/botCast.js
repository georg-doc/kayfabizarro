// WS-NPC Phase D (Georg 21.10.: Bots als Arbeitstrupp) · Kayfabrick-Bots aus WSB B17 r1 (PROOF: „WS0 prüft, dann Georg“), optional aus src/private
// (gitignored, Verweis auf ~/kfb-ws1/private-assets). Robot_Two ist KayKit-Kauf → nie im Repo. Fehlen die Dateien: null (der Host stellt einen Platzhalter).
// Augen: KFB-Augen-Rig an KFB_Eye_L/R_anchor (Karte kayfabrick_bot.figure.r1). Georgs Batch hat kein Robot_Two-Profil → Klassen-Standard Rig_Medium
// (classDefault des Batches) + Werte der Karte (R, pupilStyle, pupilSize, Lid-Farbe) + Sitz aus den Ankern (eyeActor eyeAnchors, deriveSourceAnchorSeed).
// Augen sind PROOF (Lead 21.10.): Georg sieht ein Frontbild, bevor davon etwas Richtung main geht.
// Clips der Datei: Idle_A, kfb_bot_carry_a (Gehen mit Block), kfb_bot_angry_a (Rennen, Fäuste hoch), kfb_bot_sisyphus_a. Gang-Mischer (m1-gait: Walking_B, Running_A): Walking_B → carry,
// Running_A → angry (Kit-Clips as-is, nur umbenannt). Block (KayfabrickBlock_<farbe>) am KFB_Carry_anchor, sichtbar nur beim Tragen (Karte: visibleIn carry).
import recipeBase from '../data/actors/cast/toy-soldier.recipe.json'
import castPick from '../data/eyes/cast/toy-soldier.profile.json' // nur classDefault (Georgs Batch @ac9dbaed, Klassen-Standard Rig_Medium)
import contract from '../data/eyes/kfb-pet-graft-driver.v4.json'
import { KAYKIT_CLIPS, CLASS_SCALE } from './stageCast'
import SRC from '../data/actors/cast/kayfabrick-bot.sources.json' // Herkunft (Commit, Blob) der privaten Dateien für den Darsteller-Vertrag

// Nur die Dateien, die residents.r1.json nutzt (Lead 22.10.: Build klein; bot_crew tragic/comic/absurd mit Helm, ihre Blöcke, Station tragic). Neue Farbe → hier ergänzen.
const FILES = import.meta.glob(['../private/50_BLENDER/B17/_privat_kauf_asset/KayfabrickBot_{tragic,comic,absurd}_helm.r1.glb', '../private/50_BLENDER/B17/_privat_kauf_asset/KayfabrickBlock_{tragic,comic,absurd}.r1.glb', '../private/50_BLENDER/B17/_privat_kauf_asset/KayfabrickStation_tragic.r1.glb'], { eager: true, query: '?url', import: 'default' })
const URL = Object.fromEntries(Object.entries(FILES).map(([k, v]) => [k.split('/').pop(), v]))
// Werte der Figurenkarte B17/data/kayfabrick_bot.figure.r1.json (eyeRig.settings, eyeRig.lid, eyeRig.anchors) und b17_bots.json (eyes.R)
export const BOT_CARD = Object.freeze({ R: 0.085, pupilStyle: 'matte-cute', pupilSize: 0.4, lid: '#4a5058', anchors: { l: 'KFB_Eye_L_anchor', r: 'KFB_Eye_R_anchor' }, carryAnchor: 'KFB_Carry_anchor',
  colours: ['tragic', 'comic', 'absurd', 'heroic', 'mystical', 'forbidden'] })

// castId 'kayfabrick-bot:<farbe>[:helm]' → Darsteller-Optionen oder null
export function botCast(castId) {
  const m = /^kayfabrick-bot:([a-z]+)(:helm)?$/.exec(castId || ''); if (!m || !BOT_CARD.colours.includes(m[1])) return null
  const body = `KayfabrickBot_${m[1]}${m[2] ? '_helm' : ''}.r1.glb`, url = URL[body]
  if (!url) return null
  const cd = castPick.classDefault.eye
  const profile = { schema: 'kfb.eye-profile/0.1-candidate', actorId: 'kayfabrick-bot', status: 'UNREVIEWED_ANCHOR_SEED', rigClass: 'Rig_Medium',
    source: { repo: SRC.repo, path: SRC.dir + '/' + body, revision: SRC.commit },
    sourceFace: { faceColor: BOT_CARD.lid, faceColorSource: 'catalog-explicit' },
    eye: { ...JSON.parse(JSON.stringify(cd)), pupilStyle: BOT_CARD.pupilStyle, pupilSize: BOT_CARD.pupilSize, baseColor: BOT_CARD.lid } }
  const recipe = { ...recipeBase, source: { selectedId: 'kayfabrick-bot', rigFamily: 'Rig_Medium', label: `Kayfabrick-Bot ${m[1]} (B17 r1, PROOF)` },
    composition: { ...recipeBase.composition, modelRef: { path: profile.source.path, revision: SRC.commit, blob: SRC.blobs[body] || '' } } }
  return { recipe, faceDriver: 'KFB_NATIVE', url, clipsUrl: KAYKIT_CLIPS, motion: 'Idle_A', profile, contract, classScale: CLASS_SCALE, originals: { method: 'baked' },
    eyeAnchors: { l: { node: BOT_CARD.anchors.l, r: BOT_CARD.R }, r: { node: BOT_CARD.anchors.r, r: BOT_CARD.R } },
    actor: { id: 'kayfabrick-bot-' + m[1], path: profile.source.path, revision: SRC.commit }, position: [0, 0, 0], yaw: 0, anchorId: null,
    privateBody: { url, clipsUrl: url, source: 'WSB B17 r1 (PROOF)', prop: URL[`KayfabrickBlock_${m[1]}.r1.glb`] ? { id: 'carry_block', url: URL[`KayfabrickBlock_${m[1]}.r1.glb`], slot: BOT_CARD.carryAnchor, whenWalking: true, mounts: {} } : null },
    clipAlias: { Walking_B: 'kfb_bot_carry_a', Running_A: 'kfb_bot_angry_a' }, proof: true }
}
export const botStationUrl = (colour) => URL[`KayfabrickStation_${colour}.r1.glb`] || null
export const botBlockUrl = (colour) => URL[`KayfabrickBlock_${colour}.r1.glb`] || null
