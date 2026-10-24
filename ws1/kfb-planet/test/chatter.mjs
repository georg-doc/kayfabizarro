// WS-NPC Sprech-Anlässe im Spiel (Georg 24.10.; #m1,debug,harvest,npc,band,disco): für den Ton (WS-Audio, Chatter-Familien V-693), kein Text
//   A  Orc-Band: Bemerken (staunend) beim Herankommen, Liedende (froh, 2 Sprecher, 16 Takte) – events() { type: 'chatter', group: 'orc_band', … }
//   B  Disco K12: Bemerken durch den MC (FrizzleBob), Pause zwischen Liedern (introspektiv) – group 'disco_k12'
//   C  gothgirl: Bemerken als greet (first) in npc.events(), source 'partner', ohne Denkblase
//   D  Register-IDs gesetzt (Band/Disco vorläufig markiert) · Deckel: je Gruppe höchstens ein Liedende-Anlass je 90 s · keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,npc,band,disco,npct=200', { viewport: { width: 960, height: 540 } })
await page.waitForFunction(() => window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.band?.status().status && window.__kfbM1.mods.disco?.status().status && window.__kfbM1.mods.partner?.status().status === 'OK', null, { timeout: 300000 })
const tp = (x, z) => page.evaluate(([x, z]) => { const M = window.__kfbM1; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], 0) }, [x, z])
const waitEv = (mod, cause, ms) => page.waitForFunction(([mod, cause]) => window.__kfbM1.mods[mod].events().some((e) => e.cause === cause), [mod, cause], { timeout: ms }).then(() => true, () => false)
// A Band
const bAt = await page.evaluate(() => window.__kfbM1.mods.band.debug().at)
await tp(bAt[0] + 3, bAt[1] + 3)
const aNotice = await waitEv('band', 'notice', 8000), aSong = await waitEv('band', 'songEnd', 150000) // Spielzeit läuft im Test langsamer als Echtzeit
const A = await page.evaluate(() => window.__kfbM1.mods.band.events())
// B Disco
const dAt = await page.evaluate(() => window.__kfbM1.mods.disco.debug().at)
await tp(dAt[0] + 4, dAt[1] + 4)
const bNotice = await waitEv('disco', 'notice', 8000), bPause = await waitEv('disco', 'pause', 150000)
const B = await page.evaluate(() => window.__kfbM1.mods.disco.events())
// C gothgirl (Partner auf der Bühne)
const gAt = await page.evaluate(() => { const o = window.__kfbM1.mods.partner.object3d, p = o.getWorldPosition(new (o.position.constructor)()); return [p.x, p.z] })
await tp(gAt[0] + 1.6, gAt[1] + 1.6)
await page.waitForTimeout(2500)
const Cg = await page.evaluate(() => window.__kfbM1.mods.npc.events().filter((e) => e.type === 'greet' && e.source === 'partner'))
await browser.close()
const songEnds = A.filter((e) => e.cause === 'songEnd'), pauses = B.filter((e) => e.cause === 'pause')
const capped = (L) => L.every((e, i) => i === 0 || e.t - L[i - 1].t >= 90 || e.t === L[i - 1].t)
process.exit(report('chatter (WS-NPC Sprech-Anlässe gothgirl, Band, Disco)', {
  A_bandNotice: aNotice && A.some((e) => e.cause === 'notice' && e.mood === 'staunend'),
  A_bandSongEnd: aSong && songEnds.length >= 1 && songEnds.length <= 2 * Math.ceil(songEnds.length / 2) && songEnds.every((e) => e.mood === 'froh') && new Set(songEnds.filter((e) => e.t === songEnds[0].t).map((e) => e.id)).size === 2,
  B_discoNoticeByMC: bNotice && B.some((e) => e.cause === 'notice' && e.id === 'mc' && e.characterId === 'frizzlebob'),
  B_discoPause: bPause && pauses.every((e) => e.mood === 'introspektiv' && e.id !== 'mc'),
  C_gothgirlGreet: Cg.length === 1 && Cg[0].reason === 'first' && Cg[0].characterId === 'gothgirl' && Array.isArray(Cg[0].at),
  D_registerIds: [...A, ...B].every((e) => typeof e.characterId === 'string' && e.idNote) && A.every((e) => /^orc_/.test(e.characterId)),
  D_capped: capped([...new Map(songEnds.map((e) => [e.t, e])).values()]) && capped([...new Map(pauses.map((e) => [e.t, e])).values()]),
  D_schema: [...A, ...B].every((e) => e.type === 'chatter' && typeof e.seq === 'number' && Array.isArray(e.at) && (e.group === 'orc_band' || e.group === 'disco_k12')),
  D_noPageErrors: errs.length === 0,
}, { A, B, Cg, errs: errs.slice(0, 3) }))
