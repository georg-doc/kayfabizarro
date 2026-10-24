// WS0 V-736 (Lead 25.10.): zwei Bildfragen an Georg, nur Bilder, nichts davon eingebaut.
// 1) Tempo beim Fliegen zu Fuß (Elan in M1): mit Säule gegen ohne (Prüf-Schalter fusstempo=aus). Echter Flug: flight=elan, Abheben über player().setFlying (wie Doppel-Leertaste), W.
//    Die Säule zeigt Flugzonen (ELAN in J17-m/s); das Tempo ist eingespeist (zu Fuß gibt es noch keine Telemetrie).
// 2) Flughöhe über Grund gegen absolut: einfache Probe links neben der Säule, nur als DOM-Skizze im Bild (kein Code im Spiel).
// Ausgabe test/out/hud-3d/v736/*.png mit einem Satz Klartext unter jedem Bild.
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js'
import fs from 'fs'; import path from 'path'
import sharp from 'sharp'
const OUT = 'test/out/hud-3d/v736'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const SAVE = { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } }
const FLY = [['norm', 40], ['fast', 51], ['red', 60]]
const wait = (p, ms) => p.waitForTimeout(ms)
async function flying(extra = '') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean,hud=3d,flight=elan' + extra)
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await wait(page, 5000)
  await page.waitForFunction(() => window.__kfbM1.status?.().ready?.card === 'CARD', null, { timeout: 45000 }).catch(() => errs.push('Plakat nicht geladen'))
  await page.evaluate(() => { const M = window.__kfbM1, P = M.player(), f = M.feet(); P.teleport([f[0], f[1] + 25 * M.k, f[2]], P.heading?.() ?? 0); P.setFlying(true) }); await wait(page, 600) // 25 m hoch und abheben (Prüfweg der Elan-Tests, wie Doppel-Leertaste in der Luft)
  await wait(page, 1200) /* ohne W: im Schwungflug drückt W die Nase nach unten und die Figur landet */
  const mode = await page.evaluate(() => window.__kfbClayHud.mode()); if (mode !== 'fly') errs.push('nicht im Flug: ' + mode)
  return { ctx, page, errs }
}
async function caption(file, text) { // ein Satz Klartext unter dem Bild
  const m = await sharp(file).metadata(), h = 120, esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg = `<svg width="${m.width}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f4ecdc"/><text x="48" y="74" font-family="Fredoka, Helvetica, sans-serif" font-size="44" font-weight="600" fill="#2a2024">${esc(text)}</text></svg>`
  await sharp({ create: { width: m.width, height: m.height + h, channels: 3, background: '#f4ecdc' } }).composite([{ input: file, top: 0, left: 0 }, { input: Buffer.from(svg), top: m.height, left: 0 }]).png().toFile(file.replace('.raw.png', '.png')); fs.rmSync(file)
}
const log = []
// 1) zu Fuß: mit Säule
{ const { ctx, page, errs } = await flying()
  await page.evaluate((F) => window.__kfbClayHud.speedFeed(() => ({ fly: true, ms: 34, zones: F, stall: 12 })), FLY); await wait(page, 1200)
  const f = `${OUT}/1a_fuss_mit_saeule.raw.png`; await page.screenshot({ path: f }); log.push({ n: '1a', sp: await page.evaluate(() => window.__kfbClayHud.speed()), errs })
  await caption(f, 'Zu Fuß fliegen mit Säule: Tempo und „am Limit“ wie im Racer, gleiche Zonen und km/h.'); await ctx.close() }
// 1) zu Fuß: ohne Säule
{ const { ctx, page, errs } = await flying(',fusstempo=aus'); await wait(page, 1200)
  const f = `${OUT}/1b_fuss_ohne_saeule.raw.png`; await page.screenshot({ path: f }); log.push({ n: '1b', sp: await page.evaluate(() => window.__kfbClayHud.speed()), errs })
  await caption(f, 'Zu Fuß fliegen ohne Säule: ruhigeres Bild, das Tempo liest man nur an Figur und Welt.'); await ctx.close() }
// 2) Flughöhe: Probe links neben der Säule (Racer im Flug eingespeist), über Grund gegen absolut
for (const [n, label, val, ref, txt] of [['2a', 'ÜBER GRUND', '34 M', 'Grund', 'Höhe über Grund: zeigt den Abstand zum Boden darunter, gut fürs Landen und Tiefflug.'],
  ['2b', 'ABSOLUT', '118 M', 'Meer', 'Höhe absolut: zeigt die Höhe über dem Meer, gut zum Vergleichen von Orten, springt über Bergen nicht.']]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  await ctx.addInitScript((save) => { try { localStorage.setItem('kfb.save', JSON.stringify(save)) } catch {} }, SAVE)
  const page = await ctx.newPage()
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + ',debug,clean,hud=3d,car')
  await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await wait(page, 5000)
  await page.keyboard.down('KeyW'); await wait(page, 1500)
  await page.evaluate((F) => window.__kfbClayHud.speedFeed(() => ({ fly: true, ms: 46, zones: F, stall: 12 })), FLY); await wait(page, 1200)
  await page.evaluate(([label, val, ref]) => { // Skizze: schmales Band links neben der Säule, Marke auf Höhe, Zahl darunter wie km/h (nur im Bild)
    const R = window.__kfbClayHud.rects().speed, L = window.__kfbClayHud.layout(), k = R.h / L.speed.h, inner = R.h * L.speed.fill, top = R.y + (R.h - inner) / 2 + L.speed.h * 0 , h0 = inner, w = 12 * 2 * k * 0.75
    const x = R.x - 58 * k, root = document.getElementById('kfb-hud-clay'), d = document.createElement('div')
    const ink = '#130e16', font = (s) => `white-space:nowrap;font:400 ${s}px/1 Bangers,Fredoka,sans-serif;letter-spacing:.04em;color:#fff6e0;text-shadow:${2}px ${2}px 0 ${ink},-1px -1px 0 ${ink},1px -1px 0 ${ink},-1px 1px 0 ${ink}`
    d.style.cssText = `position:absolute;left:${x}px;top:${top + inner * 0.13}px;width:${w}px;height:${h0 * 0.87}px;border-radius:${w}px;background:#efe5d2;box-shadow:0 0 0 2px ${ink};pointer-events:none`
    const g = document.createElement('div'); g.style.cssText = `position:absolute;left:-6px;right:-6px;bottom:-2px;height:4px;border-radius:2px;background:${ref === 'Grund' ? '#7a5a3a' : '#3d8fd6'}`; d.append(g)
    const mk = document.createElement('div'); mk.style.cssText = `position:absolute;left:50%;top:38%;width:${w * 1.6}px;height:${w * 1.6}px;transform:translate(-50%,-50%);border-radius:50%;background:#58be4e;box-shadow:0 0 0 2px ${ink}`; d.append(mk)
    const t = document.createElement('div'); t.style.cssText = `position:absolute;left:50%;top:${document.getElementById('kfb-hud3d-speed').getBoundingClientRect().top - (top + inner * 0.13)}px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:2px`
    const a = document.createElement('div'); a.style.cssText = font(Math.round(22 * 2 * k * 0.75)); a.textContent = val; const b = document.createElement('div'); b.style.cssText = font(Math.round(11 * 2 * k * 0.75)); b.textContent = label; t.append(a, b); d.append(t); root.append(d)
  }, [label, val, ref]); await wait(page, 300)
  const f = `${OUT}/${n}_hoehe_${ref === 'Grund' ? 'ueber_grund' : 'absolut'}.raw.png`; await page.screenshot({ path: f }); await caption(f, txt); await ctx.close()
}
fs.writeFileSync(`${OUT}/messung.json`, JSON.stringify(log, null, 1)); console.log(JSON.stringify(log).slice(0, 600))
await browser.close()
