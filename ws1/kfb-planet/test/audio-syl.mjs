// WS-Audio · Chatter-Silben R1 (Lead 24.10., Georg-GO, Schalter #chat=syl): jede Sprech-Blase mit Laut, Laut nur mit Blase.
//   Welt: Blase am Bewohner (npc-farmer_b) → speak mit Akkordeon (F03), Wechselrede (Lorekeeper antwortet versetzt), greet-Ringpuffer stumm,
//   gleicher Sprecher + Text binnen 1 s nur einmal. Bühne (#stage,actors=fb,dialog): nur Silben geladen (keine Musik), FrizzleBob/gothgirl sprechen.
// Headless, privater Ton nötig (sonst SKIP). Aufruf: PW_GPU=1 node test/audio-syl.mjs
import fs from 'fs'
import os from 'os'
import path from 'path'
import { report } from './_page.mjs'
import { startServer, openAudioPage } from './_audioServer.mjs'

if (!fs.existsSync(path.join(process.env.KFB_PRIVATE_ASSETS || path.join(os.homedir(), 'kfb-ws1/private-assets'), '40_AUDIO/elevenlabs_r1'))) { console.log('PASS audio-syl (skip)'); process.exit(0) }
const srv = await startServer(), out = {}
try {
  // ── Welt ──
  { const { browser, page, errs } = await openAudioPage(srv.url, '#m1,harvest,look=terrain3,world=probe,npc,chat=syl,debug')
    await page.waitForFunction(() => window.__kfbM1?.status?.().amphTris > 0 && window.__kfbM1?.npc?.()?.status?.status === 'OK', null, { timeout: 180000 }).catch(() => {})
    await page.mouse.click(400, 300); await page.keyboard.press('KeyW')
    await page.waitForFunction(() => window.__kfbAudio?.stats?.().loads?.total, null, { timeout: 180000 })
    out.world = await page.evaluate(async () => { const a = window.__kfbAudio, M = window.__kfbM1, p = M.feet(), wait = (ms) => new Promise((r) => setTimeout(r, ms))
      const greet = a.greet({ type: 'greet', reason: 'first', id: 'farmer_b' }, { x: p[0] + 2, y: p[1] + 1.6, z: p[2] }) // chat=syl: Ereignis-Laut stumm
      const n0 = (a.stats().speak?.log || []).length
      window.__kfbSayTest('npc-farmer_b', ['Was ist das?']) // Blase → speak (Haken in BubbleHost, synchron) – Antwort direkt danach, sonst ist die Frage unter Last schon vorbei
      const r1 = a.speak({ text: 'Was ist das?', characterId: 'farmer_b', pos: { x: p[0] + 2, y: p[1] + 1.6, z: p[2] } }) // gleicher Sprecher + Text: einmal
      const rDup = a.speak({ text: '*Was ist das?*', characterId: 'irgendein_anker' }) // gleiche Zeile über anderen Weg (Anker ≠ characterId): einmal
      const r2 = a.speak({ text: '*Feuerball* heute!', characterId: 'lorekeeper', pos: { x: p[0] - 2, y: p[1] + 1.6, z: p[2] } }) // Antwort: versetzt
      const none = a.speak({ text: 'Bongo.', characterId: 'unbekannt_xyz' })
      const plan = a.speakPlan('Boggle...?', 'farmer_b'); await wait(300)
      const st = a.stats(); return { greet, r1, rDup, r2, none, plan, log: st.speak.log.slice(n0), on: st.speak.on, perf: st.perf, duck: st.duckDb, errors: st.errors }
    })
    out.world.errs = errs; await browser.close() }
  // ── Bühne (nur Silben, kein AudioHost) ──
  { const { browser, page, errs } = await openAudioPage(srv.url, '#stage,debug,actors=fb,dialog=6,chat=syl')
    await page.waitForFunction(() => window.__kfbStageCtl?.deck, null, { timeout: 120000 }).catch(() => {})
    await page.mouse.click(400, 300)
    await page.waitForTimeout(25000)
    out.stage = await page.evaluate(async () => { const m = await import('/src/audio/kfbAudio.js'); const s = m.stats(); return { mode: s.mode, music: s.music, loads: Object.keys(s.loads || {}), log: s.speak.log, bubbles: (window.__kfbBubbles?.() || []).map((b) => b.anchor + ':' + b.kind) } })
    out.stage.errs = errs; await browser.close() }
} finally { srv.stop() }
fs.mkdirSync('test/out/audio', { recursive: true }); fs.writeFileSync('test/out/audio/syl.json', JSON.stringify(out, null, 1))
const W = out.world, B = out.stage
process.exit(report('audio-syl', {
  worldSwitchOn: W.on === true && W.greet === null,
  bubbleSpeaks: W.log.some((l) => l.who === 'farmer_b' && l.fam === 'F03_accordion' && l.end === '?'),
  sameLineOnce: W.log.filter((l) => l.who === 'farmer_b').length === 1 && W.r1?.family === 'F03_accordion' && W.rDup?.family === 'F03_accordion' && !W.log.some((l) => l.who === 'irgendein_anker'),
  answerOffset: W.r2?.family === 'F02_clarinet' && W.r2.start >= 0.3 && W.r2.dur > 0.4,
  noInstrumentNoSound: W.none === null && W.plan.syllables === 2,
  duckWhileSpeaking: W.duck <= -7,
  worldNoErrors: W.errs.length === 0 && W.errors.length === 0,
  stageSpeechOnly: B.mode === 'full' && !B.music && !B.loads.includes('ambience') && B.log.length >= 1 && B.errs.length === 0,
  stageVoices: B.log.some((l) => l.fam === 'F01_trombone' || l.fam === 'F10_oboe'),
}, { world: { r1: W.r1, r2: W.r2, log: W.log.length, perf: W.perf }, stage: { mode: B.mode, log: B.log.map((l) => l.who + ':' + l.fam + ':' + l.n) } }))
