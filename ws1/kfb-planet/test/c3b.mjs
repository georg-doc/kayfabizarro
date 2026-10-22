// C3b (V-434/V-437, V-654 C6 löst V-450 ab) · WSB-B28-Fundsachen in der Laufwelt (#m1,harvest): LIEGEN auf dem Gelände (Unterkante 1,2 cm eingesunken, still),
// kein Kontaktfleck (V-587), Erdkeil + Kontakt-Steinchen je Stück (world/grounding), 0 Stücke auf dem Weg, Aufheben mit I in den R5f-Rucksack, Wegwerfen aus dem Rucksack (Stück schwebt
// wieder vor dem Spieler), Ziel-Anzeige „i“ in der Aktionsleiste. Bild: Kontaktschatten 200 % (test/out/c3b/contact-200.png), Übersicht (test/out/c3b/demo.png).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/c3b', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,harvest,cards=1', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.found?.stats().status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
await page.waitForTimeout(2000)
const a = await page.evaluate(async () => {
  const M = window.__kfbM1, F = M.mods.found, P = M.mods.path, s0 = F.items(), st = F.stats()
  await new Promise((r) => setTimeout(r, 900)); const s1 = F.items()
  const hip = st.clearance, rel = s0.filter((i) => i.here).map((i) => (i.y - i.ground - i.half) / ((st.clearance + i.half) * 0.05) ), bottoms = s0.filter((i) => i.here).map((i) => i.y - i.half - i.ground), tilted = s0.filter((i) => i.tilt).length
  return { st, n: s0.length, hip, tilted, bottomMin: Math.min(...bottoms), bottomMax: Math.max(...bottoms), relMin: Math.min(...rel), relMax: Math.max(...rel), moved: s0.filter((i, k) => Math.abs(i.y - s1[k].y) > 1e-4).length, path: P?.info?.(), items: s0 }
})
// Aufheben: Spieler neben das erste Stück der Wiese setzen, I drücken
const pick = await page.evaluate(async () => { const M = window.__kfbM1, it = M.mods.found.items().find((i) => i.here && /^wiese/.test(i.key)) || M.mods.found.items()[0]
  M.player().teleport([it.x + 0.6, it.ground + 1.2, it.z + 0.6]); await new Promise((r) => setTimeout(r, 1500))
  return { key: it.key, x: it.x, z: it.z, target: !!document.querySelector('#kfb-hud-r5f') && !!window.__kfbM1.mods.found.near(window.__kfbM1.feet()) } })
await page.keyboard.press('KeyI'); await page.waitForTimeout(800)
const afterPick = await page.evaluate(() => { const F = window.__kfbM1.mods.found, bag = window.__kfbM1.harvest().hud.items(); return { pickedKey: bag[0]?.key ?? null, here: bag[0] ? F.items().find((i) => i.key === bag[0].key)?.here : null, picked: F.stats().picked } })
// Kontaktschatten 200 %: ein anderes Stück aus der Nähe, Ausschnitt doppelt vergrößert
const blob = await page.evaluate(async () => { const M = window.__kfbM1, it = M.mods.found.items().find((i) => i.here)
  M.player().teleport([it.x + 2.4, it.ground + 1.2, it.z + 2.4]); await new Promise((r) => setTimeout(r, 1600))
  return { key: it.key } })
const shotDemo = await page.screenshot(); fs.writeFileSync('test/out/c3b/demo.png', shotDemo)
await sharp(shotDemo).extract({ left: 440, top: 260, width: 400, height: 240 }).resize(800, 480, { kernel: 'nearest' }).png().toFile('test/out/c3b/contact-200.png')
// Wegwerfen über den Rucksack (api throwItem), Stück schwebt wieder
const t2 = await page.evaluate(async (key) => { const st = window.__kfbM1.harvest?.(); const h = st?.hud; if (!h) return { err: 'no hud' }
  const bagN = h.items().length; h.openBag(); await new Promise((r) => setTimeout(r, 400)); const throwBtn = !!document.querySelector('[data-kfb-throw]')
  const it = h.throwItem(0); await new Promise((r) => setTimeout(r, 400)); const F = window.__kfbM1.mods.found
  return { bagN, throwBtn, thrownKey: it?.key, back: F.items().find((i) => i.key === key)?.here, bagAfter: h.items().length, dropped: F.stats().dropped } }, afterPick.pickedKey)
const blobs = await page.evaluate(() => { let n = 0; window.__kfbM1.mods.found.object3d.traverse((m) => { if (m.name === 'contact-blob' && m.visible) n++ }); return n })
const ground = await page.evaluate(() => { const G = window.__kfbM1.mods.ground, F = window.__kfbM1.mods.found, ids = F.anchors().filter((a) => a.visible).map((a) => a.id)
  return { info: G?.info?.(), rises: ids.map((id) => G?.probe?.(id)?.maxRise ?? null) } })
await browser.close()
const DP = [[0, 30], [0, 44], [-14, 50], [-26, 46]].map(([x, z]) => [x * 0.6508775522703274, z * 0.6508775522703274])
const dseg = (x, z) => { let b = Infinity; for (let i = 0; i + 1 < DP.length; i++) { const [ax, az] = DP[i], [bx, bz] = DP[i + 1], dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)); b = Math.min(b, Math.hypot(x - ax - t * dx, z - az - t * dz)) } return b }
const onPath = a.items.filter((i) => dseg(i.x, i.z) < 1.3).length
const summary = { ground, items: a.n, clearance: a.hip, tilted: a.tilted, bottom: [+a.bottomMin.toFixed(3), +a.bottomMax.toFixed(3)], moved: a.moved, onPath, pick: { ...pick, ...afterPick }, throw: t2, blobs, path: a.path }
fs.writeFileSync('test/out/c3b/c3b.json', JSON.stringify(summary, null, 1))
process.exit(report('c3b found items demo (V-434/V-437)', {
  itemsLoaded: a.st.status === 'OK' && a.n >= 20,
  restMode: a.st.mode === 'rest' && a.hip === -0.012, // V-654: liegen statt schweben (V-450 abgelöst)
  bottomInGround: a.bottomMin > -0.03 && a.bottomMax <= 0.001, // Unterkante knapp im Gelände (kein Schweben, nicht vergraben)
  still: a.moved === 0, // keine Drehung, kein Wippen
  zeroOnPath: onPath === 0,
  noBlobs: blobs === 0, // V-587
  groundContactEach: ground.rises.length >= a.n - 1 && ground.rises.every((r) => r != null && r > 0.01) && ground.info?.pebbles > 0, // Erdkeil steigt an, Kontakt-Steinchen
  targetShownNearItem: pick.target === true,
  pickUpWithI: afterPick.here === false && afterPick.picked === 1,
  backpackHasItem: t2.bagN === 1 && t2.throwBtn === true,
  throwAwayLiesAgain: t2.thrownKey === afterPick.pickedKey && t2.back === true && t2.bagAfter === 0 && t2.dropped === 1,
  noPageErrors: errs.length === 0,
}, { summary, errs: errs.slice(0, 3) }))
