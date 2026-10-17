// V-230 · Browser-Fassung des Meshy-Amphitheaters aus dem unveränderten Master (Dropbox-Kopie, SHA-256 geprüft).
// Vorgabe WS0 14.10.: Geometrie ≈ 300–400 Tsd. Dreiecke, Texturen 2048² WebP (Metall/Rau 1024²), Ziel < 20 MB, kein KTX2/Meshopt-Kompression
// (kein neuer Laufzeit-Decoder; WebP = EXT_texture_webp, dekodiert der Browser). Werkzeug @gltf-transform 4.5.1 (gepinnte Dev-Abhängigkeit).
// Ablauf: weld → Vereinfachung mit Normalen/UV (meshoptimizer, nur Rechenweg, Ausgabe ist normales glTF) → Texturen je Slot verkleinern + WebP → dedup → prune.
// Aufruf: node scripts/amph/build-browser.mjs <master.glb> <out.glb> [ratio] [error] [quality]
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { weld, simplify, textureCompress, dedup, prune, compactPrimitive } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import sharp from 'sharp'
import fs from 'fs'
import crypto from 'crypto'
const [IN, OUT, ratio = '0.215', error = '0.01', quality = '86'] = process.argv.slice(2)
const MASTER_SHA = '11846848465efb0f119bf2ab27290787cdbb2c63f55773915d1dca38952a9efb'
const sha = crypto.createHash('sha256').update(fs.readFileSync(IN)).digest('hex')
if (sha !== MASTER_SHA) throw new Error('MASTER_SHA_MISMATCH ' + sha)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(IN)
const tris = (d) => d.getRoot().listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((k, p) => k + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0)
const t0 = tris(doc)
await MeshoptSimplifier.ready
// Vereinfachung mit Normalen und UV als Attributen (meshoptimizer simplifyWithAttributes): gltf-transform simplify() wertet nur Positionen,
// dadurch passten Normalen-Textur und gröbere Flächen nicht mehr zusammen (dunkle Schlieren auf den Sitzreihen, Bildpaar v1).
// Gewichte per Umgebung: NW (Normalen, Standard 2), UW (UV, Standard 2). ATTR=0 schaltet zurück auf reine Positionen.
const simplifyReport = []
const simplifyAttr = (ratio, error) => (doc) => {
  const nw = process.env.NW ? +process.env.NW : 2, uw = process.env.UW ? +process.env.UW : 2 // 2/2: Schlieren weg (Bildpaar Nah 4,47 → 2,35 nur Geometrie)
  for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
    const P = prim.getAttribute('POSITION')?.getArray(), N = prim.getAttribute('NORMAL')?.getArray(), U = prim.getAttribute('TEXCOORD_0')?.getArray(), idx = prim.getIndices()
    if (!P || !N || !U || !idx) throw new Error('SIMPLIFY_NEEDS_POSITION_NORMAL_UV_INDEX') // Master hat genau diese (Quell-Isolation §2)
    if (idx.listParents().filter((x) => x.propertyType === 'Primitive').length > 1) throw new Error('SHARED_INDEX_ACCESSOR')
    const n = P.length / 3, A = new Float32Array(n * 5)
    for (let i = 0; i < n; i++) { A[i * 5] = N[i * 3]; A[i * 5 + 1] = N[i * 3 + 1]; A[i * 5 + 2] = N[i * 3 + 2]; A[i * 5 + 3] = U[i * 2]; A[i * 5 + 4] = U[i * 2 + 1] }
    const I = new Uint32Array(idx.getArray())
    const [out, err] = MeshoptSimplifier.simplifyWithAttributes(I, new Float32Array(P), 3, A, 5, [nw, nw, nw, uw, uw], null, Math.floor(I.length * ratio / 3) * 3, error, [])
    idx.setArray(out)
    compactPrimitive(prim)
    simplifyReport.push({ mesh: mesh.getName(), trisIn: I.length / 3, trisOut: out.length / 3, error: +err.toFixed(6) })
  }
}
// Prüf-Schalter (nur Ursachensuche): NOSIMPL=1 ohne Vereinfachung, NOTEX=1 Texturen unverändert, NORMQ=<q> eigene Qualität für Normalen
const steps = [weld()]
if (!process.env.NOSIMPL) steps.push(process.env.ATTR === '0' ? simplify({ simplifier: MeshoptSimplifier, ratio: +ratio, error: +error }) : simplifyAttr(+ratio, +error))
if (!process.env.NOTEX) {
  const nq = process.env.NORMQ ? +process.env.NORMQ : +quality
  steps.push(textureCompress({ encoder: sharp, targetFormat: 'webp', slots: /^baseColorTexture$/, resize: [2048, 2048], quality: +quality }))
  steps.push(textureCompress({ encoder: sharp, targetFormat: 'webp', slots: /^normalTexture$/, resize: [2048, 2048], quality: nq, ...(nq >= 100 ? { lossless: true } : {}) }))
  steps.push(textureCompress({ encoder: sharp, targetFormat: 'webp', slots: /^metallicRoughnessTexture$/, resize: [1024, 1024], quality: +quality }))
}
await doc.transform(...steps, dedup(), prune())
await io.write(OUT, doc)
const out = { master: { sha256: sha, tris: t0 }, browser: { file: OUT, bytes: fs.statSync(OUT).size, sha256: crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex'), tris: tris(doc),
  verts: doc.getRoot().listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((k, p) => k + p.getAttribute('POSITION').getCount(), 0), 0), simplify: simplifyReport, textures: doc.getRoot().listTextures().map((t) => ({ mime: t.getMimeType(), size: t.getSize(), bytes: t.getImage().byteLength })) }, params: { ratio: +ratio, error: +error, quality: +quality, weights: { normal: process.env.NW ? +process.env.NW : 2, uv: process.env.UW ? +process.env.UW : 2 }, tool: '@gltf-transform 4.5.1 · meshoptimizer 1.1.1 · sharp 0.35.5 (exakt gepinnt)' } }
console.log(JSON.stringify(out, null, 1))
