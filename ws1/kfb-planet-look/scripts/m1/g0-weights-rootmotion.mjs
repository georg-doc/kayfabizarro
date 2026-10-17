// G0 M1 (Briefing BRIEF_WS1_M1_BEWEGUNG_R1): node scripts/m1/<datei> <FB.glb> <Clip-Paket.glb …> [Maßstab]. Clip-Pakete: KayKit Character Animations 1.1 @378b2093 (git show), lokal ~/kfb-ws1/intake/loco/
import fs from 'fs'
const load = (f) => { const b = fs.readFileSync(f); let o = 12, g, bin; while (o < b.length) { const cl = b.readUInt32LE(o), ct = b.toString('ascii', o + 4, o + 8), c = b.subarray(o + 8, o + 8 + cl); if (ct === 'JSON') g = JSON.parse(c); else bin = c; o += 8 + cl } return { g, bin } }
const read = ({ g, bin }, ai) => {
  const a = g.accessors[ai], bv = g.bufferViews[a.bufferView], n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type], cs = { 5126: 4, 5121: 1, 5123: 2 }[a.componentType]
  const st = bv.byteStride || n * cs, base = bin.byteOffset + (bv.byteOffset || 0) + (a.byteOffset || 0), dv = new DataView(bin.buffer), out = []
  for (let i = 0; i < a.count; i++) { const v = []; for (let k = 0; k < n; k++) { const o = base + i * st + k * cs; v.push(cs === 4 ? dv.getFloat32(o, true) : cs === 2 ? dv.getUint16(o, true) : dv.getUint8(o)) } out.push(v) }
  return out
}
const fb = load(process.argv[2]); const skin = fb.g.skins[0], names = skin.joints.map((j) => fb.g.nodes[j].name), sum = {}
for (const m of fb.g.meshes) for (const p of m.primitives) if (p.attributes.JOINTS_0 != null) {
  const J = read(fb, p.attributes.JOINTS_0), W = read(fb, p.attributes.WEIGHTS_0)
  J.forEach((js, i) => js.forEach((j, k) => { if (W[i][k] > 0.001) sum[names[j]] = (sum[names[j]] || 0) + W[i][k] }))
}
console.log('gewichtete Knochen:', Object.entries(sum).map(([k, v]) => k + ':' + v.toFixed(0)).join(' '))
for (const f of process.argv.slice(3)) {
  const pk = load(f); console.log('==', f.split('/').pop())
  for (const a of pk.g.animations) {
    const tr = a.channels.filter((c) => c.target.path === 'translation' && /^(root|hips)$/.test(pk.g.nodes[c.target.node].name)).map((c) => {
      const s = a.samplers[c.sampler], t = read(pk, s.input), v = read(pk, s.output)
      return `${pk.g.nodes[c.target.node].name} Δ=[${v.at(-1).map((x, i) => (x - v[0][i]).toFixed(3))}]`
    })
    const T = read(pk, a.samplers[0].input).at(-1)[0]
    console.log(' ', a.name, 'T=' + T.toFixed(3), tr.join(' | '))
  }
}
