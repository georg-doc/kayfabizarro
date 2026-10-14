// V-243 · FrizzleBob Ruhe-Mund geschlossen (Rezept mouth.rest = "closed"): Bildreihe Ruhe · „Zu“ · mitten im Satz · nach dem Satz · nach „!“
// mit parts.mouth, mouthOnModel, m.rest, m.viseme, m.cur je Zustand; „geschlossen“ = keine Zähne (helle Pixel im Mundausschnitt) und keine Lücke.
// Befund: Das Decal „neutral“ zeigt geschlossene Lippen ohne Zähne; Zähne zeigt nur „smile“, das eigene Decal des Modellmunds.
// Gegenbild: Spender-Modus (#actortest,donor → Modellmund in Ruhe, Zähne sichtbar).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out/v243', { recursive: true })
const state = (page) => page.evaluate(() => { const A = window.__kfbActor, F = A.debugFace(), m = F.mouth
  return { parts: A.report()?.parts?.mouth ?? null, closedKey: F.mouth.p?.visemeMap?.closed ?? null, mouthOnModel: A.status().mouth, rest: m.rest ?? null, viseme: m.viseme ?? null, cur: m.cur ?? null, hold: m.__kfbHold ?? null, mouthRest: A.status().mouthRest, speaking: A.speaking() } })
// Mundausschnitt: Mitte des Modellmund-Pflasters (das Pflaster deckt das Untergesicht; Augen und Nase bleiben draußen)
const mouthClip = (page) => page.evaluate(() => { const F = window.__kfbActor.debugFace(), it = F.orig.mouth.items[0].mesh
  const V = it.position.constructor, pts = []; it.geometry.computeBoundingBox(); const b = it.geometry.boundingBox; it.updateWorldMatrix(true, false)
  const C = window.__kfbActorCamera; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { const p = new V(x, y, z).applyMatrix4(it.matrixWorld).project(C); pts.push([(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight]) }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
  return { x: Math.min(...xs) + w * 0.15, y: Math.min(...ys) + h * 0.45, width: w * 0.7, height: h * 0.4 } })
// Zähne/Lücke: helle, fast farblose Pixel (Zahn; die Haut ist gesättigtes Gelb) und sehr dunkle Pixel (Mundhöhle) im Ausschnitt
const teeth = (page, png) => page.evaluate(async (src) => { const i = new Image(); await new Promise((ok) => { i.onload = ok; i.src = src }); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0)
  const d = g.getImageData(0, 0, c.width, c.height).data; let white = 0, gap = 0; for (let k = 0; k < d.length; k += 4) { const r = d[k], gg = d[k + 1], b = d[k + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b); if (mx > 100 && (mx - mn) / mx < 0.35) white++; if (mx < 70 && r > b) gap++ } return { white, gap, px: d.length / 4 } }, 'data:image/png;base64,' + png.toString('base64'))

// shots: [Name, Text für say() oder null, Warte-Bedingung oder null]
async function run(hash, shots) {
  const { browser, page, errs } = await openPage(hash, { viewport: { width: 900, height: 900 } })
  await page.waitForFunction(() => window.__kfbActor?.status().status === 'OK' && window.__kfbActor.status().shown, null, { timeout: 180000 })
  await page.evaluate(() => { const R = window.__kfbActor.debugRig(); R.setLife({ on: false }); R._blinkK = -1; R._blinkT = 1e9; window.__kfbActor.debugFace().set('brow.life.on', false) }); await page.waitForTimeout(1200)
  const clip = await mouthClip(page), out = {}
  for (const [name, act, wait] of shots) { if (act) await page.evaluate((t) => window.__kfbActor.say(t), act); const h = wait ? await page.waitForFunction(wait, null, { timeout: 30000, polling: 'raf' }) : null; const st = { ...(await state(page)), ...(h ? (await h.jsonValue()) || {} : {}) }; // Zustand im selben Schritt wie die Warte-Bedingung (unter Last springt der Laut sonst weiter) if (!act || !wait) await page.waitForTimeout(250)
    const png = await page.screenshot({ clip }); fs.writeFileSync(`test/out/v243/${name}.png`, png); out[name] = { ...st, ...(await teeth(page, png)) } }
  await browser.close(); return { out, errs, clip }
}
const game = await run('#actortest,debug,view=face', [
  ['1_ruhe', null, null],
  ['2_zu', null, null], // „Zu“ = Ruhe-Mund aus dem Rezept (die ToolBox-Wahl „Zu“ wird nicht exportiert, V-243); gleicher Zustand, eigens belegt
  ['3_mitten', 'Hallo, ich bin FrizzleBob und rede gerade ziemlich lange weiter', () => { const A = window.__kfbActor, m = A.debugFace().mouth; return A.speaking() && ['ah', 'oh', 'ee'].includes(m.cur) ? { speaking: true, cur: m.cur, mouthOnModel: A.status().mouth } : false }], // Vokal: offener Mund (Pausen zeigen „neutral“)
  ['4_nach_satz', null, () => !window.__kfbActor.speaking()],
  ['5_nach_ausruf', 'Na klar!', () => !window.__kfbActor.speaking()],
])
const donor = await run('#actortest,debug,view=face,donor', [['0_spender_ruhe', null, null]])
const G = game.out, D = donor.out['0_spender_ruhe']
// geschlossen = gehaltenes Ruhe-Decal = Laut „closed“ des Eintrags (wie „Zu“ in der ToolBox), keine Zahnpixel
const K = G['1_ruhe'].mouthRest
const closed = (x) => !!K && x.mouthOnModel === 'decal ' + K && x.cur === K && x.hold === K && x.speaking === false && x.white < Math.max(20, D.white * 0.05)
process.exit(report('v243 rest mouth closed', {
  restFromRecipe: !!K && K === G['1_ruhe'].closedKey && K !== 'smile' && G['1_ruhe'].parts === 'original',
  // Zustand je Bild wird unmittelbar vor der Aufnahme gelesen
  restClosedNoTeeth: closed(G['1_ruhe']) && closed(G['2_zu']),
  speakingUsesTrack: G['3_mitten'].speaking === true && /^decal (ah|oh|ee)$/.test(G['3_mitten'].mouthOnModel) && G['3_mitten'].cur !== K,
  backToRestAfterSentence: closed(G['4_nach_satz']),
  backToRestAfterExclamation: closed(G['5_nach_ausruf']), // V-243: nach say() wieder Ruhe-Mund (Spender endete bei „!“ auf smile)
  donorModeKeepsModelMouth: D.mouthOnModel === 'own' && D.mouthRest === null && D.white > 300, // Gegenbild: Zähne sichtbar (Modell-Decal Smile)
  noPageErrors: game.errs.length === 0 && donor.errs.length === 0,
}, { game: G, donor: D, clip: game.clip }))
