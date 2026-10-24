// HUD 3D · N34-Kassette (Georg 24.10.: „HUD-Teile r2“, cassette_a.glb, privates Kauf-Asset) auf HUD-Größe verkleinern: Textur 1024² PNG → 512² WebP,
// Netz unverändert (908 Ecken). Quelle: src/private/50_BLENDER/N34/_privat_kauf_asset/src/registry/cassette_a.glb (nur lokal, nie öffentlich).
// Ziel: src/private-gen/hud/cassette_a.hud.glb (gitignored, wie src/private). Ohne Ziel-Datei lädt das HUD die Quelle direkt (größer, gleiches Bild).
// Aufruf: node scripts/hud/shrink-cassette.mjs
import fs from 'fs'; import path from 'path'
import { NodeIO } from '@gltf-transform/core'
import { textureCompress } from '@gltf-transform/functions'
import { ALL_EXTENSIONS, EXTTextureWebP } from '@gltf-transform/extensions'
import sharp from 'sharp'
const SRC = 'src/private/50_BLENDER/N34/_privat_kauf_asset/src/registry/cassette_a.glb', OUT = 'src/private-gen/hud/cassette_a.hud.glb'
if (!fs.existsSync(SRC)) { console.log('Quelle fehlt (src/private):', SRC); process.exit(1) }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), doc = await io.read(SRC)
await doc.transform(textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [512, 512], quality: 88 }))
doc.createExtension(EXTTextureWebP).setRequired(true)
fs.mkdirSync(path.dirname(OUT), { recursive: true }); await io.write(OUT, doc)
console.log(OUT, fs.statSync(SRC).size, '→', fs.statSync(OUT).size, 'Bytes')
