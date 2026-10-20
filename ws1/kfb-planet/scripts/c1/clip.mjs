// C1 Videoclip für Georg (V-408): langsame Fahrt auf das Theater zu mit Orbit 360°, dann Halt, Zoom bis Ich-Perspektive (Blick auf die Bühne) und zurück. Aufnahme im festen Takt (replay: ein Schritt je Bild,
// jedes zweite Bild ein Standbild = 30 Bilder/s Spielzeit), danach Wiedergabe der Standbilder mit 30 Bildern/s in einer Abspielseite, die Playwright
// als Video mitschneidet (der Software-Renderer des Test-Browsers schafft live nur ≈ 8 Bilder/s – ein Live-Mitschnitt sähe ruckelig aus, ohne dass
// die Kamera schuld ist). Ausgabe: test/out/c1/clip.webm
import { openPage } from '../../test/_page.mjs'
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
const OUT = path.resolve('test/out/c1/frames'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true })
const W = 960, H = 540
const { browser, page } = await openPage('#m1,debug,replay,car', { viewport: { width: W, height: H } })
await page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.() && window.__kfbM2.stats.follow, null, { timeout: 240000 })
await page.evaluate(async () => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, K = M.k, J = K / 0.6509
  const x = -3 * J, z = 31 * J; M2.setKind('k2b', { p: [x, (M.terrainH(x, z) ?? 0) + 0.3 * K, z], yaw: Math.PI }); /* langsam von vorn auf das Theater zu (Ich-Perspektive mit Blick auf die Bühne) */ /* über den flachen Platz nach −X, Theater links im Blick (Richtung +X lag der Hügelring vor der Ich-Perspektive) */ const t = C.steps + 90; await new Promise((r) => { const f = () => (C.steps >= t ? r() : requestAnimationFrame(f)); f() }) })
let n = 0
const FR = 330 // 11 s bei 30 Bildern/s
for (let i = 0; i < FR; i++) {
  await page.evaluate((i) => new Promise((r) => { const M = window.__kfbM1, M2 = window.__kfbM2, C = M.clock, F = M2.stats.follow, c = M2.car(), t = i / 30
    // 0–3 s Anfahrt (Gas bis ≈ 7 m/s), 3–7 s Orbit 360° im Fahren, 7–9 s Zoom bis Ich-Perspektive, 9–11 s zurück
    M.input({ forward: t < 6 && (c?.speed() ?? 0) < 2.2 }) /* langsam heran, ab 6 s ausrollen */
    if (t >= 3 && t < 7) F.orbit((2 * Math.PI) / 120, 0)
    if (t >= 7 && t < 7.8) F.zoomBy(-60); if (t >= 7.8 && t < 7.84) F.zoomBy(-120); if (t >= 9.3 && t < 9.34) F.zoomBy(120); if (t >= 9.4 && t < 9.8) F.zoomBy(60)
    const s = C.steps + 2; const f = () => (C.steps >= s ? r() : requestAnimationFrame(f)); f() }), i)
  await page.screenshot({ path: path.join(OUT, String(n++).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 85 })
}
await browser.close()
// Wiedergabe mitschneiden
const html = path.join(OUT, 'play.html')
fs.writeFileSync(html, `<html><body style="margin:0;background:#000"><img id=i width=${W} height=${H}><script>const N=${n};let k=0;const pre=[];for(let j=0;j<N;j++){const im=new Image();im.src=String(j).padStart(4,'0')+'.jpg';pre.push(im)}
Promise.all(pre.map(im=>im.decode())).then(()=>{const t0=performance.now();const f=()=>{k=Math.min(N-1,Math.floor((performance.now()-t0)/1000*30));document.getElementById('i').src=pre[k].src;if(k<N-1)requestAnimationFrame(f);else window.done=1};f()})</script></body></html>`)
const b2 = await chromium.launch(), ctx = await b2.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: path.resolve('test/out/c1/video'), size: { width: W, height: H } } }), p2 = await ctx.newPage()
await p2.goto('file://' + html); await p2.waitForFunction(() => window.done === 1, null, { timeout: 120000 }); await p2.waitForTimeout(300)
const vid = await p2.video().path(); await ctx.close(); await b2.close()
fs.copyFileSync(vid, path.resolve('test/out/c1/clip.webm')); console.log('clip', path.resolve('test/out/c1/clip.webm'), n, 'Bilder')
