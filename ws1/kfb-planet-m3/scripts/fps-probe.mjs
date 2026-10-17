import { openPage } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet/test/_page.mjs'
const { browser, page } = await openPage('#hosttest')
await page.waitForTimeout(3000)
const f = await page.evaluate(() => new Promise((ok) => { let n = 0; const t0 = performance.now(); const s = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(s); else ok(n / ((performance.now() - t0) / 1000)) }; requestAnimationFrame(s) }))
console.log('fps', f.toFixed(1)); await browser.close()
