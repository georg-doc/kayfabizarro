// G0 M1 (Briefing BRIEF_WS1_M1_BEWEGUNG_R1): node scripts/m1/<datei> <FB.glb> <Clip-Paket.glb …> [Maßstab]. Clip-Pakete: KayKit Character Animations 1.1 @378b2093 (git show), lokal ~/kfb-ws1/intake/loco/
import fs from 'fs'
const rd = (f) => { const b = fs.readFileSync(f); let o = 12; const cl = b.readUInt32LE(o); return JSON.parse(b.subarray(o + 8, o + 8 + cl).toString('utf8')) }
const fb = rd(process.argv[2]), packs = process.argv.slice(3).map((f) => [f.split('/').pop(), rd(f)])
const joints = (g) => { const s = new Set(); (g.skins || []).forEach((k) => k.joints.forEach((j) => s.add(g.nodes[j].name))); return s }
const fbJ = joints(fb)
console.log('FB skins', fb.skins?.length, 'joints', fbJ.size, 'anims', fb.animations?.length || 0)
console.log('FB joints:', [...fbJ].join(' '))
for (const [n, g] of packs) {
  const pj = joints(g)
  const missingInFB = [...pj].filter((x) => !fbJ.has(x)), extraFB = [...fbJ].filter((x) => !pj.has(x))
  console.log(`\n== ${n}: joints ${pj.size}; fehlt in FB: ${missingInFB.join(',') || '-'}; nur FB: ${extraFB.join(',') || '-'}`)
  console.log('clips:', (g.animations || []).map((a) => a.name).join(', '))
  // Bindepose-Vergleich Ruhe-Rotation/Translation je gemeinsamen Knochen
  const byName = (gg) => Object.fromEntries(gg.nodes.map((x) => [x.name, x]))
  const A = byName(fb), B = byName(g); let worstR = [0, ''], worstT = [0, '']
  for (const k of pj) if (A[k] && B[k]) {
    const ra = A[k].rotation || [0, 0, 0, 1], rb = B[k].rotation || [0, 0, 0, 1]; const dot = Math.abs(ra.reduce((s, v, i) => s + v * rb[i], 0)); const ang = 2 * Math.acos(Math.min(1, dot)) * 180 / Math.PI
    const ta = A[k].translation || [0, 0, 0], tb = B[k].translation || [0, 0, 0]; const lt = Math.hypot(...tb), dt = Math.hypot(...ta.map((v, i) => v - tb[i])) / Math.max(lt, 1e-6)
    if (ang > worstR[0]) worstR = [ang, k]; if (lt > 1e-4 && dt > worstT[0]) worstT = [dt, k]
  }
  console.log('Bindepose: max Rotationsdiff', worstR[0].toFixed(2) + '°', worstR[1], '| max rel. Längendiff', (worstT[0] * 100).toFixed(1) + '%', worstT[1])
}
