// AD-Audit R1 · Spiel #m1,harvest,look=terrain3 (dist). Aufruf: node ad-game.mjs <out>
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2]
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] })
const errs = []
async function run(hash, tag) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  page.on('pageerror', (e) => errs.push(tag + ': ' + e.message))
  await page.goto('file:///Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/dist/index.html' + hash)
  await page.waitForTimeout(25000)
  await page.screenshot({ path: `${OUT}/${tag}-01-start.png` })
  const c = { x: 640, y: 400 }
  await page.mouse.click(c.x, c.y); await page.keyboard.down('KeyW'); await page.waitForTimeout(3000); await page.keyboard.up('KeyW'); await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/${tag}-02-lauf.png` })
  // Kamera drehen (ziehen)
  await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x + 380, c.y + 60, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/${tag}-03-dreh.png` })
  await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x, c.y + 220, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/${tag}-04-himmel.png` })
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(100) } await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x, c.y - 320, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/${tag}-05-weit.png` })
  if (hash.includes('debug')) console.log(tag, JSON.stringify(await page.evaluate(() => { try { const s = window.__kfbM1.status(); return { pos: s.pos, cam: s.camera } } catch (e) { return String(e) } })))
  await page.close()
}
await run('#m1,harvest,look=terrain3', 'spiel')
await run('#m1,car,harvest,look=terrain3', 'spiel-car')
console.log('errs', JSON.stringify(errs.slice(0, 5)))
await browser.close()
