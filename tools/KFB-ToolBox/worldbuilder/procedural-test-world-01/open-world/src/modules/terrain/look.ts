// Terrain look: terrain-only clones of the hex atlas material.
//  * grass tops get a gentle low-frequency tonal variation (world-space patches, not per tile — the eye stops counting hexes)
//  * near-vertical faces: olive sides with a darker foot per 3.75 m step; the DIRT variant (cells with a cliff of
//    2+ levels) shows KayKit-style brown dirt sides with a grass lip under every step (like the hills_* pieces)
//  * SHORE variant: per-vertex distance D to the water picks grass vs sand texels per fragment (crisp beach edge)
//  * FrontSide only: coplanar back faces of neighbouring tiles can no longer z-fight (ramp seams flickered)
// plus a shallower tile-edge bevel so seams read as fine lines.
import * as THREE from 'three';
import type { StaticAsset } from '../../core/types';
import { HEX_SCALE } from '../../core/units';
import { SAND_W, LIP_W } from './shore';

export type TerrainLook = 'plain' | 'dirt' | 'shore' | 'deco';

/** Atlas texels (glTF UV, v down) of the hexagons_medieval atlas. */
const UV_GRASS = 'vec2(0.083, 0.576)'; // = hex_grass top texel used by the welded flat tops
const UV_SAND = 'vec2(0.58, 0.575)';

/** Shared strength of the world-space tonal noise (0 = off; `?terrainnoise=0`, or services.terrain.noise.value). */
export const NOISE = { value: 1 };

/**
 * Claymation detail (recorded exception to the KayKit-only asset policy: STATUS decision `asset-policy-clay`;
 * Poly Haven `clay_floor_001` diffuse, CC0). One shared, mipmapped texture, world-space projected; used only as a
 * grey luminance multiplier around 1.0 (palette unchanged), faded out with view distance. `?clay=0` → off.
 */
export const CLAY = {
  tex: { value: null as THREE.Texture | null },
  /** strength (0 = off) */
  on: { value: 0 },
  /** mean luminance of the texture */
  mean: { value: 0.5 },
  /** luminance standard deviation (detail is normalised to σ units: the texture is low-contrast) */
  std: { value: 0.06 },
};
/** Tile size of the clay projection (m) and its near/far fade (m). */
const CLAY_TILE = 2.8, CLAY_NEAR = 22, CLAY_FAR = 50, CLAY_STRENGTH = 0.07; // ±7 % per σ, clamped at ±2σ
let clayRequested = false;
function requestClay(): void {
  if (clayRequested) return;
  clayRequested = true;
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('clay') === '0') return;
  const url = (import.meta.env.BASE_URL ?? '/') + 'assets/tex/clay_floor_001_diff_1k.jpg';
  new THREE.TextureLoader().load(
    url,
    (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 4;
      t.colorSpace = THREE.NoColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.needsUpdate = true;
      // mean luminance (32×32 downsample) → the detail is centred on 1.0
      try {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 32;
        const g = cv.getContext('2d')!;
        g.drawImage(t.image as CanvasImageSource, 0, 0, 32, 32);
        const d = g.getImageData(0, 0, 32, 32).data;
        let s = 0, s2 = 0;
        const n = d.length / 4;
        for (let i = 0; i < d.length; i += 4) {
          const y = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
          s += y;
          s2 += y * y;
        }
        CLAY.mean.value = s / n || 0.5;
        // 32×32 downsample underestimates the per-texel spread → widen a little
        CLAY.std.value = Math.max(0.02, Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2)) * 1.4);
      } catch {
        /* keep 0.5 */
      }
      CLAY.tex.value = t;
      CLAY.on.value = CLAY_STRENGTH;
    },
    undefined,
    () => console.warn('[terrain] clay detail texture missing; continuing without it'),
  );
}

export function makeTerrainMaterial(base: THREE.Material, look: TerrainLook): THREE.Material {
  const m = (base as THREE.MeshStandardMaterial).clone();
  m.name = 'terrain-' + look;
  m.side = THREE.FrontSide;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTNoise = NOISE;
    requestClay();
    sh.uniforms.uClayTex = CLAY.tex;
    sh.uniforms.uClayOn = CLAY.on;
    sh.uniforms.uClayMean = CLAY.mean;
    sh.uniforms.uClayStd = CLAY.std;
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying vec3 vTWN;\nvarying vec3 vTWP;\nattribute float aForest;\nvarying float vForest;${look === 'shore' ? '\nattribute float shoreD;\nvarying float vShoreD;' : ''}`,
      )
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvTWN = normalize(mat3(modelMatrix) * objectNormal);')
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>\nvTWP = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvForest = aForest;${look === 'shore' ? '\nvShoreD = shoreD;' : ''}`,
      );
    let frag = sh.fragmentShader.replace(
      '#include <common>',
      `#include <common>\nvarying vec3 vTWN;\nvarying vec3 vTWP;\nvarying float vForest;${look === 'shore' ? '\nvarying float vShoreD;' : ''}
      uniform float uTNoise;
      uniform sampler2D uClayTex;
      uniform float uClayOn;
      uniform float uClayMean;
      uniform float uClayStd;
      float tHash(vec2 q) { q = fract(q * vec2(123.34, 456.21)); q += dot(q, q + 45.32); return fract(q.x * q.y); }
      float tNoise(vec2 q) {
        vec2 i = floor(q), f = fract(q);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(tHash(i), tHash(i + vec2(1.0, 0.0)), u.x), mix(tHash(i + vec2(0.0, 1.0)), tHash(i + vec2(1.0, 1.0)), u.x), u.y);
      }`,
    );
    if (look === 'shore') {
      frag = frag.replace(
        '#include <map_fragment>',
        `{
          float sandW = ${SAND_W.toFixed(3)};
          float aa = fwidth(vShoreD) * 0.75;
          float grass = smoothstep(sandW - aa, sandW + aa, vShoreD);
          vec4 g = texture2D(map, ${UV_GRASS});
          vec4 s = texture2D(map, ${UV_SAND});
          // thin shadow line under the grass lip
          float lipShade = 1.0 - 0.18 * (1.0 - smoothstep(0.0, ${(LIP_W * 1.4).toFixed(3)}, sandW - vShoreD)) * (1.0 - grass);
          diffuseColor *= mix(s * vec4(vec3(lipShade), 1.0), g, grass);
        }`,
      );
    }
    frag = frag.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      {
        float side = 1.0 - smoothstep(0.45, 0.85, abs(vTWN.y));
        // world-space tonal variation (never per tile — the eye stops counting hexes):
        //  * low frequency (~100–300 m): warm/cool hue drift + brightness, organic value-noise, not sine stripes
        //  * mid frequency (~3–10 m): a very faint grass grain on grass-coloured fragments only, faded out with
        //    distance before it can alias (KayKit-clean: no texture, just ±3 % tone)
        vec2 p = vTWP.xz;
        vec3 patchTint = vec3(1.0);
        if (uTNoise > 0.0) {
        float lo = tNoise(p / 290.0 + vec2(17.3, 5.1)) * 0.62 + tNoise(p / 120.0 + vec2(3.7, 41.9)) * 0.38;
        float lb = tNoise(p / 75.0 + vec2(91.1, 13.4));
        patchTint = mix(vec3(0.88, 0.97, 0.84), vec3(1.07, 1.03, 0.92), smoothstep(0.25, 0.75, lo));
        patchTint *= 0.94 + 0.10 * smoothstep(0.2, 0.8, lb);
        float grassy = smoothstep(0.0, 0.05, diffuseColor.g - diffuseColor.r) * (1.0 - side);
        float fp = length(fwidth(p));
        float grain = (tNoise(p / 7.0 + vec2(5.0, 9.0)) - 0.5) * (1.0 - smoothstep(0.6, 2.2, fp / 7.0))
                    + 0.6 * (tNoise(p / 2.6 + vec2(31.0, 2.0)) - 0.5) * (1.0 - smoothstep(0.5, 1.6, fp / 2.6));
        patchTint *= 1.0 + 0.09 * grain * grassy;
        patchTint = mix(vec3(1.0), patchTint, uTNoise);
        }
        // (removed: per-level brightness step — it made single raised cells read as lighter hex patches from the air)
        // forest floor: a little darker and greener under canopies (smooth per-vertex density from build.ts)
        patchTint *= mix(vec3(1.0), vec3(0.80, 0.90, 0.74), smoothstep(0.15, 0.85, vForest));
        diffuseColor.rgb *= mix(patchTint, vec3(1.0), side);
        float band = fract(vTWP.y / 3.75 + 0.0001);
        ${
          look === 'dirt'
            ? `// KayKit dirt sides: grass lip at the top of every 3.75 m step, brown earth below (constant texels,
        // anti-aliased band edge: no stair-stepped texture lookups)
        float fw = fwidth(band) * 1.5 + 0.004;
        float lip = smoothstep(0.80 - fw, 0.80 + fw, band);
        vec3 dirtFoot = texture2D(map, vec2(0.31, 0.47)).rgb;
        vec3 dirtTop = texture2D(map, vec2(0.31, 0.29)).rgb;
        vec3 dirt = mix(dirtFoot, dirtTop, smoothstep(0.0, 0.8, band));
        // KayKit layered cliff look (whole-game r3 #8): a dark shadow line under the grass lip, two darker strata bands
        // whose height wobbles slowly along the wall (world-space, so long runs never repeat per hex), soft vertical
        // weathering streaks and a darker foot — all anti-aliased, no texture.
        {
          vec2 wp = vTWP.xz;
          float along = dot(wp, vec2(0.71, 0.71)) + 0.37 * (wp.x - wp.y);
          float wob = 0.035 * sin(along * 0.21) + 0.02 * sin(along * 0.57 + 1.7);
          float s1 = abs(band - (0.56 + wob)), s2 = abs(band - (0.27 - wob * 0.8));
          float strata = (1.0 - smoothstep(0.055, 0.055 + fw * 2.0, s1)) * 0.22 + (1.0 - smoothstep(0.075, 0.075 + fw * 2.0, s2)) * 0.16;
          float underLip = (1.0 - smoothstep(0.0, 0.07 + fw, 0.80 - band)) * step(band, 0.80) * 0.32;
          float streak = 0.07 * (tNoise(vec2(along * 0.9, vTWP.y * 0.12)) - 0.5);
          float foot = 0.18 * (1.0 - smoothstep(0.0, 0.2, band));
          // close-range earth detail: soft clods and a few lighter stones, faded out with screen footprint (no shimmer)
          vec2 cp = vec2(along, vTWP.y);
          float near = 1.0 - smoothstep(0.08, 0.35, length(fwidth(cp)));
          float clod = (tNoise(cp * vec2(0.55, 0.9)) - 0.5) * 0.16 + (tNoise(cp * vec2(1.7, 2.6) + 7.0) - 0.5) * 0.10;
          float stone = smoothstep(0.80, 0.86, tNoise(cp * vec2(2.3, 3.4) + 13.0)) * 0.16;
          dirt *= 1.0 + near * (clod + stone);
          dirt *= (1.0 - strata - underLip - foot) * (1.0 + streak);
        }
        vec3 sideCol = mix(dirt, diffuseColor.rgb * 0.92, lip);
        diffuseColor.rgb = mix(diffuseColor.rgb, sideCol, side);`
            : look === 'deco'
              ? ''
              : `vec3 tint = mix(vec3(0.70, 0.64, 0.48), vec3(0.92, 0.88, 0.74), smoothstep(0.0, 0.9, band));
        diffuseColor.rgb *= mix(vec3(1.0), tint, side);`
        }
        // claymation detail: world-space projection (top: xz, cliff faces: along-wall × height), grey luminance around
        // 1.0, faded by view distance — one texture fetch, no draw calls
        if (uClayOn > 0.0) {
          float cd = length(vTWP - cameraPosition);
          float cf = 1.0 - smoothstep(${CLAY_NEAR.toFixed(1)}, ${CLAY_FAR.toFixed(1)}, cd);
          if (cf > 0.0) {
            // normal-weighted blend of top (xz) and side (along-wall × height) projections: no hard switch seam, no
            // stretched top projection on 35–55° faces. Tops additionally mix a second, rotated + rescaled sample by a
            // low-frequency world noise → the 2.8 m tile does not repeat visibly in the 15–40 m band.
            float wTop = smoothstep(0.45, 0.85, abs(vTWN.y));
            float lumC = 0.0;
            if (wTop > 0.001) {
              vec2 tp = vTWP.xz / ${CLAY_TILE.toFixed(2)};
              float a = smoothstep(0.38, 0.62, tNoise(vTWP.xz / 23.0 + vec2(3.1, 7.7)));
              vec2 tp2 = mat2(0.737, -0.676, 0.676, 0.737) * tp * 0.61 + vec2(0.37, 0.71);
              // low-frequency regions → coherent branches: one fetch except in the narrow transition bands
              float lt = 0.0;
              if (a < 0.999) lt += (1.0 - a) * dot(texture2D(uClayTex, tp).rgb, vec3(0.299, 0.587, 0.114));
              if (a > 0.001) lt += a * dot(texture2D(uClayTex, tp2).rgb, vec3(0.299, 0.587, 0.114));
              lumC += wTop * lt;
            }
            if (wTop < 0.999) {
              vec2 tw = normalize(vec2(-vTWN.z, vTWN.x) + 1e-5);
              vec2 sp = vec2(dot(vTWP.xz, tw), vTWP.y) / ${CLAY_TILE.toFixed(2)};
              lumC += (1.0 - wTop) * dot(texture2D(uClayTex, sp).rgb, vec3(0.299, 0.587, 0.114));
            }
            float cl = (lumC - uClayMean) / max(uClayStd, 0.01);
            diffuseColor.rgb *= 1.0 + clamp(cl, -2.0, 2.0) * uClayOn * cf;
          }
        }
      }`,
    );
    sh.fragmentShader = frag;
  };
  m.customProgramCacheKey = () => 'terrain-v12-' + look;
  return m;
}

/** Softened tile rim height (asset units): seams between same-level tiles become hairlines. */
export const RIM_Y = -0.002;

const NORMALS = [0, 1, 2].map((i) => [Math.cos((i * Math.PI) / 3), -Math.sin((i * Math.PI) / 3)]);
const _v = new THREE.Vector3();
const _inv = new THREE.Matrix4();

/**
 * Raise the outer rim of a tile's top bevel from −0.05 to `rimY` asset units (in place, once). Only vertices on the hex
 * rim whose UV lies in the grass column of the atlas are touched.
 */
export function softenBevel(asset: StaticAsset | null, rimY = RIM_Y, profile: (x: number, z: number) => number = () => 0): void {
  if (!asset || (asset as any).__softened) return;
  (asset as any).__softened = true;
  const done = new Set<THREE.BufferGeometry>();
  for (const p of asset.parts) {
    const g = p.geometry;
    if (done.has(g)) continue;
    done.add(g);
    const P = g.attributes.position as THREE.BufferAttribute;
    const UV = g.attributes.uv as THREE.BufferAttribute | undefined;
    _inv.copy(p.matrix).invert();
    let changed = 0;
    for (let i = 0; i < P.count; i++) {
      _v.fromBufferAttribute(P, i).applyMatrix4(p.matrix).divideScalar(HEX_SCALE);
      const f = profile(_v.x, _v.z);
      const dy = _v.y - f;
      if (dy > -0.02 || dy < -0.075) continue;
      let rim = 0;
      for (const [nx, nz] of NORMALS) rim = Math.max(rim, Math.abs(_v.x * nx + _v.z * nz));
      if (rim < 0.985) continue;
      if (UV && UV.getX(i) > 0.125) continue;
      _v.y = f + rimY;
      _v.multiplyScalar(HEX_SCALE).applyMatrix4(_inv);
      P.setXYZ(i, _v.x, _v.y, _v.z);
      changed++;
    }
    // bevel-ring triangles (all three corners near the top) take the top face's texel: no lighter/darker seam ring
    if (changed && UV && !g.index) {
      let topU = 0, topV = 0, nTop = 0;
      for (let i = 0; i < P.count; i++) {
        _v.fromBufferAttribute(P, i).applyMatrix4(p.matrix).divideScalar(HEX_SCALE);
        if (Math.abs(_v.y - profile(_v.x, _v.z)) < 1e-3 && Math.hypot(_v.x, _v.z) < 0.5) { topU += UV.getX(i); topV += UV.getY(i); nTop++; }
      }
      if (nTop) {
        topU /= nTop; topV /= nTop;
        for (let t = 0; t + 2 < P.count; t += 3) {
          let near = true;
          for (let k = 0; k < 3; k++) {
            _v.fromBufferAttribute(P, t + k).applyMatrix4(p.matrix).divideScalar(HEX_SCALE);
            if (_v.y - profile(_v.x, _v.z) < -0.03) near = false;
          }
          if (near) for (let k = 0; k < 3; k++) UV.setXY(t + k, topU, topV);
        }
        UV.needsUpdate = true;
      }
    }
    if (changed) {
      P.needsUpdate = true;
      if (!g.index) g.computeVertexNormals();
    }
  }
}

/** KayKit ramp profile in asset units: rises toward +X over the low half, flat high half. */
export const rampProfile = (rise: number) => (x: number) => (x >= 0 ? rise : rise * Math.max(0, 1 + x));
