// QA P2-4 Speedlines: Georgs Einstellungen, placeCar(157.1, 240.0, 1.49), W+⇧ 3,5 s, dann A; misst Spurlänge (m) und tiefsten Bildpunkt der Bänder (0 = oben, 1 = unten)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || 'speedlines'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true)
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(800)
await p.evaluate(() => __probeDrive().placeCar(157.1, 240.0, 1.49)); await p.waitForTimeout(600)
const meas = () => p.evaluate(() => { const { camera } = __probeDrive(), sc = camera.parent || null; const res = []; let maxY = 0, len = 0
  const scene = __probeDrive().carRoot; let root = scene; while (root.parent) root = root.parent
  root.traverse((o) => { if (o.isMesh && o.renderOrder === 6 && o.material.uniforms?.uK && o.visible) { const pos = o.geometry.attributes.position, v = new o.position.constructor(); let L = 0, prev = null
    for (let i = 0; i < pos.count; i += 2) { const a = new o.position.constructor().fromBufferAttribute(pos, i), c = new o.position.constructor().fromBufferAttribute(pos, i + 1); if (a.distanceTo(c) < 1e-4) continue; v.copy(a).add(c).multiplyScalar(0.5); if (prev) L += prev.distanceTo(v); prev = v.clone(); const s = v.clone().project(camera); if (s.z < 1) maxY = Math.max(maxY, (1 - s.y) / 2) }
    len = Math.max(len, L) } }); return { len: +len.toFixed(2), maxY: +maxY.toFixed(3), uK: +(__probeDrive().P?.boosting ? 1 : 0) } })
await p.keyboard.down('KeyW'); await p.keyboard.down('ShiftLeft'); const tr = []; for (let i = 0; i < 7; i++) { await p.waitForTimeout(500); tr.push(await meas()) }
await p.screenshot({ path: `/Users/georgvonwestphalen/kfb-ws1/probe/tests/out/${OUT}-straight.png` })
await p.keyboard.down('KeyA'); await p.waitForTimeout(700); tr.push(await meas()); await p.screenshot({ path: `/Users/georgvonwestphalen/kfb-ws1/probe/tests/out/${OUT}-turn.png` })
console.log(JSON.stringify({ tr, errs: errs.slice(0, 3) })); await b.close()
