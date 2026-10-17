// M1 · Live = Replay, unabhängig von der Bildrate (Prüfer M1-3, Befund 1): Die Kennzahlen von m1-move bei 120 Hz (ein Schritt je zweitem Bild) und
// 30 Hz (zwei Schritte je Bild) müssen denen bei 60 Hz gleichen. Liest die Logs aus run-all (test/out/m1/logs/m1-move*.log).
// Toleranz: 0,5 cm bei Längen, 0,01 beim Rutschanteil, 0,02 m bei Höhen (Gleitkomma, gleiche Schritte).
import fs from 'fs'
const read = (f) => { const l = fs.readFileSync(f, 'utf8').split('\n').find((x) => x.startsWith('{')); return l ? JSON.parse(l) : null }
const L = { 60: read('test/out/m1/logs/m1-move.log'), 120: read('test/out/m1/logs/m1-move-120.log'), 30: read('test/out/m1/logs/m1-move-30.log') }
const diffs = []
const cmp = (a, b, path, tol) => {
  if (typeof a === 'number' && typeof b === 'number') { if (Math.abs(a - b) > tol) diffs.push({ path, a, b }) }
  else if (a && b && typeof a === 'object') for (const k of Object.keys(a)) cmp(a[k], b[k], path + '.' + k, /slipRatio|slipSpeed/.test(k) ? 0.01 : /Cm$|creepCm/.test(k) ? 0.5 : 0.02)
}
for (const hz of [120, 30]) { if (!L[60] || !L[hz]) { diffs.push({ path: 'log fehlt ' + hz }); continue } for (const k of ['feet', 'pen', 'v248', 'restLiftCm', 'slopeRise']) cmp(L[60][k], L[hz][k], hz + '.' + k, 0.5) }
console.log(JSON.stringify({ diffs: diffs.slice(0, 20), n: diffs.length }))
console.log(diffs.length ? 'FAIL m1-hz-equal' : 'PASS m1-hz-equal')
process.exit(diffs.length ? 1 : 0)
