// Prüfsonde: Augenmitten im Raum der Figur (root) je Darsteller auf der Bühne. Richtig: symmetrisch (xL = −xR), beide Figuren gleich.
import { openPage } from '../../test/_page.mjs'
const { browser, page, errs } = await openPage(`#stage,debug,actors=fb${process.argv[2] || ''}`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.left?.status().shown && S?.right?.status().shown }, null, { timeout: 300000 })
console.log(JSON.stringify(await page.evaluate(() => { const S = window.__kfbStageMods
  return ['left', 'right'].map((k) => { const A = S[k], R = A.debugRig(), root = A.object3d; root.updateWorldMatrix(true, true)
    return { yaw: +root.rotation.y.toFixed(3), eyes: R.eyes.map((e) => { const o = e._pivot || e.group || e.root; return root.worldToLocal(o.getWorldPosition(o.position.clone())).toArray().map((v) => +v.toFixed(3)) }) } }) })), errs)
await browser.close()
