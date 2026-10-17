import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
// Web-Chat-Umgebung: vorinstallierter Chromium. Sonst (Mac): Playwrights eigener Chromium (einmalig: npx playwright install chromium).
const CHROMIUM = process.env.PW_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
const b = await chromium.launch({ executablePath: CHROMIUM, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] })
const p = await b.newPage(); const errs = []
p.on('pageerror', e => errs.push(e.message))
await p.goto('file://' + path.resolve('dist/index.html') + '#hosttest')
await p.waitForFunction(() => window.__kfbProbeLog?.update > 5, null, { timeout: 60000 })
const a = await p.evaluate(() => ({ ...window.__kfbProbeLog }))
await p.evaluate(() => { for (let i = 0; i < 5; i++) window.__kfbHostTest.rerender() })
await p.waitForTimeout(1500)
const b2 = await p.evaluate(() => ({ ...window.__kfbProbeLog }))
await p.evaluate(() => window.__kfbHostTest.off())
await p.waitForTimeout(1500)
const c = await p.evaluate(() => ({ ...window.__kfbProbeLog }))
const frozen = c.update; await p.waitForTimeout(1500)
const d = await p.evaluate(() => window.__kfbProbeLog.update)
console.log(JSON.stringify({ a, b2, c, updateAfterOff: d - frozen, errs }))
const ok = a.create === 1 && a.lastCtx.hasCam && a.lastCtx.hasPlayer && a.lastCtx.hasGame && b2.create === 1 && c.dispose === 1 && d === frozen && !errs.length
console.log(ok ? 'PASS host contract' : 'FAIL host contract'); await b.close(); process.exit(ok ? 0 : 1)
