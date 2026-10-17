// Prüfsonde: Farbe der Original-Brauen und -Nase am Darsteller gegen Georgs Export (brow.color, nose.color). node scripts/fb/part-colors.mjs
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage('#actortest,debug,view=face', { viewport: { width: 600, height: 600 } })
await page.waitForFunction(() => window.__kfbActor?.status().status === 'OK', null, { timeout: 120000 })
console.log(JSON.stringify(await page.evaluate(() => { const A = window.__kfbActor, F = A.debugFace(), out = {}
  const col = (m) => [].concat(m.material).map((x) => ({ name: x.name, type: x.type, color: x.color ? '#' + x.color.getHexString() : null, map: !!x.map, uColor: x.uniforms?.uColor?.value?.getHexString?.() || null }))
  A.object3d.traverse((o) => { if (o.isMesh && /brow|nose/i.test(o.name)) out[o.name] = { visible: o.visible, mats: col(o) } })
  return { parts: out, p: { brow: F.p?.brow?.color, nose: F.p?.nose?.color, parts: F.p?.parts } } })), errs)
await browser.close()
