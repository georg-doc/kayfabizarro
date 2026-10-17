/* KFB WorldBuilder v1 · Planet — stilisierte Erde (Grund, Höhe, Sculpt, Meer, Oberfläche)
   EIN Massstab: Meter. KayKit/Tiny-Treats/Quaternius liegen nativ in Metern (gemessen: Brunnen 4,0 ·
   Zaun 2,5 · KayKit-Baum-Median 5,54 · Wegplatte 1,987), OSM-Gebäude in echten Metern.
   Vorlage (Georg 24.09.): eine stilisierte Erde. Kontinente aus Natural Earth (world-atlas land-50m,
   TopoJSON), weich gerastert → Landmaske. Radius 400 m, Umfang 2,5 km: ein kleiner Planet, auf dem
   eine Figur (≈2 m) klein ist und ein OSM-Block (≈150 m) eine Gegend.
   Höhenregel wie WB2, entlang der Kugelnormale:
       finalHeight(dir) = baseHeight(seed, dir) + sculptDelta(dir)
       baseHeight       = Erdvorlage(Maske, Gebirge) + WB2-terrainHeightAt (Zahlen unverändert)
   · Kugel: Würfelkugel nach dem Planet-Modus von ZyFou/ProceduralTerrains (PlanetWorld). LOD in
     zwei Stufen: globales Netz (Orbit) + feines Nahfeld um den Fokus (Boden, ~0,8 m Raster wie WB2).
     Beide lesen dieselbe Höhenfunktion — eine Höhenwahrheit.
   · Rauschen: gepinnter MIT-Auszug aus WB2 (cpuNoise.js + seedDomain.js) WÖRTLICH; für die Kugel
     auf drei Achsebenen gelesen und nach der Normale gemischt.
   · Sculpt: WB2 `terrain-sculpt.js` (brushWeight · makeStroke · pointSpacing) geladen und gerufen;
     DELTA: Strichpunkte [x,y,z] auf der Kugel R statt [x,z].
   · Meer: Kugel auf Meereshöhe; Farben schreibt day-night.js über globe.setOceanColors (Quelle). */

/*
 * Third-party notice for the ProceduralTerrains subset below (copied from WB2).
 * Source: ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070 · MIT License
 * Copyright (c) 2026 ZyFou
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions: The above copyright
 * notice and this permission notice shall be included in all copies or substantial portions of
 * the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import * as LOOK from './wd-look.js';
import * as MACRO from './wd-macro.js';

export const PIN_WB2 = '8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e';
export const ZYFOU_COMMIT = 'f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070';
export const URL_SCULPT = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN_WB2 +
  '/tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js';
export const URL_LAND = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json';
export const URL_TOPO = 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm';

export const R = 400;
export const DEF = { seed: 43129, height: 2.6, macroScale: 3.2, detail: 0.55 };   // = WB2 DEFAULT_DOC
const EARTH = { sea: -6, shore: 3.2, mount: 22, mountScale: 160 };

/* ---- ZyFou/ProceduralTerrains pinned MIT subset: cpuNoise.js + seedDomain.js (aus WB2) ---- */
function fract(v){return v-Math.floor(v)}
function hash12(px,py){
  let p3x=fract(px*0.1031),p3y=fract(py*0.1031),p3z=p3x;
  const d=p3x*(p3y+33.33)+p3y*(p3z+33.33)+p3z*(p3x+33.33);
  p3x+=d;p3y+=d;
  return fract((p3x+p3y)*(p3z+d));
}
function vnoise2(px,py){
  const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy;
  const ux=fx*fx*fx*(fx*(fx*6-15)+10),uy=fy*fy*fy*(fy*(fy*6-15)+10);
  const a=hash12(ix,iy),b=hash12(ix+1,iy),c=hash12(ix,iy+1),d=hash12(ix+1,iy+1);
  const top=a+(b-a)*ux,bot=c+(d-c)*ux;
  return top+(bot-top)*uy;
}
function rot2(x,y){return [0.80*x+0.60*y,-0.60*x+0.80*y]}
function fbm2(px,py,octaves,pers,lac){
  let amp=.5,sum=0,norm=0,x=px,y=py;
  const n=Math.max(1,Math.min(9,octaves|0));
  for(let i=0;i<n;i++){
    sum+=amp*vnoise2(x,y);norm+=amp;amp*=pers;
    const r=rot2(x,y);x=r[0]*lac;y=r[1]*lac;
  }
  return sum/Math.max(norm,1e-4);
}
function seedDomainOffset(value){
  const numeric=Number(value);if(!Number.isFinite(numeric))return 0;
  const seed=Math.trunc(numeric);if(seed===0)return 0;
  let hash=seed>>>0;
  hash=Math.imul(hash^(hash>>>16),0x7feb352d);
  hash=Math.imul(hash^(hash>>>15),0x846ca68b);
  hash=(hash^(hash>>>16))>>>0;
  return Math.fround((hash/0x100000000)*2048-1024);
}
/* ---- end pinned donor subset ---- */

function fbmSphere(x, y, z, ox, oz, oct, pers, lac) {
  const l = Math.hypot(x, y, z) || 1;
  let wx = (x / l) ** 4, wy = (y / l) ** 4, wz = (z / l) ** 4;
  const s = wx + wy + wz; wx /= s; wy /= s; wz /= s;
  return wx * fbm2(y + ox, z + oz, oct, pers, lac) + wy * fbm2(x + ox, z + oz, oct, pers, lac) + wz * fbm2(x + ox, y + oz, oct, pers, lac);
}
/* WB2 terrainHeightAt — Formel und Zahlen unverändert, Weltpunkt in Metern = dir·R */
function wb2Height(x, y, z, t) {
  const ox = seedDomainOffset(t.seed), oz = seedDomainOffset(t.seed ^ 0x51f15e);
  const km = 0.13 / t.macroScale, kf = 0.55 * t.detail;
  const macro = fbmSphere(x * km, y * km, z * km, ox * km, oz * km, 5, .5, 2.0);
  const fine = fbmSphere(x * kf, y * kf, z * kf, -ox * .37 * kf, oz * .29 * kf, 3, .5, 2.13);
  return (macro - .5) * t.height + (fine - .5) * t.height * .18;
}

/* ---------- Erdvorlage: Landmaske ---------- */
export const latLonToDir = (lat, lon, out = new THREE.Vector3()) => {
  const a = lat * Math.PI / 180, o = lon * Math.PI / 180;
  return out.set(Math.cos(a) * Math.sin(o), Math.sin(a), Math.cos(a) * Math.cos(o));
};
export const dirToLatLon = (d) => {
  const l = d.length() || 1;
  return { lat: Math.asin(Math.max(-1, Math.min(1, d.y / l))) * 180 / Math.PI, lon: Math.atan2(d.x, d.z) * 180 / Math.PI };
};
const MW = 2048, MH = 1024;
async function loadLandMask(log) {
  try {
    const [topo, TJ] = await Promise.all([fetch(URL_LAND).then((r) => { if (!r.ok) throw new Error('land ' + r.status); return r.json(); }), import(URL_TOPO)]);
    const land = TJ.feature(topo, topo.objects.land);
    const c = document.createElement('canvas'); c.width = MW; c.height = MH;
    const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, MW, MH);
    g.fillStyle = '#fff';
    const X = (lon) => (lon + 180) / 360 * MW, Y = (lat) => (90 - lat) / 180 * MH;
    const polys = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];
    let rings = 0;
    for (const geo of polys) {
      const list = geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates;
      for (const poly of list) {
        g.beginPath();
        for (const ring of poly) { ring.forEach(([lo, la], i) => (i ? g.lineTo(X(lo), Y(la)) : g.moveTo(X(lo), Y(la)))); g.closePath(); rings++; }
        g.fill('evenodd');
      }
    }
    const b = document.createElement('canvas'); b.width = MW; b.height = MH;
    const gb = b.getContext('2d');
    gb.filter = 'blur(3px)';
    gb.drawImage(c, 0, 0);
    const d = gb.getImageData(0, 0, MW, MH).data;
    const m = new Float32Array(MW * MH);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4] / 255;
    log('earth template · Natural Earth land-50m (world-atlas@2.0.2) · ' + rings + ' rings rasterised ' + MW + '×' + MH + ' · coast blur 3 px');
    return { m, ok: true };
  } catch (e) {
    log('earth template · FAILED (' + e.message + ') · fallback: seeded noise continents', true);
    return { m: null, ok: false };
  }
}
function maskAt(M, x, y, z) {
  if (!M.m) return fbmSphere(x * 0.004, y * 0.004, z * 0.004, 11.3, 7.1, 4, .5, 2) * 1.35 - 0.2;
  const l = Math.hypot(x, y, z) || 1;
  const lat = Math.asin(Math.max(-1, Math.min(1, y / l))), lon = Math.atan2(x, z);
  const u = (lon / Math.PI + 1) * 0.5 * MW - 0.5, v = (0.5 - lat / Math.PI) * MH - 0.5;
  const i0 = Math.floor(u), j0 = Math.max(0, Math.min(MH - 2, Math.floor(v))), fu = u - i0, fv = v - j0;
  const a = (i0 % MW + MW) % MW, b = (a + 1) % MW;
  const row0 = j0 * MW, row1 = row0 + MW;
  return (M.m[row0 + a] * (1 - fu) + M.m[row0 + b] * fu) * (1 - fv) + (M.m[row1 + a] * (1 - fu) + M.m[row1 + b] * fu) * fv;
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function earthHeight(M, x, y, z, t) {
  const m = maskAt(M, x, y, z), c = sstep(0.4, 0.62, m);
  const k = 1 / EARTH.mountScale, ox = seedDomainOffset(t.seed ^ 0x2b7) * k;
  const ridge = Math.max(0, fbmSphere(x * k, y * k, z * k, ox, -ox, 5, .5, 2.0) - 0.47);
  return { h: EARTH.sea + (EARTH.shore - EARTH.sea) * c + c * c * ridge * EARTH.mount, m, c };
}

/* ---------- Sculpt auf der Kugel (Donor-Kern + 3D-Punkte) ---------- */
export function sculptOps(S) {
  const norm = (st) => {
    if (!st || typeof st !== 'object') return null;
    const s = S.makeStroke(st.mode, st.radius, st.strength);
    for (const p of st.points || []) {
      if (!Array.isArray(p) || p.length < 3) continue;
      const v = p.map(Number);
      if (v.every(Number.isFinite)) s.points.push(v.map((n) => +n.toFixed(3)));
    }
    return s;
  };
  return {
    ensure(t) {
      if (!t.sculpt || typeof t.sculpt !== 'object') t.sculpt = { strokes: [] };
      t.sculpt.version = S.SCULPT_VERSION;
      t.sculpt.space = 'sphere-surface-R' + R;
      t.sculpt.strokes = (t.sculpt.strokes || []).map(norm).filter(Boolean);
      return t.sculpt;
    },
    add(stroke, p, minSpacing) {
      const last = stroke.points[stroke.points.length - 1];
      if (last && Math.hypot(p.x - last[0], p.y - last[1], p.z - last[2]) < minSpacing) return false;
      stroke.points.push([+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)]);
      return true;
    },
    deltaAt(x, y, z, sculpt) {
      let sum = 0;
      for (const st of sculpt.strokes) {
        const sign = st.mode === 'lower' ? -1 : 1, rr = st.radius;
        for (const p of st.points) {
          const dx = x - p[0], dy = y - p[1], dz = z - p[2];
          if (dx > rr || dx < -rr || dy > rr || dy < -rr || dz > rr || dz < -rr) continue;
          const w = S.brushWeight(Math.hypot(dx, dy, dz), rr);
          if (w) sum += sign * st.strength * w;
        }
      }
      return sum;
    }
  };
}

/* ---------- Geometrie ---------- */
function cubeSphere(N) {
  const pos = [], idx = [];
  const faces = [[0, 1, 2], [0, 1, 2], [1, 2, 0], [1, 2, 0], [2, 0, 1], [2, 0, 1]];
  faces.forEach(([ua, va, wa], fi) => {
    const s = fi % 2 ? -1 : 1, base = pos.length / 3;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const p = [0, 0, 0];
      p[ua] = (i / N) * 2 - 1; p[va] = (j / N) * 2 - 1; p[wa] = s;
      const [x, y, z] = p, x2 = x * x, y2 = y * y, z2 = z * z;
      pos.push(x * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3), y * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3), z * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3));
    }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = base + j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  });
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g = mergeVertices(g, 1e-5);
  outward(g);
  return g;
}
function outward(g) {
  const P = g.attributes.position, I = g.index.array, A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), n = new THREE.Vector3();
  for (let t = 0; t < I.length; t += 3) {
    A.fromBufferAttribute(P, I[t]); B.fromBufferAttribute(P, I[t + 1]); C.fromBufferAttribute(P, I[t + 2]);
    n.subVectors(B, A).cross(C.clone().sub(A));
    if (n.dot(A) < 0) { const k = I[t + 1]; I[t + 1] = I[t + 2]; I[t + 2] = k; }
  }
}
export function frameAt(d) {
  const up = d.clone().normalize();
  const ref = Math.abs(up.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const e = new THREE.Vector3().crossVectors(ref, up).normalize();
  const n = new THREE.Vector3().crossVectors(up, e).normalize();
  return { up, e, n };
}
function patchGeometry(M) {
  const pos = new Float32Array((M + 1) * (M + 1) * 3), idx = [];
  for (let j = 0; j < M; j++) for (let i = 0; i < M; i++) {
    const a = j * (M + 1) + i, b = a + 1, c = a + M + 1, d = c + 1;
    idx.push(a, b, d, a, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.length), 3));
  g.setIndex(idx);
  return g;
}

/* Bandfarben: Tal · Wiese · Hochland · Schnee · Strand. Albedo im Band von light-budget.js.
   Stimmung dreht NUR den Farbton (weltstimmungen.js). */
const BANDS = [0x3d7a2c, 0x5c9436, 0x8c7a4a, 0xd8d2c4, 0xc8b27a];

export async function makePlanet({ S, N = 128, params = {}, log = () => {} }) {
  const ops = sculptOps(S);
  const t = { ...DEF, ...params };
  ops.ensure(t);
  const MASK = await loadLandMask(log);
  const bandCols = BANDS.map((h) => new THREE.Color(h));
  const bandHsl = BANDS.map((h) => { const o = {}; new THREE.Color(h).getHSL(o, THREE.SRGBColorSpace); return o; });
  const cc = new THREE.Color();

  function baseAt(x, y, z) {
    const e = earthHeight(MASK, x * R, y * R, z * R, t);
    return { h: e.h + wb2Height(x * R, y * R, z * R, t) * (0.35 + 0.65 * e.c), c: e.c };
  }
  function colour(attr, i, h, c, y) {
    const lat = Math.abs(y);
    const hl = Math.max(0, Math.min(1, (h - 2) / (EARTH.mount * 0.45)));
    cc.copy(bandCols[0]).lerp(bandCols[1], Math.min(1, Math.max(0, h) / 4));
    if (hl > 0) cc.lerp(bandCols[2], Math.min(1, hl * 1.6));
    const snow = Math.max(sstep(0.8, 0.9, lat), sstep(0.62, 0.95, hl));
    if (snow > 0) cc.lerp(bandCols[3], snow);
    const beach = Math.max(0, 1 - Math.abs(h - 0.4) / 1.4) * (1 - snow);
    if (beach > 0) cc.lerp(bandCols[4], beach * 0.85);
    if (c < 0.5) cc.lerp(bandCols[4], 1 - c * 2);   // Meeresgrund sandig
    attr.setXYZ(i, cc.r, cc.g, cc.b);
  }

  /* --- globales Netz --- */
  const geo = cubeSphere(N);
  const P = geo.attributes.position, n = P.count;
  const dirs = new Float32Array(P.array), base = new Float32Array(n), coast = new Float32Array(n), delta = new Float32Array(n);
  geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  const matG = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.92, metalness: 0, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 4 });
  const mesh = new THREE.Mesh(geo, matG);
  mesh.name = 'planet:ground';
  mesh.receiveShadow = true;
  function writeG(i) {
    const h = base[i] + delta[i], k = R + h;
    P.setXYZ(i, dirs[i * 3] * k, dirs[i * 3 + 1] * k, dirs[i * 3 + 2] * k);
    colour(geo.attributes.color, i, h, coast[i], dirs[i * 3 + 1]);
  }
  function computeBase() { for (let i = 0; i < n; i++) { const b = baseAt(dirs[i * 3], dirs[i * 3 + 1], dirs[i * 3 + 2]); base[i] = b.h; coast[i] = b.c; } }
  function computeDelta() { for (let i = 0; i < n; i++) delta[i] = ops.deltaAt(dirs[i * 3] * R, dirs[i * 3 + 1] * R, dirs[i * 3 + 2] * R, t.sculpt); }
  function finishG() { P.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere(); }

  /* --- Nahfeld (LOD 2): Tangentialgitter um den Fokus, ~0,8 m Raster --- */
  const PM = 220, PL = 90;
  const pgeo = patchGeometry(PM);
  const PP = pgeo.attributes.position, pn = PP.count;
  const pdirs = new Float32Array(pn * 3), pbase = new Float32Array(pn), pcoast = new Float32Array(pn), pdelta = new Float32Array(pn);
  const matP = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.92, metalness: 0 });
  const patch = new THREE.Mesh(pgeo, matP);
  patch.name = 'planet:near';
  patch.receiveShadow = true;
  patch.frustumCulled = false;
  patch.visible = false;
  const pCenter = new THREE.Vector3(0, 0, 0);
  let pBuilt = false;
  function writeP(i) {
    const h = pbase[i] + pdelta[i], k = R + h;
    PP.setXYZ(i, pdirs[i * 3] * k, pdirs[i * 3 + 1] * k, pdirs[i * 3 + 2] * k);
    colour(pgeo.attributes.color, i, h, pcoast[i], pdirs[i * 3 + 1]);
  }
  function buildPatch(center) {
    const F = frameAt(center), v = new THREE.Vector3();
    pCenter.copy(F.up);
    for (let j = 0, i = 0; j <= PM; j++) for (let q = 0; q <= PM; q++, i++) {
      const u = (q / PM * 2 - 1) * PL, w = (j / PM * 2 - 1) * PL;
      v.copy(F.up).multiplyScalar(R).addScaledVector(F.e, u).addScaledVector(F.n, w).normalize();
      pdirs[i * 3] = v.x; pdirs[i * 3 + 1] = v.y; pdirs[i * 3 + 2] = v.z;
      const b = baseAt(v.x, v.y, v.z);
      pbase[i] = b.h; pcoast[i] = b.c;
      pdelta[i] = ops.deltaAt(v.x * R, v.y * R, v.z * R, t.sculpt);
      writeP(i);
    }
    PP.needsUpdate = true; pgeo.attributes.color.needsUpdate = true;
    pgeo.computeVertexNormals();
    pBuilt = true;
  }

  function rebuild(full = true) {
    if (full) computeBase();
    computeDelta();
    for (let i = 0; i < n; i++) writeG(i);
    finishG();
    if (pBuilt) buildPatch(pCenter);
  }

  /* --- Meer: Kugel auf Meereshöhe, Farben aus day-night (globe.setOceanColors) --- */
  const seaMat = new THREE.MeshStandardMaterial({ color: 0x1560a0, roughness: 0.38, metalness: 0 });
  const sea = new THREE.Mesh(new THREE.SphereGeometry(R, 192, 96), seaMat);
  sea.name = 'planet:sea';
  sea.receiveShadow = true;

  /* --- Halo = Atmosphärenglut (day-night.js schreibt die Farbe über globe.setAtmosphereGlow) --- */
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0xbbddcc) }, uAmt: { value: 1 } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader: 'uniform vec3 uColor; uniform float uAmt; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 3.0); gl_FragColor = vec4(uColor * f * uAmt, f * uAmt); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 128, 64), haloMat);
  halo.name = 'planet:halo';
  halo.userData.kfbSkip = true;

  const _o = new THREE.Vector3();
  const api = {
    mesh, patch, sea, halo, params: t, ops, R, mask: MASK,
    get count() { return n + pn; },
    rebuild,
    setParams(p) { Object.assign(t, p); rebuild(true); },
    heightAt(d) {
      const l = Math.hypot(d.x, d.y, d.z) || 1, x = d.x / l, y = d.y / l, z = d.z / l;
      return baseAt(x, y, z).h + ops.deltaAt(x * R, y * R, z * R, t.sculpt);
    },
    /* Stehfläche: Land oder Meeresspiegel (Figuren und Objekte stehen nie unter Wasser) */
    groundAt(d) { return Math.max(0, api.heightAt(d)); },
    surface(d, out = new THREE.Vector3()) { out.copy(d).normalize(); return out.multiplyScalar(R + api.groundAt(out)); },
    isLand(d) { return api.heightAt(d) > 0; },
    hit(ray) {
      const o = ray.origin, dv = ray.direction;
      let r = R + EARTH.mount + 8, p = null;
      for (let k = 0; k < 8; k++) {
        const b = o.dot(dv), c = o.lengthSq() - r * r, disc = b * b - c;
        if (disc < 0) return k ? p : null;
        const s = -b - Math.sqrt(disc);
        if (s < 0) return p;
        p = o.clone().addScaledVector(dv, s);
        const nr = R + api.groundAt(p);
        if (Math.abs(nr - r) < 0.01) break;
        r = nr;
      }
      return p;
    },
    dab(mode, c, radius, strength) {
      const sign = mode === 'lower' ? -1 : 1;
      let changed = 0;
      for (let i = 0; i < n; i++) {
        const x = dirs[i * 3] * R - c.x, y = dirs[i * 3 + 1] * R - c.y, z = dirs[i * 3 + 2] * R - c.z;
        if (x > radius || x < -radius || y > radius || y < -radius || z > radius || z < -radius) continue;
        const w = S.brushWeight(Math.hypot(x, y, z), radius);
        if (w) { delta[i] += sign * strength * w; writeG(i); changed++; }
      }
      if (changed) finishG();
      if (pBuilt) {
        let pc = 0;
        for (let i = 0; i < pn; i++) {
          const x = pdirs[i * 3] * R - c.x, y = pdirs[i * 3 + 1] * R - c.y, z = pdirs[i * 3 + 2] * R - c.z;
          if (x > radius || x < -radius || y > radius || y < -radius || z > radius || z < -radius) continue;
          const w = S.brushWeight(Math.hypot(x, y, z), radius);
          if (w) { pdelta[i] += sign * strength * w; writeP(i); pc++; }
        }
        if (pc) { PP.needsUpdate = true; pgeo.attributes.color.needsUpdate = true; pgeo.computeVertexNormals(); }
        changed += pc;
      }
      return changed;
    },
    /* LOD: Nahfeld nur, wenn die Kamera nah ist; neu aufgebaut, wenn der Fokus 30 % der Kante wandert */
    updateLod(focusDir, alt) {
      const near = alt < 0.42;
      patch.visible = near;
      if (!near) return false;
      if (!pBuilt || _o.copy(focusDir).normalize().distanceTo(pCenter) * R > PL * 0.3) { buildPatch(focusDir); return true; }
      return false;
    },
    setMood(m) {
      const hues = [m.land, m.land + 6, m.berg, m.schnee, m.berg - 4];
      bandHsl.forEach((o, i) => bandCols[i].setHSL(((hues[i] % 360) + 360) % 360 / 360, o.s, o.l, THREE.SRGBColorSpace));
      for (let i = 0; i < n; i++) colour(geo.attributes.color, i, base[i] + delta[i], coast[i], dirs[i * 3 + 1]);
      geo.attributes.color.needsUpdate = true;
      if (pBuilt) { for (let i = 0; i < pn; i++) colour(pgeo.attributes.color, i, pbase[i] + pdelta[i], pcoast[i], pdirs[i * 3 + 1]); pgeo.attributes.color.needsUpdate = true; }
    },
    setAtmosphereGlow(hex) { haloMat.uniforms.uColor.value.set(hex); },
    setCloudOpacity() { /* v1: keine Wolkenschicht — benannt in RETURN.md */ },
    setOceanColors(shallow, deep) { seaMat.color.setHex(shallow).lerp(new THREE.Color(deep), 0.55); },
    updateHalo(camera) {
      const d = camera.position.length();
      haloMat.uniforms.uAmt.value = Math.max(0, Math.min(1, (d - R * 1.3) / (R * 0.8)));
      halo.visible = haloMat.uniforms.uAmt.value > 0.01;
    }
  };
  computeBase(); computeDelta();
  for (let i = 0; i < n; i++) writeG(i);
  finishG();
  let land = 0; for (let i = 0; i < n; i++) if (base[i] > 0) land++;
  log('planet · stylised Earth R ' + R + ' m · cube-sphere N=' + N + ' (' + n + ' v) + near patch ' + PM + '² @' + (PL * 2 / PM).toFixed(2) + ' m · land ' + Math.round(land / n * 100) + ' % · finalHeight = base(seed ' + t.seed + ') + sculpt');
  return api;
}

/* ---------- Oberfläche: triplanar RGB-Palette + Makro + Cel (wd-look); Tusche im Host ---------- */
export const GROUND_LOOK = {
  ...LOOK.PRESETS['TERRAIN · COMBINED REF'],
  /* colour 0: die Derek-Kachel ist eine MASKE (R/G/B wählen Palettenfarben), keine Farbe — sonst
     färbte sie den Boden pastellbunt statt ihn zu gliedern */
  colour: 0, proc: 0.3,
  scale: 0.35, pal: 0.7, palSpread: 0.28, palHue: 0.12, grain: 0.22, grainScale: 5,
  cel: 0.6, celBands: 3, celSoft: 0.14, celBreak: 0.35, morph: 0
};
export async function applyGroundLook(meshes, look, tile) {
  const maps = tile === 'gen' ? LOOK.genSet(MACRO.generate({ ...MACRO.DEF, rgb: true }), true) : await LOOK.refSet();
  look.maps(maps);
  for (const mesh of meshes) {
    LOOK.apply(mesh, look);
    /* Host-Delta (2 Zeilen): wd-look liest die Quellfarbe nach <map_fragment>; three multipliziert
       Vertexfarben erst in <color_fragment> danach. Beim Planeten steht die Farbe IN den Vertices,
       also wird <color_fragment> vorgezogen — sonst leitete die Palette aus Weiss ab. */
    const m = mesh.material;
    m.customProgramCacheKey = () => 'kfb-look-vc-' + tile;
    if (!m.userData.kfbVcWrapped) {
      m.userData.kfbVcWrapped = true;
      const f = m.onBeforeCompile;
      m.onBeforeCompile = (sh, r) => {
        sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', '').replace('#include <map_fragment>', '#include <color_fragment>\n#include <map_fragment>');
        f(sh, r);
      };
    }
    m.needsUpdate = true;
  }
  return maps.label;
}
export function removeGroundLook(meshes) { for (const m of meshes) LOOK.apply(m, null); }
