// Besetzung der Bühne als Bausteine (aus Stage.jsx herausgelöst, Werte unverändert): FrizzleBob (P08-Rezept, Georgs Eintrag), Rogue
// (F1-Prüffigur) und die KayKit-Kandidaten (F-4, V-269 GothGirl). Jede Funktion liefert die Optionen für createActor(x, yaw, anchorId).
// Ohne Hash und ohne Bühnenzustand, damit auch die M1-Szene dieselbe Besetzung nutzen kann (V-206: ein Weg statt zwei).
import rogueUrl from '../assets/actors/Rogue_Hooded.glb?url'
import clipsUrl from '../assets/actors/Rig_Medium_General.glb?url'
import pick from '../data/eyes/rogue-hooded.profile.json'
import contract from '../data/eyes/kfb-pet-graft-driver.v4.json'
import rogueRecipe from '../data/actors/rogue-hooded.recipe.json'
import fbUrl from '../assets/actors/FB_TEMPLATE_LOOK_v5b.glb?url'
import hairUrl from '../assets/actors/fb-hair/FrizzleBob_Yellow.gltf?url'
import fbRecipe from '../data/actors/frizzlebob-v5b.recipe.json'
import georg from '../data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json'
import earRig from '../data/actors/fb-default.ear-rig.json'

export const KAYKIT_CLIPS = clipsUrl, CLASS_SCALE = fbRecipe.stage.scale // Rig_Medium-Clips und Klassen-Faktor für Karten-Figuren (C2)
export const ROGUE = (x, yaw, id) => ({ recipe: rogueRecipe, faceDriver: 'KFB_NATIVE', url: rogueUrl, clipsUrl, motion: 'Idle_A', profile: pick.profile, contract, height: 2.0,
  actor: { id: 'adventurer-rogue-hooded', path: pick.profile.source.path, revision: pick.profile.source.revision }, position: [x, 0, -1.4], yaw, anchorId: id })
const decals = import.meta.glob('../assets/actors/fb-mouth/*.png', { eager: true, query: '?url', import: 'default' })
const mouthDecals = Object.fromEntries(Object.entries(decals).map(([k, v]) => [k.split('/').pop(), v]))
const pet = georg.pets.find((p) => p.id === fbRecipe.entry.pet)
export const FB = (x, yaw, id) => ({ recipe: fbRecipe, pet, faceDriver: 'KFB_NATIVE', modelUrl: fbUrl, earRig, mouthDecals, hairUrl, clipsUrl, motion: 'idle', position: [x, 0, -1.4], yaw, anchorId: id })
// Zweite Besetzung (F-4): cast=<actorId> stellt rechts eine KayKit-Figur mit ihrem Profil aus Georgs Batch auf (F1-Weg, kaykit-eye-adapter).
// Kandidaten: scripts/cast/build-cast.py (Profil-Auszug, Rezept, GLB-Kopie). KayKit hat keinen Sprechmund: sie spricht heute nur per Blase.
const castProfiles = import.meta.glob('../data/eyes/cast/*.profile.json', { eager: true, import: 'default' })
const castRecipes = import.meta.glob('../data/actors/cast/*.recipe.json', { eager: true, import: 'default' })
const castGlbs = import.meta.glob('../assets/actors/cast/*.glb', { eager: true, query: '?url', import: 'default' })
export const CAST_IDS = Object.keys(castRecipes).map((k) => k.split('/').pop().replace('.recipe.json', ''))
export const KAYKIT = (id) => {
  const recipe = castRecipes[`../data/actors/cast/${id}.recipe.json`], pickC = castProfiles[`../data/eyes/cast/${id}.profile.json`], ref = recipe.composition.modelRef
  const url = castGlbs[`../assets/actors/cast/${ref.path.split('/').pop()}`]
  return (x, yaw, anchorId) => ({ recipe, faceDriver: 'KFB_NATIVE', url, clipsUrl, motion: 'Idle_A', profile: pickC.profile, contract, classScale: fbRecipe.stage.scale, // gleicher Klassen-Faktor wie FrizzleBob (Rig_Medium, P08 CLASS_K 0,947)
   
    actor: { id, path: ref.path, revision: ref.revision }, position: [x, 0, -1.4], yaw, anchorId })
}
