// KFB Clay (K1/H0 golden line + K2 tool reliefs), shared by every island mesh.
// Taken from the Visual Terrain Recovery Lab (src/modules/clay/index.ts), which adapted donors/golden-k1h0 1:1.
import * as THREE from 'three';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from './clay-material';
import { makeClayRelief } from './clay-relief-v2';
import { makeToolReliefs } from './clay-relief-v5';
import { TOOLMIX } from './clay-toolmix';

/** Hand scale: donors are calibrated for a 1.2-unit figure; islands are built in metres for a ~1.9 m figure. */
export const CLAY_K = 2.2;

let U: Record<string, { value: any }> | null = null;

function dataTex(data: Uint8Array, N: number): THREE.DataTexture {
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

export async function initClay(): Promise<void> {
  if (U) return;
  const rel = makeClayRelief({ size: 1024, seed: 31 });
  U = makeClayUniforms(THREE, dataTex(rel.data, rel.size)) as Record<string, { value: any }>;
  U.uClayMottle.value = 0.05;
  U.uClayHand.value = 0.5 * CLAY_K;
  U.uClayTile.value = 1.6 * CLAY_K;
  U.uClayPrintTile.value = 4.5 * CLAY_K;
  U.uClayMacro.value = 0.5;
  U.uClayLodK.value = 0.6;
  U.uClayStroke.value = 0.7;
  try {
    const tr = await makeToolReliefs({ size: 1024, seed: 41 });
    U.uClayToolA.value = dataTex(tr.maps[0], tr.size);
    U.uClayToolB.value = dataTex(tr.maps[1], tr.size);
    U.uClayToolC.value = dataTex(tr.maps[2], tr.size);
    U.uClayToolOn.value = 1;
    U.uClayLegacyStroke.value = 0;
  } catch (e) {
    console.warn('[clay] tool reliefs failed; legacy relief only', e);
  }
  try {
    U.uClayPrint.value = await makePrintTexture(THREE, '/assets/clay/Fingerprints01_3K.png', 1024);
    U.uClayPrintOn.value = 1;
  } catch (e) {
    console.warn('[clay] fingerprint scan not loaded', e);
  }
}

export type ClayClass = 'terrain' | 'rock' | 'nature' | 'water' | 'model';

/** Clay material for a class. `src` keeps colour / vertexColors / map. */
export function clayMaterial(cls: ClayClass, src: THREE.MeshStandardMaterial): THREE.Material {
  if (!U) throw new Error('initClay() first');
  const P = PROFILES as Record<string, any>;
  const T = TOOLMIX as Record<string, any>;
  const K = CLAY_K;
  const base = cls === 'terrain' || cls === 'rock' ? P.terrainFg : cls === 'water' ? P.water : P.nature;
  const p = {
    ...base,
    scale: base.scale * K,
    gougeSize: base.gougeSize * K, crackSize: base.crackSize * K, dentSize: base.dentSize * K,
    // terrain = "Clay lite" (texture taps only; Georg 2026-10-07)
    ...(cls === 'terrain' ? { print: 0.35, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0, crease: 0, legacy: 1, tools: { smear: { k: 0.6, s: 2.2, c: 1 }, thumb: { k: 0.45, s: 1.6, c: 1 } } } : {}),
    ...(cls === 'rock' ? { print: 0.2, dent: 0.2, gouge: 0.1, crack: 0, stroke: 1, facet: 1, crease: 0.6, tools: T.terrain, legacy: 0 } : {}),
    ...(cls === 'water' ? { tools: { dent: { k: 0.3, s: 2.2, c: 0.5 }, smear: { k: 0.35, s: 2.8, c: 0.5 } }, legacy: 0 } : {}),
    ...(cls === 'nature' ? { tools: T.nature, legacy: 0 } : {}),
    ...(cls === 'model' ? { tools: T.nature, legacy: 0, print: 0.25 } : {}),
  };
  return (makeClayMaterial as (...a: unknown[]) => THREE.Material)(THREE, U, { src, profile: p });
}

export function claySeed<G extends THREE.BufferGeometry>(geo: G, seed = 7): G {
  return seedGeometry(THREE, geo, seed) as G;
}
