// Darsteller-Slot · KFB_NATIVE über face-mount.v1 (Figuren mit eigenem Kopf, kein KayKit-Eye-Adapter): FrizzleBob nach Georgs Export (V-240).
// Host-Vertrag R1.2 §2: create(options) -> { object3d, update(dt, ctx), dispose() }. Kein React, kein Store.
// Vorlage 1:1 = KFB ToolBox Production-08, Session-Cut 01.10. r1 (main @ac9dbaed) – die v5b-Linie, in der Georgs Export entstand
// (Export-Kennung „KFB ToolBox Production-02 · Rigging“ = Exportzeile von P08 Z. 3845–3860). Bauteile: face-mount.v1 5424bff3, clay-lids.v1 d7cea2ae,
// ear-dangle.v1 d7ad94a2 (lokale P08-Fassung mit FLOPPY-01), sonst gleich P06 r1. Georgs Eintrag wird angewendet wie P08 nach dem Neuladen
// eines importierten Eintrags (_mountFaceOn(saved), Z. 3056: mountFace mit dem gespeicherten Eintrag – nicht der Einmal-Weg rigImport mit
// Standard-Eintrag → fitToOriginal → load) · setHair(pet.hair) · ears = { …_earCfg(), …pet.ears } → _applyEars (Z. 2653) · setLids · setClay.
// Modulstand (Prüfer 9, Befund 1): Georgs Export kommt aus einer NEUEREN ToolBox als jeder Cut im Repo (clayLids mech 'skin', skinFrame, flap02,
// fOpen…/skinA… kennt P08 nicht; die Kennung „Production-02 · Rigging“ schreibt jeder Cut). Diese Felder betreffen nur die Knet-Lider, die
// im Eintrag aus sind. Der Export nennt für die Ohren ear-dangle @19088b14 (PR #214, 6bb4531a); P08 lädt d7ad94a2 (FLOPPY-01), das ohne die
// neuen Felder bit-gleich rechnet (FLOPPY-01 Abnahme 1).
// Im Rahmen weiter wie P06/P08:
//   _loadActor (kind 'earfb', Z. 1799–1818): GLB laden → ear-base.insertChainBase je ear.?.1 → ear-dangle.rigEars → _mountFaceOn
//   _mountFaceOn (Z. 2680): face-mount.mountFace(entry mit eye.socket 'surface') → _closedNeutral → rt.update = applyLids · face.update · postRig
//   _postRig (Z. 2811): Lid-Schräge „clean“ (lids.sd fehlt → drift 0) + clay-lids.sync(rig, clay) · _mountHair (Z. 2917) hair-tufts
//   _frame (Z. 1431): Mixer → rt.update → Weltmatrizen → Ohren (EAR_DANGLE_INTEGRATION §1)
//   lipSay/_lipRun (Z. 2950): lipsync-text.textToTrack → setTex je Laut, Ende 'smile' bei „!“ sonst Ruhe.
// Schatten wie P08 Z. 1901–1903: Meshes werfen (außer dünnen/Shader-Teilen) und empfangen; Ohren werfen nicht (_earCast); Gesicht ohne Streifen
// (face.shadowOff); Mund empfängt nicht (_mouthNoShadow). Kontaktschatten wie P08 _mountAO (Z. 3929): contact-ao.v1 (61e3121f) mit den
// Vorgaben der ToolBox (strength 0,8 · ears 0), angelegt vor den Haaren (wie P08; Haare also weder Empfänger noch Verdecker), Verdecker =
// Nasen-Teile, einmal eingebacken. Abweichung: gebacken in der Bindepose, bevor ein Clip läuft (P08 backt nach 700 ms in der Pose-Rig-
// Haltung mit dem Standard-Eintrag); sichtbar an den Schultern.
// Nicht übernommen (Studio-Werkzeuge bzw. ohne Wirkung): body-shape (Georgs Werte alle 1 = neutral), _mouthNoShadow (nur Schatten), pose-rig.
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
import { mountFace } from '../vendor/fb/kfb-lib-p08/face-mount.v1.js'
import * as ClayMod from '../vendor/fb/kfb-lib-p08/clay-lids.v1.js'
import { textToTrack } from '../vendor/fb/kfb-lib/lipsync-text.v1.js'
import { insertChainBase } from '../vendor/fb/kfb-lib/ear-base.v1.js'
import * as HairMod from '../vendor/fb/kfb-lib/hair-tufts.v1.js'
import { rigEars, DANGLE_DEFAULTS } from '../vendor/fb/kfb-lib-p08/ear-dangle.v1.js'
import * as AOMod from '../vendor/fb/kfb-lib-p08/contact-ao.v1.js'
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

// Mund-Decals: Spender lädt MOUTH_SETS.male.base + Dateiname. Lokale Kopien (main @ac9dbaed, gleiche Blobs) → base '' + volle Adresse.
const MALE0 = Mouth.MOUTH_SETS.male // Original des Spenders (Dateinamen)
function localMouthSet(urlsByFile) {
  if (!urlsByFile) throw new Error('MOUTH_DECALS_REQUIRED: options.mouthDecals fehlt (kein Netzabruf von main)')
  const files = {}
  for (const [k, f] of Object.entries(MALE0.files)) { if (!urlsByFile[f]) throw new Error('Mund-Decal fehlt lokal: ' + f); files[k] = urlsByFile[f] }
  return { ...MALE0, base: '', files }
}

// Teilschritt des Gesichts (s) und Obergrenze je Bild: bis 0,4 s Bildzeit bleibt jeder Schritt ≤ 1/30 s; darüber wird der Schritt länger, nie mehr Arbeit
export const FACE_STEP = 1 / 30, FACE_MAX_STEPS = 12
export const faceActorLog = { create: 0, update: 0, dispose: 0, lastCtx: null, freed: null }

// options: { recipe, pet (Georgs kfb.pets/1-Eintrag), modelUrl, earRig, mouthDecals: {Dateiname: Adresse}, hairUrl?, clipsUrl?, motion: 'bind'|'idle'|Clipname, position, yaw, anchorId, lang }
export function createFaceMountActor(options) {
  faceActorLog.create++
  // partColors: 'export' (Standard, WS0 14.10.: ToolBox exportiert die Farben der Original-Brauen/-Nase noch nicht → brow.color/nose.color aus Georgs Export)
  //             | 'model' (Materialfarbe des Modells = P08-Spender; nur für das Bildpaar gegen den Spender)
  const { recipe, modelUrl, earRig, hairUrl = null, clipsUrl = null, position = [0, 0, 0], yaw = 0, anchorId = null, lang = 'de', partColors = 'export' } = options
  const mouthSet = localMouthSet(options.mouthDecals)
  const motion = options.motion === 'idle' ? (recipe.idle?.clip || 'bind') : (options.motion || 'bind')
  const pet = options.pet
  if (!pet || !pet.eye) throw new Error('PET_ENTRY_REQUIRED: Georgs Eintrag (kfb.pets/1) fehlt')
  // P08 setClay: nur Schlüssel aus DEFAULTS · setLids: nur Zahlen u/l/s/du/dl/ds/sd · setHair: nur Schlüssel aus HairMod.DEFAULTS
  const clayCfg = { ...ClayMod.DEFAULTS }; for (const k of Object.keys(pet.clayLids || {})) if (k in ClayMod.DEFAULTS) clayCfg[k] = pet.clayLids[k]
  const lids = { u: 0, l: 0, s: 0, du: 0, dl: 0, ds: 0 }; for (const k of ['u', 'l', 's', 'du', 'dl', 'ds', 'sd']) if (typeof pet.lids?.[k] === 'number') lids[k] = pet.lids[k]
  const hairP = {}; for (const k of Object.keys(pet.hair || {})) if (k in (HairMod.DEFAULTS || {})) hairP[k] = pet.hair[k]
  const { reader: _r, ...earPatch } = pet.ears || {}
  const earCfg = { schema: 'kfb.ear-rig.v0#tuning', on: true, stiff: 1, damp: 1, elastic: earRig?.ears?.L?.elastic || 0.6, ...earPatch } // P08 _earCfg() + Import
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
    const f = mountFace({ THREE, M, figure: fig, entry: pet, log }) // P08: face-mount.load(pet) in mountFace; applied/rejected je Feld
    if (f.status !== 'OK') { inner.remove(fig); throw new Error('face-mount: ' + (f.reason || f.status)) }
    state.loadReport = { applied: (f.applied || []).length, rejected: (f.rejected || []).slice() }
    // Farben der Original-Teile aus dem Export (WS0 14.10.); je Figur eigenes Material, damit nichts zwischen Darstellern geteilt wird
    state.partColors = {}
    if (partColors === 'export') for (const [part, key] of [['brows', 'brow'], ['nose', 'nose']]) {
      const hex = pet[key]?.color; if (pet.parts?.[part] !== 'original' || typeof hex !== 'string') continue
      for (const it of f.orig?.[part]?.items || []) { const m = it.mesh; if (!m?.material?.color) continue; if (!m.userData.ownMat) { m.material = m.material.clone(); m.userData.ownMat = true } m.material.color.set(hex) }
      state.partColors[part] = hex
    }
    // P08 Z. 1901–1903 + _mouthNoShadow
    fig.traverse((n) => { if (!n.isMesh) return; const mt = n.material, thin = !!(n.userData.petOverlay || (mt && (mt.isShaderMaterial || (mt.transparent && (mt.opacity == null || mt.opacity < 0.98))))); n.castShadow = !thin; n.receiveShadow = !(mt && mt.isShaderMaterial) })
    fig.traverse((n) => { if (n.isMesh && /(^|[^a-z])ears?([^a-z]|$)/i.test(n.name || '')) n.castShadow = false }) // _earCast (aus)
    try { f.shadowOff && f.shadowOff() } catch (e) { log('shadowOff: ' + e.message) }
    { const add = (o) => o?.traverse?.((n) => { if (n.isMesh) n.receiveShadow = false }); add(f.mouth && f.mouth.mesh); (f.orig?.mouth?.items || []).forEach((it) => { if (it.mesh && !/head|skull/i.test(it.mesh.name || '')) add(it.mesh) }) }
    // Kontaktschatten vor den Haaren (P08 _mountAO); Backen läuft in der Bindepose, der Clip startet erst danach
    let aoDone = Promise.resolve()
    try {
      const faceParts = () => { const L = [], add = (o) => o?.traverse?.((n) => { if (n.isMesh) L.push(n) }); add(f.nose && f.nose.mesh); add(f.moust && f.moust.mesh); (f.orig?.nose?.items || []).forEach((it) => add(it.mesh)); return L }
      root.updateWorldMatrix(true, true)
      state.ao = AOMod.makeContactAO(THREE, root, { occluders: faceParts }); aoDone = state.ao.bake() // Parameter = DEFAULTS der ToolBox
    } catch (e) { log('contact-ao: ' + e.message) }
    state.face = f
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
        const h = HairMod.mountTufts({ THREE, figure: fig, donor: d, params: hairP })
        if (h.status === 'OK') state.hair = h; else log('Haare: ' + h.reason)
      } catch (e) { log('Haare: ' + e.message) }
    }
    // Blasen-Anker über dem Kopf, im lokalen Raum von root (gilt auch auf bewegtem/gedrehtem/skaliertem Elternknoten)
    root.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(fig).applyMatrix4(root.matrixWorld.clone().invert())
    anchor.position.set(0, box.max.y * 1.02, 0)
    state.status = f.rig && f.rig.eyeFrame() ? 'OK' : 'EYES_MISSING'
    root.updateWorldMatrix(true, true); applyEars() // P08 rigImport: Ohren-Einstellung nach dem Laden (Weltlage steht)
    await aoDone; if (state.disposed) return
    if (clipsUrl && motion !== 'bind') { // ein fehlender Clip lässt das Gesicht laufen (nur Log)
      try {
        const clips = await loader.loadAsync(clipsUrl)
        if (state.disposed) return
        const clip = clips.animations.find((c) => c.name === motion)
        if (clip) { state.mixer.clipAction(clip, fig).play(); state.mixer.update(0) } else log('Clip fehlt: ' + motion)
      } catch (e) { log('Clip: ' + e.message) }
    }
    // erst sichtbar, wenn Gesicht, Kontaktschatten und Ruhe-Clip stehen: keine T-Pose und kein ungebackener Kopf im Bild (V-214)
    fig.visible = true
  })().catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e); log('Fehler: ' + state.error) })

  // P08 _applyEars (Z. 2653–2690), 1:1: dangle → Steifigkeit, Pose, Lage/Drehung des Ohr-Basisknochens (Längen in Ohrlängen, Achsen im Kopfraum)
  function applyEars() {
    const ears = state.ears; if (!ears) return
    const c = earCfg, D = DANGLE_DEFAULTS, T = THREE, D2R = Math.PI / 180
    ears.setEnabled(c.on !== false)
    for (const [side, ch] of [['L', ears.L], ['R', ears.R]]) {
      const e = !side || c.link !== false ? c : { ...c, ...(c[side] || {}) }, d = e.dangle != null ? +e.dangle : 1, frozen = d < 0.02, k = (e.stiff != null ? e.stiff : 1) / Math.max(0.05, d * d), dm = e.damp != null ? e.damp : 1, g = (x, def) => (e[x] != null ? +e[x] : def)
      ch.setParams({ stiffness: D.stiffness.map((x) => x * (frozen ? 400 : k)), damping: D.damping.map((x) => x * dm * Math.sqrt(frozen ? 400 : k)), maxDeg: D.maxDeg.map((x) => x * g('limit', 1)),
        elastic: frozen ? 0 : g('elastic', D.elastic), inertia: D.inertia * g('inertia', 1), spin: D.spin * g('spin', 1), wind: D.wind * g('wind', 1), flutter: D.flutter * g('wind', 1), gravity: g('gravity', 0),
        sagFrom: g('sagFrom', 0), sagShare: Array.isArray(e.sagShare) ? e.sagShare : null, bob: g('bob', 0), bobHz: g('bobHz', 0.6),
        maxFwd: Array.isArray(e.maxFwd) ? e.maxFwd.map((x) => x * g('limit', 1)) : null, maxBack: Array.isArray(e.maxBack) ? e.maxBack.map((x) => x * g('limit', 1)) : null, maxRoll: Array.isArray(e.maxRoll) ? e.maxRoll.map((x) => x * g('limit', 1)) : null })
      ch.setPose({ droop: g('droop', 0), fold: g('fold', 0), foldAt: g('foldAt', 0.55), curl: g('curl', 0) })
      const b0 = ch.bones[0], base = b0 && b0.parent && b0.parent.userData && b0.parent.userData.kfbChainBase ? b0.parent : null, node = base || b0, hp = node && node.parent
      if (node && hp) {
        if (!ch.__ax) { const fig = state.figure || hp, fq = fig.getWorldQuaternion(new T.Quaternion()), pqi = hp.getWorldQuaternion(new T.Quaternion()).invert()
          const ew = node.getWorldPosition(new T.Vector3()), hw = hp.getWorldPosition(new T.Vector3()), side0 = Math.sign(fig.worldToLocal(ew.clone()).x - fig.worldToLocal(hw.clone()).x) || (side === 'L' ? 1 : -1)
          const toHead = (v) => v.applyQuaternion(fq).applyQuaternion(pqi).normalize(), q0 = (ch.state && ch.state[0] && ch.state[0].q0) ? ch.state[0].q0.clone() : b0.quaternion.clone()
          ch.__ax = { p0: node.position.clone(), r0: node.quaternion.clone(), out: toHead(new T.Vector3(side0, 0, 0)), fwd: toHead(new T.Vector3(0, 0, 1)), up: toHead(new T.Vector3(0, 1, 0)),
            dir: new T.Vector3(0, 1, 0).applyQuaternion(q0).normalize(), len: (ch.bones[1] && ch.bones[1].position.length()) || 0.1 } }
        const A = ch.__ax
        node.position.copy(A.p0).addScaledVector(A.out, g('spread', 0) * A.len).addScaledVector(A.fwd, g('fwd', 0) * A.len).addScaledVector(A.up, g('rise', 0) * A.len).addScaledVector(A.dir, -g('sink', 0) * A.len)
        const ax = (a, b) => new T.Vector3().crossVectors(a, b).normalize()
        const qr = new T.Quaternion().setFromAxisAngle(ax(A.up, A.out), g('out', 0) * D2R)
          .multiply(new T.Quaternion().setFromAxisAngle(ax(A.up, A.fwd.clone().negate()), g('back', 0) * D2R))
          .multiply(new T.Quaternion().setFromAxisAngle(A.dir, g('twist', 0) * D2R * (A.out.x >= 0 ? 1 : -1)))
        if (base) node.quaternion.copy(qr).multiply(A.r0)
        else { const s0 = ch.state && ch.state[0]; if (s0) { if (!ch.__q0) ch.__q0 = s0.q0.clone(); s0.q0.copy(qr).multiply(ch.__q0) } }
      }
    }
  }
  // P08 _applyLids (vor face.update): Lid-Grundstellung aus Georgs lids
  const applyLids = () => { const R = state.face?.rig; if (!R || !R.emote) return; const E = R.emote, L = lids; E.lidUpper = [L.u + L.du, L.u]; E.lidLower = [L.l + L.dl, L.l]; E.slant = [L.s + L.ds, L.s] }
  // P08 _postRig0 + clay.sync
  const postRig = () => {
    const R = state.face?.rig; if (!R || !R.eyes || !R.emote) return
    const drift = lids.sd != null ? +lids.sd : 0; if (drift >= 1) { try { state.clay.sync(R, clayCfg) } catch (e) { log('clay: ' + e.message) } return }
    const E = R.emote
    R.eyes.forEach((e, i) => { if (!e || !e._lids) return; const clean = -(e._sx || 1) * pk(E.slant, i) * 0.85; e._lids.rotation.z = clean + (e._lids.rotation.z - clean) * drift })
    try { state.clay.sync(R, clayCfg) } catch (e) { log('clay: ' + e.message) }
  }
  // P08 _earsTick: Wind = −(geglättete Geschwindigkeit der Figur) (Reisewind 0); steht die Figur, ist er 0
  const EW = { p: new THREE.Vector3(), v: new THREE.Vector3(), w: new THREE.Vector3(), ok: false }
  const earWind = (dt) => { const p = root.getWorldPosition(new THREE.Vector3()); if (EW.ok && dt > 0) EW.v.lerp(p.clone().sub(EW.p).divideScalar(dt), 0.2); else EW.v.set(0, 0, 0); EW.p.copy(p); EW.ok = true; return EW.w.copy(EW.v).negate() }
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
      // Gesicht in Teilschritten ≤ FACE_STEP: die Pupillen-Feder der Augen-Lib rechnet explizit und schwingt bei langen Bildern auf (bei ≈ 5 Bildern/s
      // auf der Bühne wuchs _px je Bild um ×2,3, die Brauen folgen dem Blick und flogen davon). ear-dangle teilt selbst (P.substep), der Mixer braucht es nicht.
      if (f) { const n = Math.min(FACE_MAX_STEPS, Math.max(1, Math.ceil(dt / FACE_STEP))), h = dt / n; for (let i = 0; i < n; i++) { lipTick(h); applyLids(); f.update(h, ctx?.camera || null); postRig() } }
      if (state.ears) { root.updateWorldMatrix(true, true); state.ears.update(dt, { wind: earWind(dt) }) }
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
    status: () => ({ status: state.status, shown: !!state.figure?.visible, partColors: state.partColors ?? null, error: state.error, log: state.log.slice(-8), mouth: state.face?.mouthOnModel ?? null, hair: !!state.hair, ears: state.ears ? [state.ears.L.bones.length, state.ears.R.bones.length] : null, load: state.loadReport ?? null, ao: state.ao ? { baked: !!state.ao.info.baked, darkened: state.ao.info.darkened ?? 0, ms: state.ao.info.ms ?? null } : null }),
    // gleiche Form wie kaykit-eye-adapter report().eyeFrame (Vektoren gerundet), dazu Eintrag und Mundzustand
    report: () => { const f = state.face; if (!f) return null; const ef = f.rig?.eyeFrame?.(), x = f.export?.() || {}, v = (a) => a.toArray().map((n) => +n.toFixed(4))
      return { parts: x.parts, eye: x.eye, eyeFrame: ef ? { left: v(ef.left), right: v(ef.right), radius: +ef.radius.toFixed(4), unit: +ef.unit.toFixed(4), gen: ef.gen } : null, mouth: f.mouthOnModel ?? null, lip: state.lip?.cur ?? null } },
    // Prüfwerte gegen den Spender (Test actors): angewandte Haar-, Lid- und Ohren-Einstellung, Lage/Drehung der Ohr-Basisknochen
    debugApplied: () => ({ hair: state.hair ? { ...state.hair.params } : null, lids: { ...lids }, ears: { ...earCfg },
      earBase: state.ears ? ['L', 'R'].map((k) => { const b0 = state.ears[k].bones[0], n = b0?.parent?.userData?.kfbChainBase ? b0.parent : b0; return { side: k, p: n.position.toArray().map((v) => +v.toFixed(5)), q: n.quaternion.toArray().map((v) => +v.toFixed(5)) } }) : null }),
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
      try { state.ao?.dispose() } catch (e) { /* weiter */ }
      try { state.clay?.dispose() } catch (e) { /* weiter */ }
      try { state.hair?.dispose() } catch (e) { /* weiter */ }
      try { state.face?.dispose() } catch (e) { /* weiter */ }
      geos.forEach((g) => g.dispose()); texs.forEach((t) => t.dispose()); mats.forEach((m) => m.dispose())
      faceActorLog.freed = { geometries: geos.size, materials: mats.size, textures: texs.size }
      root.clear()
    },
  }
}
