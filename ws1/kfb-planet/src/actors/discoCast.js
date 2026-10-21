// Disco K12 (Lead, WS0 21.10.: „Disco-Besetzung K12 da, für den Dioramen-Test“) · Besetzung der Disco aus WSB K12, optional aus src/private
// (gitignored, Verweis auf ~/kfb-ws1/private-assets, flacher Klon von assets/private). Die Tänzer sind KayKit-Kauf → nie im Repo. Fehlen die Dateien,
// liefert discoK12() null (der Host zeigt nur Kulisse und MC).
// Augen: Georgs Batch-Profil, wo es eins gibt (Hexe, Avian, Teen = protagonist-a, Skelett-Minion, Spielzeugsoldat) – derselbe Weg wie jede KayKit-Figur
// im Spiel (kaykit-eye-adapter, Körper „baked“: KayKit-Augen in Blender entfernt). Ritter und Dämon haben kein Profil: Klassen-Standard Rig_Medium
// + Werte der Karte (Pupille, Lid-Farbe) + Sitz aus den Ankern eye_anchor.l/r (eyeActor eyeAnchors, deriveSourceAnchorSeed) = PROOF.
// MC = FrizzleBob als Spielfigur (actor "fb_game", WSB K12 §4): Georgs Export über stageCast.FB (P08-Rezept, ToolBox-Look zur Laufzeit), Clips der
// Motion Library Rig_Medium (öffentlich, kayfabizarro main) zur Laufzeit von GitHub, nicht im Bündel.
import recipeBase from '../data/actors/cast/toy-soldier.recipe.json'
import contract from '../data/eyes/kfb-pet-graft-driver.v4.json'
import { FB, CLASS_SCALE } from './stageCast'
import SRC from '../data/actors/cast/disco-k12.sources.json' // Herkunft (Commit, Blob) der privaten Körper für den Darsteller-Vertrag, nur Hashes

const CAST = Object.values(import.meta.glob('../private/50_BLENDER/K12/data/disco_cast_k12.json', { eager: true, import: 'default' }))[0] || null
const CARDS = Object.fromEntries(Object.entries(import.meta.glob('../private/50_BLENDER/K12/data/disco_*.k12.figure.json', { eager: true, import: 'default' })).map(([k, v]) => [k.split('/').pop(), v]))
const GLBS = Object.fromEntries(Object.entries(import.meta.glob('../private/50_BLENDER/B50/disco/_privat_kauf_asset/KFB_Disco_*.src.glb', { eager: true, query: '?url', import: 'default' })).map(([k, v]) => [k.split('/').pop(), v]))
const PICKS = Object.fromEntries(Object.entries({ ...import.meta.glob('../data/eyes/cast/*.profile.json', { eager: true, import: 'default' }), ...import.meta.glob('../data/eyes/disco/*.profile.json', { eager: true, import: 'default' }) }).map(([k, v]) => [k.split('/').pop().replace('.profile.json', ''), v]))

// Platz → Profil aus Georgs Batch (null = keins, Sitz aus den Ankern)
export const DISCO_PROFILE = Object.freeze({ minion: 'skeleton-minion', avian: 'avian', teen: 'protagonist-a', soldier: 'toy-soldier', witch: 'witch', knight: null, demon: null })
// Motion Library Rig_Medium (33 Clips, u. a. kfb_dance_*, kfb_idle_happy_a): kayfabizarro main @c746a956, Blob 45e12910 (sha256 08b76780…, wie WSB K12 §4)
export const MOTION_LIBRARY_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/c746a9567e0ea20a24b8969fe9130ac0756e7a7e/media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb'
export const DISCO_EYE_R = 0.08 // glTF-Einheiten, Augenradius der Rig_Medium-Karten (K12 disco_soldier.eyeRig.settings.R) – nur für den Anker-Sitz von Ritter und Dämon

export const discoAvailable = () => !!CAST

// Set-Liste K12 (kfb.set-cast/1) mit Karte und GLB-Adresse je Platz, MC eingeschlossen; null ohne private Dateien
export function discoK12() {
  if (!CAST) return null
  return { ...CAST, slots: CAST.slots.map((s) => ({ ...s, cardData: CARDS[`disco_${s.slot}.k12.figure.json`] || null, url: s.glb?.path ? GLBS[s.glb.path.split('/').pop()] || null : null })) }
}

// Darsteller-Optionen für createActor (Muster botCast): privater Körper, Augen wie oben, Bewegung „bind“ (die Disco treibt die Clips selbst)
export function discoCast(slot) {
  const card = slot.cardData, url = slot.url
  if (!url || !card) return null
  const pid = DISCO_PROFILE[slot.slot], pick = pid ? PICKS[pid] : null, base = PICKS['toy-soldier'], fromAnchors = !pick
  const settings = card.eyeRig?.settings || {}, lid = card.eyeRig?.lid?.colour
  const profile = pick ? JSON.parse(JSON.stringify(pick.profile)) : { schema: 'kfb.eye-profile/0.1-candidate', actorId: 'disco-' + slot.slot, status: 'UNREVIEWED_ANCHOR_SEED', rigClass: 'Rig_Medium',
    source: { repo: SRC.repo, path: slot.glb.path, revision: SRC.commit },
    sourceFace: lid ? { faceColor: lid, faceColorSource: 'catalog-explicit' } : {},
    eye: { ...JSON.parse(JSON.stringify(base.classDefault.eye)), ...(settings.pupilStyle ? { pupilStyle: settings.pupilStyle } : {}), ...(settings.pupilSize ? { pupilSize: settings.pupilSize } : {}), ...(lid ? { baseColor: lid } : {}) } }
  const anchors = card.eyeRig?.anchors || {}, node = (s) => String(s || '').split(' ')[0], file = slot.glb.path.split('/').pop(), rev = SRC.commit, path = SRC.dir + '/' + file
  const recipe = { ...recipeBase, source: { selectedId: 'disco-' + slot.slot, rigFamily: 'Rig_Medium', label: `${card.displayName || slot.slot} (K12)` },
    composition: { ...recipeBase.composition, modelRef: { path, revision: rev, blob: SRC.blobs[file] || '' } } }
  return { recipe, faceDriver: 'KFB_NATIVE', url, clipsUrl: null, motion: 'bind', profile, contract, classScale: CLASS_SCALE, originals: { method: 'baked' },
    ...(fromAnchors ? { eyeAnchors: { l: { node: node(anchors.L) || 'eye_anchor.l', r: DISCO_EYE_R }, r: { node: node(anchors.R) || 'eye_anchor.r', r: DISCO_EYE_R } } } : {}),
    actor: { id: 'disco-' + slot.slot, path, revision: rev }, position: [0, 0, 0], yaw: 0, anchorId: null,
    eyeSource: pick ? `Batch ${pid} (${pick.profile.status})` : 'Anker-Sitz (PROOF)', proof: fromAnchors }
}

// MC: FrizzleBob wie auf der Bühne (Georgs Export, P08), ohne eigenen Ruhe-Clip
export const discoMC = () => ({ ...FB(0, 0, null), motion: 'bind', position: [0, 0, 0] })
