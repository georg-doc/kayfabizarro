// V-346 · Bildpaare vorher | neu für Georg (V-253: Paare, ≥ 1600 px, große Beschriftung), immer mit Knet (V-346 Punkt 5), dazu Messwerte:
// GothGirl-Helligkeit (Knet aus | vorher | neu), FB-Gesichtshelligkeit, Fahrzeug-Sättigung (Knet aus | vorher | neu, Ziel ≥ 95 %).
// vorher = tune=0,tm=aces (Stand V-340/V-342 mit Look B und Knet alle) · neu = Standard ohne Schalter.
// node scripts/light/v346-pairs.mjs [out] [teil: stage|lineup]
import fs from 'fs'
import { execFileSync } from 'child_process'
import sharp from 'sharp'
import { openPage } from '../../test/_page.mjs'
const OUT = process.argv[2] || 'test/out/v346'; fs.mkdirSync(OUT, { recursive: true })
const ONLY = process.argv[3] || null
const PAIR = 'scripts/amph/palette-pair.mjs'
const rows = []
// Bildschirm-Rechteck einer Figur bzw. ihres Kopfes (projizierte Hüllbox)
const boxes = (page) => page.evaluate(() => {
  const S = window.__kfbStageMods, cam = window.__kfbStageCamera, W = innerWidth, H = innerHeight
  const rect = (obj, pick = () => true) => { let lo = [Infinity, Infinity], hi = [-Infinity, -Infinity]; obj.updateWorldMatrix(true, true)
    obj.traverse((o) => { if (!o.isMesh || !o.geometry || !pick(o)) return; o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox
      for (let i = 0; i < 8; i++) { const v = new (cam.position.constructor)(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).applyMatrix4(o.matrixWorld).project(cam)
        const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H; lo = [Math.min(lo[0], x), Math.min(lo[1], y)]; hi = [Math.max(hi[0], x), Math.max(hi[1], y)] } })
    const c = (v, m) => Math.max(0, Math.min(m, Math.round(v))); return { left: c(lo[0], W), top: c(lo[1], H), width: c(hi[0], W) - c(lo[0], W), height: c(hi[1], H) - c(lo[1], H) } }
  return { fb: rect(S.left.object3d), fbHead: rect(S.left.object3d, (o) => /CharacterTemplate_Head/.test(o.name)), gg: rect(S.right.object3d) } })
// mittlere Helligkeit (Rec. 709, 0–255) und mittlere Sättigung (HSV, 0–1) über nicht schwarze Pixel
async function stats(buf, region = null) {
  const img = region ? sharp(buf).extract(region) : sharp(buf), { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  let n = 0, Y = 0, Sat = 0
  for (let i = 0; i < data.length; i += info.channels) { const r = data[i], g = data[i + 1], b = data[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx < 8) continue; n++; Y += 0.2126 * r + 0.7152 * g + 0.0722 * b; Sat += (mx - mn) / mx }
  return { lum: +(Y / n).toFixed(1), sat: +(Sat / n).toFixed(4), px: n }
}
const shot = async (hash, W = 1920, H = 1080, prep = null) => {
  const { browser, page, errs } = await openPage(hash, { viewport: { width: W, height: H } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S.left?.status().shown && S.right?.status?.().shown !== false && (S.rim?.info?.() || []).length >= 1 && (S.clay ? S.clay.info().length >= 1 : true) && (S.lineup ? S.lineup.status().status === 'OK' && (/clay=0/.test(location.hash) || (S.clayV?.info?.() || []).length === 1) : true) }, null, { timeout: 480000 }).catch(() => {})
  await page.waitForTimeout(2500)
  await page.evaluate(() => { for (const id of ['kfb-cam-marks', 'kfb-compare', 'kfb-preview-badge']) document.getElementById(id)?.style.setProperty('display', 'none') })
  if (prep) { await page.evaluate(prep); await page.waitForTimeout(800) }
  const info = await page.evaluate(() => ({ light: window.__kfbStageLight?.info(), tones: window.__kfbStageMods.tones?.info?.() || null, face: window.__kfbStageMods.rim?.faceInfo?.() || null }))
  const b = await boxes(page).catch(() => null), buf = await page.screenshot({ timeout: 180000 }); await browser.close(); return { buf, info, b, errs: errs.length }
}
const save = (name, buf) => { const f = `${OUT}/${name}.png`; fs.writeFileSync(f, buf); return f }
const pair = (a, b, out, title, sub, la = 'VORHER · Stand V-340', lb = 'NEU · V-346') => execFileSync('node', [PAIR, a, b, `${OUT}/${out}.png`, title, sub, la, lb])
// Ausschnitt um ein Rechteck, auf 1600 Breite vergrößert (Nahbild ohne zweite Kamera)
const crop = async (buf, r, pad = 0.35) => { const m = await sharp(buf).metadata(), px = Math.round(r.width * pad), py = Math.round(r.height * pad)
  const e = { left: Math.max(0, r.left - px), top: Math.max(0, r.top - py) }; e.width = Math.min(m.width - e.left, r.width + 2 * px); e.height = Math.min(m.height - e.top, r.height + 2 * py)
  return sharp(buf).extract(e).resize({ width: 1600, height: 900, fit: 'contain', background: '#1c1610' }).png().toBuffer() }

const BASE = '#stage,debug,actors=fb,light=l1'
if (!ONLY || ONLY === 'stage') {
  for (const [mid, mname] of [['day', 'Tag'], ['gold', 'Goldene Stunde']]) {
    const off = await shot(`${BASE},tod=${mid},clay=0,tune=0,tm=aces`), old = await shot(`${BASE},tod=${mid},tune=0,tm=aces`), neu = await shot(`${BASE},tod=${mid}`)
    const fa = save(`stage_${mid}_vorher`, old.buf), fb = save(`stage_${mid}_neu`, neu.buf)
    pair(fa, fb, `paar_buehne_${mid}`, `V-346 · Amphitheater · ${mname} · vorher | neu`, 'Neu: Himmel nur getönt · GothGirl-Glow als Hauch · FB-Gesicht heller · Knet alle · ACES, Boden ohne')
    const ga = save(`gg_${mid}_vorher`, await crop(old.buf, old.b.gg)), gb = save(`gg_${mid}_neu`, await crop(neu.buf, neu.b.gg))
    pair(ga, gb, `paar_gothgirl_${mid}`, `V-346 · GothGirl nah · ${mname}`, 'Randlicht 0,5 → 0,15 (nur Silhouette) · Knet-Belichtung × 0,95, weniger Samt')
    const ha = save(`fb_${mid}_vorher`, await crop(old.buf, old.b.fbHead, 0.6)), hb = save(`fb_${mid}_neu`, await crop(neu.buf, neu.b.fbHead, 0.6))
    pair(ha, hb, `paar_fb_gesicht_${mid}`, `V-346 · FrizzleBob Gesicht · ${mname}`, 'Gesichts-Fill 0,16 im Material, Kopf ohne Sonnenschatten · Mund und Augen lesbar (G1)')
    const m = { gg: { knetAus: await stats(off.buf, off.b.gg), vorher: await stats(old.buf, old.b.gg), neu: await stats(neu.buf, neu.b.gg) },
      fbHead: { knetAus: await stats(off.buf, off.b.fbHead), vorher: await stats(old.buf, old.b.fbHead), neu: await stats(neu.buf, neu.b.fbHead) } }
    rows.push({ part: 'stage', mid, m, light: neu.info.light, tones: neu.info.tones, face: neu.info.face, errs: [off.errs, old.errs, neu.errs] }); console.log(mid, JSON.stringify(m))
  }
  // Tonemapping: ACES überall | ACES mit Boden ohne (beide neu, Tag)
  const ta = await shot(`${BASE},tod=day,tm=aces`), tb = await shot(`${BASE},tod=day`)
  pair(save('tm_aces', ta.buf), save('tm_split', tb.buf), 'paar_tonemapping', 'V-346 · Tonemapping · ACES überall | ACES mit Boden ohne', 'Licht und Figuren mit ACES, Bühne/Boden wie „ohne“ (toneMapped: false)', 'ACES überall', 'NEU · ACES, Boden ohne')
}
if (!ONLY || ONLY === 'lineup') {
  // Fahrzeuge: Sättigung gegen die Meshy-Textur (Knet aus); Boden und Himmel ausgeblendet, damit nur Fahrzeuge zählen
  const L = `${BASE},lineup=1,tod=day`
  const iso = () => { const S = window.__kfbStageMods; let sc = null; S.lineup.object3d.traverseAncestors((o) => { if (o.isScene) sc = o }); sc.getObjectByName('sky').visible = false; S.lineup.object3d.getObjectByName('lineup-ground').visible = false; S.left.object3d.visible = false; S.right && (S.right.object3d.visible = false); sc.background = new (sc.getObjectByName('sky').material.uniforms.top.value.constructor)(0, 0, 0); sc.fog = null }
  // faire Referenz: Original-Material bei gleichem Licht, nur ohne Metall (Meshy-Materialien haben Metall ≈ 0,93; Knet ist nach G8 nie metallisch)
  const iso0 = () => { const S = window.__kfbStageMods; let sc = null; S.lineup.object3d.traverseAncestors((o) => { if (o.isScene) sc = o }); const sky = sc.getObjectByName('sky'); sky.visible = false; S.lineup.object3d.getObjectByName('lineup-ground').visible = false; S.left.object3d.visible = false; if (S.right) S.right.object3d.visible = false; sc.background = sky.material.uniforms.top.value.clone().setRGB(0, 0, 0); sc.fog = null
    S.lineup.object3d.traverse((o) => { if (o.isMesh) [].concat(o.material).forEach((x) => { x.metalness = 0; x.metalnessMap = null; x.needsUpdate = true }) }) }
  const vf = await shot(`${L},clay=0`, 1920, 1080, iso0), sFair = await stats(vf.buf)
  const vo = await shot(`${L},clay=0`, 1920, 1080, iso), vv = await shot(`${L},tune=0,tm=aces`, 1920, 1080, iso), vn = await shot(L, 1920, 1080, iso)
  const sOff = await stats(vo.buf), sOld = await stats(vv.buf), sNew = await stats(vn.buf)
  const full = { old: await shot(`${L},tune=0,tm=aces`), neu: await shot(L) }
  pair(save('lineup_vorher', full.old.buf), save('lineup_neu', full.neu.buf), 'paar_fahrzeuge', 'V-346 · Fahrzeuge mit Knet · vorher | neu', `Knet nur als Relief/Rauheit, kein Samt · Sättigung ${(sOld.sat / sFair.sat * 100).toFixed(0)} % → ${(sNew.sat / sFair.sat * 100).toFixed(0)} % der Textur bei gleichem Licht (Ziel ≥ 95 %; Meshy-Original ist metallisch, Knet nie)`)
  const m = { sat: { fair: sFair, fairAnteil: +(sNew.sat / sFair.sat).toFixed(3), vorherFair: +(sOld.sat / sFair.sat).toFixed(3), knetAus: sOff, vorher: sOld, neu: sNew, neuAnteil: +(sNew.sat / sOff.sat).toFixed(3), vorherAnteil: +(sOld.sat / sOff.sat).toFixed(3) } }
  rows.push({ part: 'lineup', m, errs: [vf.errs, vo.errs, vv.errs, vn.errs, full.old.errs, full.neu.errs] }); console.log('lineup', JSON.stringify(m))
}
fs.writeFileSync(`${OUT}/v346${ONLY ? '-' + ONLY : ''}.json`, JSON.stringify(rows, null, 1))
