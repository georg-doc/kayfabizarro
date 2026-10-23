// WS-Audio · jsDelivr vorwärmen (Recherche MUSIK_AUSLIEFERUNG_R1: erster Abruf einer neuen Datei ≈ 4,4 s, danach ≈ 50 ms). Nach jedem Ton-Commit
// einmal alle Dateien der Ablage über den ersten Host abrufen, damit kein Spieler den Kaltstart erlebt. Liest den Commit aus scripts/audio/remote.json,
// die Dateiliste aus der lokalen Ablage (site-copy.mjs --publish). Aufruf: node scripts/audio/warm-cdn.mjs [ablage] [--fallback]
import fs from 'fs'
import os from 'os'
import path from 'path'

const args = process.argv.slice(2), PUB = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(os.homedir(), 'kfb-ws1/.kfb-audio-publish/r1'))
const R = JSON.parse(fs.readFileSync(new URL('./remote.json', import.meta.url), 'utf8'))
if (!R.commit) { console.error('[warm] kein Commit in scripts/audio/remote.json'); process.exit(2) }
const fill = (u) => u.replace('{repo}', R.repo).replace('{commit}', R.commit).replace('{path}', R.path), base = fill(args.includes('--fallback') ? R.fallback : R.primary)
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(path.relative(PUB, p).split(path.sep).join('/')) } })(PUB)
const res = []; let k = 0
const worker = async () => { while (k < files.length) { const f = files[k++], url = base + f.split('/').map(encodeURIComponent).join('/'), t0 = performance.now()
  try { const r = await fetch(url), t1 = performance.now(); await r.arrayBuffer(); res.push({ f, status: r.status, ttfb: Math.round(t1 - t0), ms: Math.round(performance.now() - t0) }) } catch (e) { res.push({ f, status: 0, err: String(e.message || e) }) }
  process.stdout.write(`\r[warm] ${res.length}/${files.length}`) } }
await Promise.all(Array.from({ length: 6 }, worker))
const bad = res.filter((r) => r.status !== 200), t = res.filter((r) => r.ttfb != null).map((r) => r.ttfb).sort((a, b) => a - b), q = (p) => t[Math.min(t.length - 1, Math.floor(p * t.length))]
console.log('\n' + JSON.stringify({ base, files: files.length, ok: res.length - bad.length, bad: bad.slice(0, 10), ttfbMs: { p50: q(0.5), p95: q(0.95), max: t.at(-1) } }))
process.exit(bad.length ? 1 : 0)
