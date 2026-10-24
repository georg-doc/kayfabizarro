// WS-NPC · S3 Schritt 0b (Lead 25.10., V-740): je Modul-Typ Bilder aus dem Live-Stand für das S3-Bild-Paket (WS1b) → test/out/npc/s3-0b/
//   Typen aus dem WS-NPC-Bestand: Bewohner-Begegnung (Lorekeeper), Ork-Band, Disco K12 (MiB-Turm, UFO erst nach V-744)
//   a  Bühnen-Ring: Spielkamera ≈ 40 m vor der Szene, so wie man auf sie zukommt
//   b  Spiel-Ring: ≈ 8 m, Szene in Aktion mit Sprechblase (Wechselrede per Prüfhilfe talk.inject, Blase wie im Spiel; chat=syl nur dafür, Bild ohne Ton)
// SITE_HASH + npc,band,disco (die Site-Welt hat ohne diese Schalter keine Bewohner, Band, Disco), 1600×900 @2, JPG 88, debug,clean.
// Aufruf mit Test-Slot: PW_GPU=1 node scripts/npc/s3-0b.mjs
import fs from 'fs'
import { execSync } from 'child_process'
import { openPage } from '../../test/_page.mjs'
import { SITE_HASH } from '../../src/siteHash.js'
import { ready, stand, standFree } from './_shot.mjs'

const OUT = 'test/out/npc/s3-0b', W = 1600, H = 900, DPR = 2
fs.mkdirSync(OUT, { recursive: true })
const hash = SITE_HASH + ',npc,band,disco,npct=200,chat=syl,debug,clean'
const { browser, page, errs } = await openPage(hash, { viewport: { width: W, height: H }, deviceScaleFactor: DPR })
await ready(page, "window.__kfbM1.mods.band?.status?.().status && window.__kfbM1.mods.disco?.status?.().status && window.__kfbM1.mods.talk && window.__kfbM1.mods.talk.stats().anchors.includes('disco-mc')")
await page.waitForTimeout(3000)

// Platzbedarf je Typ: Konzept Prozedurale Welt R1.5 §5.1 (Vorschlag WS-NPC); Band-/Disco-Werte aus den Modulen (BAND, DISCO)
// farA: Abstand der Zufahrt (Standard 40 m); Bewohner sind klein, daher 18 m
const TYPES = [
  { typ: 'bewohner', name: 'Bewohner-Begegnung (Lorekeeper)', at: "(() => { const p = M.npc().debug.find((b) => b.id === 'lorekeeper'); return [p.x, p.z] })()", obj: "M.mods.npc.actors().find((a) => /lorekeeper/.test(a.object3d.name))?.object3d",
    occ: { group: 'resident', cause: 'songEnd', speakers: [{ anchor: 'npc-lorekeeper', characterId: 'lorekeeper', id: 'lorekeeper' }] }, farA: 18, platz: { r: 6, neigung: null, plinthe: false, quelle: 'Konzept §5.1 Typ 1 (Fläche r ≈ 6 m)' } },
  { typ: 'band', name: 'Ork-Band', at: 'M.mods.band.debug().at', obj: "M.mods.band.holders().find((h) => h.name === 'band:guitarist')",
    occ: { group: 'orc_band', cause: 'songEnd', speakers: [{ anchor: 'band-guitarist', characterId: 'orc_raider', id: 'guitarist' }, { anchor: 'band-drummer', characterId: 'orc_brute', id: 'drummer' }] }, platz: { r: 8, neigung: '< 1,1°', plinthe: 'Bühne Ø 5 m', quelle: 'Konzept §5.1 Typ 5' } },
  { typ: 'disco', name: 'Disco K12', at: 'M.mods.disco.debug().at', obj: 'M.mods.disco.object3d', fixedDir: [0, -1],   // Lichtkegel und Kugel machen die Box der Disco riesig, der Sichttest taugt dort nicht: Richtung von Hand geprüft (25.10.)
    occ: { group: 'disco_k12', cause: 'pause', speakers: [{ anchor: 'disco-avian', characterId: 'avian_swordsman', id: 'avian' }, { anchor: 'disco-witch', characterId: 'witch', id: 'witch' }] }, platz: { r: '9·s (discoSite)', neigung: null, plinthe: false, quelle: 'Konzept §5.1 Typ 6' } },
]
const index = { schema: 'kfb.abnahme/1', id: 'ws-npc-s3-0b', datum: '2026-10-25', sitzung: 'WS-NPC', auftrag: 'S3 Schritt 0b (V-740), Bild-Paket an WS1b', commit: execSync('git rev-parse --short HEAD').toString().trim(), hash, dateien: [] }
const prev = fs.existsSync(`${OUT}/index.json`) && process.env.TYP ? JSON.parse(fs.readFileSync(`${OUT}/index.json`, 'utf8')) : null
if (prev) index.dateien = prev.dateien.filter((d) => !process.env.TYP.split(',').includes(d.typ))
for (const T of TYPES.filter((t) => !process.env.TYP || process.env.TYP.split(',').includes(t.typ))) {
  const at = () => page.evaluate((e) => { const M = window.__kfbM1; return new Function('M', 'return ' + e)(M) }, T.at)
  // a · Bühnen-Ring ≈ 40 m
  const fixed = async (d, az) => { await stand(page, await at(), d + 6, T.fixedDir); await page.waitForTimeout(2200); await stand(page, await at(), d, T.fixedDir, az); await page.waitForTimeout(2500); return { share: NaN, dir: T.fixedDir } }
  const a = T.fixedDir ? await fixed(T.farA ?? 40, 0) : await standFree(page, at, T.obj, T.farA ?? 40, [0.7071, -0.7071], 0)
  await page.waitForTimeout(1500)
  let file = `${T.typ}-a-buehne.jpg`; fs.writeFileSync(`${OUT}/${file}`, await page.screenshot({ type: 'jpeg', quality: 88 }))
  index.dateien.push({ datei: file, typ: T.typ, objekt: T.name, fall: `a · Zufahrt ≈ ${T.farA ?? 40} m`, sichtAnteil: Number.isNaN(a.share) ? 'von Hand' : +a.share.toFixed(2), platz: T.platz })
  // b · Spiel-Ring ≈ 8 m mit Wechselrede
  const b = T.fixedDir ? await fixed(8, 0.32) : await standFree(page, at, T.obj, 8, a.dir, 0.32)
  await page.waitForTimeout(3000)   // Bemerken-Ruf ablaufen lassen
  const n0 = await page.evaluate(() => window.__kfbM1.mods.talk.log().length)
  await page.evaluate((occ) => window.__kfbM1.mods.talk.inject(occ), T.occ)
  await page.waitForFunction((n0) => window.__kfbM1.mods.talk.log().slice(n0).some((e) => e.kind === 'line'), n0, { timeout: 10000 }).catch(() => {})
  // bei zwei Sprechern: auf die Antwort warten, dann kurz aufklappen lassen (die Frage steht, bis die Antwort gelesen ist)
  if (T.occ.speakers.length > 1) await page.waitForFunction((n0) => window.__kfbM1.mods.talk.log().length >= n0 + 2, n0, { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(T.occ.speakers.length > 1 ? 600 : 1100)
  const line = await page.evaluate((n0) => window.__kfbM1.mods.talk.log().slice(n0).map((e) => `${e.anchor}: ${e.text}`), n0)
  file = `${T.typ}-b-spiel.jpg`; fs.writeFileSync(`${OUT}/${file}`, await page.screenshot({ type: 'jpeg', quality: 88 }))
  index.dateien.push({ datei: file, typ: T.typ, objekt: T.name, fall: 'b · Spiel-Ring ≈ 8 m, Wechselrede (talk.inject)', sichtAnteil: Number.isNaN(b.share) ? 'von Hand' : +b.share.toFixed(2), zeilen: line, platz: T.platz })
  console.log(JSON.stringify({ typ: T.typ, a: +a.share.toFixed(2), b: +b.share.toFixed(2), line }))
  await page.waitForTimeout(4000)
}
index.errs = errs.slice(0, 3)
await browser.close()
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 1))
console.log(JSON.stringify({ out: OUT, files: index.dateien.map((d) => d.datei) }))
