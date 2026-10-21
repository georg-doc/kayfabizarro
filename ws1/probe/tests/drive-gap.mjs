// Probe · Karosserie gegen Boden beim Fahren (Georg 21.10.: Wagen steckte in Hügeln). Misst den tiefsten Netzpunkt gegen hgt().
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 960, height: 600 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__hgt) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.evaluate((a) => { window.__SM = +a[0]; window.__LK = +a[1] }, [process.argv[2] ?? 1, process.argv[3] ?? 3]); await page.getByRole('button', { name: 'Fahren', exact: true }).click()
await page.waitForTimeout(1000)
const out = []
for (let run = 0; run < 10; run++) {
  const r = await page.evaluate(async (run) => {
    const d = () => __probeDrive(); let car = null; d().carRoot.traverse((o) => { if (o.isMesh && o.name === 'rustwing_cruiser') car = o })
    const pos = car.geometry.attributes.position, v = new THREE.Vector3()
    const worst = () => { car.updateWorldMatrix(true, false); let w = 1e9; for (let i = 0; i < pos.count; i += 30) { v.fromBufferAttribute(pos, i).applyMatrix4(car.matrixWorld); w = Math.min(w, v.y - __meshH(v.x + d().P.x, v.z + d().P.z)) } return w }
    const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(run * 131 + 7)
    // hügelige Stelle über Wasser
    let x, z; for (let i = 0; i < 200; i++) { x = (rnd() - 0.5) * 240; z = (rnd() - 0.5) * 240; const e = 1, s = Math.hypot(__hgt(x + e, z) - __hgt(x - e, z), __hgt(x, z + e) - __hgt(x, z - e)) / 2; if (s > 0.6 && __hgt(x, z) > __S.water * __S.amp + 0.5) break }
    __probeTP(x, z); await new Promise((r) => setTimeout(r, 300)); return { x, z }
  }, run)
  await page.keyboard.down('KeyW'); if (run % 2) await page.keyboard.down('KeyA'); if (run % 3 === 2) await page.keyboard.down('ShiftLeft')
  const g = await page.evaluate(async () => {
    const d = () => __probeDrive(); let car = null; d().carRoot.traverse((o) => { if (o.isMesh && o.name === 'rustwing_cruiser') car = o })
    const pos = car.geometry.attributes.position, v = new THREE.Vector3(), p0 = [d().P.x, d().P.z], WL = new THREE.Vector3(), q = new THREE.Vector3(), box = new THREE.Box3().setFromBufferAttribute(pos), sz = box.getSize(new THREE.Vector3())
    const worst = () => { car.updateWorldMatrix(true, false); let w = 1e9; for (let i = 0; i < pos.count; i += 30) { q.fromBufferAttribute(pos, i); v.copy(q).applyMatrix4(car.matrixWorld); const gg = v.y - __meshH(v.x + d().P.x, v.z + d().P.z); if (gg < w) { w = gg; WL.set((q.x - box.min.x) / sz.x, (q.y - box.min.y) / sz.y, (q.z - box.min.z) / sz.z) } } return w }
    let mn = 1e9, n = 0, inn = 0, at = null, flo = 0, gnd = 0; for (let k = 0; k < 60; k++) { await new Promise((r) => requestAnimationFrame(r)); await new Promise((r) => setTimeout(r, 40)); const w = worst(); n++; if (w < -0.02) inn++; if (!d().P.air && !d().P.fly) { gnd++; if (w > 0.4) flo++ } if (w < mn) { mn = w; const P = d().P; at = { lx: +WL.x.toFixed(2), ly: +WL.y.toFixed(2), lz: +WL.z.toFixed(2), air: P.air, fly: P.fly, vf: +P.vf.toFixed(1), y: +P.y.toFixed(2), g: +__hgt(P.x, P.z).toFixed(2), tiltX: +d().carRoot.rotation.x.toFixed(2), liftY: +__LIFT.y.toFixed(2), nPts: __LIFT.pts.length } } }
    return { floatFrames: flo, groundFrames: gnd, at, moved: +Math.hypot(d().P.x - p0[0], d().P.z - p0[1]).toFixed(1), minGapCm: +(mn * 100).toFixed(1), framesIn: inn, n }
  })
  await page.keyboard.up('KeyW'); await page.keyboard.up('KeyA'); await page.keyboard.up('ShiftLeft')
  out.push({ ...r, ...g })
}
console.log(JSON.stringify(out)); console.log('errs', errs.slice(0, 3))
await browser.close()
