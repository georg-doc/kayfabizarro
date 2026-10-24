// WS-NPC · Abnahme 25.10. (Lead, Georgs Urteile V-734/V-736) → test/out/npc/abnahme-25/
//   tr1      drei Bilder, je eine andere Figur aus dem Register (Orc-Band-Gitarrist orc_raider, Lorekeeper, Bäuerin farmer_b) erzählt eine Karte als tr1-Zeile
//            in der Live-Welt (SITE_HASH) mit lines=tr1,chat=syl. Der Anlass wird per Prüfhilfe talk.inject() ausgelöst; Zeile, Blase und Laut laufen über den
//            echten Weg (talkDirector → reader.ssotLine 'T' → store.say → bubbleLayer). Dazu je Blase der gemessene Innenabstand gegen AIR (bubbleLayer.js).
//   kitclay  dieselbe Figur (Lorekeeper) in Stufe 0/1/2 im selben eingefrorenen Moment (Material/Uniforms zur Laufzeit getauscht), Einzelbilder + Abnahmekarte.
// Einzelbilder 1600×900 @2, JPG 88, #debug,clean. Aufruf mit Test-Slot: PW_GPU=1 node scripts/npc/abnahme25.mjs [tr1|kitclay]
import fs from 'fs'
import sharp from 'sharp'
import { execSync } from 'child_process'
import { openPage } from '../../test/_page.mjs'
import { SITE_HASH } from '../../src/siteHash.js'
import { KIT_FIGURE } from '../../src/look/clayKit.js'

const OUT = 'test/out/npc/abnahme-25', W = 1600, H = 900, DPR = 2
fs.mkdirSync(OUT, { recursive: true })
const only = process.argv[2] || null, commit = execSync('git rev-parse --short HEAD').toString().trim(), index = { schema: 'kfb.abnahme/1', id: 'ws-npc-abnahme-25', datum: '2026-10-25', sitzung: 'WS-NPC', commit, dateien: [] }
const prev = fs.existsSync(`${OUT}/index.json`) ? JSON.parse(fs.readFileSync(`${OUT}/index.json`, 'utf8')) : null
if (prev && only) index.dateien = prev.dateien.filter((d) => d.teil !== only || (process.env.FIG && !process.env.FIG.split(',').some((f) => d.datei.includes(f))))
if (prev) for (const k of ['tr1', 'kitclay']) if (prev[k] && !index[k]) index[k] = prev[k]
const jpg = async (page, file) => { const b = await page.screenshot({ type: 'jpeg', quality: 88 }); fs.writeFileSync(`${OUT}/${file}`, b); return b }
const ready = (page, extra = 'true') => page.waitForFunction(`window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0 && (${extra})`, null, { timeout: 300000 })
// Spieler d m vor dem Ziel auf der Achse vom Ziel weg (Seite dir), Blick zum Ziel; Kamera folgt weich → erst weiter weg, dann heran
// az: Kamera seitlich versetzt (rad), damit die Spielfigur den Sprecher nicht verdeckt (die Folgekamera dreht nur bei Eingaben nach)
const stand = (page, q, d, dir = [0.7071, 0.7071], az = 0) => page.evaluate(([q, d, dir, az]) => { const M = window.__kfbM1, x = q[0] + dir[0] * d, z = q[1] + dir[1] * d, w = Math.atan2(q[0] - x, q[1] - z)
  M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI + az, false) }, [q, d, dir, az])

// Anteil der Figur, der im Bild wirklich zu sehen ist: Ausschnitt um ihre projizierte Box mit und ohne Figur vergleichen (wie die Maske der Kit-Abnahme)
async function visibleShare(page, objExpr) {
  const box = await page.evaluate((e) => { const M = window.__kfbM1, o = new Function('M', 'return ' + e)(M); if (!o) return null; const cam = M.camera3(), v = new o.position.constructor(), mn = [1e9, 1e9], mx = [-1e9, -1e9]; let n = 0
    o.updateWorldMatrix(true, true); o.traverse((x) => { if (!x.isMesh || !x.visible || !x.geometry) return; if (!x.geometry.boundingBox) x.geometry.computeBoundingBox(); const bb = x.geometry.boundingBox
      for (let i = 0; i < 8; i++) { v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(x.matrixWorld).project(cam); if (v.z > 1) return; mn[0] = Math.min(mn[0], v.x); mn[1] = Math.min(mn[1], v.y); mx[0] = Math.max(mx[0], v.x); mx[1] = Math.max(mx[1], v.y); n++ } })
    if (!n) return null; const W = innerWidth, H = innerHeight, x0 = Math.max(0, (mn[0] * 0.5 + 0.5) * W), x1 = Math.min(W, (mx[0] * 0.5 + 0.5) * W), y0 = Math.max(0, (-mx[1] * 0.5 + 0.5) * H), y1 = Math.min(H, (-mn[1] * 0.5 + 0.5) * H)
    return x1 - x0 > 8 && y1 - y0 > 8 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null }, objExpr)
  if (!box) return 0
  const raw = async () => (await sharp(await page.screenshot({ type: 'png', clip: box })).raw().toBuffer())
  const tog = (on) => page.evaluate(([e, on]) => { const o = new Function('M', 'return ' + e)(window.__kfbM1); if (o) o.visible = on }, [objExpr, on])
  await page.evaluate(() => { window.__kfbM1.clock.hidden = true }); const A = await raw(); await tog(false); await page.waitForTimeout(120); const B = await raw(); await tog(true); await page.evaluate(() => { window.__kfbM1.clock.hidden = false })
  let ch = 0; for (let i = 0; i < A.length; i += 3) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 24) ch++
  return ch / (A.length / 3)
}

if (!only || only === 'tr1') {
  const hash = SITE_HASH + ',npc,band,npct=200,lines=tr1,chat=syl,debug,clean'
  const { browser, page, errs } = await openPage(hash, { viewport: { width: W, height: H }, deviceScaleFactor: DPR })
  await ready(page, "window.__kfbM1.mods.band?.status?.().status && window.__kfbM1.mods.talk && window.__kfbM1.mods.talk.stats().anchors.includes('band-guitarist')")
  await page.waitForTimeout(3000)
  const FIG = [
    { id: 'gitarrist', name: 'Orc-Band, Gitarrist (orc_raider)', group: 'orc_band', anchor: 'band-guitarist', characterId: 'orc_raider', obj: "M.mods.band.holders().find((h) => h.name === 'band:guitarist')", where: "M.mods.band.positions().find((p) => p.id === 'band-guitarist')", d: 5.5, dir: [0.7071, 0.7071] },
    { id: 'lorekeeper', name: 'Lorekeeper (Bewohner)', group: 'resident', anchor: 'npc-lorekeeper', characterId: 'lorekeeper', obj: "M.mods.npc.actors().find((a) => /lorekeeper/.test(a.object3d.name))?.object3d", where: "M.npc().debug.find((b) => b.id === 'lorekeeper')", d: 4.6, dir: [0.7071, -0.7071] },
    { id: 'baeuerin', name: 'Bäuerin mit Mistgabel (farmer_b)', group: 'resident', anchor: 'npc-farmer_b', characterId: 'farmer_b', obj: "M.mods.npc.actors().find((a) => /farmer[-_]b/.test(a.object3d.name))?.object3d", where: "M.npc().debug.find((b) => b.id === 'farmer_b')", d: 4.6, dir: [-0.7071, 0.7071] },
  ]
  for (const F of FIG.filter((f) => !process.env.FIG || process.env.FIG.split(',').includes(f.id))) {
    const at = () => page.evaluate((w) => { const M = window.__kfbM1, p = new Function('M', 'return ' + w)(M); return p ? [p.x, p.z] : null }, F.where)
    // Richtung wählen, aus der Kopf und Kamera frei sind: Strahl Kamera → Kopf des Sprechers darf nur die Figur selbst treffen (Bäume, Hänge verdecken sonst)
    let dir = F.dir, free = null, share = 0
    for (let k = 0; k < 8 && !free; k++) {
      dir = [Math.cos(Math.atan2(F.dir[1], F.dir[0]) + (k * Math.PI) / 4), Math.sin(Math.atan2(F.dir[1], F.dir[0]) + (k * Math.PI) / 4)]
      await stand(page, await at(), F.d + 6, dir); await page.waitForTimeout(2200)
      await stand(page, await at(), F.d, dir, 0.32); await page.waitForTimeout(2500)   // auch: Bemerken-Ruf (Boggle...?) ablaufen lassen
      share = await visibleShare(page, F.obj); free = share >= 0.3 ? dir : null   // Silhouette füllt ihre Box nie ganz; 0,3 = frei genug (Schätzwert)
    }
    const n0 = await page.evaluate(() => window.__kfbM1.mods.talk.log().length)
    await page.evaluate((F) => window.__kfbM1.mods.talk.inject({ group: F.group, cause: 'songEnd', speakers: [{ anchor: F.anchor, characterId: F.characterId, id: F.id }] }), F)
    const ok = await page.waitForFunction((n0) => window.__kfbM1.mods.talk.log().slice(n0).some((e) => e.kind === 'line'), n0, { timeout: 10000 }).then(() => true, () => false)
    await page.waitForTimeout(1100)   // Blase aufgeklappt (Aufklappen 0,17 s, Zeilen 0,3 s)
    const info = await page.evaluate(([n0, anchor]) => { const e = window.__kfbM1.mods.talk.log().slice(n0).find((x) => x.kind === 'line'), C = window.KFB_CB
      const b = [...document.querySelectorAll('#ui-bubbles [data-speaker]')].filter((x) => x.dataset.speaker === anchor).pop(), box = b?.firstElementChild?.lastElementChild
      const fsPx = box ? parseFloat(box.style.fontSize) : null, pad = box ? box.style.padding : null, base = Math.round(Math.max(15, Math.min(20, innerHeight / 42)))
      const core = b ? C.layout(b.dataset.text, 'speech', { basePx: base, maxPx: Math.min(420, innerWidth * 0.42) }) : null
      return { line: e || null, shown: !!b && b.style.display !== 'none', pad, fontPx: fsPx, corePad: core ? [core.padY, core.padX] : null, expectedAir: core ? [core.padY + Math.round(core.fontPx * 0.45), core.padX + Math.round(core.fontPx * 0.6)] : null } }, [n0, F.anchor])
    const file = `tr1-${F.id}.jpg`; await jpg(page, file)
    index.dateien.push({ teil: 'tr1', datei: file, objekt: F.name, fall: 'tr1 · chat=syl', hash, ausgeloest: 'talk.inject (Prüfhilfe), Weg wie im Spiel', zeile: info.line?.text ?? null, quelle: info.line?.field ?? null, sichtAnteil: +share.toFixed(2), sichtbar: info.shown && ok,
      innenabstand: { gemessen: info.pad, kern: info.corePad, erwartetMitAIR: info.expectedAir, schrift: info.fontPx },
      zeileFuerGeorg: `${F.name}: erzählt eine Karte als tr1-Zeile (Satz-Opener + Triplet, Titel fett). Achte auf den Randabstand der Blase (neuer Abstand AIR) und ob der Satz sich wie Rede liest.` })
    console.log(JSON.stringify({ file, ok, share: +share.toFixed(2), dir, ...info }))
    await page.waitForTimeout(4500)
  }
  index.tr1 = { hash, errs: errs.slice(0, 3) }
  await browser.close()
}

if (!only || only === 'kitclay') {
  const hash = SITE_HASH + ',npc,npct=200,kitclay=1,debug,clean'
  const { browser, page, errs } = await openPage(hash, { viewport: { width: W, height: H }, deviceScaleFactor: DPR })
  await ready(page, 'window.__kfbM1.mods.clay')
  await page.waitForTimeout(3000)
  const raf = (n = 2) => page.evaluate((n) => new Promise((r) => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f) }), n)
  const KIT = { lump: [KIT_FIGURE.lump.size, KIT_FIGURE.lump.slope], dent: [KIT_FIGURE.dent.size, KIT_FIGURE.dent.slope], dent2: [KIT_FIGURE.dent2.size, KIT_FIGURE.dent2.slope], maxSlope: KIT_FIGURE.maxSlope }
  // Stufen wie in der Abnahme kitclay2 (22.10.): 1 = character mit kitSkip-Fix (Schalter), 2 = kit-figure (Uniforms), 0 = Original-Material der eyeActor-Figur (Standard heute)
  await page.evaluate((KIT) => { const M = window.__kfbM1, fig = () => M.mods.npc.actors().find((a) => /lorekeeper/.test(a.object3d.name))
    window.__kc = { fig,
      set(on) { const f = fig(); for (const { module, handle: h } of M.mods.clay.entries()) { if (module !== f) continue; const U = h.uniforms
        if (!h.__a) h.__a = { lump: U.uClayLump.value.toArray(), dent: U.uClayDent.value.toArray(), dent2: U.uClayDent2.value.toArray(), maxSlope: U.uClayMaxSlope.value }
        const A = h.__a; if (on) { U.uClayLump.value.set(...KIT.lump); U.uClayDent.value.x = KIT.dent[0]; U.uClayDent.value.z = KIT.dent[1]; U.uClayDent2.value.x = KIT.dent2[0]; U.uClayDent2.value.z = KIT.dent2[1]; U.uClayMaxSlope.value = KIT.maxSlope }
        else { U.uClayLump.value.fromArray(A.lump); U.uClayDent.value.fromArray(A.dent); U.uClayDent2.value.fromArray(A.dent2); U.uClayMaxSlope.value = A.maxSlope } } },
      stage0(on) { const o = fig().object3d; o.traverse((x) => { if (!x.isMesh || !x.userData.kfbClayOrig) return; if (on) { x.userData.__clay = x.material; x.material = x.userData.kfbClayOrig } else if (x.userData.__clay) { x.material = x.userData.__clay; delete x.userData.__clay } }) },
      box() { const o = fig().object3d, cam = M.camera3(), mn = [1e9, 1e9], mx = [-1e9, -1e9], v = new o.position.constructor(); let n = 0
        o.updateWorldMatrix(true, true)
        o.traverse((x) => { if (!x.isMesh || !x.visible || !x.geometry) return; if (!x.geometry.boundingBox) x.geometry.computeBoundingBox(); const bb = x.geometry.boundingBox
          for (let i = 0; i < 8; i++) { v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(x.matrixWorld).project(cam); mn[0] = Math.min(mn[0], v.x); mn[1] = Math.min(mn[1], v.y); mx[0] = Math.max(mx[0], v.x); mx[1] = Math.max(mx[1], v.y); n++ } })
        return n ? { x0: (mn[0] * 0.5 + 0.5) * innerWidth, x1: (mx[0] * 0.5 + 0.5) * innerWidth, y0: (-mx[1] * 0.5 + 0.5) * innerHeight, y1: (-mn[1] * 0.5 + 0.5) * innerHeight } : null } }
  }, KIT)
  const at = await page.evaluate(() => { const p = window.__kfbM1.npc().debug.find((b) => b.id === 'lorekeeper'); return [p.x, p.z] })
  await stand(page, at, 9, [0.7071, -0.7071]); await page.waitForTimeout(2500)
  // Spieler 2,6 m davor: der Bewohner bleibt stehen und schaut ihn an (Bemerken); dann Spielfigur ausblenden und die Kamera auf die Figur (≈ 70 % der Bildhöhe)
  await stand(page, await page.evaluate(() => { const p = window.__kfbM1.npc().debug.find((b) => b.id === 'lorekeeper'); return [p.x, p.z] }), 2.6, [0.7071, -0.7071]); await page.waitForTimeout(4000)
  await page.waitForFunction(() => { const f = window.__kc.fig(); return window.__kfbM1.mods.clay.entries().some((e) => e.module === f) }, null, { timeout: 30000 }).catch(() => {})
  // Spielfigur ausblenden, Welt einfrieren, dann ein Ausschnitt des Bildfelds um die Figur (setViewOffset: volle Auflösung, kein Hochskalieren), Figur ≈ 72 % der Höhe
  await page.evaluate(() => { window.__kfbM1.mods.player.object3d.visible = false; window.__kfbM1.clock.hidden = true }); await raf(4)
  const b0 = await page.evaluate(() => window.__kc.box())
  const cam = await page.evaluate((b) => { const cam = window.__kfbM1.camera3(), W = innerWidth, H = innerHeight, h = (b.y1 - b.y0) / 0.72, w = (h * W) / H, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2
    cam.setViewOffset(W, H, cx - w / 2, cy - h / 2, w, h); cam.updateProjectionMatrix(); return { viewOffset: [+(cx - w / 2).toFixed(1), +(cy - h / 2).toFixed(1), +w.toFixed(1), +h.toFixed(1)], zoom: +(H / h).toFixed(2) } }, b0)
  await raf(4)
  const box = await page.evaluate(() => window.__kc.box())
  const ST = [['0', 'Stufe 0 – heute', 'Original-Material, keine Knete (so sieht das Spiel heute aus)'], ['1', 'Stufe 1 – Knete wie die Hauptfiguren', 'character-Profil (wie Spielfigur und Partnerin), mit Fix'], ['2', 'Stufe 2 – Knete für Kit-Figuren', 'kit-figure: kräftigere Dellen und Beulen, auf Spielkamera-Abstand abgestimmt']]
  const files = {}
  await page.evaluate(() => window.__kc.stage0(true)); await raf(); files['0'] = await jpg(page, 'kitclay-lorekeeper-0.jpg'); await page.evaluate(() => window.__kc.stage0(false))
  await page.evaluate(() => window.__kc.set(false)); await raf(); files['1'] = await jpg(page, 'kitclay-lorekeeper-1.jpg')
  await page.evaluate(() => window.__kc.set(true)); await raf(); files['2'] = await jpg(page, 'kitclay-lorekeeper-2.jpg')
  await page.evaluate(() => { window.__kc.set(false); const c = window.__kfbM1.camera3(); c.clearViewOffset(); c.updateProjectionMatrix(); window.__kfbM1.clock.hidden = false })
  await browser.close()
  for (const [k, t, s] of ST) index.dateien.push({ teil: 'kitclay', datei: `kitclay-lorekeeper-${k}.jpg`, objekt: 'Lorekeeper (Bewohner), Nahbild aus der Spielkamera (Ausschnitt per setViewOffset, Spielfigur ausgeblendet)', fall: t, hash, moment: 'alle drei Stufen im selben eingefrorenen Bild, nur Material/Uniforms getauscht', zeileFuerGeorg: `${t}: ${s}.` })
  // Abnahmekarte: drei Ausschnitte derselben Figur nebeneinander (Figur ≈ 80 % der Ausschnitthöhe), beschriftet, Klartext und Empfehlung
  const m = 0.08, bw = box.x1 - box.x0, bh = box.y1 - box.y0, side = Math.max(bw, bh * 0.75) * (1 + 2 * m), cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2
  const cr = { left: Math.max(0, Math.round((cx - side / 2) * DPR)), top: Math.max(0, Math.round((cy - (bh * (1 + 2 * m)) / 2) * DPR)) }
  cr.width = Math.min(W * DPR - cr.left, Math.round(side * DPR)); cr.height = Math.min(H * DPR - cr.top, Math.round(bh * (1 + 2 * m) * DPR))
  const TW = 900, TH = Math.round((TW * cr.height) / cr.width), pad = 40, head = 120, foot = 300, CW = 3 * TW + 4 * pad, CH = head + TH + foot
  const tiles = await Promise.all(['0', '1', '2'].map((k) => sharp(files[k]).extract(cr).resize(TW, TH).toBuffer()))
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const txt = (x, y, s, size, weight = 400, fill = '#2a1a0c') => `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`
  const svg = `<svg width="${CW}" height="${CH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f4e7cf"/>
    ${ST.map(([k, t, s], i) => txt(pad + i * (TW + pad), 62, t, 40, 700) + txt(pad + i * (TW + pad), 100, s, 24)).join('')}
    ${txt(pad, head + TH + 70, 'Worum es geht: Sollen die Bewohner, Skelette, Soldaten und Bots dieselbe Knet-Oberfläche bekommen wie die Hauptfiguren? Heute haben sie keine (Stufe 0).', 30, 700)}
    ${txt(pad, head + TH + 120, 'Stufe 1 nimmt das Knet-Profil der Hauptfiguren; Stufe 2 verstärkt Dellen und Beulen, damit sie aus der Spielkamera (6–20 m) noch zu sehen sind.', 28)}
    ${txt(pad, head + TH + 170, 'Augen, Lider und Mund bleiben in allen Stufen unberührt; Farbe gleich (ΔE ≤ 0,3), Kosten gleich (gleiche Shader).', 28)}
    ${txt(pad, head + TH + 235, 'Empfehlung WS-NPC: Stufe 2 – nur dort ist die Knete auf Spieldistanz gut sichtbar (Relief 1,6–1,9 × Stufe 1 bei 12–20 m, nah 1,46 ×; Messung 22.10.).', 30, 700, '#7a2e10')}
  </svg>`
  await sharp(Buffer.from(svg)).composite(tiles.map((b, i) => ({ input: b, left: pad + i * (TW + pad), top: head }))).jpeg({ quality: 88 }).toFile(`${OUT}/kitclay-karte.jpg`)
  index.dateien.push({ teil: 'kitclay', datei: 'kitclay-karte.jpg', objekt: 'Lorekeeper', fall: 'Abnahmekarte Stufe 0/1/2', hash, zeileFuerGeorg: 'Dieselbe Figur in drei Knet-Stufen nebeneinander; bitte eine Stufe wählen (Empfehlung: Stufe 2).' })
  index.kitclay = { hash, box, crop: cr, kamera: cam, errs: errs.slice(0, 3), quelleMesswerte: 'research/audits/abnahme/kitclay2/index.json (22.10., K3/K4/K6)' }
  console.log(JSON.stringify({ box, crop: cr }))
}
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 1))
console.log(JSON.stringify({ out: OUT, files: index.dateien.map((d) => d.datei) }))
