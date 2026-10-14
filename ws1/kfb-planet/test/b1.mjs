// B1 · Billboard nach BILLBOARD_STANDARD_R2 · ein deterministischer Prüfpunkt je zugesagter Eigenschaft (#stagetest, Karte forget_utopia #1).
import fs from 'fs'
import { createHash } from 'crypto'
import { openPage, report } from './_page.mjs'

const blob = (f) => { const b = fs.readFileSync(f); return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex') }
const vendor = blob('src/vendor/billboard/billboard-clay.js').startsWith('5c9f22e1')

const { browser, page, errs } = await openPage('#stagetest,debug,view=two,card=forget_utopia:1', { viewport: { width: 1280, height: 800 } })
await page.waitForFunction(() => window.__kfbBillboard?.info()?.source === 'CARD' && window.__kfbStageActors?.left?.status().status === 'OK' && window.__kfbStageActors?.right?.status().status === 'OK', null, { timeout: 180000 })
await page.waitForTimeout(2000)
const full = await page.screenshot(); fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync('test/out/b1_two.png', full)
const r = await page.evaluate(async () => {
  const B = window.__kfbBillboard, I = B.info(), C = window.__kfbStageTestCtl, A = window.__kfbStageActors, g = B.object3d
  const face = g.getObjectByName('face'), body = g.getObjectByName('body'), fb = new face.position.constructor()
  face.geometry.computeBoundingBox(); const fs = face.geometry.boundingBox.getSize(fb.clone())
  // Leinwand gegen die rohe Viertelseite (gleiche Auflösung): randlos, nicht beschnitten, nicht gepolstert
  const raw = await window.__kfbCardImage('forget_utopia', 1, C.lib.BB_RES)
  const img = new Image(); await new Promise((ok) => { img.onload = ok; img.src = raw.png })
  const cv = face.material.map.image, k = document.createElement('canvas'); k.width = cv.width; k.height = cv.height; const kg = k.getContext('2d'); kg.drawImage(img, 0, 0, k.width, k.height)
  const a = kg.getImageData(0, 0, k.width, k.height).data, b = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let d = 0; for (let i = 0; i < a.length; i += 4) d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])
  body.geometry.computeBoundingBox(); const bbx = body.geometry.boundingBox
  return { faceZ: face.position.z, bodyTop: +bbx.max.y.toFixed(3), bodyWidth: +(bbx.max.x - bbx.min.x).toFixed(3), I, faceSize: [+fs.x.toFixed(4), +fs.y.toFixed(4)], faceY: +face.position.y.toFixed(4), bodyVerts: body.geometry.attributes.position.count, rawWH: [raw.w, raw.h], canvasDiff: d / (a.length / 4 * 3),
    leftStatus: A.left.status().status, rightStatus: A.right.status().status }
})
// Bildschirm-Überdeckung: Kartenfläche vs. Figuren (projiziert mit der Szenenkamera)
const ov = await page.evaluate(() => {
  const B = window.__kfbBillboard, A = window.__kfbStageActors, face = B.object3d.getObjectByName('face'), V = face.position.constructor
  const cam = window.__kfbStageCamera
  const rect = (pts) => { const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  face.geometry.computeBoundingBox(); const bb = face.geometry.boundingBox, fc = []
  for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) fc.push(face.localToWorld(new V(x, y, 0)).project(cam))
  // Figuren mit der gespielten Pose: SkinnedMesh.computeBoundingBox rechnet mit den aktuellen Knochen (nicht die Bindepose)
  const actorRect = (a) => { const pts = []; a.object3d.updateWorldMatrix(true, true); a.object3d.traverse((m) => { if (!m.isMesh || !m.visible) return; let q; if (m.isSkinnedMesh) { m.computeBoundingBox(); q = m.boundingBox } else { m.geometry.computeBoundingBox(); q = m.geometry.boundingBox } for (const x of [q.min.x, q.max.x]) for (const y of [q.min.y, q.max.y]) for (const z of [q.min.z, q.max.z]) pts.push(m.localToWorld(new V(x, y, z)).project(cam)) }); return rect(pts) }
  const F = rect(fc), L = actorRect(A.left), R = actorRect(A.right), inter = (P, Q) => Math.max(0, Math.min(P[2], Q[2]) - Math.max(P[0], Q[0])) * Math.max(0, Math.min(P[3], Q[3]) - Math.max(P[1], Q[1]))
  return { face: F.map((v) => +v.toFixed(3)), left: L.map((v) => +v.toFixed(3)), right: R.map((v) => +v.toFixed(3)), overlapL: inter(F, L), overlapR: inter(F, R), faceInView: F[0] > -1 && F[2] < 1 && F[1] > -1 && F[3] < 1 }
})
// Platzhalter: Karte aus einem nicht gesicherten Deck → wörtlicher Text, Kartenverhältnis 1,79
const ph = await page.evaluate(async () => { const C = window.__kfbStageTestCtl, { DECKS, cardAt, cardsOfDeck } = C.cards, di = DECKS.findIndex((d) => d.id === 'anti_rules_toolkit'), card = cardAt(cardsOfDeck(di)[0])
  const info = await window.__kfbBillboard.setCard(card); return { safe: C.lib.isCardSafe(card.deck.id, card.num), source: info.source, aspect: info.aspect, cornerR: info.cornerR, card: info.card, name: card.name, fontScale: info.fontScale } })
// fitFace-Grenzfälle; Palette: ohne Biom kein Billboard, anderes Biom → andere Rahmenfarbe (Georg 14.10.)
const corner = await page.evaluate(() => { const C = window.__kfbStageTestCtl, L = C.lib
  let noBiome = ''; try { L.createBillboard({ card: null }) } catch (e) { noBiome = e.message }
  const other = L.createBillboard({ card: null, biome: L.BIOMES[3] }), oi = other.info(); other.dispose()
  return { fit: L.fitFace(1.79, 7, 5), fitTall: L.fitFace(0.8, 7, 5), noBiome, other: oi.palette } })
// Innenecken rund + Karte maskiert: Rand-Pixel der Fläche (Ecke vs. Kantenmitte) im Nahbild der Tafel
const face = await page.evaluate(() => { const f = window.__kfbBillboard.object3d.getObjectByName('face'), p = f.geometry.attributes.position
  let minR = Infinity; const bb = (f.geometry.computeBoundingBox(), f.geometry.boundingBox)
  for (let i = 0; i < p.count; i++) { const dx = bb.max.x - p.getX(i), dy = bb.max.y - p.getY(i); minR = Math.min(minR, Math.hypot(dx, dy)) } // Abstand der nächsten Ecke der Fläche zur Box-Ecke
  return { verts: p.count, cornerGap: +minR.toFixed(4) } })
// Vertrag §6: Abbau gibt Leinwand-Textur und beide Materialien frei
const life = await page.evaluate(async () => { const B = window.__kfbBillboard, face = B.object3d.getObjectByName('face'), body = B.object3d.getObjectByName('body'), seen = new Set()
  for (const x of [face.material, face.material.map, body.material]) x.addEventListener('dispose', () => seen.add(x.uuid))
  window.__kfbStageTestCtl.off(); await new Promise((r) => setTimeout(r, 500)); return { freed: seen.size, log: window.__kfbStageTestCtl.log() } })
await browser.close()

const I = r.I
process.exit(report('b1 billboard R2', {
  vendorByteIdentical: vendor,
  // Stil plain (Rahmen + Pfosten, kein TV-Gehäuse/Antenne/Knöpfe): Oberkante = Rahmenkante, Breite = Rahmen (W + 2·0,45 + Fase)
  plainStyleNoTv: r.bodyTop < I.gb + I.H + 0.75 && r.bodyWidth < I.W + 1.2 && r.bodyVerts > 1000,
  lowPosts: I.gb === 0.9 && r.faceY === +(0.9 + I.H / 2).toFixed(4) && I.top < 5.5,
  responsiveFitFace: Math.abs(I.W / I.H - I.aspect) < 1e-3 && I.W <= 7 && I.H <= 5 && corner.fit.w === 7 && Math.abs(corner.fit.h - 7 / 1.79) < 1e-9 && corner.fitTall.h === 5 && corner.fitTall.w === 4,
  canvasHasCardAspect: Math.abs(I.canvas[0] / I.canvas[1] - r.rawWH[0] / r.rawWH[1]) < 0.003 && I.canvas[0] === r.rawWH[0],
  faceFillsOpening: Math.abs(r.faceSize[0] - I.W) < 1e-3 && Math.abs(r.faceSize[1] - I.H) < 1e-3,
  cardWholeNotCropped: r.canvasDiff < 1, // Leinwand = rohe Viertelseite Pixel für Pixel (Mittel < 1/255)
  realCardFromSafeDeck: I.source === 'CARD' && I.card === 'forget_utopia#1',
  // runde Innenecke r = 0,45 (STYLES.plain.corner): die Fläche ist ein Rundrechteck, ihre Ecke liegt r·(√2−1) ≈ 0,186 innerhalb der Box-Ecke (Maske)
  // Ecke = quadratische Kurve des Spenders (rr): Scheitel r·√2/4 ≈ 0,159 innerhalb der Box-Ecke → die Kartenecke ist maskiert
  cornersRoundMasked: I.cornerR === 0.45 && face.verts > 4 && Math.abs(face.cornerGap - 0.45 * Math.SQRT2 / 4) < 0.005,
  faceInFrontOfFrameWall: r.faceZ >= 0.28 && r.faceZ < 0.36, // vor der geraden Innenwand (0,08–0,28): Schrägansicht schneidet nichts ab
  paletteFromBiome: I.palette.biome === 'Moos-Insel' && I.palette.frame === '#d97c3a' && I.palette.post === '#6f4e37' && /BILLBOARD_BIOME_REQUIRED/.test(corner.noBiome) && corner.other.frame === '#a64670',
  placeholderForUnsafeDeck: ph.safe === false && ph.source === 'PLACEHOLDER' && Math.abs(ph.aspect - 1.79) < 0.01 && ph.cornerR === 0.45 && ph.fontScale > 0.3, // ganzer Text passt (Schrift verkleinert, nie gekürzt)
  cardReadableBetweenActors: ov.faceInView && ov.overlapL === 0 && ov.overlapR === 0,
  actorsOnStage: r.leftStatus === 'OK' && r.rightStatus === 'OK',
  contractDisposeFrees: life.freed === 3 && life.log.dispose === life.log.create && life.log.create === 2, // Hauptbillboard + Paletten-Probe
  noPageErrors: errs.length === 0,
}, { info: I, ov, ph, corner, face, life, r: { ...r, I: undefined }, errs }))
