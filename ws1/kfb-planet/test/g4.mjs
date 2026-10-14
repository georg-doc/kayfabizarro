// G4 · Bildaufbau der Bühne mit FrizzleBob (#stage ohne cam/place = Standard near, Georg 14.10.; 1 Karte): ein deterministischer Prüfpunkt je Eigenschaft.
// Figuren im Bild, bevor die erste Zeile kommt · Karte frei von Figuren, Blase und Spielerwahl · Brauen am Kopf (Teilschritte, auch bei wenigen Bildern/s)
// · Farben der Original-Brauen/-Nase aus Georgs Export (WS0 14.10.).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,actors=fb,dialog=1', { viewport: { width: 1280, height: 720 } })
const st = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state())
const until = async (f, ms = 300000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await st(); if (s && f(s)) return s; await page.waitForTimeout(100) } throw new Error('timeout ' + JSON.stringify(await st())) }
// Bildschirm-Rechtecke (px): Kartenfläche, Figuren (gespielte Pose), Blasen und Spielerwahl (DOM)
const rects = () => page.evaluate(() => {
  const S = window.__kfbStageMods, cam = window.__kfbStageCamera, face = S.billboard.object3d.getObjectByName('face'), V = cam.position.constructor, W = innerWidth, H = innerHeight
  const px = (p) => [(p.x * 0.5 + 0.5) * W, (-p.y * 0.5 + 0.5) * H], box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  face.geometry.computeBoundingBox(); const bb = face.geometry.boundingBox, fc = []
  for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) fc.push(px(face.localToWorld(new V(x, y, 0)).project(cam)))
  const actor = (a) => { const pts = []; a.object3d.updateWorldMatrix(true, true); a.object3d.traverse((m) => { if (!m.isMesh || !m.visible) return; let q; if (m.isSkinnedMesh) { m.computeBoundingBox(); q = m.boundingBox } else { m.geometry.computeBoundingBox(); q = m.geometry.boundingBox } for (const x of [q.min.x, q.max.x]) for (const y of [q.min.y, q.max.y]) for (const z of [q.min.z, q.max.z]) pts.push(px(m.localToWorld(new V(x, y, z)).project(cam))) }); return box(pts) }
  // ganze Spielerwahl = kleinster Vorfahr, der alle vier Zuruf-Knöpfe und das Wortfeld enthält
  const keys = [...document.querySelectorAll('button[data-key]')], inp = document.querySelector('input, textarea'); let panel = keys[0] || null
  while (panel && !(keys.every((k) => panel.contains(k)) && (!inp || panel.contains(inp)))) panel = panel.parentElement
  const pr = panel ? panel.getBoundingClientRect() : null
  return { face: box(fc), left: actor(S.left), right: actor(S.right), choice: pr ? [pr.left, pr.top, pr.right, pr.bottom] : null, bubbles: (window.__kfbBubbles?.() || []).filter((b) => b.shown).map((b) => ({ anchor: b.anchor, r: [b.rect.left, b.rect.top, b.rect.right, b.rect.bottom] })) }
})
const shown = () => page.evaluate(() => { const S = window.__kfbStageMods; return [S.left?.status().shown, S.right?.status().shown] })
// Brauen gegenüber dem Kopfknochen (Weltlage, je Figur): bleiben am Kopf
const brows = () => page.evaluate(() => { const S = window.__kfbStageMods; return ['left', 'right'].map((k) => { const a = S[k].object3d; let head = null; const out = []
  a.traverse((o) => { if (o.isBone && /^head$/i.test(o.name)) head = o }); const h = head.getWorldPosition(head.position.clone())
  a.traverse((o) => { if (/^Carl_Brow_[LR]$/.test(o.name)) out.push(+o.getWorldPosition(o.position.clone()).sub(h).y.toFixed(3)) }); return out }) })
const visAtStart = await page.evaluate(() => new Promise((ok) => { const t = setInterval(() => { const S = window.__kfbStageMods, d = S?.dialog; if (d && d.log().length) { clearInterval(t); ok({ first: d.log()[0].type, shown: [S.left.status().shown, S.right.status().shown] }) } }, 20) }))
const camPos = await page.evaluate(() => window.__kfbStageCamera.position.toArray().map((v) => +v.toFixed(2)))
await until((s) => s.phase === 'A'); await page.waitForTimeout(500); const rA = await rects(), shA = await shown()
await until((s) => s.phase === 'CHOICE'); await page.waitForTimeout(700); const rC = await rects()
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/g4_test_choice.png', await page.screenshot())
await page.waitForTimeout(8000); const bw = await brows() // ≥ 8 s Leben mit wenigen Bildern/s (headless)
// Farben der Original-Teile = Georgs Export (WS0 14.10.), je Figur eigenes Material
const pc = await page.evaluate(() => { const S = window.__kfbStageMods; return ['left', 'right'].map((k) => { const out = { status: S[k].status().partColors }; S[k].object3d.traverse((o) => { if (/^Carl_(Brow_L|Brow_R|Nose)$/.test(o.name)) out[o.name] = { hex: '#' + o.material.color.getHexString(), uuid: o.material.uuid } }); return out }) })
await browser.close()

const inter = (P, Q) => !!P && !!Q && Math.min(P[2], Q[2]) > Math.max(P[0], Q[0]) && Math.min(P[3], Q[3]) > Math.max(P[1], Q[1])
const inView = (R) => R[0] >= 0 && R[1] >= 0 && R[2] <= 1280 && R[3] <= 720
process.exit(report('g4 framing (near, FrizzleBob)', {
  defaultIsNear: camPos[0] === 0 && camPos[1] === 2.15 && camPos[2] === 9.2, // ohne cam/place: Kamera near (Georg 14.10.)
  actorsShownBeforeFirstLine: visAtStart.first === 'card' && visAtStart.shown.every((x) => x === true) && shA.every((x) => x === true),
  cardWholeInView: inView(rA.face),
  cardFreeOfActors: !inter(rA.face, rA.left) && !inter(rA.face, rA.right) && inView(rA.left) && inView(rA.right),
  speakerBubbleOffCard: rA.bubbles.some((b) => b.anchor === 'stage-left') && rA.bubbles.every((b) => !inter(b.r, rA.face)),
  choiceBelowCard: !!rC.choice && rC.choice[1] >= rC.face[3] && rC.choice[3] <= 720, // Spielerwahl unter der Kartenfläche, ganz im Bild
  browsStayOnHead: bw.every((a) => a.length === 2 && a.every((y) => y > 0.1 && y < 0.5)), // Braue 0,1–0,5 m über dem Kopfknochen (Ruhe ≈ 0,28)
  partColorsFromExport: pc.every((a) => a.status?.brows === '#17130f' && a.status?.nose === '#e96049' && a.Carl_Nose?.hex === '#e96049' && a.Carl_Brow_L?.hex === '#17130f' && a.Carl_Brow_R?.hex === '#17130f') && pc[0].Carl_Nose.uuid !== pc[1].Carl_Nose.uuid,
  noPageErrors: errs.length === 0,
}, { camPos, pc, visAtStart, shA, rA, rC, bw, errs }))
