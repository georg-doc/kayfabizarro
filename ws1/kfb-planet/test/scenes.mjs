// WS-NPC S3 Begegnungs-Module hinter #scenes=entwurf (Lead 25.10.), im Spiel (Site-Welt + npc, Platzhalter-Raster):
//   A  Die Spielfigur läuft einen Kreis (r 90 m, ≈ 4 m/s); die Regie setzt Szenen voraus im Kegel, auf Rasterplätze in der Welt, nicht auf die Bühne
//   B  mindestens zwei verschiedene Typen, kein Typ zweimal hintereinander, alle Datensätze kfb.scene/1
//   C  Szenen-Module laden (Status OK), hinter dem Spieler werden sie abgebaut und schreiben ein Protokoll (characterIds, gesehen)
//   D  ohne =entwurf kommt keine Szene (kein Typ freigegeben) · keine Seitenfehler
//   E  Konflikt-Typen per Kontext-Anfrage: Patrouille auf einem Rasterplatz (Karte aus dem Signatur-Deck), Fluffer am Baum seiner Definition (Sorte)
import { openPage, report } from './_page.mjs'
const SITE = '#m1,harvest,look=terrain3,world=probe,hud=3d'
async function run(hash, secs) {
  const { browser, page, errs } = await openPage(SITE + hash, { viewport: { width: 960, height: 540 } })
  await page.waitForFunction(() => window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.scenes, null, { timeout: 300000 })
  await page.waitForTimeout(2000)
  const R = 90, w = 4 / R, samples = []
  for (let i = 0; i < secs * 2; i++) {
    const a = i * 0.5 * w
    await page.evaluate(([x, z, yaw]) => { const M = window.__kfbM1; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], yaw) }, [R * Math.sin(a), R * Math.cos(a), a + Math.PI / 2])
    await page.waitForTimeout(500)
    if (i % 4 === 0) samples.push(await page.evaluate(() => ({ p: window.__kfbM1.feet(), live: window.__kfbM1.mods.scenes.scenes().map((s) => ({ id: s.id, typ: s.typ, st: s.status?.status, x: s.anker.x, z: s.anker.z })) })))
  }
  // E · Kontext-Anfragen: Patrouille (weiter im Kreis), dann Fluffer (auf den Baum zulaufen)
  if (/scenes=entwurf/.test(hash)) {
    await page.evaluate(() => window.__kfbM1.mods.scenes.director.request('patrouille', 'test'))
    for (let i = 0; i < 60 && !(await page.evaluate(() => window.__kfbM1.mods.scenes.scenes().some((s) => s.typ === 'patrouille'))); i++) { const a = (secs * 2 + i) * 0.5 * w
      await page.evaluate(([x, z, yaw]) => { const M = window.__kfbM1; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], yaw) }, [R * Math.sin(a), R * Math.cos(a), a + Math.PI / 2]); await page.waitForTimeout(500) }
    await page.waitForTimeout(4000); samples.push(await page.evaluate(() => ({ live: window.__kfbM1.mods.scenes.scenes().map((s) => ({ id: s.id, typ: s.typ, st: s.status?.status, x: s.anker.x, z: s.anker.z })) })))
    const tree = await page.evaluate(() => { const t = window.__kfbM1.mods.orchard.trees().find((x) => x.zone === 'goblin' && x.id === 't4'); return t ? [t.pos[0], t.pos[2]] : null })
    if (tree) { for (let k = 0; k < 6; k++) { const d = 50 - k * 2.5; await page.evaluate(([x, z]) => { const M = window.__kfbM1; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], 0) }, [tree[0], tree[1] - d]); await page.waitForTimeout(600) }
      await page.evaluate(() => window.__kfbM1.mods.scenes.director.request('fluffer', 'test'))
      await page.waitForFunction(() => window.__kfbM1.mods.scenes.scenes().some((s) => s.typ === 'fluffer'), null, { timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(5000) }
  }
  const out = await page.evaluate(() => ({ log: window.__kfbM1.mods.scenes.log(), dlog: window.__kfbM1.mods.scenes.director.log(), state: window.__kfbM1.mods.scenes.state(), errors: window.__kfbM1.mods.scenes.errors(), live: window.__kfbM1.mods.scenes.scenes().map((s) => ({ id: s.id, typ: s.typ, karte: s.karte, ausloeser: s.ausloeser, ort: s.anker.ort ?? null, sorte: s.besetzung[0]?.sorte ?? null, st: s.status?.status ?? s.status?.mode ?? null })) }))
  await browser.close()
  return { ...out, samples, errs }
}
const A = await run(',npc,scenes=entwurf,debug', 75)
const N = await run(',npc,scenes,debug', 20)
const typs = A.dlog.map((d) => d.typ), statuses = A.samples.flatMap((s) => s.live.map((l) => l.st))
process.exit(report('scenes (WS-NPC S3 Begegnungs-Module, Platzhalter-Raster)', {
  A_scenesSpawned: A.dlog.length >= 3,
  A_inWorldNotOnStage: A.samples.every((s) => s.live.every((l) => { const r = Math.hypot(l.x, l.z); return r > 30 && r < 160 })),
  B_twoTypes: new Set(typs).size >= 2,
  B_noTypeTwiceInRow: typs.every((t, i) => i === 0 || t !== typs[i - 1]),
  C_modulesLoad: statuses.includes('OK') && !statuses.includes('ERROR') && A.errors.length === 0,
  C_despawnLogged: A.log.length >= 1 && A.log.every((l) => l.characterIds.length >= 1 && typeof l.gesehen === 'boolean'),
  C_noInstantDespawn: A.log.every((l) => l.t1 - l.t0 >= 3),   // voraus gesetzte Szenen bleiben stehen (vorher: Patrouille nach 0,5 s abgebaut)
  D_nothingWithoutRelease: N.dlog.length === 0 && N.state.director.pool.length === 0,
  D_noPageErrors: A.errs.length === 0 && N.errs.length === 0,
  E_patrolKontext: A.dlog.some((d) => d.typ === 'patrouille' && d.ausloeser === 'kontext' && /^.+:\d+$/.test(d.karte || '')),
  E_flufferAtTree: A.dlog.some((d) => d.typ === 'fluffer' && d.ausloeser === 'kontext') && A.live.some((l) => l.typ === 'fluffer' && l.ort === 'dark_fluffer_ghost' && l.sorte),
}, { live: A.live, dlog: A.dlog, log: A.log, state: A.state, errors: A.errors, errs: [...A.errs, ...N.errs].slice(0, 3), last: A.samples.at(-1) }))
