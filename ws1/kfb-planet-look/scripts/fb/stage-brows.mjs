// Prüfsonde: Brauen-Lage je Darsteller auf der Bühne (zwei FrizzleBobs). node scripts/fb/stage-brows.mjs [hash-zusatz]
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage(`#stage,debug,cam=near,place=near,actors=fb${process.argv[2] || ''}`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.left?.status().status === 'OK' && S?.right?.status().status === 'OK' && S.left.status().ao?.baked && S.right.status().ao?.baked }, null, { timeout: 240000 })
await page.waitForTimeout(2500)
console.log(JSON.stringify(await page.evaluate(() => { const S = window.__kfbStageMods, r = {}
  for (const k of ['left', 'right']) { const a = S[k].object3d, out = []; let head = null
    a.traverse((o) => { if (o.isBone && /^head$/i.test(o.name)) head = o })
    a.traverse((o) => { if (/brow/i.test(o.name)) { const p = o.getWorldPosition(o.position.clone()); let root = o; while (root.parent) root = root.parent; out.push([o.name, o.parent?.name, o.visible, p.toArray().map((v) => +v.toFixed(2))]) } })
    r[k] = { head: head && head.getWorldPosition(head.position.clone()).toArray().map((v) => +v.toFixed(2)), brows: out } }
  // Brauen, die NICHT unter einem der Darsteller hängen, aber in der Szene sind
  return r })), errs)
await browser.close()
