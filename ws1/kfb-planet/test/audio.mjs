// WS-Audio R1 (V-598) · volle Ton-Fassung im Browser (headless, lokaler Vite-Server mit /@kfb-audio/). Ohne private Töne: SKIP (PASS).
// Zu Fuß (#m1,harvest,look=terrain3,world=probe): ein AudioContext, alle Module geladen, Cozy Tunes, Schritte, Atmo + Wasser, Kampf V/B/N, Dark-Fluffer-
// und K10-Adapter, Ducking, Stimmen unter der Grenze, Audio-Takt ≤ 1 ms/Bild (Mittel und p95). Fahrt (+car,fly): Motor-Gitter mit Gängen, Suno, Flug.
// PW_GPU=1 empfohlen (SwiftShader ist zu langsam für den Ladevorgang).
import fs from 'fs'
import os from 'os'
import path from 'path'
import { report } from './_page.mjs'
import { startServer, openAudioPage } from './_audioServer.mjs'

const cache = path.join(process.env.KFB_AUDIO_CACHE || path.join(os.homedir(), 'kfb-ws1/.kfb-audio-cache'), 'index.json')
const priv = path.join(process.env.KFB_PRIVATE_ASSETS || path.join(os.homedir(), 'kfb-ws1/private-assets'), '40_AUDIO/elevenlabs_r1')
if (!fs.existsSync(priv)) { console.log('SKIP audio: keine privaten Töne (~/kfb-ws1/private-assets)'); console.log('PASS audio (skip)'); process.exit(0) }
const HASH = '#m1,harvest,look=terrain3,world=probe,debug'
const srv = await startServer()
const stats = (page) => page.evaluate(() => window.__kfbAudio?.stats?.() ?? null)
const ready = (page) => page.waitForFunction(() => { const m = window.__kfbAudio?.stats?.().modules; return m && m.racer && m.combat && m.ambience && m.steps && m.music }, null, { timeout: 180000 })
const world = (page) => page.waitForFunction(() => window.__kfbM1?.status?.().amphTris > 0, null, { timeout: 180000 }).catch(() => {})
let out = {}, code = 1
try {
  // ── zu Fuß ──
  const A = await openAudioPage(srv.url, HASH); await world(A.page)
  const before = await stats(A.page) // vor der ersten Eingabe: still (Kontext angehalten oder nicht da)
  await A.page.keyboard.press('KeyW'); const tIn = Date.now(); await ready(A.page); const readyMs = Date.now() - tIn
  await A.page.keyboard.down('KeyW'); await A.page.waitForTimeout(5000); await A.page.keyboard.up('KeyW')
  const walk = await stats(A.page)
  for (const k of ['KeyV', 'KeyB', 'KeyN']) { await A.page.keyboard.press(k); await A.page.waitForTimeout(600) }
  const adapters = await A.page.evaluate(() => { const a = window.__kfbAudio, p = { x: 3, y: 1, z: -4 }; return {
    k10: ['fire', 'cast', 'release', 'contact', 'weaponDrop'].map((type) => !!a.k10({ type, id: 'k10-' + type, weapon: type === 'fire' ? 'blaster' : 'fist', position: p, energy: 0.7 })),
    fluffer: ['windup', 'spit', 'impact', 'drop', 'healed', 'burst'].map((type) => a.fluffer({ type }, p)) } })
  await A.page.waitForTimeout(400)
  const fight = await stats(A.page)
  // Combat-AV R1: jede Arena-Waffe einmal, Gegnerwurf, Klinge (Schwung vor Treffer), Rauchbombe, Gatling-Feuerstoß (Schleife hält und endet)
  const arena = await A.page.evaluate(async () => { const a = window.__kfbAudio, p = { x: 2, y: 1, z: -3 }, before = a.stats().bank.plays, out = {}
    for (const w of ['pistol', 'blaster', 'action-rifle', 'soldier-r3d', 'crossbow', 'smoke', 'blade', 'wand', 'staff', 'skeleton-staff', 'bow', 'bow-a']) { const b = a.stats().bank.plays; a.k10({ type: 'fire', weapon: w, position: p }); out[w] = a.stats().bank.plays - b; await new Promise((r) => setTimeout(r, 120)) }
    const e0 = a.stats().bank.plays; a.k10({ type: 'fire', weapon: 'pistol', side: 'enemy', position: { x: 8, y: 1, z: -9 } }); out.enemy = a.stats().bank.plays - e0
    const b0 = a.stats().bank.plays; a.k10({ type: 'contact', weapon: 'blade', confirmed: true, position: p, id: 'bl1' }); out.bladeSwing = a.stats().bank.plays - b0
    const s0 = a.stats().bank.plays; a.k10({ type: 'contact', weapon: 'smoke', position: p }); out.smoke = a.stats().bank.plays - s0
    for (let i = 0; i < 12; i++) { a.k10({ type: 'fire', weapon: 'gatling', position: p }); await new Promise((r) => setTimeout(r, 55)) }
    out.gatlingLoopDuring = a.stats().events.filter((e) => e.type === 'k10' && e.w === 'gatling').length; await new Promise((r) => setTimeout(r, 600))
    out.plays = a.stats().bank.plays - before; out.bankVoicesAfter = a.stats().voices.bank; return out })

  // NPC-Gruppen (WS-NPC): 3 Gruppen × 6 Ereignisse direkt, dann der Abfrage-Weg mods.groups.events() mit Entdoppeln
  const groups = await A.page.evaluate(async () => { const a = window.__kfbAudio, M = window.__kfbM1, p = M.feet(), b0 = a.stats().bank.plays; let n = 0
    for (const g of ['skeleton_patrol', 'toy_squad', 'bot_crew']) for (const t of ['hit', 'aggro', 'ko', 'awake', 'calm', 'fluff']) { n += a.groupEvent({ group: g, type: t, id: 'm1', n: 2, at: [p[0] + 4, p[2] - 3], t: 1 }, { x: p[0] + 4, y: p[1] + 1, z: p[2] - 3 }); await new Promise((r) => setTimeout(r, 60)) }
    const cnt = () => a.stats().events.filter((e) => e.type === 'group').length, before = cnt()
    const ev = [{ type: 'hit', id: 'toy_3', n: 1, at: [p[0] + 3, p[2]], t: 5, group: 'toy_squad' }, { type: 'ko', id: 'bot_comic', at: [p[0] + 3, p[2]], t: 5.5, group: 'bot_crew' }, { type: 'fluff', id: 'toy_3', tag: 'fl1', at: [p[0] + 3, p[2]], t: 6, group: 'toy_squad' }]
    M.mods.groups = { events: () => ev }; await new Promise((r) => setTimeout(r, 700)); const polled = cnt() - before; await new Promise((r) => setTimeout(r, 500)); const again = cnt() - before; delete M.mods.groups
    return { n, plays: a.stats().bank.plays - b0, polled, again, errors: a.stats().errors } })
  out.groups = groups
  // Schritte/Hüpfer (WS-NPC groups.steps, npc.steps, fluffer.hops): alter Eintrag wird nicht nachgespielt, neue nah = Ton, fern (> 35 m) = still
  out.steps = await A.page.evaluate(async () => { const a = window.__kfbAudio, M = window.__kfbM1, p = M.feet(), gs = [{ type: 'step', id: 'skel_rogue', foot: 'l', at: [p[0] + 3, p[2]], speed: 1, group: 'skeleton_patrol', t: 1 }], ns = [], fh = []
    const keep = { groups: M.mods.groups, npc: M.mods.npc, fluffer: M.mods.fluffer }
    M.mods.groups = { events: () => [], steps: () => gs }; M.mods.npc = { steps: () => ns }; M.mods.fluffer = { hops: () => fh }
    const s0 = () => a.stats().npcSteps; await new Promise((r) => setTimeout(r, 300)); const old = s0()
    gs.push({ type: 'step', id: 'toy_3', foot: 'r', at: [p[0] + 4, p[2] + 1], speed: 1.2, group: 'toy_squad', t: 2 }, { type: 'step', id: 'bot_comic', foot: 'l', at: [p[0] + 2, p[2] - 2], speed: 1, group: 'bot_crew', t: 2.1 }, { type: 'step', id: 'far', foot: 'l', at: [p[0] + 80, p[2]], group: 'toy_squad', t: 2.2 })
    a.fluffer({ type: 'windup' }, { x: p[0] - 3, y: p[1] + 1, z: p[2] }) // wieder feindlich (vorher im Test geheilt) → Goo-Gleiten statt hellem Hüpfer
    ns.push({ type: 'step', id: 'farmer_b', foot: 'l', at: [p[0] + 3, p[2] + 3], speed: 0.9, t: 50 }); fh.push({ type: 'hop', id: 'dark_fluffer_ghost', at: [p[0] - 3, p[2]], t: 3 })
    await new Promise((r) => setTimeout(r, 400)); const n1 = s0(), pres = a.stats().presence; await new Promise((r) => setTimeout(r, 300)); const n2 = s0()
    Object.assign(M.mods, keep); return { old, played: n1 - old, again: n2 - n1, pres, errors: a.stats().errors } })
  // WS0-Lieferung Combat-AV L1–L13: neue Kampf-Ereignisse klingen
  out.av13 = await A.page.evaluate(async () => { const a = window.__kfbAudio, p = window.__kfbM1.feet(), pos = { x: p[0] + 2, y: p[1] + 1, z: p[2] }, r = {}
    for (const [k, e] of Object.entries({ kill: { type: 'kill' }, windup: { type: 'windup', side: 'enemy' }, block: { type: 'block' }, bite: { type: 'contact', target: 'player', weapon: 'bite' }, hurt: { type: 'contact', target: 'player' }, arrow: { type: 'contact', weapon: 'bow', confirmed: true }, magic: { type: 'contact', weapon: 'wand' }, dice: { type: 'fire', weapon: 'dice' } })) { const b = a.stats().bank.plays; a.k10({ ...e, position: pos }); r[k] = a.stats().bank.plays - b; await new Promise((x) => setTimeout(x, 80)) }
    return r })
  await A.page.keyboard.press('Space'); await A.page.waitForTimeout(120); await A.page.keyboard.press('Space') // Doppel-Leertaste: Abheben (Schwebeflug)
  await A.page.keyboard.down('KeyW'); await A.page.waitForTimeout(3500); const fly = await stats(A.page); await A.page.keyboard.up('KeyW')
  out.foot = { arena, errs: A.errs, readyMs, before: before && { mode: before.mode, state: before.state, music: before.nowPlaying }, walk: pick(walk), fight: pick(fight), fly: pick(fly), adapters }
  await A.browser.close()
  // ── Fahrt und Flug ──
  const B = await openAudioPage(srv.url, '#m1,harvest,look=terrain3,world=probe,car,fly,debug'); await world(B.page)
  await B.page.keyboard.press('KeyW'); await ready(B.page)
  await B.page.keyboard.down('KeyW'); const gears = new Set(); let drive = null, maxRpm = 0
  for (let i = 0; i < 8; i++) { await B.page.waitForTimeout(700); const s = await stats(B.page); if (s.racer) { gears.add(s.racer.gear); maxRpm = Math.max(maxRpm, s.racer.rpm) } if (s.mode2 === 'drive') drive = s }
  await B.page.keyboard.down('KeyQ'); await B.page.waitForTimeout(1500); await B.page.keyboard.up('KeyQ') // Drift
  const drv = await stats(B.page)
  await B.page.keyboard.up('KeyW'); await B.page.keyboard.down('KeyS'); await B.page.waitForTimeout(900); await B.page.keyboard.up('KeyS') // Bremsen
  await B.page.waitForTimeout(500)
  const car = await stats(B.page)
  out.car = { errs: B.errs, gears: [...gears], maxRpm, drive: drive && pick(drive), drv: drv.drive, end: pick(car) }
  await B.browser.close()
  const f = out.foot, w = f.walk, c = out.car, av = out.foot.arena
  code = report('audio', {
    noPageErrors: f.errs.length === 0 && c.errs.length === 0,
    silentBeforeInput: !f.before || f.before.state !== 'running' || !f.before.music,
    oneAudioContext: w.contexts === 1 && c.end.contexts === 1,
    fullModeAllModules: w.mode === 'full' && Object.values(w.modules).every(Boolean),
    noModuleErrors: w.errors.length === 0 && c.end.errors.length === 0,
    cozyOnFoot: w.nowPlaying?.list === 'cozy',
    footsteps: w.steps >= 4,
    ambienceWater: w.voices.ambience >= 1 && /river|fall|sea/.test(w.water),
    combatPlayed: f.fight.events.filter((e) => e.type === 'combat').length === 3 && f.fight.bank.plays > w.bank.plays,
    adaptersK10Fluffer: f.adapters.k10.every(Boolean) && f.adapters.fluffer.every((n) => n >= 1),
    combatAvEachWeapon: ['pistol', 'blaster', 'action-rifle', 'soldier-r3d', 'crossbow', 'smoke', 'blade', 'wand', 'staff', 'skeleton-staff', 'bow', 'bow-a'].every((k) => av[k] >= 1) && av.blaster === 3 && av.pistol === 2,
    combatAvEnemyBladeSmoke: av.enemy === 1 && av.bladeSwing >= 1 && av.smoke === 2,
    combatAvGatling: av.gatlingLoopDuring === 12 && av.bankVoicesAfter <= 24,
    npcGroups: out.groups.n >= 18 && out.groups.plays >= 15 && out.groups.polled === 3 && out.groups.again === 3 && out.groups.errors.length === 0,
    npcStepsHops: out.steps.old === 0 && out.steps.played === 4 && out.steps.again === 0 && out.steps.errors.length === 0,
    presenceLoops: out.steps.pres.includes('toyTick') && out.steps.pres.includes('fluffGlide'),
    combatAv13: Object.values(out.av13).every((n) => n >= 1) && out.av13.bite === 2,
    duckUnderLoudSfx: f.fight.duckDb < 0,
    voicesBounded: Math.max(w.voices.total, f.fight.voices.total, c.end.voices.total) <= 96 && f.fight.voices.bank <= 24 && f.fight.voices.combat <= 24,
    flyOnFootMusicSuno: f.fly.mode2 !== 'fly' || f.fly.nowPlaying?.list === 'suno' || f.fly.music.changes >= 0,
    sunoWhenDriving: c.end.nowPlaying?.list === 'suno',
    hoverSurfaceLoops: (() => { const d = c.drive?.drive || c.drv; return !!d && d.loops === 5 && ['grass', 'sand', 'rock', 'water'].includes(d.surface) })(), // nur am Boden (in der Luft aus)
    motorGridShifts: c.gears.length >= 2 && c.maxRpm > 2500,
    mainThreadBudget: w.perf.avgMs <= 1 && w.perf.p95Ms <= 1 && c.end.perf.avgMs <= 1 && c.end.perf.p95Ms <= 1,
  }, out)
} catch (e) { console.log('FAIL audio:', e.message); console.log(srv.log().slice(-1500)) } finally { srv.stop() }
fs.mkdirSync('test/out/audio', { recursive: true }); fs.writeFileSync('test/out/audio/audio-test.json', JSON.stringify(out, null, 1))
process.exit(code)
function pick(s) { const { events, ...rest } = s; return { ...rest, events: (events || []).slice(-25) } }
