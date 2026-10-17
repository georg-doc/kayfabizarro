import { openPage } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet/test/_page.mjs'
import fs from 'fs'
const { browser, page, errs } = await openPage(`#actortest,debug,view=q,motion=Idle_A`, { viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbActor?.status().status === 'OK' && window.__kfbActor.status().ao?.baked, null, { timeout: 120000 })
await page.waitForTimeout(2500)
fs.writeFileSync('test/out/idle_q.png', await page.screenshot())
console.log(JSON.stringify(await page.evaluate(() => { const F = window.__kfbActor.debugFace(), out = []
  window.__kfbActor.object3d.traverse((o) => { if (/brow/i.test(o.name)) { const p = o.getWorldPosition(o.position.clone()); out.push([o.name, o.type, o.parent?.name, o.parent?.type, p.toArray().map((v) => +v.toFixed(3))]) } }); return out })), errs)
await browser.close()
