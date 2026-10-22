// WS-NPC V-662 · Knete-Werte kit-figure (src/look/clayKit.js), ohne Browser:
//   K2  bei der gemessenen Bildhöhe aus der Spielkamera (K1: 12 m → 12,59 % der Bildhöhe) liegen Lump, Dent und Dent2 in der oberen Bandhälfte;
//       mit character nicht (Grund für V-662) · K5 maxSlope ≤ 0,5 · K7 Vendor kfb-clay.v1.1.js byte-gleich (sha256) · applyKitFigure setzt nur Uniforms
import fs from 'fs'
import crypto from 'crypto'
import * as THREE from 'three'
import { report } from './_report.mjs'
import { KIT_FIGURE, bandPos, applyKitFigure } from '../../src/look/clayKit.js'
import { CLAY_PROFILES, applyClay } from '../../src/vendor/clay/kfb-clay.v1.1.js'

const C = {}, CH = CLAY_PROFILES.character, B = CH.bands, MID = 0.1259 // K1 (test/out/npc/kitclay2/k1.mjs, 22.10.)
const pos = (P) => ({ lump: bandPos(P.lump.size, MID, B.lump), dent: bandPos(P.dent.size, MID, B.dent), dent2: bandPos(P.dent2.size, MID, B.dent2) })
const kit = pos(KIT_FIGURE), ch = pos(CH)
C.K2_kitUpperHalf = kit.lump >= 0.5 && kit.dent >= 0.5 && kit.dent2 >= 0.5
C.K2_characterFadesAtGameCamera = ch.lump < 0.5 && ch.dent < 0.5
C.K5_maxSlope = KIT_FIGURE.maxSlope <= 0.5 && KIT_FIGURE.lump.slope < KIT_FIGURE.maxSlope && KIT_FIGURE.dent2.slope < KIT_FIGURE.maxSlope
C.K7_vendorByteEqual = crypto.createHash('sha256').update(fs.readFileSync('src/vendor/clay/kfb-clay.v1.1.js')).digest('hex') === 'a81a3ee36ec25ab536e5c05fca14d2538b84f02ad6156a7006927836bdb93fd0'
// applyKitFigure auf einem echten applyClay-Handle: nur die vier Uniforms ändern sich, Farbe/Rauheit/Bänder bleiben
const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.3), new THREE.MeshStandardMaterial()), g = new THREE.Group(); g.add(mesh)
const h = applyClay(g, THREE, { profile: 'character', seed: 'kit-test' }), before = JSON.stringify(Object.fromEntries(Object.entries(h.uniforms).filter(([k]) => !/Lump|Dent|MaxSlope/.test(k)).map(([k, v]) => [k, v.value])))
const ok = applyKitFigure(h), after = JSON.stringify(Object.fromEntries(Object.entries(h.uniforms).filter(([k]) => !/Lump|Dent|MaxSlope/.test(k)).map(([k, v]) => [k, v.value])))
C.applySetsOnlyRelief = ok && h.kit === 'kit-figure' && before === after && h.uniforms.uClayLump.value.y === KIT_FIGURE.lump.slope && h.uniforms.uClayDent2.value.x === KIT_FIGURE.dent2.size && h.uniforms.uClayDent.value.y === CH.dent.density && h.uniforms.uClayMaxSlope.value === KIT_FIGURE.maxSlope
process.exit(report('unit-clayKit (WS-NPC V-662, Knete kit-figure)', C, { kit, character: ch }))
