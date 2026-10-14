// Darsteller-Slot (V-227/V-228 §4): eine Schnittstelle für jede Figur, genau ein Gesichts-Treiber je Figur.
// Prüft das Rezept gegen den Darsteller-Vertrag (#355, erweitert R2 in ./face-driver-contract.r2.mjs) und wählt das Modul:
//   KFB_NATIVE  · Gesichts-Besitzer kaykit-eye-adapter (KayKit-Figur, F1)      → modules/eyeActor (Eye-Rig-Studio-Weg)
//   KFB_NATIVE  · Gesichts-Besitzer face-mount.v1 (eigener Kopf, FrizzleBob)    → modules/faceMountActor (ToolBox-Weg)
//   Der Besitzer steht im Rezept (composition.faceOwners.face); es gibt keinen stillen Rückfall auf den anderen Weg.
//   WIREFACE_*  · nur mit VITE_WIREFACE=1 und lokalem SDK; ohne SDK keine Figur, sondern Status SOURCE_MISSING
//                 (V-214: keine Figur ohne animiertes Gesicht; kein Ersatzgesicht).
// Gemeinsame Bühnen-Schnittstelle aller Darsteller: object3d, bubbleAnchors, update(dt, ctx), dispose(), faceDriver,
// lookAt(nx, ny), blinkNow(), say(text) → Mundbild-Spur ohne Ton (null, wenn der Treiber keinen Mund hat), status(), report().
import { Group } from 'three'
import { companion } from './face-driver-contract.r2.mjs'
import { createEyeActor } from '../modules/eyeActor'
import { createFaceMountActor } from '../modules/faceMountActor'

const KFB_NATIVE_OWNERS = { 'kfb-lib/face-mount.v1.js': createFaceMountActor, 'lib/kaykit-eye-adapter.v1.js': createEyeActor }
export const WIREFACE_ENABLED = typeof import.meta !== 'undefined' && import.meta.env?.VITE_WIREFACE === '1'

// options: { recipe, faceDriver?, faceSource?, mount?, activeFaceOwners?, …modulspezifisch (modelUrl, earRig, hairUrl, clipsUrl, url, profile, contract …) }
// Aktive Gesichts-Besitzer aus dem Rezept (Prüfer 5, Befund 3): Kanal → Besitzer. Unter WIREFACE_* zählen alle Kanäle mit
// einem KFB-Besitzer (eye, lids, mouth, …) als belegt; unter KFB_NATIVE jeder Besitzer, der Wireface heißt.
export function activeOwners(recipe, mode) {
  const fo = recipe?.composition?.faceOwners || {}, out = []
  for (const [ch, who] of Object.entries(fo)) {
    const wf = /wireface/i.test(String(who))
    if (mode === 'KFB_NATIVE' ? wf : !wf && ch !== 'face' && !/^keiner/i.test(String(who))) out.push(mode === 'KFB_NATIVE' ? 'wireface:' + ch : ch)
  }
  return out
}

export function createActor(options) {
  const { recipe, faceDriver = 'KFB_NATIVE' } = options
  const owners = [...activeOwners(recipe, faceDriver), ...(options.activeFaceOwners || [])]
  if (faceDriver !== 'KFB_NATIVE') {
    // Ein Wireface-Wunsch reißt nie die Szene ab (Befund 4): Vertragsfehler → Darsteller ohne Figur mit Grund
    try { return wirefaceActor(companion(recipe, { mode: faceDriver, faceSource: options.faceSource, mount: options.mount, activeFaceOwners: owners }), options) }
    catch (e) { return emptyActor(faceDriver, null, String(e.message).startsWith('DOUBLE_FACE') ? 'CONTRACT_REJECTED' : 'SOURCE_MISSING', e.message, options) }
  }
  const plan = companion(recipe, { mode: faceDriver, activeFaceOwners: owners })
  const owner = recipe.composition?.faceOwners?.face
  const make = KFB_NATIVE_OWNERS[owner]
  if (!make) throw new Error('FACE_OWNER_UNKNOWN: ' + owner)
  const mod = make(options)
  mod.faceDriver = 'KFB_NATIVE'
  mod.plan = plan
  if (!mod.say) mod.say = () => null // F1-Figur (Rogue_Hooded): Maske, kein Mund
  return mod
}

function wirefaceActor(plan, options) {
  // Das SDK liegt nie im Repo (V-228, ARCHITECTURE_R1 §2). Ohne Schalter und SDK gibt es keine Figur.
  const reason = WIREFACE_ENABLED ? 'WIREFACE_ADAPTER_NOT_BUILT' : 'VITE_WIREFACE aus / SDK nicht vorhanden'
  return emptyActor(plan.faceDriver, plan, 'SOURCE_MISSING', reason, options)
}
function emptyActor(faceDriver, plan, status, reason, options) {
  return {
    object3d: new Group(), bubbleAnchors: [], faceDriver, plan, // leere Gruppe: nichts sichtbar, Host bleibt gleich
    update() {}, dispose() {}, say: () => null, lookAt() {}, blinkNow() {},
    status: () => ({ status, reason, actor: options.recipe?.source?.selectedId }),
    report: () => null,
  }
}
