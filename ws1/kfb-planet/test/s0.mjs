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
await browser.close()
process.exit(report('s0 host frame', {
  slotBubbles: a.bubbles === 1, slotChoice: a.choice === 1, oneCanvas: a.canvases === 1,
  routerInstalled: a.keys.installed && a.keys.handlers >= 3,
  ctrlOffAtStartDialog: a.dialog && a.ctrl === false,
  ctrlOnWithoutDialog: !b.dialog && b.ctrl === true,
  ctrlOffWhenDialogOpens: c.dialog && c.ctrl === false,
  escapeClosesViaRouter: !d.dialog && d.ctrl === true,
  noPageErrors: errs.length === 0,
}, { a, b, c, d, errs }))
