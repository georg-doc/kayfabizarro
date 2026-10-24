// S5a Blasen-Ebene · Host-Vertrag R1.2 §4 (V-215), V-204 plain, V-212 ein Renderer.
// Prüft: Anker über ModuleHost an/ab, Form ohne Strich (keine Tusche), ein Zipfel + Schatten, Flip 520/300 ms,
// Ausblenden hinter der Kamera und außerhalb des Bildes, Position per transform ohne React-Render, Lebensdauer.
// Bildpaar: Ausschnitt der Lab-Referenz (replies/lab-donors/V204_plain_bubble_reference.jpg) neben dem Stand,
// zur Sichtprüfung. Testtexte sind Prüf-Fixtures (Referenzzeile aus dem Bild), keine Spieltexte.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out', { recursive: true })
const { browser, page, errs } = await openPage('#hosttest')
await page.waitForFunction(() => window.__kfbAnchors && window.__kfbStore && window.__kfb && window.__kfbProbeLog?.update > 3, null, { timeout: 90000 })
await page.evaluate(() => window.__kfbStore.getState().closeDialog())
await page.waitForTimeout(1500)
const ids0 = await page.evaluate(() => window.__kfbAnchors.ids())
const say = (anchor, parts, kind = 'speech', color = '#e6b53a') => page.evaluate(([a, p, k, c]) => window.__kfbSayTest(a, p, k, c), [anchor, parts, kind, color])
const list = () => page.evaluate(() => window.__kfbBubbles())

// 1 · sichtbarer Anker vor der Kamera, Triplet mit drei Teilen
await page.evaluate(() => window.__kfbAnchors.ahead('front', 9, 0, 0))
await say('front', ['Same story', 'one ingredient missing', 'different creature'])
await page.waitForTimeout(300)
const look = await page.evaluate(() => {
  const el = [...document.querySelectorAll('#ui-bubbles [data-kind]')].find((e) => e.dataset.speaker === 'front')
  const paths = [...el.querySelectorAll('svg path')].map((p) => ({ fill: p.getAttribute('fill'), stroke: p.getAttribute('stroke') }))
  const parts = [...el.querySelectorAll('[data-part]')].map((d) => { const a = d.getAnimations()[0]; return a ? { part: +d.dataset.part, delay: a.effect.getTiming().delay, dur: a.effect.getTiming().duration } : null })
  const d = el.querySelector('svg path').getAttribute('d')
  return { paths, parts, filter: el.firstElementChild.style.filter, font: el.querySelector('[data-part]').parentElement.style.fontFamily, subpaths: (d.match(/M/g) || []).length, inSlot: !!el.closest('#ui-bubbles') }
})
await page.waitForTimeout(2200)
const shownFront = (await list()).find((b) => b.anchor === 'front')
const rect = shownFront.rect
await page.screenshot({ path: 'test/out/s5a_stand.png', clip: { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: rect.width, height: rect.height } })
// 2 · Position folgt dem Anker per transform, ohne React-Render
const r0 = await page.evaluate(() => window.__kfbBubbleRenders())
const t0 = await page.evaluate(() => [...document.querySelectorAll('#ui-bubbles [data-kind]')].find((e) => e.dataset.speaker === 'front').style.transform)
await page.evaluate(() => window.__kfbAnchors.ahead('front', 9, 2.5, 0))
await page.waitForTimeout(800)
const t1 = await page.evaluate(() => [...document.querySelectorAll('#ui-bubbles [data-kind]')].find((e) => e.dataset.speaker === 'front').style.transform)
const r1 = await page.evaluate(() => window.__kfbBubbleRenders())
// 3 · hinter der Kamera und außerhalb des Bildes -> ausgeblendet
await page.evaluate(() => { window.__kfbAnchors.ahead('behind', -6, 0, 0); window.__kfbAnchors.ahead('outside', 6, 40, 0) })
await say('behind', ['…'], 'thought'); await say('outside', ['…'], 'thought')
await page.waitForTimeout(600)
const L3 = await list()
const thought = await page.evaluate(() => { const el = [...document.querySelectorAll('#ui-bubbles [data-kind]')].find((e) => e.dataset.speaker === 'behind'); return { flips: [...el.querySelectorAll('[data-part]')].reduce((n, d) => n + d.getAnimations().length, 0) } })
// 3b · Vertrag §5 im Host: eine nicht vom Pool-Leser ausgegebene Zeile wird zu „…“ (Denkblase); Pool-Status geladen
await page.evaluate(() => { window.__kfbAnchors.ahead('forged', 9, -2.5, 0); window.__kfbSayForged('forged', 'Erfundener Satz'); window.__kfbAnchors.ahead('npc', 9, 2.5, 1.5); window.__kfbSayZuruf('npc', 'Bingo!') })
await page.waitForTimeout(300)
const forged = (await list()).find((b) => b.anchor === 'forged')
const zurufAtNpc = (await list()).find((b) => b.anchor === 'npc')
await page.waitForFunction(() => !window.__kfbPool().loading, null, { timeout: 30000 }).catch(() => {})
const pool = await page.evaluate(() => window.__kfbPool())
const cardLine = await page.evaluate(async () => { const c = window.__kfbCard('forget_utopia', 7); return { ...(await window.__kfbLineFor(c, 'cardName')), name: c.name } })
// 4 · Modul-Anker: ModuleHost meldet 'probe' an und beim Aushängen ab
await page.evaluate(() => window.__kfbHostTest.off())
await page.waitForTimeout(800)
const ids1 = await page.evaluate(() => window.__kfbAnchors.ids())
// 5 · Lebensdauer 7,5 s + 0,25 s Ausblenden. Die Blase zählt Spielzeit (Host-Takt ≤ 0,1 s je Bild): bei wenigen Bildern/s läuft sie langsamer als
// die Wanduhr. Darum warten, bis sie weg ist (höchstens 40 s), statt fest 6,5 s (FAIL nur unter Last bei 3 Bildern/s, 15.10.)
await page.waitForFunction(() => ![...document.querySelectorAll('#ui-bubbles [data-kind]')].some((e) => e.dataset.speaker === 'front'), null, { timeout: 40000 }).catch(() => {})
const L5 = await list()
await browser.close()

// Bildpaar: links Referenz (Lab), rechts Stand
const pair = await (async () => {
  const b = await openPage('')
  const out = await b.page.evaluate(async ([ref, stand]) => {
    const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
    const [R, S] = await Promise.all([load(ref), load(stand)])
    const c = document.createElement('canvas'); c.width = 900; c.height = 300; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 900, 300)
    // Referenz: rechte Blase („Same story …“) im Lab-Bild, Bereich ~ x 160–345, y 255–350
    g.drawImage(R, 150, 250, 205, 110, 10, 20, 430, 231); g.drawImage(S, 0, 0, S.width, S.height, 460, 20, 430, 430 * S.height / S.width)
    return c.toDataURL('image/png')
  }, ['data:image/jpeg;base64,' + fs.readFileSync('test/ref/V204_plain_bubble_reference.jpg').toString('base64'), 'data:image/png;base64,' + fs.readFileSync('test/out/s5a_stand.png').toString('base64')])
  await b.browser.close(); return out
})()
fs.writeFileSync('test/out/s5a_pair.png', Buffer.from(pair.split(',')[1], 'base64'))

process.exit(report('s5a bubble layer', {
  inHostSlot: look.inSlot,
  noInkOnlyFills: look.paths.length >= 1 && look.paths.every((p) => p.stroke === null && p.fill && p.fill !== 'none'),
  oneShapeOneTail: look.subpaths === 1,
  softShadow: /drop-shadow/.test(look.filter),
  shantell: /Shantell Sans/.test(look.font),
  flipStagger520: look.parts.length >= 3 && look.parts.every((p) => p && p.delay === p.part * 520 && p.dur === 300),
  thoughtNoFlip: thought.flips === 0,
  shownInFront: shownFront.shown,
  followsAnchorByTransform: t0 && t1 && t0 !== t1,
  noReactRenderOnMove: r1 === r0,
  hiddenBehindCamera: L3.find((b) => b.anchor === 'behind')?.shown === false,
  hiddenOutsideImage: L3.find((b) => b.anchor === 'outside')?.shown === false,
  playerLineOnlyAtPlayer: zurufAtNpc?.text === '…' && zurufAtNpc?.kind === 'thought',
  forgedLineBecomesSilence: forged?.text === '…' && forged?.kind === 'thought',
  livePoolLoaded: pool.loaded === true && /^[0-9a-f]{40}$/.test(pool.blob || '') && pool.contentRevision != null,
  noAcceptedSoCardText: pool.acceptedBeats > 0 || (cardLine.source === 'CARD' && cardLine.text === cardLine.name),
  moduleAnchorRegistered: ids0.includes('probe') && ids0.includes('player'),
  moduleAnchorUnregistered: !ids1.includes('probe'),
  lifetimeEnds: !L5.find((b) => b.anchor === 'front'),
  noPageErrors: errs.length === 0,
}, { pool, cardLine, forged: forged && { text: forged.text, kind: forged.kind }, look, t0, t1, r0, r1, ids0, ids1, L3: L3.map((b) => [b.anchor, b.shown]), L5: L5.map((b) => b.anchor), errs }))
