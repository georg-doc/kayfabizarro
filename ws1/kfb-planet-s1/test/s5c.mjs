// S5c Spielerwahl · Host-Vertrag R1.2 §4, Studio-Vertrag „Zurufe (Player)“: 2 × 2, Labels/Tasten fix, ≥ 44 px,
// Stempel 420 ms, optional bis 8 eigene Wörter. Plain ohne Tusche (V-204/V-214). Controller aus bei offener Wahl (§3.5).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out', { recursive: true })
const { browser, page, errs } = await openPage('#debug')
await page.waitForFunction(() => window.__kfbChoice && window.__kfbStore && window.__kfb, null, { timeout: 90000 })
await page.evaluate(() => window.__kfbStore.getState().closeDialog())
await page.waitForTimeout(2500)
const bubbleTexts = () => page.evaluate(() => window.__kfbBubbles().filter((b) => b.anchor === 'player').map((b) => b.text))

await page.evaluate(() => window.__kfbChoice.open())
await page.waitForTimeout(400)
const ui = await page.evaluate(() => {
  const el = document.querySelector('#ui-choice [data-kind="choice"]')
  const btns = [...el.querySelectorAll('[data-key]')].map((b) => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); const badge = getComputedStyle(b.firstElementChild); return { key: b.dataset.key, label: b.lastElementChild.textContent, color: getComputedStyle(b.lastElementChild).color, font: getComputedStyle(b.lastElementChild).fontFamily, h: r.height, x: Math.round(r.x), y: Math.round(r.y), border: cs.borderTopWidth + ' ' + cs.borderTopStyle, badgeBorder: badge.borderTopWidth + ' ' + badge.borderTopStyle, badgeBg: badge.backgroundColor } })
  const paths = [...el.querySelectorAll('svg path')].map((p) => p.getAttribute('stroke'))
  return { btns, paths, inSlot: !!el.closest('#ui-choice'), ctrl: window.__kfb.ctrl }
})
await page.screenshot({ path: 'test/out/s5c_choice.png' })
// Zipfel zeigt auf den Player-Anker; Lage folgt, wenn sich die Kamera bewegt (Mausrad-Zoom, Wahl bleibt offen)
const tailOf = () => page.evaluate(() => { const t = window.__kfbChoice.tail(), a = window.__kfbChoice.anchor(); return { tip: t && [t.at[0] - t.M + t.hl[0], t.at[1] - t.M + t.hl[1]], a, at: t?.at } })
const tA = await tailOf()
await page.mouse.move(640, 500); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(120) }
await page.waitForTimeout(2500)
const tB = await tailOf()
// Figur steht bei offener Wahl
const p0 = await page.evaluate(() => window.__kfb.pos); await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW'); const p1 = await page.evaluate(() => window.__kfb.pos)
const moveWithChoice = Math.hypot(p1[0] - p0[0], p1[2] - p0[2])
// Taste 3 -> Stempel, nach 420 ms zu, Ergebnis + Spielerblase
// Stempel-Zustand im Augenblick seines Entstehens festhalten (Beobachter in der Seite): der Stempel schließt nach 420 ms Wanduhr, und bei
// wenigen Bildern/s dauerte schon der Rückweg zum Test länger (FAIL nur unter Last, 15.10.)
await page.evaluate(() => { window.__stamp = null; const root = document.querySelector('#ui-choice'); const mo = new MutationObserver(() => { const k3 = root.querySelector('[data-key="3"]'), k1 = root.querySelector('[data-key="1"]')
  if (!window.__stamp && k3 && /scale/.test(k3.style.transform)) { window.__stamp = { open: window.__kfbChoice.isOpen(), pickedScale: k3.style.transform, otherOpacity: k1?.style.opacity }; mo.disconnect() } }); mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['style'] }) })
await page.keyboard.press('Digit3')
await page.waitForFunction(() => !!window.__stamp, null, { timeout: 5000 }).catch(() => {})
const mid = await page.evaluate(() => window.__stamp || { open: null })
await page.waitForFunction(() => !window.__kfbChoice.isOpen() && window.__kfb?.ctrl === true, null, { timeout: 5000 }).catch(() => {}) // Stempel zu (420 ms Wanduhr) und Steuerung zurück (__kfb wird je Bild geschrieben)
const after = await page.evaluate(() => ({ open: window.__kfbChoice.isOpen(), last: window.__kfbChoice.last(), ctrl: window.__kfb.ctrl }))
await page.waitForTimeout(300)
const zurufBubble = await bubbleTexts()
// eigene Wörter: 9 Wörter abgelehnt, 5 Wörter angenommen; Ziffern im Feld wählen nichts
await page.evaluate(() => window.__kfbChoice.open())
await page.waitForTimeout(300)
await page.click('#ui-choice [data-own]')
await page.keyboard.type('one two three four five six seven eight nine 4')
await page.keyboard.press('Enter')
await page.waitForTimeout(600)
const nineRejected = await page.evaluate(() => window.__kfbChoice.isOpen())
await page.fill('#ui-choice [data-own]', '')
await page.keyboard.type('I want my cookie back')
await page.keyboard.press('Enter')
// auf das Ereignis warten statt fester Zeit (Stempel 420 ms, unter Last länger): Wahl zu und als „own“ gemeldet
await page.waitForFunction(() => !window.__kfbChoice.isOpen() && window.__kfbChoice.last()?.id === 'own', null, { timeout: 15000, polling: 100 }).catch(() => {})
const own = await page.evaluate(() => ({ open: window.__kfbChoice.isOpen(), last: window.__kfbChoice.last() }))
await page.waitForFunction(() => (window.__kfbBubbles?.() || []).some((x) => x.text === 'I want my cookie back'), null, { timeout: 15000, polling: 100 }).catch(() => {})
const ownBubble = await bubbleTexts()
await browser.close()

const want = [['1', 'KayfaBINGO!'], ['2', 'KayfaBOGGLE?'], ['3', 'KayfaBONGO!'], ['4', 'BLÖDSINN!']]
process.exit(report('s5c choice', {
  inHostSlot: ui.inSlot,
  labelsAndKeysExact: JSON.stringify(ui.btns.map((b) => [b.key, b.label])) === JSON.stringify(want),
  twoByTwo: ui.btns[0].y === ui.btns[1].y && ui.btns[2].y === ui.btns[3].y && ui.btns[0].x === ui.btns[2].x && ui.btns[0].y < ui.btns[2].y,
  targets44: ui.btns.every((b) => b.h >= 44),
  tailPointsAtPlayer: !!tA.tip && !!tA.a && Math.abs(tA.tip[0] - tA.a[0]) < 40 && tA.a[1] - tA.tip[1] < 70 && tA.a[1] - tA.tip[1] > -5,
  followsPlayer: !!tB.at && !!tB.a && Math.abs(tB.a[1] - tA.a[1]) > 5 && Math.abs(tB.at[1] - tA.at[1]) > 5 && Math.abs(tB.tip[1] - tB.a[1]) < 70,
  // V-204 „maximal lesbar“: dunkle Schrift in Shantell (eine kaputte Inline-Formatierung ließ die helle Spike-Vorgabe durch)
  labelsReadable: ui.btns.every((b) => b.color === 'rgb(31, 26, 20)' && /Shantell Sans/.test(b.font)),
  noInk: ui.paths.every((s) => s === null) && ui.btns.every((b) => /^0px|none/.test(b.border) && /^0px|none/.test(b.badgeBorder)),
  controllerOffWhileOpen: ui.ctrl === false && moveWithChoice < 0.05,
  stampBeforeClose: mid.open === true && /scale\(1\.03\)/.test(mid.pickedScale || '') && mid.otherOpacity === '0.15',
  closesAfterStamp: after.open === false && after.last?.id === 'bongo' && after.ctrl === true,
  zurufBecomesPlayerBubble: zurufBubble.includes('KayfaBONGO!'),
  moreThan8WordsRejected: nineRejected === true,
  ownWordsAccepted: own.open === false && own.last?.id === 'own' && own.last?.text === 'I want my cookie back',
  ownWordsBecomePlayerBubble: ownBubble.includes('I want my cookie back'),
  noPageErrors: errs.length === 0,
}, { tA, tB, ui, moveWithChoice, mid, after, zurufBubble, nineRejected, own, ownBubble, errs }))
