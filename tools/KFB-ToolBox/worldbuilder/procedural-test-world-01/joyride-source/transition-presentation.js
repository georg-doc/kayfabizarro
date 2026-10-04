import * as THREE from 'three';
import {KFB_BLEND_GLSL} from './road-markings.m1.js';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// Knetflecken zwischen Grundfarbe (Material) und Biomfarbe B (aPBio 0) oder C (aPBio 1); Gewicht aPW, Musterkoordinate aPS
const PATCH_V = `attribute float aPW; attribute float aPBio; attribute vec2 aPS; varying float vPW; varying float vPBio; varying vec2 vPS;\n`;
const PATCH_F = 'uniform vec3 uPB, uPC; uniform float uPCell; varying float vPW; varying float vPBio; varying vec2 vPS;\n' + KFB_BLEND_GLSL;
const PATCH_APPLY = /* glsl */`
{ float rim; float sel = kfbBlend(vPS, uPCell, vPW, rim); vec3 alt = vPBio > 0.5 ? uPC : uPB;
  diffuseColor.rgb = mix(diffuseColor.rgb, alt, sel) * (1.0 - 0.12 * rim); }
`;
export function patchify(m, key, cell = 1.7) {
  const PU = { uPB: { value: new THREE.Color('#ffffff') }, uPC: { value: new THREE.Color('#ffffff') }, uPCell: { value: cell } };
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, PU);
    sh.vertexShader = PATCH_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vPW = aPW; vPBio = aPBio; vPS = aPS;');
    sh.fragmentShader = PATCH_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + PATCH_APPLY); };
  m.customProgramCacheKey = () => 'kfb-clay-v10-t4patch2-' + key;
  m.userData.patch = PU; return PU;
}


// Extracted atlas lines 51–70; seam: terrain-relative height and recipe zones.
export function createPresentationAtlas(S, TP, groundY = () => -44) {
 const N=S.length,ds=S[1].s-S[0].s;
  const Lend = S[N - 1].s;
  const idx = s => clamp(Math.round(s / ds), 0, N - 1);
  const zones = TP.zones.map(z => ({ ...z, fam: TP.families[z.family] })).sort((a, b) => a.s0 - b.s0);
  const Z = Object.fromEntries(zones.map(z => [z.id, z]));
  const BIO = { city: 0, nature: 1 };
  const nonTrack = f => (f.to === 'track' ? f.from : f.to);
  const seg = s => { for (const z of zones) if (s >= z.s0 && s <= z.s1) return { z, u: (s - z.s0) / (z.s1 - z.s0) };
    let reg = zones[0].fam.from, zz = zones[0]; for (const z of zones) if (s > z.s1) { reg = z.fam.to; zz = z; } return { reg, zz }; };
  const w = (layer, s, side = 0) => { const g = seg(s);
    if (g.reg) return g.reg === 'track' ? 0 : 1;
    const f = g.z.fam, win = f.windows[layer] || [0.3, 0.7], u = g.u - (f.sideLag || 0) * side * 0.5, t = sstep(win[0], win[1], u);
    return f.to === 'track' ? 1 - t : t; };
  const bio = s => { const g = seg(s); if (g.reg) return BIO[g.reg] ?? -1; return BIO[nonTrack(g.z.fam)]; };
  const sideOn = (s, sd) => { const g = seg(s), z = g.z || g.zz, L = z.sides || ['left', 'right']; return L.includes(sd < 0 ? 'left' : 'right'); };
  const groundK = i => 1 - sstep(1.2, 4.0, (S[i].p[1]-groundY(S[i])));
  const curbK = i => 1 - sstep(3.0, 8.0, (S[i].p[1]-groundY(S[i])));
  const barrierT = (s, sd, i) => { const b = bio(s); if (b < 0 || !sideOn(s, sd)) return 0; const t = w('barrier', s, sd); return b === 0 ? t * groundK(i) : t; };
  const roadTrack = (s, skin) => (skin === 'mag' ? 1 : 1 - w('road', s, 0));

 return {bio,w,barrierT,roadTrack,zones};
}
