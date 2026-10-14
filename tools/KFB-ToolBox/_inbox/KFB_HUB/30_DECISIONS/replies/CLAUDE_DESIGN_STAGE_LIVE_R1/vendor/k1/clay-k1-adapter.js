// KFB Clay K1-Adapter · bindet die K1/H0-Golden-Module unverändert an (briefd/k1/, Kopie aus georg-doc/kayfabizarro@main,
// tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/).
// Kein eigenes Material, kein eigener Deformer: Relief clay-relief.v2 (1024, Saat 11), Material clay-material.v8 mit Profil,
// Vorstufe clay-soften.v1 mit den Profilwerten, Fingerabdrücke wie K1. Licht und Regler = K1 »Tag«.
import * as THREE from 'three';
import { makeClayRelief } from './k1/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from './k1/clay-material.v8.js';
import { softenGeometry } from './k1/clay-soften.v1.js';

export { seedGeometry, PROFILES };
export const K1_LIGHT = { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, sky: '#96bede', fillC: '#ffe6d6', fillK: 0.15 };
export const K1_SOURCE = 'georg-doc/kayfabizarro@main · KFB_K1_H0_CODEBASE_2026-09-29/lab-clay · clay-material.v8 · clay-profiles.v2 · clay-soften.v1 · clay-relief.v2';
const PRINT_LOCAL = './k1/ref/Fingerprints01_3K.png';
const PRINT_REMOTE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png';

export async function initK1(renderer) {
  const t0 = performance.now(), info = { errors: [], printFrom: null };
  const rel = makeClayRelief({ size: 1024, seed: 11 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.needsUpdate = true;
  info.reliefMs = rel.ms;
  const U = makeClayUniforms(THREE, tex);
  for (const [src, url] of [['lokal', new URL(PRINT_LOCAL, import.meta.url).href], ['jsDelivr @main', PRINT_REMOTE]]) {
    try { U.uClayPrint.value = await makePrintTexture(THREE, url, 2048); U.uClayPrintOn.value = 1; info.printFrom = src; break; }
    catch (e) { info.errors.push('Fingerabdrücke ' + src + ' nicht ladbar'); }
  }
  if (!U.uClayPrint.value) U.uClayPrint.value = tex;
  info.ms = Math.round(performance.now() - t0);
  return { U, info };
}
export const k1Material = (U, color, profile, vc = false) => makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, vertexColors: !!vc }), profile: PROFILES[profile] || PROFILES.default });
export const k1Soften = (profile, over = null) => { const pf = PROFILES[profile]; return pf && pf.soften ? g => softenGeometry(THREE, g, { ...pf.soften, ...(over || {}) }).geometry : null; };
