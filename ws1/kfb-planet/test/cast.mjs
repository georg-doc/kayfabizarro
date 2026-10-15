// F-4 · Zweite Besetzung, drei KayKit-Kandidaten auf der Bühne (#stage near, FrizzleBob links, Kandidat rechts, eine Dialog-Karte).
// Je Kandidat: Quelle gepinnt (GLB-Blob = Rezept, Profil = Batch-Eintrag) · geladen mit Augen · Augen symmetrisch auf der gedrehten Figur
// (A15 auch im F1-Weg) · Klassen-Faktor wie FrizzleBob · spricht per Blase am eigenen Anker (ohne Mund) · Pupillen bleiben im Auge (A13).
import fs from 'fs'
import { createHash } from 'crypto'
import { execFileSync } from 'child_process'
import { openPage, report } from './_page.mjs'

const IDS = ['adventurer-mage', 'adventurer-barbarian', 'gothgirl']
const REPO = process.env.KFB_REPO || `${process.env.HOME}/kfb-ws1/kayfabizarro`
const BATCH = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099:tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json'
const blob = (f) => { const b = fs.readFileSync(f); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex') }
let batch = null; try { batch = JSON.parse(execFileSync('git', ['-C', REPO, 'show', BATCH], { maxBuffer: 64e6 }).toString()) } catch (e) { batch = null }
const fbScale = JSON.parse(fs.readFileSync('src/data/actors/frizzlebob-v5b.recipe.json', 'utf8')).stage.scale

const res = {}
for (const id of IDS) {
  const rec = JSON.parse(fs.readFileSync(`src/data/actors/cast/${id}.recipe.json`, 'utf8')), pick = JSON.parse(fs.readFileSync(`src/data/eyes/cast/${id}.profile.json`, 'utf8'))
  const glb = `src/assets/actors/cast/${rec.composition.modelRef.path.split('/').pop()}`
  const pinned = blob(glb).startsWith(rec.composition.modelRef.blob) && !!batch && JSON.stringify(batch.profiles.find((p) => p.actorId === id)) === JSON.stringify(pick.profile)
  const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,cast=${id},dialog=1`, { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.right?.status().status === 'OK' && S.left?.status().shown }, null, { timeout: 300000 })
  const m = await page.evaluate(() => { const R = window.__kfbStageMods.right, root = R.object3d; root.updateWorldMatrix(true, true)
    let fig = null; root.traverse((o) => { if (!fig && o.isObject3D && o.children.some((c) => c.isSkinnedMesh || c.isBone)) fig = o })
    const sc = []; let o = null; root.traverse((x) => { if (x.type === 'Group' && x.parent === root && x.scale.x !== 1) o = x }); root.children.forEach((c) => sc.push(+c.scale.x.toFixed(5)))
    return { status: R.status().status, cleanup: R.status().cleanup, yaw: +root.rotation.y.toFixed(3), childScales: sc,
      eyes: R.debugRig().eyes.map((e) => { const p = e._pivot || e.group; return root.worldToLocal(p.getWorldPosition(p.position.clone())).toArray() }) } })
  const ph = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state()?.phase)
  for (let t0 = Date.now(); Date.now() - t0 < 240000 && (await ph()) !== 'B';) await page.waitForTimeout(150)
  await page.waitForTimeout(500)
  const bub = await page.evaluate(() => (window.__kfbBubbles?.() || []).filter((b) => b.shown).map((b) => b.anchor))
  // Pupillen im Auge, nachdem der Kandidat in Zeile A zugehört hat (lookAt) und wieder frei ist (A13 auch im F1-Weg)
  const pupil = await page.evaluate(() => { const R = window.__kfbStageMods.right.debugRig(); return { px: Math.max(...R.eyes.map((e) => Math.hypot(e._px, e._py))), max: R._max } })
  res[id] = { pinned, ...m, bub, pupil, errs: errs.length }
  await browser.close()
}
const ok = (f) => IDS.every((id) => f(res[id]))
process.exit(report('cast F-4 (drei KayKit-Kandidaten)', {
  sourcesPinned: ok((r) => r.pinned),
  loadedWithEyes: ok((r) => r.status === 'OK' && /^AUTO_CANDIDATE/.test(r.cleanup) && r.eyes.length === 2),
  eyesSymmetricOnTurnedFigure: ok((r) => Math.abs(r.yaw + 0.45) < 1e-3 && Math.abs(r.eyes[0][0] + r.eyes[1][0]) < 0.05 && Math.abs(r.eyes[0][1] - r.eyes[1][1]) < 0.01 && Math.abs(r.eyes[0][2] - r.eyes[1][2]) < 0.03 && Math.min(Math.abs(r.eyes[0][0]), Math.abs(r.eyes[1][0])) > 0.1),
  classScaleLikeFrizzleBob: ok((r) => r.childScales.some((s) => Math.abs(s - fbScale) < 1e-4)),
  speaksByBubbleWithoutMouth: ok((r) => r.bub.includes('stage-right')),
  pupilsStayInEyeInDialog: ok((r) => r.pupil.px <= r.pupil.max * 1.05),
  noPageErrors: ok((r) => r.errs === 0),
}, { res, fbScale }))
