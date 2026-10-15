// M1 · Abnahme 3: Augen führen den Blick, Blinzeln und Lider bleiben aktiv (Briefing M1 Punkt 4, V-214).
// Replay mit festem Takt (#m1,debug,replay). Die Figur steht mit Blick nach −Z; das Skript gibt „rechts“ (Kamera-rechts = +X), das Blickziel springt
// also um 90° zur Seite. Gemessen je Schritt die WIRKUNG (Prüfer M1, Befund 4): tatsächliche Pupillen-Auslenkung des Eye-Rigs (Feder 150/13, Mittel
// beider Augen, Anteil am Höchstausschlag), Gier des Kopfknochens gegenüber der Figur (Grad, nach Mixer und Kopf-Schicht) und Körperrichtung
// (Kapsel). Reihenfolge: Pupillen erreichen die Hälfte ihres größten Ausschlags vor dem Kopfknochen, der Kopf vor dem Körper (je 50 % des Wegs).
// Lider/Blinzeln: Während 8 s Laufen schließt das Eye-Rig mindestens einmal von selbst (Leben an, kein erzwungener Lidschlag).
// Bildbogen (bewegt): Kamera vor der Figur, Bilder bei 0 / 4 / 10 / 20 / 40 Bildern nach dem Richtungswechsel → test/out/m1/eyes_turn.png.
// Der Studio-Vergleich (ToolBox P08 | Spiel) gilt für die Ruhehaltung (V-240-Bildpaar); eine bewegte Vorlage hat der Spender nicht.
import { openPage, report } from './_page.mjs'
import fs from 'fs'

const { browser, page, errs } = await openPage('#m1,debug,replay', { viewport: { width: 900, height: 700 } })
// (Bildbogen braucht die volle Größe; die Messung selbst ist taktfest)
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0, null, { timeout: 240000 })
const shots = []
const res = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player(), loco = M.mods.player, R = loco.debugRig()
  const frames = (n) => new Promise((r) => { const t = C.frame + n; const f = () => (C.frame >= t ? r() : requestAnimationFrame(f)); f() })
  const bodyYaw = () => { const q = P.handle().body.rotation(); return Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.x * q.x)) * 180 / Math.PI }
  P.teleport([-20, 1.15, 30], Math.PI); await frames(90) // Blick −Z, Kamera dahinter; Pupillen kommen zur Ruhe
  const y0 = bodyYaw(), rows = []
  M.input({ rightward: true }) // Ziel springt nach +X (90° rechts aus Sicht der Figur)
  const m0 = loco.measure()
  for (let i = 0; i < 90; i++) { await frames(1); const m = loco.measure(); rows.push({ i, eye: m.pupil - m0.pupil, head: m.headDeg - m0.headDeg, cmd: loco.status().eyes.nx, body: bodyYaw() }) }
  M.input(null); await frames(30)
  // Blinzeln während 8 s Laufen (Leben an)
  let closes = 0, was = false; M.input({ forward: true })
  for (let i = 0; i < 480; i++) { await frames(1); const k = R._blinkK; const c = k != null && k >= 0; if (c && !was) closes++; was = c }
  M.input(null)
  return { y0, rows, closes, life: { ...R.life }, follow: R._follow }
})
// Reihenfolge auswerten
const r = res.rows, last = r.at(-1)
const unwrap = (a) => { let d = a - res.y0; d = ((d + 540) % 360) - 180; return d }
const bodyEnd = unwrap(last.body), eyeMax = Math.max(...r.map((x) => Math.abs(x.eye))), headEnd = Math.max(...r.map((x) => Math.abs(x.head)))
const first = (f) => (r.find(f) || { i: Infinity }).i
const overshoot = Math.max(0, ...r.map((x) => Math.abs(unwrap(x.body)) - Math.abs(bodyEnd))) // Grad über das Endziel hinaus
const tEye = first((x) => Math.abs(x.eye) >= 0.5 * eyeMax), tHead = first((x) => Math.abs(x.head) >= 0.5 * headEnd), tBody = first((x) => Math.abs(unwrap(x.body)) >= 0.5 * Math.abs(bodyEnd))

// Bildbogen: Kamera vor der Figur, gleiche Wende noch einmal
const pics = await page.evaluate(async () => {
  const M = window.__kfbM1, C = M.clock, P = M.player()
  const frames = (n) => new Promise((r) => { const t = C.frame + n; const f = () => (C.frame >= t ? r() : requestAnimationFrame(f)); f() })
  P.teleport([-20, 1.15, 30], Math.PI); await frames(40)
  return true
})
const at = [0, 4, 10, 20, 40]
// Kamera fest bei +X, Blick nach −X (Eingaben sind kamerabezogen: „rückwärts“ = +X = zur Kamera). Die Figur schaut nach −Z (Profil) und
// dreht sich zur Kamera: erst die Augen, dann der Kopf, dann der Körper.
await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), cc = M.player().camera(); cc.enabled = false; cc.setLookAt(p[0] + 3.4, p[1] + 1.9, p[2], p[0], p[1] + 1.6, p[2], false) })
for (let k = 0; k < at.length; k++) {
  if (k === 0) await page.evaluate(() => window.__kfbM1.input({ backward: true }))
  const n = at[k] - (k ? at[k - 1] : 0)
  await page.evaluate(async (n) => { const M = window.__kfbM1, C = M.clock; await new Promise((r) => { const t = C.frame + n; const f = () => (C.frame >= t ? r() : requestAnimationFrame(f)); f() }) }, n)
  await page.waitForTimeout(150)
  shots.push(await page.screenshot({ clip: { x: 250, y: 120, width: 400, height: 420 } }))
}
await page.evaluate(() => window.__kfbM1.input(null))
await browser.close()
fs.mkdirSync('test/out/m1', { recursive: true }); shots.forEach((b, i) => fs.writeFileSync(`test/out/m1/eyes_turn_${at[i]}.png`, b))
process.exit(report('m1-eyes', {
  eyesMove: eyeMax > 0.3,
  headMoves: headEnd > 10,
  bodyTurns: Math.abs(bodyEnd) > 60,
  eyesBeforeHead: tEye < tHead,
  headBeforeBody: tHead < tBody,
  bodyNoPendulum: overshoot <= 10,
  blinksWhileRunning: res.closes >= 1,
  lifeOn: res.life.on !== false,
  noPageErrors: errs.length === 0,
}, { tEye, tHead, tBody, overshoot: +overshoot.toFixed(1), eyeMax: +eyeMax.toFixed(2), headEnd, bodyEnd: +bodyEnd.toFixed(1), closes: res.closes, life: res.life, sample: r.filter((x) => [0, 2, 4, 8, 12, 20, 30, 45, 60, 89].includes(x.i)), errs: errs.slice(0, 3) }))
