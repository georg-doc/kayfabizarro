#!/usr/bin/env node
// KFB GEM_R1 · compose several GLBs into one test GLB (no re-encoding: JSON + BIN merged, indices offset). Each input becomes one
// top-level placement node (translation in the input's own units, yaw in degrees). Extras are kept as they are.
//   node compose-glb.mjs <layout.json> <out.glb>
//   layout.json: { "items": [ { "glb": "/abs/path.glb", "name": "slot", "t": [x,y,z], "yaw": 0, "extras": {...}? }, ... ] }
import fs from 'node:fs';

const [layoutPath, outPath] = process.argv.slice(2);
if (!layoutPath || !outPath) { console.error('usage: node compose-glb.mjs <layout.json> <out.glb>'); process.exit(2); }
const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));

function readGlb(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB: ' + file);
  let off = 12, json = null, bin = Buffer.alloc(0);
  while (off < b.length) {
    const len = b.readUInt32LE(off), type = b.readUInt32LE(off + 4), data = b.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8')); else if (type === 0x004e4942) bin = Buffer.from(data);
    off += 8 + len;
  }
  return { json, bin };
}

const out = { asset: { version: '2.0', generator: 'KFB GEM_R1 compose-glb' }, scene: 0, scenes: [{ name: 'Scene', nodes: [] }], nodes: [], meshes: [], accessors: [], bufferViews: [], buffers: [], materials: [], textures: [], images: [], samplers: [] };
const used = new Set(), bins = []; let binLen = 0;
const remapTex = (o, texOff) => { if (!o || typeof o !== 'object') return; for (const [k, v] of Object.entries(o)) { if (v && typeof v === 'object') { if (/Texture$/.test(k) && typeof v.index === 'number') v.index += texOff; remapTex(v, texOff); } } };

for (const it of layout.items) {
  const { json: j, bin } = readGlb(it.glb);
  const pad = (4 - (binLen % 4)) % 4; if (pad) { bins.push(Buffer.alloc(pad)); binLen += pad; }
  const binOff = binLen; bins.push(bin); binLen += bin.length;
  const o = { bv: out.bufferViews.length, acc: out.accessors.length, mesh: out.meshes.length, mat: out.materials.length, node: out.nodes.length, tex: out.textures.length, img: out.images.length, smp: out.samplers.length };
  for (const bv of j.bufferViews || []) out.bufferViews.push({ ...bv, buffer: 0, byteOffset: (bv.byteOffset || 0) + binOff });
  for (const a of j.accessors || []) { const c = { ...a }; if (c.bufferView !== undefined) c.bufferView += o.bv; if (c.sparse) throw new Error('sparse accessors not supported'); out.accessors.push(c); }
  for (const im of j.images || []) { const c = { ...im }; if (c.bufferView !== undefined) c.bufferView += o.bv; out.images.push(c); }
  for (const s of j.samplers || []) out.samplers.push({ ...s });
  for (const t of j.textures || []) { const c = { ...t }; if (c.source !== undefined) c.source += o.img; if (c.sampler !== undefined) c.sampler += o.smp; out.textures.push(c); }
  for (const m of j.materials || []) { const c = JSON.parse(JSON.stringify(m)); remapTex(c, o.tex); out.materials.push(c); }
  for (const m of j.meshes || []) { const c = JSON.parse(JSON.stringify(m)); for (const p of c.primitives) { for (const k of Object.keys(p.attributes)) p.attributes[k] += o.acc; if (p.indices !== undefined) p.indices += o.acc; if (p.material !== undefined) p.material += o.mat; if (p.targets) p.targets = p.targets.map((tg) => Object.fromEntries(Object.entries(tg).map(([k, v]) => [k, v + o.acc]))); } out.meshes.push(c); }
  for (const n of j.nodes || []) { const c = JSON.parse(JSON.stringify(n)); if (c.mesh !== undefined) c.mesh += o.mesh; if (c.children) c.children = c.children.map((x) => x + o.node); if (c.skin !== undefined || c.camera !== undefined) throw new Error('skins/cameras not supported'); out.nodes.push(c); }
  for (const e of j.extensionsUsed || []) used.add(e);
  const sc = j.scenes[j.scene || 0];
  const yaw = ((it.yaw || 0) * Math.PI) / 180;
  const place = { name: it.name || 'item_' + out.scenes[0].nodes.length, translation: it.t || [0, 0, 0], children: sc.nodes.map((x) => x + o.node) };
  if (yaw) place.rotation = [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)];
  if (it.extras) place.extras = it.extras;
  out.scenes[0].nodes.push(out.nodes.length); out.nodes.push(place);
}
for (const k of ['textures', 'images', 'samplers', 'materials']) if (!out[k].length) delete out[k];
if (used.size) out.extensionsUsed = [...used];
const pad = (4 - (binLen % 4)) % 4; if (pad) { bins.push(Buffer.alloc(pad)); binLen += pad; }
out.buffers = [{ byteLength: binLen }];
let js = Buffer.from(JSON.stringify(out), 'utf8'); const jp = (4 - (js.length % 4)) % 4; if (jp) js = Buffer.concat([js, Buffer.alloc(jp, 0x20)]);
const head = Buffer.alloc(12); head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + js.length + 8 + binLen, 8);
const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
fs.writeFileSync(outPath, Buffer.concat([head, ch(js.length, 0x4e4f534a), js, ch(binLen, 0x004e4942), ...bins]));
console.log(`${outPath}: ${layout.items.length} item(s), ${out.nodes.length} nodes, ${out.meshes.length} meshes, ${binLen} bytes bin`);
