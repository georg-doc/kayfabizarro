import fs from 'fs'; import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const dir = process.argv[2]
const br = await chromium.launch(); const pg = await br.newPage()
const out = {}
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.glb'))) {
  const b = fs.readFileSync(dir + '/' + f)
  const len = b.readUInt32LE(12); const g = JSON.parse(b.slice(20, 20 + len).toString()); const bin = b.slice(20 + len + 8)
  const m = g.materials[0], p = m.pbrMetallicRoughness
  const img = (ti) => { const t = g.textures[ti.index], src = t.source ?? Object.values(t.extensions || {})[0]?.source, im = g.images[src], bv = g.bufferViews[im.bufferView]; return { mime: im.mimeType, b64: bin.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength).toString('base64') } }
  const r = await pg.evaluate(async ({ col, mr }) => {
    const dec = async (o) => { const bl = await (await fetch(`data:${o.mime};base64,${o.b64}`)).blob(); const bm = await createImageBitmap(bl); const S = 256, c = new OffscreenCanvas(S, S), x = c.getContext('2d'); x.drawImage(bm, 0, 0, S, S); return x.getImageData(0, 0, S, S).data }
    const C = await dec(col), M = await dec(mr); let n = 0, met = 0, rou = 0, metHi = 0, lum = 0, sat = 0, lumMet = 0, nMet = 0
    for (let i = 0; i < C.length; i += 4) { if (C[i + 3] < 10) continue; n++; const mt = M[i + 2] / 255, ro = M[i + 1] / 255; met += mt; rou += ro; if (mt > 0.5) { metHi++; lumMet += (C[i] + C[i + 1] + C[i + 2]) / 765; nMet++ }
      const mx = Math.max(C[i], C[i + 1], C[i + 2]), mn = Math.min(C[i], C[i + 1], C[i + 2]); lum += (C[i] + C[i + 1] + C[i + 2]) / 765; sat += mx ? (mx - mn) / mx : 0 }
    return { metal: +(met / n).toFixed(2), metalShare: +(metHi / n).toFixed(2), rough: +(rou / n).toFixed(2), lum: +(lum / n).toFixed(2), sat: +(sat / n).toFixed(2), lumOnMetal: nMet ? +(lumMet / nMet).toFixed(2) : null }
  }, { col: img(p.baseColorTexture), mr: img(p.metallicRoughnessTexture) })
  out[f.replace('.glb', '')] = r; console.log(f.replace('.glb', '').padEnd(26), JSON.stringify(r))
}
fs.writeFileSync('/tmp/claude-503/mrstats.json', JSON.stringify(out, null, 1)); await br.close()
