// Prüfsonde: Brauen-Lage über die Zeit (links), relativ zum Kopfknochen. node scripts/fb/stage-brows-t.mjs [hash-zusatz]
import { openPage } from '../../test/_page.mjs'
const { browser, page } = await openPage(`#stage,debug,cam=near,actors=fb${process.argv[2] || ''}`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.left?.status().status === 'OK' && S?.right?.status().status === 'OK' }, null, { timeout: 240000 })
for (let i = 0; i < 14; i++) {
  console.log(JSON.stringify(await page.evaluate(() => { const S = window.__kfbStageMods, a = S.left.object3d; let head = null, bl = null
    a.traverse((o) => { if (o.isBone && /^head$/i.test(o.name)) head = o; if (o.name === 'Carl_Brow_L') bl = o })
    const h = head.getWorldPosition(head.position.clone()), b = bl.getWorldPosition(bl.position.clone())
    return { t: performance.now() | 0, baked: S.left.status().ao?.baked, browMinusHead: b.sub(h).toArray().map((v) => +v.toFixed(3)), hostPos: bl.parent.position.toArray().map((v) => +v.toFixed(3)), hostScale: +bl.parent.scale.x.toFixed(3), meshPos: bl.position.toArray().map((v) => +v.toFixed(3)) } })))
  await page.waitForTimeout(2500)
}
await browser.close()
