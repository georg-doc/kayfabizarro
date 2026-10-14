// Darsteller-Slot · KFB_NATIVE über face-mount.v1 (Figuren mit eigenem Kopf, kein KayKit-Eye-Adapter), erste Figur FrizzleBob v5 (V-236).
// Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), dispose() }. Kein React, kein Store.
// Vorlage 1:1 = KFB ToolBox Production-06, Session-Cut 30.09. r1 (main @ac9dbaed), Akteur „FrizzleBob · Ear Rig v5“:
//   _loadActor (kind 'earfb', Z. 1799–1818): GLB laden → ear-base.insertChainBase je ear.?.1 → ear-dangle.rigEars → _mountFaceOn
//   _mountFaceOn (Z. 2680): face-mount.mountFace(entry mit eye.socket 'surface') → _closedNeutral → rt.update = applyLids · face.update · postRig
//   _postRig (Z. 2811): Lid-Schräge „clean“ (lids.sd fehlt → drift 0) + clay-lids.sync(rig, clay) · _mountHair (Z. 2917) hair-tufts
//   _frame (Z. 1431): Mixer → rt.update → Weltmatrizen → Ohren (EAR_DANGLE_INTEGRATION §1)
//   lipSay/_lipRun (Z. 2950): lipsync-text.textToTrack → setTex je Laut, Ende 'smile' bei „!“ sonst Ruhe.
// Abweichungen (begründet): (1) Takt der Mundbild-Spur = dt des Hosts (ModuleHost, je Bild, höchstens 0,1 s) statt setTimeout;
// Spur und setTex-Aufrufe sind dieselben, das erste Mundbild kommt sofort (wie step() im Spender). Ende wie Spender: setTex(Ende)
// auf dem Rig-Mund, der Modellmund zeigt danach wieder sein eigenes Decal (face-mount: kein Sprechen → eigene map). (2) Dateien aus dem Netz (Mund-Decals @main, Haar-Spender @eabc8725)
// zeigen auf byte-gleiche lokale Kopien: options.mouthDecals (Pflicht) setzt MOUTH_SETS.male (exportiertes Objekt des Spenders)
// vor jedem Montieren auf die lokalen Adressen; ohne sie bricht create ab (kein stiller Netzabruf von main).
// Der Haar-Spender lädt über einen Loader, der DONOR_URL auf die Kopie umlenkt. Kein Spender ist verändert.
// (4) V-214: Die Figur wird erst sichtbar, wenn das Gesicht montiert ist; scheitert face-mount, bleibt keine gesichtslose Figur stehen.
// (3) Kein pose-rig, keine Kontaktschatten/Oberfläche (Studio-Werkzeuge bzw. Bühne), keine Emote-Tabelle (kommt mit D1).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mountFace } from '../vendor/fb/kfb-lib/face-mount.v1.js'
import * as ClayMod from '../vendor/fb/kfb-lib/clay-lids.v1.js'
import { textToTrack } from '../vendor/fb/kfb-lib/lipsync-text.v1.js'
import { insertChainBase } from '../vendor/fb/kfb-lib/ear-base.v1.js'
import * as HairMod from '../vendor/fb/kfb-lib/hair-tufts.v1.js'
import { rigEars } from '../vendor/fb/ear-rig/ear-dangle.v1.js'
import * as Rig from '../vendor/eyes/pet-eye-rig.v6.js'
import * as FaceHost from '../vendor/eyes/facehost.v1.js'
import * as Mouth from '../vendor/fb/emb/petstudio-v9/studio-v3/pet-mouth.v1.js'
import * as Brow from '../vendor/fb/emb/petstudio-v9/studio-v12/brow-rig.v2.js'
import * as Nose from '../vendor/fb/emb/petstudio-v9/studio-v12/pet-nose.v2.js'
import * as Moust from '../vendor/fb/emb/petstudio-v9/studio-v12/pet-moustache.v1.js'
import * as Oval from '../vendor/fb/emb/frizzlegraft-v1/eyeoval.v1.js'
import * as Head from '../vendor/fb/emb/frizzlegraft-v1/headzones.v1.js'
import * as PartRig from '../vendor/fb/emb/lab-v6/partrig.v1.js'

const M = { Rig, Mouth, FaceHost, Brow, Nose, Moust, Oval, Head, PartRig } // P06 Z. 1324–1325: this.FaceM
const TB_VISEME_LOOK = { closed: 'neutral' } // P06 Z. 1209
const pk = (v, i) => (Array.isArray(v) ? (v[i] != null ? v[i] : (v[0] || 0)) : (v || 0))
const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k.startsWith('_') ? undefined : v)))

// Mund-Decals: Spender lädt MOUTH_SETS.male.base + Dateiname. Lokale Kopien (main @ac9dbaed, gleiche Blobs) → base '' + volle Adresse.
const MALE0 = Mouth.MOUTH_SETS.male // Original des Spenders (Dateinamen)
function localMouthSet(urlsByFile) {
  if (!urlsByFile) throw new Error('MOUTH_DECALS_REQUIRED: options.mouthDecals fehlt (kein Netzabruf von main)')
  const files = {}
  for (const [k, f] of Object.entries(MALE0.files)) { if (!urlsByFile[f]) throw new Error('Mund-Decal fehlt lokal: ' + f); files[k] = urlsByFile[f] }
  return { ...MALE0, base: '', files }
}

export const faceActorLog = { create: 0, update: 0, dispose: 0, lastCtx: null, freed: null }

// options: { recipe, modelUrl, earRig, mouthDecals: {Dateiname: Adresse}, hairUrl?, clipsUrl?, motion: 'bind'|'idle'|Clipname, position, yaw, anchorId, lang }
export function createFaceMountActor(options) {
  faceActorLog.create++
  const { recipe, modelUrl, earRig, hairUrl = null, clipsUrl = null, position = [0, 0, 0], yaw = 0, anchorId = null, lang = 'de' } = options
  const mouthSet = localMouthSet(options.mouthDecals)
  const motion = options.motion === 'idle' ? (recipe.idle?.clip || 'bind') : (options.motion || 'bind')
  const entry = strip(recipe.face), clayCfg = { ...ClayMod.DEFAULTS, ...strip(recipe.clayLids || {}) }
  const root = new THREE.Group(); root.name = 'faceActor:' + recipe.source.selectedId
  root.position.fromArray(position); root.rotation.y = yaw
  const inner = new THREE.Group(); inner.name = 'pose-root · ' + recipe.source.selectedId; root.add(inner)
  root.scale.setScalar(recipe.stage?.scale ?? 1) // P06: container.scale = CLASS_K
  const anchor = new THREE.Object3D(); anchor.name = 'bubbleAnchor'; root.add(anchor)
  const state = { status: 'LOADING', figure: null, face: null, clay: null, ears: null, hair: null, mixer: null, lip: null, log: [], error: null, disposed: false }
  const log = (m) => { state.log.push(String(m)); if (state.log.length > 40) state.log.shift() }
  const loader = new GLTFLoader()

  const ready = (async () => {
    const g = await loader.loadAsync(modelUrl)
    if (state.disposed) return
    const fig = g.scene; fig.name = 'figure · ' + recipe.source.label; state.figure = fig
    fig.traverse((n) => { if (n.isSkinnedMesh) n.frustumCulled = false })
    fig.visible = false // erst mit Gesicht sichtbar (V-214)
    inner.add(fig)
    state.mixer = new THREE.AnimationMixer(fig)
    // Ohren: Basisknochen zuerst (ear-base.v1), dann die Ketten (ear-dangle.v1), P06 Z. 1812–1814
    const baseRep = []; fig.traverse((o) => { if (o.isBone && /^ear[._]?([lr])[._]?1$/i.test(o.name)) baseRep.push(o) })
    for (const b of baseRep) { try { insertChainBase(THREE, fig, b, b.name.replace(/1$/, 'base')) } catch (e) { log('ear-base: ' + e.message) } }
    state.ears = rigEars(fig, earRig)
    if (state.ears.L.bones.length < 3 || state.ears.R.bones.length < 3) log('Ohrknochen: ' + state.ears.L.bones.length + '+' + state.ears.R.bones.length)
    // Gesicht: ein Besitzer (face-mount.v1)
    root.updateWorldMatrix(true, true)
    Mouth.MOUTH_SETS.male = mouthSet // PetMouth liest das Set beim Bauen (in mountFace)
    const f = mountFace({ THREE, M, figure: fig, entry: { ...entry, eye: { socket: 'surface', ...(entry.eye || {}) } }, log })
    if (f.status !== 'OK') { inner.remove(fig); throw new Error('face-mount: ' + (f.reason || f.status)) }
    state.face = f
    fig.visible = true
    // _closedNeutral
    const m = f.mouth
    if (m && m.p && m.p.visemeMap && m.p.visemeMap.closed === 'm' && m.has && m.has(TB_VISEME_LOOK.closed)) { try { f.set('mouth.visemeMap', { ...m.p.visemeMap, ...TB_VISEME_LOOK }) } catch (e) { /* wie Spender */ } m.setVisemeMap(TB_VISEME_LOOK) }
    f.isSpeaking = () => !!state.lip
    state.clay = new ClayMod.ClayLids(THREE)
    if (hairUrl) {
      try {
        const hl = { loadAsync: (u) => loader.loadAsync(u === HairMod.DONOR_URL ? hairUrl : u) }
        const d = await HairMod.loadDonor({ THREE, loader: hl })
        if (state.disposed) return
        const h = HairMod.mountTufts({ THREE, figure: fig, donor: d, params: recipe.hair?.params || null })
        if (h.status === 'OK') state.hair = h; else log('Haare: ' + h.reason)
      } catch (e) { log('Haare: ' + e.message) }
    }
    // Blasen-Anker über dem Kopf, im lokalen Raum von root (gilt auch auf bewegtem/gedrehtem/skaliertem Elternknoten)
    root.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(fig).applyMatrix4(root.matrixWorld.clone().invert())
    anchor.position.set(0, box.max.y * 1.02, 0)
    state.status = f.rig && f.rig.eyeFrame() ? 'OK' : 'EYES_MISSING'
    if (clipsUrl && motion !== 'bind') { // ein fehlender Clip lässt das Gesicht laufen (nur Log)
      try {
        const clips = await loader.loadAsync(clipsUrl)
        if (state.disposed) return
        const clip = clips.animations.find((c) => c.name === motion)
        if (clip) state.mixer.clipAction(clip, fig).play(); else log('Clip fehlt: ' + motion)
      } catch (e) { log('Clip: ' + e.message) }
    }
  })().catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); log('Fehler: ' + state.error) })

  // P06 _postRig0 + clay.sync
  const postRig = () => {
    const R = state.face?.rig; if (!R || !R.eyes || !R.emote) return
    const drift = 0 // Akteur ohne lids.sd (Spender: L.sd != null ? +L.sd : 0)
    const E = R.emote
    R.eyes.forEach((e, i) => { if (!e || !e._lids) return; const clean = -(e._sx || 1) * pk(E.slant, i) * 0.85; e._lids.rotation.z = clean + (e._lids.rotation.z - clean) * drift })
    try { state.clay.sync(R, clayCfg) } catch (e) { log('clay: ' + e.message) }
  }
  // Mundbild-Spur im Spieltakt (Spender: _lipRun mit setTimeout)
  const lipTick = (dt) => {
    const L = state.lip, mm = state.face?.mouth; if (!L || !mm) return
    L.t -= dt * 1000
    while (L.t <= 0) {
      if (L.i >= L.track.length) { mm.setTex(L.end || mm.rest || 'neutral', false); state.lip = null; return }
      const x = L.track[L.i++]; mm.setTex(x.key, true); L.cur = x.key; L.t += x.ms
    }
  }

  return {
    object3d: root,
    bubbleAnchors: anchorId ? [{ id: anchorId, object3d: anchor, offset: [0, 0, 0] }] : [],
    ready,
    faceDriver: 'KFB_NATIVE',
    update(dt, ctx) {
      if (state.disposed) return
      faceActorLog.update++; faceActorLog.lastCtx = { hasCam: !!ctx?.camera, hasPlayer: !!ctx?.player, hasGame: !!ctx?.game }
      state.mixer?.update(dt)
      const f = state.face
      if (f) { lipTick(dt); f.update(dt, ctx?.camera || null); postRig() }
      if (state.ears) { root.updateWorldMatrix(true, true); state.ears.update(dt, {}) }
    },
    // Text → Mundbild-Spur ohne Ton („mime“, V-228 §4). Gibt die Spur zurück.
    say(text) {
      const mm = state.face?.mouth; if (!mm) return null
      const t = String(text || '').trim(); if (!t) return null
      const track = textToTrack(t, { lang, rate: (mm.p && mm.p.rate) || 1 })
      mm.talk(false); mm.viseme = null
      state.lip = { track, i: 0, t: 0, end: /!\s*$|:\)\s*$/.test(t) ? 'smile' : null, cur: null }
      lipTick(0) // erstes Mundbild sofort (Spender: step() direkt)
      return track
    },
    speaking: () => !!state.lip,
    lookAt(nx, ny) { const R = state.face?.rig; if (!R) return; if (nx == null) R.setGazeFollow(false); else { R.setGazeFollow(true); R.pointTo(nx, ny) } },
    blinkNow() { state.face?.rig?.blinkNow?.() },
    earImpulse(k) { state.ears?.impulse(k === 'land' ? { pitch: 2.5 } : { pitch: -1.5 }) }, // P06 _earImpulse
    status: () => ({ status: state.status, error: state.error, log: state.log.slice(-8), mouth: state.face?.mouthOnModel ?? null, hair: !!state.hair, ears: state.ears ? [state.ears.L.bones.length, state.ears.R.bones.length] : null }),
    // gleiche Form wie kaykit-eye-adapter report().eyeFrame (Vektoren gerundet), dazu Eintrag und Mundzustand
    report: () => { const f = state.face; if (!f) return null; const ef = f.rig?.eyeFrame?.(), x = f.export?.() || {}, v = (a) => a.toArray().map((n) => +n.toFixed(4))
      return { parts: x.parts, eye: x.eye, eyeFrame: ef ? { left: v(ef.left), right: v(ef.right), radius: +ef.radius.toFixed(4), unit: +ef.unit.toFixed(4), gen: ef.gen } : null, mouth: f.mouthOnModel ?? null, lip: state.lip?.cur ?? null } },
    debugRig: () => state.face?.rig ?? null,
    debugFace: () => state.face,
    debugParts: () => [root, state.face?.rig?.rig, state.face?.host?.box, state.face?.host?.inner].filter(Boolean),
    dispose() {
      faceActorLog.dispose++
      state.disposed = true; state.lip = null
      state.mixer?.stopAllAction(); state.mixer?.uncacheRoot(state.figure || root)
      const geos = new Set(), mats = new Set(), texs = new Set()
      const collect = (o) => o?.traverse?.((m) => { if (!m.isMesh) return; if (m.geometry) geos.add(m.geometry); [].concat(m.material).forEach((mt) => { if (!mt) return; mats.add(mt); for (const k in mt) if (mt[k]?.isTexture) texs.add(mt[k]) }) })
      collect(root); collect(state.face?.rig?.rig); collect(state.face?.host?.box); collect(state.face?.host?.inner); collect(state.face?.mouth?.mesh)
      // Decal-Cache des Munds (bis 13) und seine flipY-Zwillinge (face-mount _decalTwins): PetMouth.dispose räumt sie nicht (Prüfer 5, Befund 6)
      const mtex = state.face?.mouth?.tex || {}, twins = state.face?._decalTwins
      for (const t of Object.values(mtex)) { if (!t) continue; texs.add(t); const tw = twins?.get?.(t); if (tw) texs.add(tw) }
      try { state.clay?.dispose() } catch (e) { /* weiter */ }
      try { state.hair?.dispose() } catch (e) { /* weiter */ }
      try { state.face?.dispose() } catch (e) { /* weiter */ }
      geos.forEach((g) => g.dispose()); texs.forEach((t) => t.dispose()); mats.forEach((m) => m.dispose())
      faceActorLog.freed = { geometries: geos.size, materials: mats.size, textures: texs.size }
      root.clear()
    },
  }
}
