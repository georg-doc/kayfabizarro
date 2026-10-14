// GLB-Inventur ohne Abhängigkeiten: Knoten, Meshes, Dreiecke, Maße, Materialien, eingebettete Bilder (Größe aus dem Header)
import fs from 'fs'
const f = process.argv[2], b = fs.readFileSync(f)
const magic = b.toString('ascii', 0, 4), ver = b.readUInt32LE(4), len = b.readUInt32LE(8)
let o = 12, g = null, bin = null
while (o < len) { const cl = b.readUInt32LE(o), ct = b.toString('ascii', o + 4, o + 8), c = b.subarray(o + 8, o + 8 + cl); if (ct === 'JSON') g = JSON.parse(c.toString('utf8')); else bin = c; o += 8 + cl }
const acc = g.accessors
let tris = 0, verts = 0; const prims = []
for (const m of g.meshes) for (const p of m.primitives) { const pos = acc[p.attributes.POSITION]; verts += pos.count; const t = p.indices != null ? acc[p.indices].count / 3 : pos.count / 3; tris += t; prims.push({ mesh: m.name, mode: p.mode ?? 4, verts: pos.count, tris: t, attrs: Object.keys(p.attributes), material: p.material, min: pos.min, max: pos.max }) }
const imgs = (g.images || []).map((im, i) => { const bv = g.bufferViews[im.bufferView]; const d = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength); let w = null, h = null
  if (im.mimeType === 'image/png') { w = d.readUInt32BE(16); h = d.readUInt32BE(20) } else if (im.mimeType === 'image/jpeg') { let k = 2; while (k < d.length - 9) { if (d[k] !== 0xff) { k++; continue } const mk = d[k + 1], sl = d.readUInt16BE(k + 2); if (mk >= 0xc0 && mk <= 0xc3) { h = d.readUInt16BE(k + 5); w = d.readUInt16BE(k + 7); break } k += 2 + sl } }
  return { i, name: im.name, mime: im.mimeType, bytes: bv.byteLength, w, h } })
console.log(JSON.stringify({ magic, ver, len, generator: g.asset?.generator, gltf: g.asset?.version, extensionsUsed: g.extensionsUsed || [], extensionsRequired: g.extensionsRequired || [], scenes: g.scenes?.length,
  nodes: g.nodes.map((n) => ({ name: n.name, mesh: n.mesh, children: n.children, t: n.translation, r: n.rotation, s: n.scale, matrix: n.matrix })), meshes: g.meshes.length, prims, totals: { verts, tris },
  materials: (g.materials || []).map((m) => ({ name: m.name, base: m.pbrMetallicRoughness?.baseColorTexture?.index, baseFactor: m.pbrMetallicRoughness?.baseColorFactor, mr: m.pbrMetallicRoughness?.metallicRoughnessTexture?.index, metal: m.pbrMetallicRoughness?.metallicFactor, rough: m.pbrMetallicRoughness?.roughnessFactor, normal: m.normalTexture?.index, emissive: m.emissiveTexture?.index, occlusion: m.occlusionTexture?.index, doubleSided: m.doubleSided, alpha: m.alphaMode, ext: Object.keys(m.extensions || {}) })),
  textures: g.textures, images: imgs, samplers: g.samplers, animations: g.animations?.length || 0, skins: g.skins?.length || 0, binBytes: bin?.length }, null, 1))
