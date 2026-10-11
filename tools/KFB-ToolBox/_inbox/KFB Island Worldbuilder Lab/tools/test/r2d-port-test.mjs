// Port test Stufe 1 §5.1: R2D v0 fields()/natural() (donor code, evaluated as-is) against src/island/r2d/* at 50
// points, same seed. R2D's Track Core is replaced by a straight mock stream (the test is about the fields, not the road).
// Run: . tools/env.sh && node --import ./tools/test/register.mjs tools/test/r2d-port-test.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { fields } from '../../src/island/r2d/fields.ts';
import { makeNatural } from '../../src/island/r2d/plan.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const src = fs.readFileSync(path.join(ROOT, 'donors/kfb-island-kit-r2-2026-10-08/KFB_R2D_v0/island.js'), 'utf8').split('\n');
const body = src.slice(17, 162).filter((l) => !/^export const MASK|^  building: \[|^const (FOREST|J14|HEX_PIN|FEST_PIN|HEXP|fo |WINTER)/.test(l)).join('\n')
  .replace(/^export const /gm, 'const ').replace(/^const fo = n =>.*$/m, '');
const BIOMES_STUB = `const fo=n=>n, sn=n=>n, fe=n=>n, hx=p=>({id:p});`;
const R2D = new Function('THREE', 'RAW', 'PIN', BIOMES_STUB + body + '\nreturn { planIsland, fields, BIOMES, fbm };')(THREE, () => '', { asset: '' });

// straight mock of TC.compileRecipe: samples every 0.5 along +z from start.p
const TC = { compileRecipe(rc) {
  const L = rc.pieces.reduce((a, p) => a + (p.length ?? Math.abs(p.turn) * Math.PI / 180 * p.radius), 0), samples = [];
  for (let s = 0; s <= L; s += 0.5) samples.push({ s, p: [rc.start.p[0], rc.start.p[1], rc.start.p[2] + s], R: [1, 0, 0], U: [0, 1, 0], T: [0, 0, 1],
    slots: [-5.4, -4.6, -3.8, -3, -2.6, -2.2, -1.9, 1.9, 2.2, 2.6, 3, 3.8, 4.6, 5.4].map((l) => [l, 0.2]), prm: { width: 3.8 } });
  return { samples };
} };

let worst = { h: 0, w: 0, mask: 0, nat: 0 }, n = 0;
const SEEDS = [[3, 'burg'], [11, 'protopia'], [5, 'dystopia']];
for (let sd = 1; sd < 60 && SEEDS.length < 6; sd++) { const P = R2D.planIsland(sd, TC, 'frei', R2D.BIOMES.burg); if (P.pond && P.creek) SEEDS.push([sd, 'burg']); }
for (const [seed, biome] of SEEDS) {
  const cfg = R2D.BIOMES[biome], P = R2D.planIsland(seed, TC, 'frei', cfg), Fr = R2D.fields(P);
  const port = {
    seed, sdf: P.sdf, c0: P.c0, NA: P.NA, edgeR: P.edgeR, rAt: P.rAt, roll: P.roll, natural: P.natural,
    pads: P.pads, plazas: P.plazas, paths: P.paths.map((s) => ({ pts: s, w: 2.8 })),
    road: (x, z) => ({ d: P.roadDist(x, z), hw: P.hw, y: P.roadY }), slopeW: () => 7, pond: P.pond,
    creek: P.creek ? { pts: P.creek.pts, w: P.creek.w, cross: P.creek.cross, dist: P.creek.dist } : null,
  };
  const Fp = fields(port), nat = makeNatural(cfg.terr, seed);
  let s = seed * 9301;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 50; k++) {
    const th = rnd() * Math.PI * 2, r = P.rAt(th) * (k < 45 ? Math.sqrt(rnd()) : 1 + rnd() * 0.05);
    const x = P.c0[0] + Math.cos(th) * r, z = P.c0[1] + Math.sin(th) * r;
    const dh = Math.abs(Fr.heightAt(x, z) - Fp.heightAt(x, z)), wr = Fr.weightsAt(x, z), wp = Fp.weightsAt(x, z);
    const dw = Math.max(...wr.map((v, i) => Math.abs(v - wp[i]))), dm = Fr.maskAt(x, z) === Fp.maskAt(x, z) ? 0 : 1, dn = Math.abs(P.natural(x, z) - nat(x, z));
    worst = { h: Math.max(worst.h, dh), w: Math.max(worst.w, dw), mask: worst.mask + dm, nat: Math.max(worst.nat, dn) };
    n++;
  }
  console.log(biome, 'seed', seed, 'pads', P.pads.length, 'plazas', P.plazas.length, 'paths', P.paths.length, 'pond', !!P.pond, 'creek', !!P.creek);
}
const pass = worst.h < 1e-9 && worst.w < 1e-9 && worst.mask === 0 && worst.nat < 1e-9;
console.log(JSON.stringify({ test: 'r2d-port-fields', points: n, maxHeightDiff: worst.h, maxWeightDiff: worst.w, maskMismatches: worst.mask, maxNaturalDiff: worst.nat, pass }));
process.exit(pass ? 0 : 1);
