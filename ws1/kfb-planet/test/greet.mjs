// WS-NPC · Begrüßung mit Blase und Ereignis (Georg 22.10., G-2) im Spiel (#m1,debug,harvest,look=terrain3,npc,npcfresh):
//   A  erstes Bemerken → greet { reason: 'first' } im Ringpuffer npc.events(), keine Blase
//   B  zweites Bemerken (nach Abklingzeit) → reason 'known', Waving, Blase am Anker npc-<id> mit dem Schweigen-Symbol „…“ (bis WS0-Zeilen da sind)
//   C  Einträge mit seq (aufsteigend), at nahe der Figur; keine Seitenfehler
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest,look=terrain3,npc,npcfresh,npct=40', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.npc?.()?.status?.status === 'OK' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const go = (dist) => page.evaluate((dist) => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === 'farmer_b'), fx = Math.sin(d.yaw), fz = Math.cos(d.yaw), px = d.x + fx * dist, pz = d.z + fz * dist
  M.player().teleport([px, M.terrainH(px, pz) + 1.2, pz], Math.atan2(d.x - px, d.z - pz)) }, dist)
const ev = () => page.evaluate(() => window.__kfbM1.npc().events.filter((e) => e.id === 'farmer_b'))
const bubbles = () => page.evaluate(() => (window.__kfbBubbles?.() || []).filter((b) => b.anchor === 'npc-farmer_b'))
await go(2.4); let e1 = []; for (let i = 0; i < 30 && !e1.length; i++) { await page.waitForTimeout(150); e1 = await ev() }
await page.waitForTimeout(600); const b1 = await bubbles()
await go(12); const tA = await page.evaluate(() => window.__kfbM1.clock.t); for (let i = 0; i < 200; i++) { await page.waitForTimeout(150); if ((await page.evaluate(() => window.__kfbM1.clock.t)) > tA + 16) break }
await go(2.4); let e2 = []; for (let i = 0; i < 40 && e2.length < 2; i++) { await page.waitForTimeout(150); e2 = await ev() }
let b2 = []; for (let i = 0; i < 20 && !b2.length; i++) { await page.waitForTimeout(100); b2 = await bubbles() }
await page.screenshot({ path: 'test/out/npc/greet_bubble.png' })
const fb = await page.evaluate(() => window.__kfbM1.npc().debug.find((x) => x.id === 'farmer_b')), played = await page.evaluate(() => window.__kfbM1.npc().played.filter(([id]) => id === 'farmer_b').map(([, c]) => c))
await browser.close()
const last = e2.at(-1)
process.exit(report('greet (WS-NPC, Begrüßung mit Blase und Ereignis, G-2)', {
  A_firstNoBubble: e1.length === 1 && e1[0].reason === 'first' && b1.length === 0,
  B_knownWithBubble: e2.length >= 2 && last.reason === 'known' && played.includes('Waving') && b2.length === 1 && b2[0].text === '…' && b2[0].kind === 'thought',
  C_seqAndPlace: e2.every((e, i) => i === 0 || e.seq > e2[i - 1].seq) && Math.hypot(last.at[0] - fb.x, last.at[1] - fb.z) < 2.5,
  C_noPageErrors: errs.length === 0,
}, { e1, e2, b1, b2, played: played.slice(-6), errs: errs.slice(0, 3) }))
