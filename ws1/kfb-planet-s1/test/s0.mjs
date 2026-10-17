// S0 Host-Gerüst · Slots, ein Canvas, ein Tasten-Router, Controller aus bei offenem Dialog (Vertrag §3.5, §4).
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#debug')
await page.waitForFunction(() => window.__kfb && window.__kfbStore, null, { timeout: 60000 })
const a = await page.evaluate(() => ({
  bubbles: document.querySelectorAll('#ui-bubbles').length,
  choice: document.querySelectorAll('#ui-choice').length,
  canvases: document.querySelectorAll('canvas[data-engine]').length, // nur WebGL-Canvas von R3F; Kartenbilder im DOM sind 2D-Canvas
  keys: window.__kfbHostKeys(),
  dialog: !!window.__kfbStore.getState().dialog,
  ctrl: window.__kfb.ctrl,
}))
await page.evaluate(() => window.__kfbStore.getState().closeDialog())
await page.waitForFunction(() => window.__kfb.ctrl === true, null, { timeout: 30000 }).catch(() => {})
const b = await page.evaluate(() => ({ dialog: !!window.__kfbStore.getState().dialog, ctrl: window.__kfb.ctrl }))
await page.evaluate(() => window.__kfbStore.getState().openDialog({ kind: 'stage', id: 1 }))
await page.waitForFunction(() => window.__kfb.ctrl === false, null, { timeout: 30000 }).catch(() => {})
const c = await page.evaluate(() => ({ dialog: !!window.__kfbStore.getState().dialog, ctrl: window.__kfb.ctrl }))
// Escape schließt den Dialog über den Router (Rang dialog), danach ist der Controller wieder an
await page.keyboard.press('Escape')
await page.waitForFunction(() => window.__kfb.ctrl === true, null, { timeout: 30000 }).catch(() => {})
const d = await page.evaluate(() => ({ dialog: !!window.__kfbStore.getState().dialog, ctrl: window.__kfb.ctrl }))
// Gegenprobe Bewegung: W 4 s halten, einmal ohne, einmal mit offenem Dialog (unabhängig von __kfb.ctrl)
const walk = async () => { const p0 = await page.evaluate(() => window.__kfb.pos); await page.keyboard.down('KeyW'); await page.waitForTimeout(4000); await page.keyboard.up('KeyW'); await page.waitForTimeout(500); const p1 = await page.evaluate(() => window.__kfb.pos); return Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) }
await page.waitForTimeout(3000) // Figur gelandet
// nach dem Loslassen gleitet die Figur noch einige Meter aus: warten, bis sie steht (< 2 cm/s)
const settle = async () => { for (let i = 0; i < 20; i++) { const a = await page.evaluate(() => window.__kfb.pos); await page.waitForTimeout(1000); const b = await page.evaluate(() => window.__kfb.pos); if (Math.hypot(b[0] - a[0], b[2] - a[2]) < 0.02) return true } return false }
const moveFree = await walk()
await page.evaluate(() => window.__kfbStore.getState().openDialog({ kind: 'stage', id: 2 }))
const settled = await settle()
const moveDialog = await walk()
// Flug + Dialog: Tasten gehören dem Dialog, die Figur schwebt (blinder Prüfer 2, Befund 3)
await page.evaluate(() => window.__kfbStore.getState().closeDialog())
await page.keyboard.press('KeyF'); await page.waitForTimeout(2500)
const flying = await page.evaluate(() => window.__kfb.flying)
await page.evaluate(() => window.__kfbStore.getState().openDialog({ kind: 'stage', id: 3 }))
await page.waitForTimeout(800)
const fp0 = await page.evaluate(() => window.__kfb.pos)
await page.keyboard.down('KeyW'); await page.keyboard.down('Space'); await page.waitForTimeout(3000); await page.keyboard.up('KeyW'); await page.keyboard.up('Space')
const fp1 = await page.evaluate(() => window.__kfb.pos)
const moveFlyDialog = Math.hypot(fp1[0] - fp0[0], fp1[1] - fp0[1], fp1[2] - fp0[2])
await browser.close()
// ohne URL-Schalter: keine Debug-Zugänge (Vertrag §6)
const plain = await openPage('')
await plain.page.waitForFunction(() => document.querySelector('canvas[data-engine]'), null, { timeout: 60000 })
await plain.page.waitForTimeout(3000)
const leaked = await plain.page.evaluate(() => Object.keys(window).filter((k) => k.startsWith('__kfb')))
await plain.browser.close()
process.exit(report('s0 host frame', {
  walksWithoutDialog: moveFree > 0.3,
  standsWithDialog: settled && moveDialog < 0.05,
  hoversWhenFlyingWithDialog: flying === true && moveFlyDialog < 0.05,
  noDebugGlobalsWithoutSwitch: leaked.length === 0,
  slotBubbles: a.bubbles === 1, slotChoice: a.choice === 1, oneCanvas: a.canvases === 1,
  routerInstalled: a.keys.installed && a.keys.handlers >= 3,
  ctrlOffAtStartDialog: a.dialog && a.ctrl === false,
  ctrlOnWithoutDialog: !b.dialog && b.ctrl === true,
  ctrlOffWhenDialogOpens: c.dialog && c.ctrl === false,
  escapeClosesViaRouter: !d.dialog && d.ctrl === true,
  noPageErrors: errs.length === 0,
}, { a, b, c, d, moveFree, moveDialog, flying, moveFlyDialog, leaked, errs }))
