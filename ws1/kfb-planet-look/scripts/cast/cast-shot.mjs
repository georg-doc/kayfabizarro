// F-4 · Kandidaten-Bild: #stage near, FrizzleBob links, KayKit-Kandidat rechts, Karte im Billboard; Kandidat spricht eine Zeile (Blase, ohne Mund).
// node scripts/cast/cast-shot.mjs <actorId> [...]
import fs from 'fs'
import { openPage } from '../../test/_page.mjs'
fs.mkdirSync('test/out/cast', { recursive: true })
for (const id of process.argv.slice(2)) {
  const { browser, page, errs } = await openPage(`#stage,debug,actors=fb,cast=${id},dialog=1`, { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().status === 'OK' }, null, { timeout: 300000 })
  await page.waitForTimeout(2500)
  fs.writeFileSync(`test/out/cast/stage_${id}.png`, await page.screenshot())
  // Sprechen ohne Mund: Antwort B kommt von rechts (Kandidat) → Blase am Anker stage-right, das Gesicht bleibt (KayKit hat keinen Sprechmund)
  const ph = () => page.evaluate(() => window.__kfbStageMods?.dialog?.state()?.phase)
  for (let t0 = Date.now(); Date.now() - t0 < 240000 && (await ph()) !== 'B';) await page.waitForTimeout(150)
  await page.waitForTimeout(600); fs.writeFileSync(`test/out/cast/speak_${id}.png`, await page.screenshot())
  const bub = await page.evaluate(() => (window.__kfbBubbles?.() || []).filter((b) => b.shown).map((b) => [b.anchor, b.text.slice(0, 40)]))
  const st = await page.evaluate((id) => { const R = window.__kfbStageMods.right, root = R.object3d; root.updateWorldMatrix(true, true); const rig = R.debugRig()
    return { status: R.status(), eyes: rig ? rig.eyes.map((e) => { const o = e._pivot || e.group; return root.worldToLocal(o.getWorldPosition(o.position.clone())).toArray().map((v) => +v.toFixed(3)) }) : null } }, id)
  console.log(id, 'bubbles', JSON.stringify(bub), 'eyes', JSON.stringify(st.eyes), 'status', st.status.status, st.status.cleanup, 'errs', errs.length)
  await browser.close()
}
