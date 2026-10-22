// WS-Audio R1 (V-598) · Abnahme-Videos mit Ton, headless (kein sichtbares Fenster): gespielte Abschnitte mit echter Tastatur-Eingabe, Bild = Spiel-Canvas,
// Ton = Ausgang des einen Mixers (gleicher AudioContext), danach in einem eigenen Tab zu EINEM Video zusammengesetzt (Einblendung je Abschnitt und je Marke).
// Profile:
//   abnahme  1 · Fahrt + Flug (car,fly) · 2 · Zu Fuß                                     → kfb-audio-r1.webm
//   kampf    1 · Kampf am Obstgarten (V/B/N, Saugarm) · 2 · Hörprobe Arena-Waffen (K10-Adapter, Ereignisse per Prüfskript – die Arena ist noch
//            nicht im Spiel, das steht im Bild) · 3 · Fahrt am Boden (Untergrund, Drift, Bremse)                → kfb-audio-kampf.mp4 (Handy)
//   gruppen  NPC-Gruppen (Skelette, Bots, Spielzeugsoldaten) und Dark Fluffer – nur in einer lokalen Vorschau-Kombination mit ws-npc/phase-a → kfb-audio-gruppen.mp4
// Aufruf: PW_GPU=1 node scripts/audio/record.mjs [abnahme|kampf|gruppen|heilen|mvp|neu] → test/out/audio/ (privat: enthält Musik und gekaufte Töne!)
import fs from 'fs'
import path from 'path'
import { startServer, openAudioPage } from '../../test/_audioServer.mjs'

const PROFILE = process.argv[2] || 'abnahme', OUT = 'test/out/audio'
fs.mkdirSync(OUT, { recursive: true })
const srv = await startServer()
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const tap = async (page, k, ms = 90) => { await page.keyboard.down(k); await wait(ms); await page.keyboard.up(k) }
const hold = async (page, k, ms) => { await page.keyboard.down(k); await wait(ms); await page.keyboard.up(k) }
// Datenstück → base64 (nach „base64,“; der MIME-Typ enthält selbst ein Komma)
const SEND = "(e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((res) => { const fr = new FileReader(); fr.onload = () => { window.__kfbRecChunk(fr.result.slice(fr.result.indexOf('base64,') + 7)).then(res) }; fr.readAsDataURL(e.data) })) }"

async function recordSegment(name, hash, seconds, script) {
  const { browser, page, errs } = await openAudioPage(srv.url, hash + ',debug')
  const file = path.join(OUT, `seg-${name}.webm`); const fd = fs.openSync(file, 'w')
  await page.exposeFunction('__kfbRecChunk', (b64) => { fs.writeSync(fd, Buffer.from(b64, 'base64')) })
  await page.waitForFunction(() => window.__kfbM1?.status?.().amphTris > 0 && window.__kfbM1?.status?.().ready?.player === 'OK', null, { timeout: 180000 }).catch(() => {})
  await wait(2500)
  await page.keyboard.press('KeyM'); await page.keyboard.press('KeyM') // erste Eingabe (M = Fahrhilfe an/aus, zweimal = unverändert); zu Fuß ohne Wirkung
  await page.waitForFunction(() => { const s = window.__kfbAudio?.stats?.(), m = s?.modules; return m && m.racer && m.combat && m.ambience && m.steps && m.music && s.loads.bank }, null, { timeout: 180000 })
  await wait(1500)
  await page.evaluate((SEND) => {
    const c = document.querySelector('canvas'), v = c.captureStream(30), a = window.__kfbAudio.capture()
    const st = new MediaStream([...v.getVideoTracks(), ...a.getAudioTracks()])
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m))
    const r = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: 3_000_000, audioBitsPerSecond: 160_000 }); let chain = Promise.resolve()
    r.ondataavailable = eval(SEND)
    window.__kfbRec = { stop: () => new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }) }; r.start(1000) }, SEND)
  const t0 = Date.now(), at = (s) => wait(Math.max(0, t0 + s * 1000 - Date.now())), samples = [], marks = []
  const mark = (text) => marks.push({ t: +((Date.now() - t0) / 1000).toFixed(2), text })
  const sample = async () => { const s = await page.evaluate(() => { const a = window.__kfbAudio.stats(); return { mode: a.mode2, list: a.nowPlaying?.list, outDb: a.outDb, voices: a.voices.total, avgMs: a.perf.avgMs, p95Ms: a.perf.p95Ms, racer: a.racer, duck: a.duckDb, steps: a.steps, biome: a.biome, drive: a.drive } }); samples.push({ s: +((Date.now() - t0) / 1000).toFixed(1), ...s }) }
  const ticker = setInterval(() => sample().catch(() => {}), 2000)
  try { await script(page, at, mark) } finally { clearInterval(ticker) }
  await at(seconds); await sample()
  await page.evaluate(() => window.__kfbRec.stop()); fs.closeSync(fd)
  const final = await page.evaluate(() => { const a = window.__kfbAudio.stats(); return { perf: a.perf, voices: a.voices, loads: a.loads, errors: a.errors, music: a.music, bank: a.bank, steps: a.steps, drive: a.drive, events: a.events.map((e) => e.type + ':' + (e.e || e.kind || e.list || '') + (e.w ? '/' + e.w : '') + (e.hit ? '+' : '')) } })
  await browser.close()
  return { name, file, url: '/' + file, bytes: fs.statSync(file).size, errs, marks, samples, final }
}

// Obstgarten: neben Baum i stellen, Blick auf den Baum (+X), dann Aktionen
const toTree = (page, i, dx = -3.2) => page.evaluate(({ i, dx }) => { const M = window.__kfbM1, t = M.mods.orchard?.trees?.()[i]; if (!t) return false; const P = M.player(), y = M.terrainH(t.pos[0] + dx, t.pos[2]) + 1.2; P.teleport([t.pos[0] + dx, y, t.pos[2]], Math.PI / 2); return true }, { i, dx })
const SEGMENTS = {
  abnahme: [
    ['drive', '#m1,harvest,look=terrain3,world=probe,car,fly', 60, 'KFB Ton R1 · Fahrt + Flug · Motor, Boost, Flug, Suno-Jukebox', async (page, at) => {
      await page.keyboard.down('KeyW'); await at(3); await hold(page, 'KeyA', 700); await at(6); await hold(page, 'ShiftLeft', 1400); await at(9); await tap(page, 'Space')
      await at(12); await hold(page, 'KeyD', 800); await hold(page, 'KeyQ', 1400); await at(16); await page.keyboard.up('KeyW'); await at(18.5); await page.keyboard.down('KeyW')
      await at(21); await tap(page, 'Space'); await wait(160); await tap(page, 'Space'); await at(23); await page.keyboard.down('ArrowUp'); await at(26); await page.keyboard.up('ArrowUp')
      await at(28); await hold(page, 'ShiftLeft', 1500); await at(31); await hold(page, 'KeyA', 1200); await at(35); await page.keyboard.down('ArrowDown'); await at(38); await page.keyboard.up('ArrowDown')
      await at(41); await hold(page, 'KeyD', 1200); await at(45); await hold(page, 'ShiftLeft', 1200); await at(48); await page.keyboard.up('KeyW'); await hold(page, 'KeyS', 1800); await page.keyboard.down('KeyW')
      await at(52); await hold(page, 'KeyE', 1300); await at(55); await tap(page, 'Space'); await at(59); await page.keyboard.up('KeyW') }],
    ['foot', '#m1,harvest,look=terrain3,world=probe', 60, 'KFB Ton R1 · Zu Fuß · Schritte, Atmo, Wasser, Kampf, Saugarm, Cozy Tunes', async (page, at) => {
      await toTree(page, 0); await at(1); await hold(page, 'KeyS', 1600); await hold(page, 'KeyW', 1500)
      await at(5); await tap(page, 'KeyV'); await at(6.2); await tap(page, 'KeyV'); await at(7.5); await tap(page, 'KeyB'); await at(9); await tap(page, 'KeyB')
      await at(11); await tap(page, 'KeyT'); await at(14); await tap(page, 'KeyN'); await at(16.5); await tap(page, 'KeyT')
      await at(19); await page.keyboard.down('KeyW'); await at(21); await tap(page, 'Space'); await at(24); await hold(page, 'KeyA', 900); await at(27); await page.keyboard.up('KeyW')
      await at(28); await tap(page, 'Space'); await wait(150); await tap(page, 'Space'); await page.keyboard.down('KeyW'); await at(36); await hold(page, 'KeyD', 1000); await at(40); await page.keyboard.down('KeyX'); await at(45); await page.keyboard.up('KeyX'); await page.keyboard.up('KeyW')
      await at(47); await page.keyboard.down('KeyW'); await at(50); await hold(page, 'KeyA', 1200); await at(53); await tap(page, 'Space'); await at(57); await page.keyboard.up('KeyW') }],
  ],
  kampf: [
    ['kampf', '#m1,harvest,look=terrain3,world=probe', 46, 'KFB Kampf-Ton · Obstgarten: V Faust · B Blaster · N Explosion · T Saugarm', async (page, at, mark) => {
      for (const [i, t0] of [[0, 0.5], [3, 15.5], [6, 30.5]]) { await at(t0); await toTree(page, i); await at(t0 + 1.5)
        mark('V · Faust'); await tap(page, 'KeyV'); await at(t0 + 3); await tap(page, 'KeyV'); await at(t0 + 4.5)
        mark('B · Blaster'); await tap(page, 'KeyB'); await at(t0 + 5.7); await tap(page, 'KeyB'); await at(t0 + 7.2)
        mark('T · Saugarm'); await tap(page, 'KeyT'); await at(t0 + 9.5)
        mark('N · Explosion'); await tap(page, 'KeyN'); await at(t0 + 12)
        await hold(page, 'KeyS', 900) } }],
    ['arena', '#m1,harvest,look=terrain3,world=probe', 34, 'Hörprobe Arena-Waffen (Kampf-Tabelle Combat-AV) · per Prüfskript – Arena noch nicht im Spiel', async (page, at, mark) => {
      await toTree(page, 1, -6)
      const shot = (o) => page.evaluate((o) => { const M = window.__kfbM1, p = M.feet(), pos = o.far ? { x: p[0] + 9, y: p[1] + 1, z: p[2] - 7 } : { x: p[0] + 0.4, y: p[1] + 1.3, z: p[2] }; const { far, ...e } = o; return !!window.__kfbAudio.k10({ ...e, position: pos }) }, o)
      const seq = [['Pistole', { type: 'fire', weapon: 'pistol' }], ['Blaster', { type: 'fire', weapon: 'blaster' }], ['Gewehr', { type: 'fire', weapon: 'action-rifle' }], ['Armbrust (Platzhalter)', { type: 'fire', weapon: 'crossbow' }],
        ['Bogen (Platzhalter)', { type: 'fire', weapon: 'bow' }], ['Zauberstab (Platzhalter)', { type: 'fire', weapon: 'wand' }], ['Klinge: Schwung + Treffer', { type: 'contact', weapon: 'blade', confirmed: true }],
        ['Bombe: Wurf + Zünder', { type: 'release', weapon: 'bomb' }], ['Treffer Metall · Glas · Lehm', null], ['Gegnerwurf (leiser)', { type: 'fire', weapon: 'pistol', side: 'enemy', far: true }], ['Rauchbombe', { type: 'contact', weapon: 'smoke' }], ['Waffe fällt', { type: 'weaponDrop' }]]
      let t = 1
      for (const [label, ev] of seq) { await at(t); mark(label)
        if (ev) { await shot(ev); await wait(500); if (ev.type === 'fire' && !ev.far) await shot(ev) }
        else for (const m of ['metal', 'glass', 'clay']) { await shot({ type: 'contact', weapon: 'pistol', material: m, confirmed: true }); await wait(600) }
        t += 2.2 }
      await at(t); mark('Gatling-Feuerstoß'); for (let i = 0; i < 26; i++) { await shot({ type: 'fire', weapon: 'gatling' }); await wait(55) }
      await at(t + 3.5); mark('Explosion mit Trümmer-Ausklang'); await shot({ type: 'contact', explosive: true, energy: 0.8, material: 'clay' }) }],
    ['fahrt', '#m1,harvest,look=terrain3,world=probe,car', 36, 'KFB Fahr-Ton · Untergrund · Drift · Bremse (WS0-Lieferung)', async (page, at, mark) => {
      await page.keyboard.down('KeyW'); await at(4); mark('Drift (Q)'); await hold(page, 'KeyQ', 1800); await at(8); mark('Bremsen'); await page.keyboard.up('KeyW'); await hold(page, 'KeyS', 1500); await page.keyboard.down('KeyW')
      await at(13); await hold(page, 'KeyA', 1200); await at(16); mark('Drift (E)'); await hold(page, 'KeyE', 2000); await at(20); mark('Boost'); await hold(page, 'ShiftLeft', 1300)
      await at(24); await hold(page, 'KeyD', 1500); await at(27); mark('Drift + Bremsen'); await hold(page, 'KeyQ', 1500); await page.keyboard.up('KeyW'); await hold(page, 'KeyS', 1400); await page.keyboard.down('KeyW'); await at(35); await page.keyboard.up('KeyW') }],
  ],
  // Gruppen-Ton: nur in einer lokalen Vorschau-Kombination (terrain/probe-world + ws-npc/phase-a + ws-audio/r1, nicht gemergt). Welt = M1-Standard,
  // weil WS-NPC die Orte nur dort geprüft hat. Treffer mit echter Taste B nach Blick aufs Ziel (Teleport mit Blickrichtung); Ablauf je Gruppe:
  // Treffer 1 → hit n=1 + Fluff, 2 → hit n=2, 3 → Wut, 4 → K.o. (+ Sterne), 10 s später Aufstehen
  gruppen: [
    ['gruppen', '#m1,harvest,look=terrain3,npc,fluffer,patrol,band,fluffert=60', 98, 'KFB Gruppen-Ton · Vorschau-Kombination (Gelände + NPC + Ton, noch nicht gemergt)', async (page, at, mark) => {
      // Ziel: erstes stehendes Mitglied der Gruppe; Figur 5 m davor, Blick aufs Ziel; dann B
      const aim = (gid, dist = 5) => page.evaluate(({ gid, dist }) => { const M = window.__kfbM1, G = M.groups?.()?.debug?.find((g) => g.id === gid); const m = G?.members?.find((x) => !x.down && !x.ko && x.state !== 'ko') || G?.members?.[0]; if (!m) return null
        const p = M.feet(), dx = m.x - p[0], dz = m.z - p[2], l = Math.hypot(dx, dz) || 1, x = m.x - dx / l * dist, z = m.z - dz / l * dist, y = M.terrainH(x, z) + 1.2
        M.player().teleport([x, y, z], Math.atan2(m.x - x, m.z - z)); return { id: m.id, x: m.x, z: m.z } }, { gid, dist })
      // je Schuss: was wirklich passiert ist (neue Gruppen-Ereignisse) wird eingeblendet – kein Ergebnis = daneben
      const NAME = { hit: 'Treffer', aggro: 'Wut', ko: 'K.o.', awake: 'Aufstehen', calm: 'Beruhigen' }
      const evs = () => page.evaluate(() => (window.__kfbM1.groups?.()?.events || []).map((e) => e.group + '|' + e.type + '|' + e.id + '|' + e.t + '|' + (e.n || '')))
      const fight = async (gid, t0, label, shots = 6) => { await at(t0); mark(label); await aim(gid); await wait(1800)
        for (let k = 0; k < shots; k++) { await at(t0 + 2.2 + k * 2.6); await aim(gid); await wait(900); const before = new Set(await evs()); await tap(page, 'KeyB'); await wait(700)
          const fresh = (await evs()).filter((e) => !before.has(e) && e.startsWith(gid)).map((e) => e.split('|')).filter(([, t]) => NAME[t]).map(([, t, , , n]) => NAME[t] + (t === 'hit' && n ? ' ' + n : ''))
          mark(label + ' · ' + (fresh.length ? [...new Set(fresh)].join(' + ') : 'daneben')) } }
      await fight('skeleton_patrol', 0.5, 'Skelette')
      await fight('bot_crew', 19, 'Bots')
      // Spielzeugsoldaten erscheinen über die Begegnungstabelle: Zone m1-east betreten, kurz wegschauen, dann hinschauen
      await at(37.5); await page.evaluate(() => { const M = window.__kfbM1, y = M.terrainH(30, 14) + 1.2; M.player().teleport([30, y, 14], Math.PI) }); await at(40); await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(); M.player().teleport([p[0], p[1] + 0.2, p[2]], 0.6) })
      await fight('toy_squad', 42, 'Spielzeugsoldaten')
      // Dark Fluffer (Start fluffert=70 Weltsekunden): hinstellen, zusehen (Ausholen, Spucken, Fleck), dann heilen (Schuss)
      await at(61); mark('Dark Fluffer'); const fl = () => page.evaluate(() => { const M = window.__kfbM1, d = M.fluffer?.()?.debug; if (!d) return null; const p = M.feet(), dx = d.x - p[0], dz = d.z - p[2], l = Math.hypot(dx, dz) || 1, x = d.x - dx / l * 6, z = d.z - dz / l * 6
        M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(d.x - x, d.z - z)); return { phase: d.phase, x: d.x, z: d.z } })
      for (let t = 61; t < 84; t += 4) { await at(t); await fl() }
      await at(84); mark('Dark Fluffer · heilen'); await fl(); await wait(350); await tap(page, 'KeyB'); await wait(900); await fl(); await tap(page, 'KeyB')
      await at(92); mark('Fluff einsammeln: T'); await tap(page, 'KeyT') }],
  ],
  // Heilen des Dark Fluffers (WS-NPC-Hinweis 21.10.): warten bis feindlich, 2,8 m davor auf der vom Goblin-Hain [-26, 46] abgewandten Seite, Taste B;
  // Erfolg = Ereignis healed (dann Augen-Plopp, Quietschen, bunter Fluff), sonst bis zu 4 Versuche
  heilen: [
    ['heilen', '#m1,harvest,look=terrain3,npc,fluffer,patrol,band,fluffert=4', 30, 'KFB Gruppen-Ton · Dark Fluffer heilen · Vorschau-Kombination (noch nicht gemergt)', async (page, at, mark) => {
      const st = () => page.evaluate(() => { const d = window.__kfbM1.fluffer?.()?.debug; return d ? { hostile: d.hostile, healed: d.healed, phase: d.phase, ev: (d.events || []).map((e) => e.type) } : null })
      const place = () => page.evaluate(() => { const M = window.__kfbM1, g = M.fluffer().debug, ax = g.x + 26, az = g.z - 46, n = Math.hypot(ax, az) || 1, px = g.x + ax / n * 2.8, pz = g.z + az / n * 2.8
        const want = Math.atan2(g.x - px, g.z - pz); M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], want)
        const cc = M.player().camera(); if (cc?.rotateAzimuthTo) cc.rotateAzimuthTo(want + Math.PI, false) }) // B zielt in Kamerarichtung: Kamera mitdrehen (Teleport dreht nur die Figur)
      for (let i = 0; i < 40; i++) { const s = await st(); if (s?.hostile) break; await wait(250) }
      await place(); mark('Dark Fluffer ist feindlich')
      for (let t = 1; t < 7; t += 1.5) { await at(t); await place() }
      await at(7); mark('heilen (B)')
      for (let k = 0; k < 4; k++) { await place(); await wait(700); await tap(page, 'KeyB'); await wait(1700); const s = await st(); if (s?.healed) { mark('geheilt: Verwandlung · Augen-Plopp · Quietschen · bunter Fluff'); break } mark('daneben, noch einmal') }
      await wait(4000); mark('Fluff einsammeln: T'); await tap(page, 'KeyT') }],
  ],
  // Hörprobe für die Abnahme von ws1/mvp-r1 (V-618, ein Spiel-Branch): Fahrt/Flug auf world=probe, dann zu Fuß mit NPCs (Skelette, Dorf, Schritte, Fluffer).
  // NPC-Welt per Umgebungsvariable KFB_NPC_WORLD (Standard probe; 'm1' = Standard-Welt, falls die NPC-Orte auf dem Probe-Gelände schlecht stehen)
  mvp: [
    ['mvp-fahrt', '#m1,harvest,look=terrain3,world=probe,car,fly', 34, 'ws1/mvp-r1 · Fahrt + Flug (Motor, Untergrund, Drift, Suno)', async (page, at, mark) => {
      await page.keyboard.down('KeyW'); await at(4); mark('Drift'); await hold(page, 'KeyQ', 1600); await at(8); mark('Boost'); await hold(page, 'ShiftLeft', 1300)
      await at(12); mark('Bremsen'); await page.keyboard.up('KeyW'); await hold(page, 'KeyS', 1300); await page.keyboard.down('KeyW'); await at(16); mark('Sprung / Flug'); await tap(page, 'Space'); await wait(160); await tap(page, 'Space')
      await at(19); await page.keyboard.down('ArrowUp'); await at(23); await page.keyboard.up('ArrowUp'); await at(26); await hold(page, 'KeyA', 1200); await at(33); await page.keyboard.up('KeyW') }],
    ['mvp-fuss', '#m1,harvest,look=terrain3,npc,fluffer,patrol,band,fluffert=4' + (process.env.KFB_NPC_WORLD === 'm1' ? '' : ',world=probe'), 50, 'ws1/mvp-r1 · Zu Fuß: Skelette, Dorf, Schritte, Dark Fluffer, Cozy Tunes', async (page, at, mark) => {
      const go = (fn) => page.evaluate(fn)
      const skel = () => go(() => { const M = window.__kfbM1, m = M.groups?.()?.debug?.find((g) => g.id === 'skeleton_patrol')?.members?.find((x) => !x.ko); if (!m) return; const p = M.feet(), dx = m.x - p[0], dz = m.z - p[2], l = Math.hypot(dx, dz) || 1, x = m.x - dx / l * 5, z = m.z - dz / l * 5, w = Math.atan2(m.x - x, m.z - z)
        M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) })
      await at(0.5); mark('Skelette gehen vorbei (Schritte)'); for (let t = 0.5; t < 8; t += 1.5) { await at(t); await skel() }
      for (const [k, txt] of [[0, 'Treffer'], [1, 'Treffer'], [2, 'Wut'], [3, 'K.o.']]) { await at(8 + k * 2.4); await skel(); await wait(500); mark('Skelette · ' + txt); await tap(page, 'KeyB') }
      await at(19); mark('Dorf (Bewohner-Schritte, Band)'); await go(() => { const M = window.__kfbM1; M.player().teleport([-8, M.terrainH(-8, 24) + 1.2, 24], 0) })
      const fl = () => go(() => { const M = window.__kfbM1, g = M.fluffer?.()?.debug; if (!g) return; const ax = g.x + 26, az = g.z - 46, n = Math.hypot(ax, az) || 1, px = g.x + ax / n * 2.8, pz = g.z + az / n * 2.8, w = Math.atan2(g.x - px, g.z - pz)
        M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) })
      await at(29); mark('Dark Fluffer (Hüpfer, Spucken)'); for (let t = 29; t < 40; t += 2) { await at(t); await fl() }
      await at(40); mark('Dark Fluffer heilen'); await fl(); await wait(600); await tap(page, 'KeyB'); await at(46); mark('Fluff einsammeln'); await tap(page, 'KeyT') }],
  ],
  // Neue WS0-Töne (22.10.): Combat-AV L1–L13 als Hörprobe (K10 per Prüfskript, Arena noch nicht im Spiel) + NPCs echt gespielt (npc_steps_r1)
  neu: [
    ['neu-arena', '#m1,harvest,look=terrain3,world=probe', 40, 'Neue Kampf-Töne (WS0 L1–L13) · Hörprobe per Prüfskript – Arena noch nicht im Spiel', async (page, at, mark) => {
      await toTree(page, 1, -6)
      const k = (o) => page.evaluate((o) => { const M = window.__kfbM1, p = M.feet(), pos = o.far ? { x: p[0] + 8, y: p[1] + 1, z: p[2] - 6 } : { x: p[0] + 0.6, y: p[1] + 1.3, z: p[2] }; const { far, ...e } = o; return !!window.__kfbAudio.k10({ ...e, position: pos }) }, o)
      const seq = [['Bogen (L1) → Pfeil-Treffer (L3)', [{ type: 'fire', weapon: 'bow' }, { type: 'contact', weapon: 'bow', confirmed: true, far: true }]], ['Armbrust (L2) → Treffer', [{ type: 'fire', weapon: 'crossbow' }, { type: 'contact', weapon: 'crossbow', confirmed: true, far: true }]],
        ['Zauber (L4) → Zauber-Treffer (L5)', [{ type: 'fire', weapon: 'wand' }, { type: 'contact', weapon: 'wand', confirmed: true, far: true }]], ['Würfel schnipsen (L6)', [{ type: 'fire', weapon: 'dice' }]],
        ['Gegner holt aus (L13) → Wurf', [{ type: 'windup', side: 'enemy', far: true }, { type: 'fire', side: 'enemy', far: true }]], ['Du wirst getroffen: Bonk (L8)', [{ type: 'contact', target: 'player' }]],
        ['Monster-Biss (L7)', [{ type: 'contact', target: 'player', weapon: 'bite' }]], ['Schild-Block', [{ type: 'block' }]], ['Gegner besiegt: Kill-Pop + Schädel (L9)', [{ type: 'kill', far: true }]],
        ['Rauchbombe (L12)', [{ type: 'contact', weapon: 'smoke', far: true }]], ['Waffe fällt (L10)', [{ type: 'weaponDrop' }]]]
      let t = 1
      for (const [label, evs] of seq) { await at(t); mark(label); for (const e of evs) { await k(e); await wait(650) } t += 2.7 }
      await at(t); mark('Gatling: Anlauf → Drehen → Auslauf (L11)'); for (let i = 0; i < 30; i++) { await k({ type: 'fire', weapon: 'gatling' }); await wait(55) } }],
    ['neu-npc', '#m1,harvest,look=terrain3,world=probe,npc,fluffer,patrol,band,fluffert=4', 86, 'Neue NPC-Töne (WS0 npc_steps_r1) · echt gespielt auf ws1/mvp-r1', async (page, at, mark) => {
      const look = (fn, dist) => page.evaluate(({ fn, dist }) => { const M = window.__kfbM1, q = new Function('M', fn)(M); if (!q) return null; const p = M.feet(), dx = q.x - p[0], dz = q.z - p[2], l = Math.hypot(dx, dz) || 1, x = q.x - dx / l * dist, z = q.z - dz / l * dist, w = Math.atan2(q.x - x, q.z - z)
        M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false); return q }, { fn, dist })
      const member = (gid) => `const G = M.groups?.()?.debug?.find((g) => g.id === '${gid}'); const m = G?.members?.find((x) => !x.ko) || G?.members?.[0]; return m ? { x: m.x, z: m.z } : null`
      const shoot = async (gid, n, label) => { for (let i = 0; i < n; i++) { await look(member(gid), 5); await wait(700); await tap(page, 'KeyB'); await wait(1500) } }
      // Spielzeugsoldaten: Zone betreten, kurz wegschauen, dann hinschauen (Begegnungstabelle), Marschtritt + Aufziehschlüssel, dann Pfiff (Wut) und Rappeln
      await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([30, M.terrainH(30, 14) + 1.2, 14], Math.PI) }); await at(2.5)
      mark('Spielzeugsoldaten: Marschtritt + Aufziehschlüssel'); for (let t = 2.5; t < 9; t += 1.5) { await at(t); await look(member('toy_squad'), 6) }
      await at(9); mark('Spielzeugsoldaten: Treffer → Pfiff (Wut) → K.o.'); await shoot('toy_squad', 4)
      await at(25); mark('Bots: Metall-Stapfen, Zorn-Piepen (N10), K.o.'); for (let t = 25; t < 29; t += 1.5) { await at(t); await look(member('bot_crew'), 6) } await shoot('bot_crew', 4)
      await at(46); mark('Skelette: Knochen-Tock, K.o. = Knochen-Zerfall (N12)'); await shoot('skeleton_patrol', 4)
      await at(63); mark('Dark Fluffer: Goo-Gleiten zwischen den Hüpfern (N08)'); const fl = 'const g = M.fluffer?.()?.debug; return g ? { x: g.x, z: g.z } : null'
      for (let t = 63; t < 72; t += 1.5) { await at(t); await look(fl, 3) }
      await at(72); mark('heilen → heller Hüpfer (N09)'); await look(fl, 2.8); await wait(600); await tap(page, 'KeyB'); for (let t = 74; t < 80; t += 1.5) { await at(t); await look(fl, 3.5) }
      await at(80); mark('Band mit Publikum (N15)'); await page.evaluate(() => { const M = window.__kfbM1, P = M.mods.band?.positions?.() || [], c = P.length ? { x: P.reduce((s, p) => s + p.x, 0) / P.length, z: P.reduce((s, p) => s + p.z, 0) / P.length } : { x: -8, z: 30 }, x = c.x - 9, z = c.z, w = Math.atan2(c.x - x, c.z - z); M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) }) }],
  ],
}[PROFILE]
if (!SEGMENTS) throw new Error('Profil unbekannt: ' + PROFILE)
const segs = []
for (const [name, hash, seconds, label, script] of SEGMENTS) segs.push({ ...(await recordSegment(name, hash, seconds, script)), label })

// Zusammensetzen: Abschnitte nacheinander abspielen, Bild über Canvas mit Einblendungen, Ton über einen MediaStream, Pegel je Abschnitt messen
fs.writeFileSync(path.join(OUT, 'stitch.html'), '<!doctype html><meta charset=utf-8><title>stitch</title><body style="margin:0;background:#000"></body>') // gleicher Ursprung (sonst stummes MediaElement)
const small = ['kampf', 'gruppen', 'heilen', 'mvp', 'neu'].includes(PROFILE), W = small ? 960 : 1280, H = small ? 540 : 720
const { browser, page, errs } = await openAudioPage(srv.url, 'test/out/audio/stitch.html')
const outFile = path.join(OUT, { kampf: 'kfb-audio-kampf.mp4', gruppen: 'kfb-audio-gruppen.mp4', heilen: 'kfb-audio-heilen.mp4', mvp: 'kfb-audio-mvp.mp4', neu: 'kfb-audio-neu.mp4' }[PROFILE] || 'kfb-audio-r1.webm'), fd = fs.openSync(outFile, 'w')
await page.exposeFunction('__kfbRecChunk', (b64) => { fs.writeSync(fd, Buffer.from(b64, 'base64')) })
const levels = await page.evaluate(async ({ segs, W, H, mime, vbr, SEND }) => {
  document.body.innerHTML = ''; const c = document.createElement('canvas'); c.width = W; c.height = H; document.body.append(c); const g = c.getContext('2d'), u = W / 1280
  const ac = new AudioContext(), dest = ac.createMediaStreamDestination(), an = ac.createAnalyser(); an.fftSize = 2048; const pcm = new Float32Array(2048)
  const st = new MediaStream([...c.captureStream(30).getVideoTracks(), ...dest.stream.getAudioTracks()])
  const r = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: vbr, audioBitsPerSecond: 160_000 }); let chain = Promise.resolve()
  r.ondataavailable = eval(SEND)
  const box = (text, y, size) => { g.font = `600 ${Math.round(size * u)}px system-ui`; const w = g.measureText(text).width; g.fillStyle = 'rgba(30,22,14,.74)'; g.fillRect(24 * u, y - size * 1.25 * u, w + 32 * u, size * 1.75 * u); g.fillStyle = '#f4e7cf'; g.fillText(text, 40 * u, y) }
  r.start(1000); const out = []
  for (const s of segs) {
    const v = document.createElement('video'); v.src = s.url; await new Promise((res, rej) => { v.oncanplay = res; v.onerror = () => rej(new Error('Abschnitt nicht lesbar: ' + s.url)); setTimeout(() => rej(new Error('Abschnitt lädt nicht: ' + s.url)), 20000); v.load() })
    const src = ac.createMediaElementSource(v); src.connect(dest); src.connect(an); let sum = 0, n = 0, loud = 0
    await v.play()
    await new Promise((res) => { const draw = () => { g.drawImage(v, 0, 0, W, H); const k = v.currentTime
        if (k < 4.5) box(s.label, 64 * u, 24)
        const m = [...(s.marks || [])].reverse().find((x) => k >= x.t && k < x.t + 2.1); if (m) box(m.text, H - 40 * u, 30)
        an.getFloatTimeDomainData(pcm); let q = 0; for (const x of pcm) q += x * x; const rms = Math.sqrt(q / pcm.length); sum += rms; n++; if (rms > 0.003) loud++
        if (v.ended) return res(); requestAnimationFrame(draw) }; draw() })
    src.disconnect(); out.push({ label: s.label, meanRms: +(sum / Math.max(1, n)).toFixed(4), audibleShare: +(loud / Math.max(1, n)).toFixed(3) })
  }
  await new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }); return out
}, { segs: segs.map(({ url, label, marks }) => ({ url, label, marks })), W, H, mime: small ? 'video/mp4;codecs=avc1.42E01E,mp4a.40.2' : 'video/webm;codecs=vp9,opus', vbr: small ? 1_300_000 : 3_000_000, SEND })
fs.closeSync(fd); await browser.close(); srv.stop()
const report = { at: new Date().toISOString(), profile: PROFILE, out: outFile, bytes: fs.statSync(outFile).size, levels, stitchErrs: errs, segments: segs.map(({ samples, ...x }) => ({ ...x, samples })) }
fs.writeFileSync(path.join(OUT, `record-report-${PROFILE}.json`), JSON.stringify(report, null, 1))
console.log(JSON.stringify({ out: outFile, mb: +(report.bytes / 1048576).toFixed(1), levels, segs: segs.map((s) => ({ name: s.name, errs: s.errs, perf: s.final.perf, voices: s.final.voices.total, errors: s.final.errors, drive: s.final.drive })) }))
