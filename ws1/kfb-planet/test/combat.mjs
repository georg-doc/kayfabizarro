// Kampf R1 (Georg 22.10.) · FrizzleBob mit den K10-Waffen im Spiel (#m1,debug,harvest,look=terrain3,patrol,fluffer). Prüft aus dem Spiel heraus:
//   A  geladen: Karten zugelassen (auditWeaponProfile), Waffen-GLBs und Mündungsblitze mit der sha256 der Karte, beide Waffen im Rucksack
//   B  Wechsel: Ziffer 2 = Pistole, 3 = Blaster, 1 = keine; Aktionsleiste zeigt die Familie; Waffe am Handknochen (feste Halterung = slotOffset der Karte,
//      Abstand Hand–Waffe klein); Heil-Pistole des Fluffers mit aktiver K10-Waffe ausgeblendet, ohne wieder sichtbar; Rucksack-Klick „Ausrüsten“ wechselt
//   C  Schuss mit Taste B auf ein Skelett der Patrouille: Clip Ranged_1H_Shoot auf dem Mixer der Figur, Abgang am Marker 0,2667 s, Geschoss startet an der
//      Mündung (KFB_Muzzle), Mündungsblitz sichtbar, Treffer (groups hit), Hit-Stop ausgelöst (Spieler eingefroren, Welt läuft), Knet-Treffer
//   D  weiter schießen bis zum K.o.: Plopp am Ort (knet pop), K10 kill
//   E  Blaster auf den Dark Fluffer: Treffer heilt (onHit des Fluffers), kein zweites Zielsystem
//   F  K10-Ereignisse im Ringpuffer (fire, contact, kill, Schema), Kosten des Moduls je Bild, keine Seitenfehler
// Bilder: test/out/combat/ – Spielkamera: rucksack.png (Waffen mit Bild), spiel_schuss.png (beim Abgang), treffer_skelett.png, plopp.png, treffer_fluffer.png; nah: waffe_pistole.png / waffe_blaster.png
// (Ruhehaltung), schuss_nah.png (Schritt nach dem Abgang: Pose, Blitz, Geschoss), treffer_skelett_nah.png, plopp_nah.png, treffer_fluffer_nah.png
import fs from 'fs'
import { openPage, report } from './_page.mjs'
fs.mkdirSync('test/out/combat', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,patrol,fluffer,fluffert=2', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const M = window.__kfbM1; return M?.status().player?.status === 'OK' && M.mods.orchard?.stats().status === 'OK' && M.combat?.()?.status.status !== 'LOADING' && (M.groups?.()?.status?.status ?? 'LOADING') !== 'LOADING' && M.fluffer?.()?.status.status === 'OK' && M.harvest().bagWeapons }, null, { timeout: 300000 })
const wait = (ms) => page.waitForTimeout(ms)
const C = () => page.evaluate(() => window.__kfbM1.combat())
const cards = Object.fromEntries(['kfb_kit_gun_pistol_prototype', 'kfb_kit_heroman_blaster'].map((f) => [f, JSON.parse(fs.readFileSync(`src/data/combat/k10/${f}.weapon.json`, 'utf8'))]))
const savePng = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'))
// Bilder aus eigenen Kameras (Render-Ziel wie c3g) – im Spiel als window.__cbShot(eye, look) angelegt, damit der Schritt-Rekorder genau am Abgang/Treffer aufnimmt
await page.evaluate(() => { const M = window.__kfbM1, T = M.three()
  window.__cbShot = (eye, look, fov = 34) => { const gl = M.renderer(), scene = M.scene(), W = 640, H = 480, cam = new T.PerspectiveCamera(fov, W / H, 0.02, 200)
    cam.position.fromArray(eye); cam.lookAt(new T.Vector3().fromArray(look)); cam.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace, samples: 4 }), b = new Uint8Array(W * H * 4); gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, b); gl.setRenderTarget(null); rt.dispose()
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), im = g.createImageData(W, H); for (let y = 0; y < H; y++) im.data.set(b.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4); g.putImageData(im, 0, 0)
    return c.toDataURL('image/png') }
  // nah an der Waffe: seitlich von der rechten Hand (Seite = Richtung Figurmitte → Hand), Blick auf die Mitte Hand–Mündung
  window.__cbHand = (dist = 1.1) => { const pl = M.mods.player, hand = pl.figureBones(['hand.r'])['hand.r'], fig = pl.object3d, h = hand.getWorldPosition(new T.Vector3()), f = fig.getWorldPosition(new T.Vector3())
    const q = fig.getWorldQuaternion(new T.Quaternion()), fwd = new T.Vector3(0, 0, 1).applyQuaternion(q), side = h.clone().sub(f).setY(0).normalize(), mz = M.mods.combat.debug().mount?.muzzle, look = mz ? h.clone().add(new T.Vector3().fromArray(mz)).multiplyScalar(0.5) : h
    return window.__cbShot(look.clone().addScaledVector(side, dist).addScaledVector(fwd, dist * 0.55).add(new T.Vector3(0, 0.22, 0)).toArray(), look.toArray()) }
  // Treffer/Plopp: von der Seite des Spielers auf den Punkt, etwas erhöht
  window.__cbAt = (pos, dist = 1.9, up = 0.55, lookUp = 0) => { const p = new T.Vector3(pos.x, pos.y, pos.z), me = new T.Vector3().fromArray(M.feet()), dir = me.sub(p).setY(0).normalize(), lat = new T.Vector3(-dir.z, 0, dir.x)
    return window.__cbShot(p.clone().addScaledVector(dir, dist).addScaledVector(lat, dist * 0.45).add(new T.Vector3(0, up, 0)).toArray(), p.clone().add(new T.Vector3(0, lookUp, 0)).toArray()) } })
const closeUp = (file) => page.evaluate(() => window.__cbHand()).then((u) => savePng(file, u))
const handState = () => page.evaluate(() => { const M = window.__kfbM1, slot = M.mods.player.figureBones(['handslot.r'])['handslot.r']
  return { heal: slot.children.filter((c) => /^heal-weapon:/.test(c.name)).map((c) => c.visible), k10: slot.children.filter((c) => /^KFB_fixed_kit_mount:/.test(c.name)).map((c) => c.name) } })

// A
const A = await C()
// B: Ziffern über die echte Tastatur (Host-Router), Rucksack über Klicks
await page.keyboard.press('Digit2'); await wait(400)
const B2 = await C(), hud2 = await page.evaluate(() => ({ bar: window.__kfbM1.harvest().hud.weapon(), bag: window.__kfbM1.harvest().hud.activeWeapon() })), hand2 = await handState()
await closeUp('test/out/combat/waffe_pistole.png')
await page.keyboard.press('Digit1'); await wait(400)
const B1 = await C(), hud1 = await page.evaluate(() => window.__kfbM1.harvest().hud.weapon()), hand1 = await handState()
await page.keyboard.press('Digit3'); await wait(400)
const B3 = await C(), hud3 = await page.evaluate(() => window.__kfbM1.harvest().hud.weapon())
await closeUp('test/out/combat/waffe_blaster.png')
// Rucksack: Fach „Pistole“ anklicken, dann „Ausrüsten“
await page.evaluate(() => window.__kfbM1.harvest().hud.openBag()); await wait(300)
await page.click('#kfb-hud-r5f [title="Pistole"]'); await wait(300)
await page.screenshot({ path: 'test/out/combat/rucksack.png' })
const bagShots = await page.evaluate(() => window.__kfbM1.harvest().hud.weapons().map((w) => ({ wid: w.wid, shot: /^data:image\/png;base64,/.test(w.shot || '') && w.shot.length > 2000 })))
await page.click('#kfb-hud-r5f [data-kfb-equip] [title="Ausrüsten"]'); await wait(400)
const Bbag = await C(), hudBag = await page.evaluate(() => ({ bar: window.__kfbM1.harvest().hud.weapon(), bag: window.__kfbM1.harvest().hud.activeWeapon(), open: window.__kfbM1.harvest().hud.bagOpen() }))
await page.evaluate(() => window.__kfbM1.harvest().hud.closeBag())

// C: Spieler vor die Skelett-Patrouille (Muster test/patrol.mjs C), Kamera auf den Anführer, Taste B
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-40, M.terrainH(-40, 30) + 1.2, 30], Math.PI) }); await wait(4000)
await page.evaluate(() => { const M = window.__kfbM1, d = M.mods.groups.debug()[0], p = d.members[0], yaw = p.yaw, ax = p.x + Math.sin(yaw) * 7 + Math.cos(yaw) * 2.0, az = p.z + Math.cos(yaw) * 7 - Math.sin(yaw) * 2.0
  M.player().teleport([ax, M.terrainH(ax, az) + 1.2, az], yaw + Math.PI) })
let aim = null
for (let i = 0; i < 60 && !aim; i++) { await wait(150); aim = await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), m = M.mods.groups.debug()[0].members[0], dx = m.x - p[0], dz = m.z - p[2], l = Math.hypot(dx, dz)
  const r = M.mods.orchard.aimTarget(p, [dx / l, 0, dz / l]); return r?.kind === 'target' && /^group:/.test(r.id) ? { ...r, yaw: Math.atan2(dx, dz) } : null }) }
await page.evaluate((yaw) => { const M = window.__kfbM1, cc = M.player().camera(); cc.rotateAzimuthTo(yaw + Math.PI, false) // Kamera hinter der Figur: Ziel im Blickkegel der Taste B
  const R = window.__cbRec = { overlays: {}, flashSteps: 0, shots: {}, pend: [], seq: 0, n: 0 }; M.clock.onStep = () => { const pl = M.mods.player, c = M.mods.combat; R.n++; const ov = pl.status().overlay; if (ov) R.overlays[ov] = (R.overlays[ov] || 0) + 1
    const d = c.debug(); if (d.mount?.flashVisible) R.flashSteps++
    if (d.lastRelease && !R.shots.schuss_nah) R.shots.schuss_nah = window.__cbHand(1.0) // genau im Schritt nach dem Abgang: Pose, Blitz, Geschoss an der Mündung
    for (const e of c.events()) { if (e.seq <= R.seq) continue; R.seq = e.seq
      if (e.type === 'contact' && /^group:/.test(e.target)) R.pend.push({ at: R.n + 3, name: 'treffer_skelett_nah', pos: e.position })
      if (e.type === 'contact' && e.target === 'dark_fluffer_ghost') R.pend.push({ at: R.n + 3, name: 'treffer_fluffer_nah', pos: e.position })
      if (e.type === 'kill') R.pend.push({ at: R.n + 14, name: 'plopp_nah', pos: e.position, dist: 3.2, up: 1.1, lookUp: 0.6 }) }
    for (const j of R.pend) if (!j.done && R.n >= j.at && !R.shots[j.name]) { j.done = true; R.shots[j.name] = window.__cbAt(j.pos, j.dist, j.up, j.lookUp) } } }, aim?.yaw ?? 0)
await wait(300)
const ev0 = (await C()).events.length
await page.evaluate(() => window.__kfbM1.mods.combat.holdFlash(1.2))
await page.keyboard.press('KeyB')
await page.evaluate((yaw) => window.__kfbM1.player().camera().rotateAzimuthTo(yaw + Math.PI - 1.15, false), aim?.yaw ?? 0) // danach Spielkamera schräg von rechts (Arm, Waffe, Blitz)
let rel = null
for (let i = 0; i < 40 && !rel; i++) { await wait(50); rel = (await C()).debug.lastRelease }
await page.screenshot({ path: 'test/out/combat/spiel_schuss.png' })
const relCard = cards.kfb_kit_gun_pistol_prototype.release.seconds
let hitC = null
for (let i = 0; i < 40 && !hitC; i++) { await wait(60); const c = await C(); hitC = c.events.find((e) => e.type === 'contact' && e.seq > ev0) || null }
await wait(40); await page.screenshot({ path: 'test/out/combat/treffer_skelett.png' })
const C1 = await C(), g1 = await page.evaluate(() => window.__kfbM1.groups().events.filter((e) => e.type === 'hit'))
const fire1 = await page.evaluate(() => window.__kfbM1.harvest().lastFire)
// D: weiter schießen (Zielwahl aus der aktuellen Lage) bis zum K.o.
let ko = null
for (let n = 0; n < 14 && !ko; n++) {
  await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), ms = M.mods.groups.debug()[0].members.filter((m) => !m.ko); if (!ms.length) return; const m = ms[0], dx = m.x - p[0], dz = m.z - p[2], l = Math.hypot(dx, dz) || 1
    M.mods.combat.fire({ from: p, dir: [dx / l, 0, dz / l] }) })
  await wait(900); ko = (await page.evaluate(() => window.__kfbM1.groups().events.find((e) => e.type === 'ko'))) || null
}
await wait(180); await page.screenshot({ path: 'test/out/combat/plopp.png' })
await wait(800)
const C2 = await C()
// E: Blaster auf den Dark Fluffer
await page.keyboard.press('Digit3'); await wait(300)
// freie Schusslinie: vom Baum des Fluffers weg (der Stamm hält das gerade Geschoss auf wie jedes andere)
await page.evaluate(() => { const M = window.__kfbM1, g = M.fluffer().debug, tr = M.mods.orchard.trees().filter((t) => t.zone === 'goblin').sort((a, b) => Math.hypot(a.pos[0] - g.x, a.pos[2] - g.z) - Math.hypot(b.pos[0] - g.x, b.pos[2] - g.z))[0]
  const a = Math.atan2(g.x - tr.pos[0], g.z - tr.pos[2]) + 0.35, x = g.x + Math.sin(a) * 6, z = g.z + Math.cos(a) * 6; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], a + Math.PI) })
await wait(1500)
const f0 = await page.evaluate(() => window.__kfbM1.fluffer().debug)
/* Härtung (Lead 22.10.): der Ghost bewegt sich (Spucken/Hüpfen) – ein einzelner Schuss traf nicht immer (E wackelte, auch vor der Leistungsarbeit).
   Bis zu 3 Versuche, jedes Mal neu auf die aktuelle Lage gezielt, wie ein Spieler nachschießt; geprüft wird weiter: Kontakt mit dem Blaster und genau eine Heilung. */
let fr = null, fc = null, tries = 0
for (; tries < 3 && !fc; tries++) {
  fr = await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), g = M.fluffer().debug, dx = g.x - p[0], dz = g.z - p[2], l = Math.hypot(dx, dz); M.player().camera().rotateAzimuthTo(Math.atan2(dx, dz) + Math.PI, false)
    return M.mods.combat.fire({ from: p, dir: [dx / l, 0, dz / l] }) })
  for (let i = 0; i < 40 && !fc; i++) { await wait(60); fc = (await C()).events.find((e) => e.type === 'contact' && e.target === 'dark_fluffer_ghost') || null }
  if (!fc) await wait(700) /* Nachladen/Abkühlen der Waffe */
}
await wait(60); await page.screenshot({ path: 'test/out/combat/treffer_fluffer.png' })
await wait(1200)
const f1 = await page.evaluate(() => window.__kfbM1.fluffer().debug), C3 = await C()
const rec = await page.evaluate(() => { const R = window.__cbRec; window.__kfbM1.clock.onStep = null; return R })
for (const [k, u] of Object.entries(rec.shots)) savePng(`test/out/combat/${k}.png`, u)
rec.shots = Object.keys(rec.shots); rec.pend = rec.pend.length
await browser.close()

const pc = cards.kfb_kit_gun_pistol_prototype, bc = cards.kfb_kit_heroman_blaster, W = Object.fromEntries(A.status.weapons.map((w) => [w.id, w]))
const types = new Set(C3.events.map((e) => e.type)), schemaOk = C3.events.every((e) => typeof e.seq === 'number' && e.side === 'player' && typeof e.weapon === 'string' && e.position && Number.isFinite(e.position.x) && typeof e.id === 'string')
const seqUp = C3.events.every((e, i, a) => !i || e.seq > a[i - 1].seq)
const qd = (a, b) => Math.abs(Math.abs(a.reduce((s, v, i) => s + v * b[i], 0)) - 1)
const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
process.exit(report('combat (Kampf R1: K10-Waffen im Spiel)', {
  A_weaponsLoadedShaAudit: A.status.status === 'OK' && W.pistol?.status === 'OK' && W.blaster?.status === 'OK' && W.pistol.sha === pc.source.sha256 && W.blaster.sha === bc.source.sha256 && W.pistol.audit === 'CONTRACT_PASS' && W.blaster.audit === 'CONTRACT_PASS',
  A_muzzleFlashSources: A.status.flash === 'OK',
  A_bagHasWeapons: A.weapons.filter((w) => w.status === 'OK').length === 2 && bagShots.length === 2 && bagShots.every((w) => w.shot),
  B_digitKeysSwitch: B2.active === 'pistol' && B1.active === null && B3.active === 'blaster' && hud2.bar === 'blaster' && hud1 === 'fist' && hud3 === 'blaster' && hud2.bag === 'pistol',
  B_mountAtHandFixed: !!B2.debug.mount && B2.debug.mount.slotToWeapon < 1e-3 && B2.debug.mount.handToWeapon < 0.12 && qd(B2.debug.mount.mountQuat, pc.mount.slotOffset.rotation) < 1e-5 &&
    !!B3.debug.mount && d3(B3.debug.mount.mountPos, bc.mount.slotOffset.position) < 1e-6 && B3.debug.mount.handToWeapon < 0.15,
  B_oneWeaponInHand: hand2.k10.length === 1 && hand2.heal.every((v) => v === false) && hand1.k10.length === 0 && hand1.heal.every((v) => v === true),
  B_bagClickEquips: Bbag.active === 'pistol' && hudBag.bag === 'pistol' && hudBag.bar === 'blaster',
  C_keyBFiresAtSkeleton: !!aim && fire1?.ok === true && /^group:/.test(fire1?.target || ''),
  C_clipOnPlayerMixer: (rec.overlays.Ranged_1H_Shoot || 0) > 5,
  C_releaseAtMarker: !!rel && rel.clipTime >= relCard - 1e-6 && rel.clipTime <= relCard + 1 / 30 + 1e-6,
  C_projectileFromMuzzle: !!rel && d3(rel.proj, rel.muzzle) < 1e-3 && Math.abs(rel.dir[1]) < 0.2,
  C_drawnAtMuzzle: !!rel && rel.drawnGap != null && rel.drawnGap < 1e-3, // Kritiker R3 #23: im Abgangsbild steht das Geschoss an der Mündung, nicht 34 m/s · dt davor
  C_muzzleFlashVisible: !!rel && rel.flashOn === 1 && rec.flashSteps > 0,
  C_hitSkeleton: !!hitC && /^group:/.test(hitC.target) && hitC.confirmed === true && g1.some((e) => 'group:' + e.id === hitC.target),
  C_hitStop: C1.status.hitStops >= 1 && C1.status.frozenMs > 30 && C1.status.knetHits >= 1,
  D_koPlopp: !!ko && C2.status.pops >= 1 && C2.events.some((e) => e.type === 'kill' && e.target === 'group:' + ko.id),
  E_blasterHealsFluffer: fr?.ok === true && !!fc && fc.weapon === 'blaster' && !f0.healed && f1.healed === true && f1.heals >= 1,
  F_k10EventsRing: types.has('fire') && types.has('contact') && types.has('kill') && schemaOk && seqUp && C3.events.length <= 64,
  F_costPerFrame: C3.status.ms !== null && C3.status.ms <= 0.3,
  F_noPageErrors: errs.length === 0,
}, { A: A.status, B: { B2: B2.debug.mount, B3: B3.debug.mount, hud2, hud1, hud3, hand2, hand1, hudBag, bagShots }, aim, fire1, rel, hitC, g1: g1.slice(-3), C1: C1.status, ko, C2: { pops: C2.status.pops, kills: C2.status.kills }, fr, fc, tries, lastContact: C3.debug.lastContact, f0: { healed: f0.healed, phase: f0.phase }, f1: { healed: f1.healed, heals: f1.heals }, rec, evTypes: [...types], nEv: C3.events.length, ms: C3.status.ms, errs: errs.slice(0, 3) }))
