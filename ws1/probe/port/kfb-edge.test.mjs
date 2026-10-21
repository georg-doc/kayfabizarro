/* kfb-edge.v1 · Node-Test ohne Browser. Aufruf: node kfb-edge.test.mjs */
import fs from 'fs'
import vm from 'vm'
import path from 'path'
import crypto from 'crypto'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
vm.runInThisContext(fs.readFileSync(path.join(HERE, 'kfb-edge.v1.js'), 'utf8'), { filename: 'kfb-edge.v1.js' })
const E = globalThis.KFB_EDGE, X = E._
const REPO = process.env.KFB_REPO || path.join(process.env.HOME, 'kfb-ws1', 'kayfabizarro'), COMMIT = 'e77445fde'
const JSON_PATH = 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/CANON_3D/lib/kfb_edge_params.json'
const results = []
const check = (name, ok, info) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  · ' + info : ''}`) }
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex')

/* Anker wie in der Probe (DISCO_A, BAND_A) + gedrehte Box; Stärken wie in der Vorschau */
const DISCO = { x: 137.4, z: -58.2, R: 9.5, y: 3.1, hx: 0, hz: 0, rot: 0, blend: 10 }
const BAND = { x: 152.6, z: -44.9, R: 0.6, y: 3.4, hx: 3.3, hz: 3.65, rot: 0.73, blend: 6 }
const CASES = [['disco', DISCO, 1], ['band', BAND, 1], ['disco·3.5', { ...DISCO, strength: 3.5 }, 3.5], ['band·2.5', { ...BAND, strength: 2.5 }, 2.5]]

/* 1 · D monoton nach außen (entlang der Normalen der Grundform, im aktiven Band), Stufen A → D in Reihenfolge */
{
  let maxG = 0; for (let i = 0; i < 400; i++) for (let j = 0; j < 400; j++) { const x = -40 + i * 0.2, z = -40 + j * 0.2, e = 1e-4; const g = Math.hypot((X.warpQ(x + e, z) - X.warpQ(x - e, z)) / (2 * e), (X.warpQ(x, z + e) - X.warpQ(x, z - e)) / (2 * e)); if (g > maxG) maxG = g }
  let rays = 0, bad = 0, badStage = 0, minStep = Infinity
  for (const [, A0, st] of CASES) {
    const a = X.anc(A0)
    /* Randpunkte der abgerundeten Box: Gerade Seiten + Viertelkreise, Normale analytisch */
    const pts = []; const cs = Math.cos(a.rot), sn = Math.sin(a.rot), W = (u, v) => [a.x + cs * u - sn * v, a.z + sn * u + cs * v]
    for (let k = 0; k < 720; k++) { const t = k / 720 * Math.PI * 2, cx = Math.sign(Math.cos(t)) * a.hx, cz = Math.sign(Math.sin(t)) * a.hz, u = cx + Math.cos(t) * a.R, v = cz + Math.sin(t) * a.R; pts.push([W(u, v), [cs * Math.cos(t) - sn * Math.sin(t), sn * Math.cos(t) + cs * Math.sin(t)]]) }
    for (let k = 0; k < 200; k++) { const f = k / 199 * 2 - 1; for (const [u, v, nu, nv] of [[a.hx + a.R, f * a.hz, 1, 0], [-a.hx - a.R, f * a.hz, -1, 0], [f * a.hx, a.hz + a.R, 0, 1], [f * a.hx, -a.hz - a.R, 0, -1]]) if (a.hx > 0) pts.push([W(u, v), [cs * nu - sn * nv, sn * nu + cs * nv]]) }
    const tIn = -(1.0 * st + 0.6)
    for (const [p, n] of pts) {
      rays++; let last = -1, lastStage = 0, ok = true, okS = true
      for (let t = tIn; t <= 1.0; t += 0.02) {
        const x = p[0] + n[0] * t, z = p[1] + n[1] * t
        const gx = X.sdfXZ(x + 1e-4, z, a) - X.sdfXZ(x - 1e-4, z, a), gz = X.sdfXZ(x, z + 1e-4, a) - X.sdfXZ(x, z - 1e-4, a), gl = Math.hypot(gx, gz) || 1
        if ((gx * n[0] + gz * n[1]) / gl < 0.9998) continue   /* innen hinter der Mittelachse: andere Seite zuständig, kein Strahl der Grundform */
        const d = X.DXZ(x, z, a, st); if (last >= 0) { minStep = Math.min(minStep, d - last); if (d < last - 1e-12) ok = false }
        const sg = d < X.sm(0, 1, 0) + 0.15 ? 0 : d < 0.4 ? 1 : d < 0.6 ? 2 : d < 0.8 ? 3 : 4; if (sg < lastStage) okS = false; lastStage = sg; last = d
      }
      if (!ok) bad++; if (!okS) badStage++
    }
  }
  check('D() monoton nach außen, Stufen A → D', bad === 0 && badStage === 0 && maxG < 1, `${rays} Strahlen, ${bad} nicht monoton, ${badStage} Stufenfolge verletzt, max |∇warp| = ${maxG.toFixed(3)} (< 1 ⇒ monoton), kleinster Schritt ${minStep.toExponential(2)}`)
}

/* Läufe für die Stück-Prüfungen */
const runs = []
for (const [name, A, st] of CASES) for (const seed of ['t1', 't2', 't3']) { const t0 = performance.now(); const r = E.freeEnd(A, { seed: name + ':' + seed, groundAt: () => A.y }); runs.push({ name, seed, st, A, r, ms: performance.now() - t0 }) }

/* 2 · fehlende Stücke nur ab D ≥ 0,7 und höchstens 45 % */
{
  let minMiss = Infinity, miss = 0, keep7 = 0, top = 0, topMiss = 0
  for (const { r } of runs) { for (const d of r.report.missingD) { minMiss = Math.min(minMiss, d); miss++; if (d >= 0.9) topMiss++ } for (const d of r.report.piecesD) { if (d >= 0.7) keep7++; if (d >= 0.9) top++ } }
  const frac = miss / Math.max(1, miss + keep7), fracTop = topMiss / Math.max(1, topMiss + top)
  check('fehlende Stücke nur ab D ≥ 0,7, höchstens 45 %', minMiss >= 0.7 && frac <= 0.45, `${miss} fehlend, kleinstes D ${minMiss.toFixed(3)}, Anteil an D ≥ 0,7: ${(frac * 100).toFixed(1)} % (D ≥ 0,9: ${(fracTop * 100).toFixed(1)} %)`)
}

/* 3 · kein gerades Randstück > 1 m in der Farbmaske (Isolinie earth = 0, Raster 5 cm) */
{
  let worst = 0, minDev = Infinity, loopsN = 0, ptsN = 0, bandMin = Infinity, bandMax = 0
  for (const [, A0] of CASES.slice(0, 2)) {
    const a = X.anc(A0), h = 0.05, ext = Math.max(a.hx, a.hz) + a.R + 3, n = Math.ceil(2 * ext / h), x0 = a.x - ext, z0 = a.z - ext, G = new Float64Array((n + 1) * (n + 1))
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) G[j * (n + 1) + i] = -X.earthXZ(x0 + i * h, z0 + j * h, a)   /* innen < 0 = Erde */
    const loops = X.marching(G, n, n, (i, j) => [x0 + i * h, z0 + j * h]); loopsN += loops.length
    for (const L of loops) {
      ptsN += L.length; const m = L.length
      for (let i = 0; i < m; i++) {
        let j = i, len = 0
        while (len < 1.0 && j - i < m) { const p = L[j % m], q = L[(j + 1) % m]; len += Math.hypot(q[0] - p[0], q[1] - p[1]); j++ }
        if (len < 1.0 || j - i >= m) continue   /* ganzer Umriss kürzer als 1 m: kein Randstück */
        const A = L[i], B = L[j % m], dx = B[0] - A[0], dz = B[1] - A[1], c = Math.hypot(dx, dz) || 1; let dev = 0
        for (let k = i + 1; k < j; k++) { const P = L[k % m]; dev = Math.max(dev, Math.abs((P[0] - A[0]) * dz - (P[1] - A[1]) * dx) / c) }
        minDev = Math.min(minDev, dev); if (dev < 0.01) worst = Math.max(worst, len)   /* gerade = alle Punkte ≤ 1 cm an der Sehne */
      }
    }
    /* Breite des Sprenkelbands (radial, Info für Plan Schritt 5) */
    for (let k = 0; k < 360; k++) { const t = k / 360 * Math.PI * 2; let first = null, last = null; for (let r = 0; r < ext; r += 0.02) { const x = a.x + Math.cos(t) * r, z = a.z + Math.sin(t) * r, e = X.earthXZ(x, z, a), s = X.sXZ(x, z, a); if (Math.abs(s - 0.55) < 1.2) { if (e <= 0 && first === null) first = r; if (e > 0) last = r } } if (first !== null && last !== null && last > first) { bandMin = Math.min(bandMin, last - first); bandMax = Math.max(bandMax, last - first) } }
  }
  check('kein gerades Randstück > 1 m in der Farbmaske', worst === 0, `${loopsN} Umrisse, ${ptsN} Randpunkte, längstes gerades Stück ${worst.toFixed(2)} m, kleinste Abweichung von der 1-m-Sehne ${(minDev * 100).toFixed(1)} cm; Sprenkelband radial ${bandMin === Infinity ? 0 : bandMin.toFixed(2)}–${bandMax.toFixed(2)} m`)
}

/* 4 · Dreiecks-Budget ≤ 20 k je Anker, Index passt */
{
  let ok = true, mx = 0; const info = []
  for (const { name, seed, r } of runs) { const t = r.index.length / 3; if (t !== r.report.tris || t > 20000 || r.positions.length !== r.normals.length) ok = false; mx = Math.max(mx, t); if (seed === 't1') info.push(`${name} ${t}`) }
  for (const { r } of runs) for (let i = 0; i < r.index.length; i++) if (r.index[i] >= r.positions.length / 3) { ok = false; break }
  check('Dreiecks-Budget ≤ 20 000 je Anker', ok, `max ${mx}; ${info.join(', ')}`)
}

/* 5 · deterministisch bei gleicher Saat, anders bei anderer */
{
  const fp = (r) => sha(Buffer.concat([Buffer.from(r.positions.buffer), Buffer.from(r.normals.buffer), Buffer.from(r.index.buffer)])).slice(0, 12)
  const a1 = fp(E.freeEnd(DISCO, { seed: 'det' })), a2 = fp(E.freeEnd(DISCO, { seed: 'det' })), b1 = fp(E.freeEnd(BAND, { seed: 'det' })), b2 = fp(E.freeEnd(BAND, { seed: 'det' })), c = fp(E.freeEnd(DISCO, { seed: 'det2' }))
  const n1 = JSON.stringify(E.rubbleNests(DISCO, [{ x: 147, z: -58 }, { x: 137, z: -47 }], { seed: 'det' })), n2 = JSON.stringify(E.rubbleNests(DISCO, [{ x: 147, z: -58 }, { x: 137, z: -47 }], { seed: 'det' }))
  check('deterministisch bei gleicher Saat', a1 === a2 && b1 === b2 && a1 !== c && n1 === n2, `disco ${a1} = ${a2}, band ${b1} = ${b2}, andere Saat ${c}`)
}

/* 6 · Parameter-SHA = JSON im Register */
{
  let fileBuf = null, src = ''
  try { fileBuf = execFileSync('git', ['-C', REPO, 'show', `${COMMIT}:${JSON_PATH}`]); src = `git ${COMMIT}` } catch (e) { src = 'git nicht lesbar: ' + e.message.split('\n')[0] }
  const ok = !!fileBuf && sha(fileBuf) === E.paramsSha && sha(Buffer.from(E.paramsText, 'utf8')) === E.paramsSha && JSON.stringify(JSON.parse(fileBuf.toString('utf8'))) === JSON.stringify(E.params)
  check('Parameter-SHA = kfb_edge_params.json', ok, `${E.paramsSha.slice(0, 16)}… (${src})`)
}

/* Zusatz: Rubbel-Nester regelkonform (nest_ok) */
{
  const R = E.rubbleNests(BAND, [{ x: 150, z: -40 }, { x: 156, z: -48 }, { x: 149, z: -49, count: 5, R: 0.16 }, { x: 155, z: -41, count: 7, R: 0.16 }], { seed: 'band-kontakt', groundAt: () => BAND.y })
  check('Rubbel-Nester regelkonform (nest_ok)', R.report.rule_ok.every(Boolean) && R.length === 3 + 3 + 5 + 7, `${R.length} Steinchen in ${R.report.nests} Nestern, r ${Math.min(...R.map((q) => q.r)).toFixed(3)}–${Math.max(...R.map((q) => q.r)).toFixed(3)}`)
}

console.log('\nBericht (wie rep in Python):')
for (const { name, seed, r, ms } of runs.filter((q) => q.seed === 't1')) { const p = r.report; console.log(`  ${name.padEnd(10)} tiles_in ${p.tiles_in} · tiles_cut ${p.tiles_cut} · intact ${p.intact_tiles} · rest ${p.intact_rest} · pieces ${p.pieces} · missing ${p.missing} · Stufen A/B/C/D ${p.stages.A}/${p.stages.B}/${p.stages.C}/${p.stages.D} · tris ${p.tris} · verts ${p.verts} · ${ms.toFixed(0)} ms`) }
const nPass = results.filter(Boolean).length
console.log(`\n${nPass === results.length ? 'PASS' : 'FAIL'} ${nPass}/${results.length}`)
process.exit(nPass === results.length ? 0 : 1)
