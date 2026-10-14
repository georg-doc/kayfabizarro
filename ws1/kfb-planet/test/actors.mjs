// Darsteller-Slot (V-227/V-228 §4) + FrizzleBob v5 (V-236) · ein deterministischer Prüfpunkt je zugesagter Eigenschaft.
// Teil A (ohne Browser): Darsteller-Vertrag R2 = #355 + Erweiterung. Die #355-Tests laufen unverändert gegen R2, dazu die neuen Fälle.
// Teil B (#actortest, Bindepose, ToolBox-Licht/-Kamera): FrizzleBob über createActor gegen die Spender-Referenz der ToolBox P06 r1
// (test/ref/fb_donor_face.*, aufgenommen mit scripts/fb/donor-pair.mjs aus demselben Eintrag).
import fs from 'fs'
import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import { openPage, report } from './_page.mjs'
import { companion } from '../src/actors/face-driver-contract.r2.mjs'

const FREEZE = () => { const R = window.__kfbActor.debugRig(); R.setLife({ on: false }); R._blinkK = -1; R._blinkT = 1e9; R.setGazeFollow(true); R.pointTo(0, 0) } // = scripts/fb/donor-pair.mjs
const RECIPE = JSON.parse(fs.readFileSync('src/data/actors/frizzlebob-v5.recipe.json', 'utf8'))
const ROGUE = JSON.parse(fs.readFileSync('src/data/actors/rogue-hooded.recipe.json', 'utf8'))
const REF = JSON.parse(fs.readFileSync('test/ref/fb_donor_face.report.json', 'utf8'))
const blob = (f) => { const b = fs.readFileSync(f); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex') }

// --- Teil A · Vertrag
fs.mkdirSync('test/out', { recursive: true })
const t355 = fs.readFileSync('test/vendor355/wireface-face-driver-contract.test.mjs', 'utf8').replace("../../src/vendor/composer/wireface-face-driver-contract.mjs", '../../../src/actors/face-driver-contract.r2.mjs')
fs.mkdirSync('test/out/r2', { recursive: true }); fs.writeFileSync('test/out/r2/contract355-on-r2.mjs', t355)
let suite355 = false
try { suite355 = JSON.parse(execFileSync('node', ['test/out/r2/contract355-on-r2.mjs'], { encoding: 'utf8' })).passed === 19 } catch (e) { suite355 = false }
const throws = (fn, re) => { try { fn(); return false } catch (e) { return re.test(e.message) } }
const fbPlan = companion(RECIPE)
const donor = { sourceId: 'S', sourceRef: 'r', sdkVersion: 'v', proof: 'SOURCE_ISOLATED_VISUALLY_VERIFIED', distributionReviewed: true }
const mount = { headNodeId: 'head', measured: true, at: [0, 0, 0], rotation: [0, 0, 0], size: 1 }
const contract = {
  contract355UnchangedOnR2: suite355,
  singleModelRecipeAccepted: fbPlan.channelOwner === 'KFB_NATIVE' && fbPlan.modelRef?.blob === '131d7c38' && fbPlan.bodyRef === null,
  rogueRecipeAccepted: companion(ROGUE).modelRef?.blob === '7063f6cb',
  modelPinRequired: throws(() => companion({ ...RECIPE, composition: { modelRef: { path: 'x', revision: 'y' } } }), /MODEL_RIG_SOURCE_REQUIRED/),
  customRigOnlyWithModel: throws(() => companion({ ...RECIPE, source: { ...RECIPE.source, rigFamily: 'CUSTOM' }, composition: { bodyRef: 'b', headRef: 'h' } }), /BODY_HEAD_RIG_SOURCE_REQUIRED/),
  nativeRejectsWirefaceOwner: throws(() => companion(RECIPE, { activeFaceOwners: ['wireface-mouth'] }), /DOUBLE_FACE_CHANNEL_OWNER/),
  ambiguousCompositionRejected: throws(() => companion({ ...RECIPE, composition: { ...RECIPE.composition, bodyRef: 'b', headRef: 'h' } }), /COMPOSITION_AMBIGUOUS/),
  floatingRevisionRejected: throws(() => companion({ ...RECIPE, composition: { modelRef: { ...RECIPE.composition.modelRef, revision: 'main' } } }), /MODEL_RIG_SOURCE_REQUIRED/)
    && throws(() => companion({ ...RECIPE, composition: { modelRef: { ...RECIPE.composition.modelRef, path: ' ' } } }), /MODEL_RIG_SOURCE_REQUIRED/),
  customRigWithModelAccepted: companion({ ...RECIPE, source: { ...RECIPE.source, rigFamily: 'CUSTOM' } }).rigFamily === 'CUSTOM',
  wirefaceRejectsEyeRig: throws(() => companion(RECIPE, { mode: 'WIREFACE_MESH', faceSource: donor, mount, activeFaceOwners: ['eye'] }), /DOUBLE_FACE_CHANNEL_OWNER/),
  // eingebundene Spender byte-gleich (Blobs aus SOURCE_ISOLATION_R1 / Pins)
  vendorByteIdentical: [
    ['src/vendor/composer/wireface-face-driver-contract.mjs', '74d03061'], ['src/vendor/fb/kfb-lib/face-mount.v1.js', '535b592a'], ['src/vendor/fb/kfb-lib/clay-lids.v1.js', '027d5af6'],
    ['src/vendor/fb/kfb-lib/lipsync-text.v1.js', '7b981a94'], ['src/vendor/fb/kfb-lib/ear-base.v1.js', 'dc320dfe'], ['src/vendor/fb/kfb-lib/hair-tufts.v1.js', '92d2d44a'],
    ['src/vendor/fb/ear-rig/ear-dangle.v1.js', '6bb4531a'], ['src/vendor/fb/emb/petstudio-v9/studio-v3/pet-mouth.v1.js', 'd18c95cc'], ['src/vendor/fb/emb/frizzlegraft-v1/eyeoval.v1.js', '397e5174'],
    ['src/vendor/fb/emb/frizzlegraft-v1/headzones.v1.js', 'f373c5e3'], ['src/vendor/fb/emb/lab-v6/partrig.v1.js', '27c6533f'], ['src/vendor/fb/emb/petstudio-v9/studio-v12/brow-rig.v2.js', 'ccc91a7f'],
    ['src/vendor/fb/emb/petstudio-v9/studio-v12/pet-nose.v2.js', '1057af70'], ['src/vendor/fb/emb/petstudio-v9/studio-v12/pet-moustache.v1.js', '1f8b869e'], ['src/vendor/fb/emb/petstudio-v9/kfb-ink-canon.js', 'de9d4776'],
    ['src/vendor/eyes/pet-eye-rig.v6.js', '853bcf5f'], ['src/vendor/eyes/facehost.v1.js', '38ec7770'],
    ['src/assets/actors/FB_TEMPLATE_LOOK_v5.glb', '131d7c38'], ['src/data/actors/fb-default.ear-rig.json', '5ab5e8bc'], ['src/assets/actors/fb-hair/FrizzleBob_Yellow.gltf', 'e0a757ec'],
  ].every(([f, b]) => blob(f).startsWith(b)),
  mouthDecalsPinned: (() => { const want = { Smile: 'bf7f9b1b', Neutral: 'dc12552f', M: 'd747d302', D: '652ca2d6', S: '6e4012be', Ee: 'c65bc3a7', Uh: 'aa87724b', Ah: 'b2ad7596', Oh: '6153869c', R: '264c60d7', F: 'b56eed5f', 'W-oo': '5aabcac3', L: '61f0eb60' }
    const fsz = fs.readdirSync('src/assets/actors/fb-mouth'); return fsz.length === 13 && fsz.every((f) => { const k = f.replace(/^FrizzleBobMouth_01_0000s_0001s_\d{4}_/, '').replace('.png', ''); return want[k] && blob('src/assets/actors/fb-mouth/' + f).startsWith(want[k]) }) })(),
}

// --- Teil B · Browser
const { browser, page, errs } = await openPage('#actortest,debug,view=face', { viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbActor && window.__kfbActor.status().status !== 'LOADING', null, { timeout: 120000 })
await page.waitForTimeout(1500)
await page.evaluate(FREEZE); await page.waitForTimeout(1500) // Augen eingefroren: Aufnahmen wiederholbar (Prüfer 5, Befund 1)
const st = await page.evaluate(() => window.__kfbActor.status())
const drv = await page.evaluate(() => { const A = window.__kfbActor, f = A.debugFace(), orig = []; A.object3d.traverse((o) => { if (/^FB_Eye_[LR]$/.test(o.name)) orig.push(o.visible) })
  const anchorY = A.bubbleAnchors[0].object3d.getWorldPosition(new f.rig.rig.position.constructor()).y, head = A.object3d.getObjectByName('head').getWorldPosition(new f.rig.rig.position.constructor()).y
  return { owner: A.plan.channelOwner, rigVisible: f.rig.rig.visible, origEyesHidden: orig.length === 2 && orig.every((v) => !v), rigMouthHidden: !!f.mouth?.mesh && f.mouth.mesh.visible === false, anchorAboveHead: anchorY > head + 0.5 } })
const rep = await page.evaluate(() => window.__kfbActor.report())
const full = await page.screenshot()
fs.writeFileSync('test/out/actors_face.png', full)
// Blick: Weltrichtung des Pupillen-Drehpunkts je Auge (e._pivot; beim Sitz 'surface' hängt er unter kfb-pupil-free, face-mount Z. 213)
const pupils = () => page.evaluate(() => { const rig = window.__kfbActor.debugRig(); return rig.eyes.map((e) => { const piv = e._pivot; const d = piv.getWorldDirection(new piv.position.constructor()); return [d.x, d.y] }) })
const p0 = await pupils(); await page.evaluate(() => window.__kfbActor.lookAt(-0.85, 0)); await page.waitForTimeout(800)
const pL = await pupils(); await page.evaluate(FREEZE); await page.waitForTimeout(800)
// Lidschlag in der Mitte gehalten: Augenweiß UND Pupille müssen verschwinden (Spender-Abnahme 3 „closed means closed“)
const eyeCrop = { x: 290, y: 340, width: 340, height: 90 } // nur Augäpfel: ohne Brauen (schwarz) und ohne Hintergrund
const open1 = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbActor.debugRig(); rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 }); await page.waitForTimeout(400)
const shut = await page.screenshot({ clip: eyeCrop })
await page.evaluate(() => { const rig = window.__kfbActor.debugRig(); rig.blink.dur = rig.__dur; rig._blinkK = -1 }); await page.waitForTimeout(400)
fs.writeFileSync('test/out/actors_eyes_open.png', open1); fs.writeFileSync('test/out/actors_eyes_shut.png', shut)
// Mund: Text → Spur ohne Ton; während der Spur trägt der Modellmund das aktuelle Decal, danach wieder sein eigenes
const mouth = await page.evaluate(async () => {
  const A = window.__kfbActor, wait = (ms) => new Promise((r) => setTimeout(r, ms))
  const mats = []; A.object3d.traverse((o) => { if (o.isMesh && /^FB_Mouth/.test(o.name)) [].concat(o.material).forEach((m) => mats.push(m)) })
  const own = mats.map((m) => m.map && m.map.uuid)
  const track = A.say('Hallo, ich bin FrizzleBob!'); const total = track.reduce((s, x) => s + x.ms, 0)
  const seen = new Set(); let decalOnModel = false
  for (let t = 0; t < total + 600; t += 60) { await wait(60); const r = A.report(); if (r.lip) seen.add(r.lip); if (/^decal/.test(r.mouth || '') && mats.some((m, i) => m.map && m.map.uuid !== own[i])) decalOnModel = true }
  await wait(300)
  const after = A.report()
  return { keys: track.length, total, shapes: [...seen], decalOnModel, endMouth: after.mouth, ownBack: mats.length > 0 && mats.every((m, i) => (m.map && m.map.uuid) === own[i]), speaking: A.speaking(),
    endShapeOnRig: A.debugFace().mouth.cur, decalCache: Object.keys(A.debugFace().mouth.tex).length }
})
// Ohren: Stoß → Ohrknochen schwingen, bleiben endlich, kommen zur Ruhe
const ears = await page.evaluate(async () => {
  const A = window.__kfbActor, wait = (ms) => new Promise((r) => setTimeout(r, ms)); const b = []; A.object3d.traverse((o) => { if (o.isBone && /^ear[._]?[lr][._]?[123]$/i.test(o.name)) b.push(o) }) // GLTFLoader entfernt die Punkte (earl1)
  const q = () => b.map((o) => o.quaternion.toArray()); const q0 = q(); A.earImpulse('land'); await wait(250)
  const q1 = q(); const moved = q1.some((x, i) => x.some((v, k) => Math.abs(v - q0[i][k]) > 1e-3)); await wait(4000)
  const q2 = q(); const settled = q2.every((x, i) => x.every((v, k) => Math.abs(v - q0[i][k]) < 0.02)); return { bones: b.length, moved, settled, finite: q1.flat().every(Number.isFinite) }
})
// Vertrag §6
for (let i = 0; i < 5; i++) await page.evaluate(() => window.__kfbActorTestCtl.rerender())
await page.waitForTimeout(500)
// Unabhängig von dispose gesammelt: alle Meshes unter dem Szenenknoten + Mund-Rig + Decal-Cache (alle gesprochenen Laute) + flipY-Zwillinge
const before = await page.evaluate(() => {
  const A = window.__kfbActor, f = A.debugFace(), geos = new Set(), mats = new Set(), texs = new Set()
  const add = (o) => o && o.traverse((m) => { if (!m.isMesh) return; geos.add(m.geometry); [].concat(m.material).forEach((x) => { if (!x) return; mats.add(x); for (const k in x) if (x[k]?.isTexture) texs.add(x[k]) }) })
  add(A.object3d); add(f.rig.rig); add(f.mouth?.mesh)
  for (const t of Object.values(f.mouth?.tex || {})) { if (!t) continue; texs.add(t); const tw = f._decalTwins?.get?.(t); if (tw) texs.add(tw) }
  window.__freedSet = { g: new Set(), m: new Set(), t: new Set() }
  geos.forEach((g) => g.addEventListener('dispose', () => window.__freedSet.g.add(g.uuid))); mats.forEach((x) => x.addEventListener('dispose', () => window.__freedSet.m.add(x.uuid))); texs.forEach((x) => x.addEventListener('dispose', () => window.__freedSet.t.add(x.uuid)))
  return { geos: geos.size, mats: mats.size, texs: texs.size, log: window.__kfbActorTestCtl.log() }
})
await page.evaluate(() => window.__kfbActorTestCtl.off()); await page.waitForTimeout(600)
const after = await page.evaluate(() => ({ log: window.__kfbActorTestCtl.log(), freed: { g: window.__freedSet.g.size, m: window.__freedSet.m.size, t: window.__freedSet.t.size } }))
await page.waitForTimeout(600)
const later = await page.evaluate(() => window.__kfbActorTestCtl.log().update)
// Wireface: nie ein zweites Gesicht, nie ein Absturz. (a) FrizzleBob-Rezept (KFB-Besitzer für eye/lids/mouth) unter WIREFACE → abgelehnt;
// (b) reines Wireface-Rezept ohne SDK → SOURCE_MISSING; (c) ohne Nachweis-Objekt → SOURCE_MISSING statt Ausnahme. Plus: ohne lokale Decals kein Akteur.
const wf = await page.evaluate(() => { const C = window.__kfbActorTestCtl, src = { sourceId: 'S', sourceRef: 'r', sdkVersion: '0.3.3', proof: 'SOURCE_ISOLATED_VISUALLY_VERIFIED', distributionReviewed: true }, mount = { headNodeId: 'head', measured: true, at: [0, 0, 0], rotation: [0, 0, 0], size: 1 }
  const wfRecipe = { ...C.recipe, composition: { ...C.recipe.composition, faceOwners: { face: 'wireface-sdk' } } }
  const a = C.createActor({ recipe: C.recipe, faceDriver: 'WIREFACE_MESH', faceSource: src, mount }), b = C.createActor({ recipe: wfRecipe, faceDriver: 'WIREFACE_MESH', faceSource: src, mount }), c = C.createActor({ recipe: wfRecipe, faceDriver: 'WIREFACE_MODEL' })
  let noDecals = ''; try { const { mouthDecals, ...rest } = C.options; C.createActor(rest) } catch (e) { noDecals = e.message }
  return { a: [a.status().status, a.status().reason, a.object3d.children.length], b: [b.status().status, b.object3d.children.length, b.faceDriver], c: [c.status().status, c.object3d.children.length], noDecals } })
const cmp = await page.evaluate(async ([a, b, o, s]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const px = (img, x, y, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h); return c.getContext('2d').getImageData(0, 0, w, h).data }
  const diff = (A, B) => { let d = 0; for (let i = 0; i < A.length; i += 4) for (let k = 0; k < 3; k++) d += Math.abs(A[i + k] - B[i + k]); return d / (A.length / 4 * 3) }
  const white = (A) => { let n = 0; for (let i = 0; i < A.length; i += 4) { const r = A[i], g = A[i + 1], b = A[i + 2]; if (Math.min(r, g, b) > 170 && Math.max(r, g, b) - Math.min(r, g, b) < 30) n++ } return n }
  // Pupille = neutrales Schwarz (matte-cute); der Lid-Schatten ist dunkel, aber bräunlich (r > b) und zählt nicht
  const dark = (A) => { let n = 0; for (let i = 0; i < A.length; i += 4) { const mx = Math.max(A[i], A[i + 1], A[i + 2]), mn = Math.min(A[i], A[i + 1], A[i + 2]); if (mx < 45 && mx - mn < 10) n++ } return n }
  const [R, S, O, Z] = await Promise.all([load(a), load(b), load(o), load(s)])
  const PO = px(O, 0, 0, O.width, O.height), PZ = px(Z, 0, 0, Z.width, Z.height)
  return { faceVsDonor: diff(px(R, 200, 100, 500, 480), px(S, 200, 100, 500, 480)), whiteOpen: white(PO), whiteShut: white(PZ), pupilOpen: dark(PO), pupilShut: dark(PZ) }
}, ['data:image/png;base64,' + full.toString('base64'), 'data:image/png;base64,' + fs.readFileSync('test/ref/fb_donor_face.png').toString('base64'), 'data:image/png;base64,' + open1.toString('base64'), 'data:image/png;base64,' + shut.toString('base64')])
await browser.close()

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const dxL = pL[0][0] - p0[0][0], dxR = pL[1][0] - p0[1][0]
process.exit(report('actors slot + FrizzleBob v5', {
  ...contract,
  mounted: st.status === 'OK',
  oneFaceDriverNative: drv.owner === 'KFB_NATIVE' && drv.rigVisible && drv.origEyesHidden && drv.rigMouthHidden && rep?.parts?.mouth === 'original',
  bubbleAnchorAboveHead: drv.anchorAboveHead,
  entryAsRecipe: same(rep?.eye?.anchor, RECIPE.face.eye.anchor) && same(rep.eye.oval, RECIPE.face.eye.oval) && rep.eye.socket === 'surface',
  eyeFrameEqualDonor: same(rep?.eyeFrame?.left, REF.eyeFrame.left) && same(rep.eyeFrame.right, REF.eyeFrame.right) && rep.eyeFrame.radius === REF.eyeFrame.radius,
  imageMatchesDonor: cmp.faceVsDonor < 6,
  hairAndEars: st.hair === true && same(st.ears, [3, 3]),
  gazeParallel: dxL < -0.003 && dxR < -0.003 && Math.abs(dxL - dxR) < Math.max(Math.abs(dxL), Math.abs(dxR)) * 0.5,
  lidsCoverSclera: cmp.whiteOpen > 400 && cmp.whiteShut < cmp.whiteOpen * 0.05,
  pupilHiddenWhenClosed: cmp.pupilOpen > 300 && cmp.pupilShut <= cmp.pupilOpen * 0.05,
  mouthMimeTrack: mouth.keys > 10 && mouth.shapes.length >= 5 && mouth.decalOnModel,
  mouthBackToOwn: mouth.endMouth === 'own' && mouth.ownBack && mouth.speaking === false && mouth.endShapeOnRig === 'smile', // „!“ → Ende smile (wie Spender), Modellmund wieder eigen
  earsSwingAndSettle: ears.bones === 6 && ears.moved && ears.finite && ears.settled,
  contractCreateOnce: before.log.create === 1,
  contractUpdateGetsCtx: before.log.update > 5 && before.log.lastCtx?.hasCam === true,
  contractDisposeOnce: after.log.dispose === 1 && later === after.log.update,
  contractAllFreed: before.geos > 10 && after.freed.g === before.geos && after.freed.m === before.mats && before.texs > 5 && after.freed.t === before.texs,
  wirefaceNeverSecondFace: wf.a[0] === 'CONTRACT_REJECTED' && /DOUBLE_FACE_CHANNEL_OWNER/.test(wf.a[1]) && wf.a[2] === 0,
  wirefaceWithoutSdkNoFigure: wf.b[0] === 'SOURCE_MISSING' && wf.b[1] === 0 && wf.b[2] === 'WIREFACE_MESH' && wf.c[0] === 'SOURCE_MISSING' && wf.c[1] === 0,
  localDecalsRequired: /MOUTH_DECALS_REQUIRED/.test(wf.noDecals),
  noPageErrors: errs.length === 0,
}, { drv, st, eyeFrame: rep?.eyeFrame, cmp, mouth, ears, contract: { before, after, later }, wf, dx: [dxL, dxR], errs }))
