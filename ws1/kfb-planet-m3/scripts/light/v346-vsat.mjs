// V-346 · Fahrzeug-Sättigung: faire Referenz (Original-Material ohne Metall, gleiche Beleuchtung) gegen Knet; nur Fahrzeuge im Bild. node scripts/light/v346-vsat.mjs
import sharp from 'sharp'
import { openPage } from '../../test/_page.mjs'
const stats = async (buf) => { const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true }); let n = 0, Y = 0, S = 0
  for (let i = 0; i < data.length; i += info.channels) { const r = data[i], g = data[i + 1], b = data[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx < 8) continue; n++; Y += 0.2126 * r + 0.7152 * g + 0.0722 * b; S += (mx - mn) / mx }
  return { lum: +(Y / n).toFixed(1), sat: +(S / n).toFixed(4) } }
const run = async (h, metal0) => { const { browser, page } = await openPage('#stage,debug,actors=fb,light=l1,lineup=1,tod=day' + h, { viewport: { width: 1600, height: 900 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.lineup?.status().status === 'OK' && (/clay=0/.test(location.hash) || (S.clayV?.info?.() || []).length === 1) }, null, { timeout: 480000 })
  await page.waitForTimeout(2000)
  await page.evaluate((m0) => { const S = window.__kfbStageMods; let sc = null; S.lineup.object3d.traverseAncestors((o) => { if (o.isScene) sc = o }); const sky = sc.getObjectByName('sky'); sky.visible = false; S.lineup.object3d.getObjectByName('lineup-ground').visible = false; S.left.object3d.visible = false; if (S.right) S.right.object3d.visible = false; sc.background = sky.material.uniforms.top.value.clone().setRGB(0, 0, 0); sc.fog = null
    const mats = new Set(); S.lineup.object3d.traverse((o) => { if (o.isMesh) [].concat(o.material).forEach((x) => mats.add(x)) }); const met = [...mats].map((x) => x.metalness); if (m0) mats.forEach((x) => { x.metalness = 0; x.metalnessMap = null; x.needsUpdate = true }); window.__met = met.reduce((a, b) => a + b, 0) / met.length }, metal0)
  await page.waitForTimeout(1500); const s = await stats(await page.screenshot({ timeout: 180000 })), met = await page.evaluate(() => window.__met); await browser.close(); return { ...s, met: +met.toFixed(2) } }
const ref = await run(',clay=0', false), ref0 = await run(',clay=0', true), neu = await run('', false), neuNone = await run(',tm=none', false), ref0None = await run(',clay=0,tm=none', true)
console.log(JSON.stringify({ ref, ref0, neu, ratioFair: +(neu.sat / ref0.sat).toFixed(3), neuNone, ref0None, ratioNone: +(neuNone.sat / ref0None.sat).toFixed(3) }))
