// WS-NPC Wechselrede hinter #chat=syl im Spiel (Lead 24.10., Georg-GO; #m1,debug,harvest,npc,band,disco,chat=syl):
//   A  Disco: der MC (FrizzleBob) bleibt ruhig, bis er ruft; Bemerken → Ruf-Blase am MC (Boggle...?), danach tanzt er
//   B  Disco-Pause: Wechselrede zweier Tänzer (Karte → Ruf → ggf. Lore), Blasen an den Tänzern
//   C  Band: Bemerken und Liedende als Blasen an den Musikern
//   D  gothgirl: Begrüßung als Ruf-Blase am Partner-Anker (statt keiner Blase)
//   E  höchstens 2 Blasen gleichzeitig · Blasen nie über dem HUD · nur Rufe V-712 bzw. Kartenzeilen · keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,npc,band,disco,chat=syl,npct=200,look=terrain3', { viewport: { width: 960, height: 540 } })
await page.waitForFunction(() => window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.band?.status().status && window.__kfbM1.mods.disco?.status().status && window.__kfbM1.mods.partner?.status().status === 'OK' && window.__kfbM1.mods.talk, null, { timeout: 300000 })
// Blasen-Stichprobe alle 150 ms: Anzahl sichtbarer Blasen, Überlappung mit HUD-Flächen
await page.evaluate(() => { const W = window, S = W.__talkProbe = { max: 0, hudHits: [], samples: 0, seen: [] }
  const ov = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  setInterval(() => { const L = (W.__kfbBubbles?.() || []).filter((b) => b.shown && b.t < b.life); S.samples++; S.max = Math.max(S.max, L.length)
    const hud = (W.__kfbBubbleAvoid?.() || []).filter((r) => r.kind === 'hud')
    for (const b of L) { const r = { x: b.rect.x + 34, y: b.rect.y + 34, w: b.rect.width - 68, h: b.rect.height - 68 }; for (const h of hud) if (ov(r, h)) S.hudHits.push({ anchor: b.anchor, h, r, text: b.text, t: b.t }) }
    for (const b of L) { const text = b.text.replace(/\*/g, ''); if (!S.seen.some((x) => x.anchor === b.anchor && x.text === text)) S.seen.push({ anchor: b.anchor, text, life: b.life }) } }, 150) })
// Teleport mit Blick zum Ziel (Kamera hinter der Figur): nur Sprecher im Bild sprechen
const tp = (x, z, to = null) => page.evaluate(([x, z, to]) => { const M = window.__kfbM1, w = to ? Math.atan2(to[0] - x, to[1] - z) : 0; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); if (to) M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) }, [x, z, to])
const log = () => page.evaluate(() => window.__kfbM1.mods.talk.log())
const waitLog = (fn, ms) => page.waitForFunction(`(${fn})(window.__kfbM1.mods.talk.log())`, null, { timeout: ms, polling: 200 }).then(() => true, () => false)
const mcClip = () => page.evaluate(() => window.__kfbM1.mods.disco.debug().members.find((m) => m.slot === 'mc')?.clip ?? null)
// Start: weg von der Bühne (der Bühnen-Dialog friert die Figur ein und sperrt die Wechselrede); läuft er schon, beenden
const free = async () => { for (let i = 0; i < 10; i++) { if (await page.evaluate(() => window.__kfbM1.status().phase) !== 'dialog') return true; await page.evaluate(() => window.__kfbM1.endDialog?.()); await page.waitForTimeout(300) } return false }
// A Disco: erst in Sicht (30 m), MC ruhig; dann heran (Bemerken bei 8 m)
const dAt = await page.evaluate(() => window.__kfbM1.mods.disco.debug().at)
await free(); await tp(dAt[0] - 21, dAt[1] - 21, dAt); await free()   // +21 läge auf der Bühne (0, 0)
await page.waitForTimeout(3000)
const mcBefore = await mcClip()
await tp(dAt[0] - 4, dAt[1] - 4, dAt)
const aCall = await waitLog((L) => L.some((e) => e.anchor === 'disco-mc' && e.kind === 'call'), 10000)
await page.waitForTimeout(4000)
const mcAfter = await mcClip()
const anchors = await page.evaluate(() => window.__kfbM1.mods.talk.stats().anchors)
await page.screenshot({ path: 'test/out/npc/talk-disco-mc.png' })
// B Disco-Pause (Spielzeit läuft im Test langsamer als Echtzeit)
const bPause = await waitLog((L) => L.filter((e) => /^disco-/.test(e.anchor) && e.anchor !== 'disco-mc').length >= 2, 150000)
await page.waitForTimeout(1200); await page.screenshot({ path: 'test/out/npc/talk-disco-pause.png' })
await page.waitForTimeout(6000)
// C Band
const bAt = await page.evaluate(() => window.__kfbM1.mods.band.debug().at)
const n0 = (await log()).length
await tp(bAt[0] + 8, bAt[1] + 8, bAt); await page.waitForTimeout(2500)   // 11 m: erst die Kamera nachziehen lassen (sie folgt weich)
await tp(bAt[0] + 5, bAt[1] + 5, bAt)   // 7 m: im Bemerken-Radius (8 m), die ganze Band im Bild
// nur neue Zeilen zählen (die Band kann schon von der Disco aus im Bild gewesen sein)
const cNotice = await waitLog(`(L) => L.slice(${n0}).some((e) => /^band-/.test(e.anchor) && e.kind === 'call')`, 10000)
const cSong = await waitLog(`(L) => L.slice(${n0}).filter((e) => /^band-/.test(e.anchor)).length >= 2`, 150000)
await page.waitForTimeout(800); await page.screenshot({ path: 'test/out/npc/talk-band.png' })
// D gothgirl (Partner auf der Bühne): Begrüßung kommt vor dem Bühnen-Dialog
const gAt = await page.evaluate(() => { const o = window.__kfbM1.mods.partner.object3d, p = o.getWorldPosition(new (o.position.constructor)()); return [p.x, p.z] })
await tp(gAt[0] + 2, gAt[1] + 2, gAt)   // 2,8 m: im Bemerken-Radius (3,2 m), ihr Kopf im Bild
const dGreet = await waitLog((L) => L.some((e) => e.anchor === 'stage-right' && e.kind === 'call'), 8000)
await page.waitForTimeout(300); await page.screenshot({ path: 'test/out/npc/talk-goth.png' })
const L = await log(), P = await page.evaluate(() => window.__talkProbe), stats = await page.evaluate(() => window.__kfbM1.mods.talk.stats())
await browser.close()
const V712 = ['Bingo!', 'Boggle...?', 'Bongo.', 'Blödsinn!', 'Humbug?!'], idle = /idle/i
process.exit(report('talk (WS-NPC Wechselrede chat=syl)', {
  A_mcQuietUntilCall: idle.test(mcBefore || '') && aCall && !idle.test(mcAfter || 'x'),
  A_mcCallBubble: P.seen.some((b) => b.anchor === 'disco-mc' && V712.includes(b.text)),
  A_anchorsRegistered: anchors.includes('disco-mc') && anchors.some((a) => /^band-/.test(a)) && anchors.filter((a) => /^disco-/.test(a)).length >= 3,
  B_discoExchange: bPause && P.seen.filter((b) => /^disco-/.test(b.anchor) && b.anchor !== 'disco-mc').length >= 2,
  C_band: cNotice && cSong,
  D_gothgirlGreet: dGreet && P.seen.some((b) => b.anchor === 'stage-right' && V712.includes(b.text)),
  E_maxTwo: P.max <= 2 && P.samples > 100,
  E_notOverHud: P.hudHits.length === 0,
  E_textSources: L.every((e) => (e.kind === 'call' ? e.source === 'CALL' && V712.includes(e.text) : e.source === 'CARD')),
  E_noPageErrors: errs.length === 0,
}, { mcBefore, mcAfter, anchors, log: L, max: P.max, samples: P.samples, hudHits: P.hudHits.slice(0, 3), hudN: P.hudHits.length, seen: P.seen, stats, errs: errs.slice(0, 3) }))
