// V-130 Prüfbank A (Steuerung 11.10.): the TC1 Knethügel (tunnel-clay.tc1.js `mound` host, moundLift 1:1) as a FIELD on a straight Track Core
// v0.12 road, the tunnel cut into that field (tunnel-field.ts, exact Core ring, grow 0), TC1 portal + interior per look from tunnel-insert.ts
// `tunnelParts` at both mouths, joined by booleans (tunnel-host.ts, field mode). The portal head plate and the base of each portal stone /
// timber go into the field first as a soft union (Knet-Fuß, smin) — so they grow out of the body without a gap. One levelSet meshes it.
// Profile (arch | rect) is a property of the tunnel module, separate from the look (V-130): default per TC1, ?profile= overrides.
// Track metres throughout (scene unit 1, as J15); cameras = TC1 sheet (lab-track/tc1-sheet.js, fov 50, 16:9).
// URL: bench.html?look=race_tube|stone_arch|stone_rect|mine[&profile=arch|rect][&h=0.5][&host=mound|berg]
// Bank B (V-156): ?host=berg = the host is a real island body with a ridge mountain (host-berg.ts), tunnel 40 m, no table (the island floats)
import * as THREE from 'three';
// @ts-ignore plain JS vendor
import * as TC from '../world/organ/vendor/vendor-j15/lab-track/core/track-core.v012.mjs';
// @ts-ignore plain JS vendor
import { makeJ17Materials, prepJ17, buildJ17Chunk, buildJ17Lips, buildJ17Markings, CANYON_FULL } from '../world/organ/vendor/j17/lab-track/j17-track.lab.js';
// @ts-ignore plain JS vendor
import * as C from '../world/organ/vendor/lab-clay/clay-material.v10nb.js';
// @ts-ignore plain JS vendor
import { makeClayRelief } from '../world/organ/vendor/lab-clay/clay-relief.v2.js';
// @ts-ignore plain JS vendor
import { makeToolReliefs } from '../world/organ/vendor/lab-clay/clay-relief.v5.js';
import { manifoldLib } from '../world/organ/tunnel-join';
import { shapeFieldTunnels, sampG, sdPoly, type FieldGrid } from '../world/tunnel/tunnel-field';
import { tunnelParts, outline, roundFloorCorners, Y_CUT, type V2 } from '../world/tunnel/tunnel-insert';
import { insertTunnelsIntoBody } from '../world/tunnel/tunnel-host';
import { tunnelQChecks } from '../world/tunnel/tunnel-qcheck';
import { buildBergField } from './host-berg';

const q = new URLSearchParams(location.search), LOOK = q.get('look') ?? 'race_tube';
// TC1 v3 tunnel spec per look, 1:1 from lab-track/data/p1b.export.json → tunnelLooks.*.spec (J15 cut): the profile (arch | rect | round) is part of it
const TC1_SPEC: Record<string, any> = { stone_arch: { preset: 'gotthard' }, stone_rect: { preset: 'gotthard', shape: 'rect', e: 6 }, race_tube: { preset: 'toy', host: 'mountain' }, mine: { preset: 'gotthard', shape: 'rect', e: 10, host: 'earth', wall: 1 } };
const HOST = q.get('host') === 'berg' ? 'berg' : 'mound', SIZE = q.get('size') === 'L' ? 'L' : 'M';   // Bank B island size: M decided, L comparison
const SPEC = { ...(TC1_SPEC[LOOK] ?? TC1_SPEC.stone_arch), ...(q.get('profile') ? { shape: q.get('profile') } : {}) }, PROFILE = SPEC.shape ?? (SPEC.preset === 'toy' ? 'round' : 'arch'), H = Number(q.get('h') ?? 0.5);
const note = (t: string) => { const e = document.getElementById('note'); if (e) e.textContent = t; };
const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede');   // WORLDS.canyon sky
const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.3, 4000);
// J17 light (track-look.v5.js l.126–129): sun #fff4e6 2.9, hemi #eef4fa / #9a8a78 1.05, back light 0.6
const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 1, far: 1600 });
scene.add(sun, sun.target, new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05)); const back = new THREE.DirectionalLight('#cfe0ff', 0.6); scene.add(back);
const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }; resize(); addEventListener('resize', resize);
const B: any = (window as any).__bench = { ready: false, look: LOOK, profile: PROFILE, host: HOST, h: H, errors: [] as string[] };

const smin = (a: number, b: number, k: number) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
// TC1 helpers 1:1 (tunnel-clay.tc1.js l.25)
const hn = (x: number, y: number, z: number) => Math.sin(x * 1.7 + y * 0.3 + z * 2.1) * 0.5 + Math.sin(x * 0.37 - z * 0.9 + y * 1.3) * 0.35 + Math.sin(z * 0.23 + x * 0.11) * 0.15;

async function build() {
  const t0 = performance.now(), w = await manifoldLib();
  // ---- clay uniforms as the organ world (organ-world.lab.js l.370–378)
  note('Knete …');
  const tex = (d: any) => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t; };
  const rel = makeClayRelief({ size: 1024, seed: 31 }), relT = tex(rel.data), tools = await makeToolReliefs({ size: 1024, seed: 41 }), U = C.makeClayUniforms(THREE, relT);
  [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(tex); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; U.uClayMottle.value = 0.04;
  let printT = null; try { printT = await C.makePrintTexture(THREE, new URL('../world/organ/vendor/ref/clay-joebinns/Fingerprints01_3K.png', import.meta.url).href, 2048); } catch (e: any) { B.errors.push('print: ' + e.message); }
  U.uClayPrint.value = printT || relT; U.uClayPrintOn.value = printT ? 1 : 0;
  const WK = 3; U.uClayHand.value = 0.5 * WK; U.uClayTile.value = 1.6 * WK; U.uClayPrintTile.value = 4.5 * WK; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  const M: any = makeJ17Materials(U, 3, CANYON_FULL), lampMat = new THREE.MeshStandardMaterial({ color: 0xfff2c8, emissive: 0xffc15a, emissiveIntensity: 2.2, roughness: 0.5 });

  // ---- road: Track Core v0.12, straight, one tunnel piece (TC1 sheet: tunnel 232 m = 29 modules à 8 m), profile = module property
  note('Strecke …');
  const td: any = TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: 'tc1_bench', closed: false, start: { p: [0, 0, 0], headingDeg: 0 }, defaults: { widthClass: 'STANDARD', markings: 'TRACK' },
    pieces: [{ id: 'run_in', type: 'STRAIGHT', length: HOST === 'berg' ? (SIZE === 'L' ? 130 : 90) : 140, tunnel: null }, { id: 'tunnel_bench', type: 'STRAIGHT', length: HOST === 'berg' ? (SIZE === 'L' ? 64 : 40) : 232, tunnel: SPEC }, { id: 'run_out', type: 'STRAIGHT', length: HOST === 'berg' ? (SIZE === 'L' ? 130 : 90) : 140, tunnel: null }] });
  const S = td.samples, seg = td.tunnels[0], V3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
  B.td = td; B.seg = seg; B.spec = SPEC;
  const pre = prepJ17(td), track = new THREE.Group(); track.name = 'j17-track'; scene.add(track); const chunks: any[] = [];
  for (const [a, b] of pre.runs) for (let i0 = a; i0 < b; i0 += 120) { const i1 = Math.min(b, i0 + 120), o = V3(S[(i0 + i1) >> 1].p), g = buildJ17Chunk(pre, i0, i1, 1, o, { capStart: i0 === a, capEnd: i1 === b });
    const near = new THREE.Group(); near.position.copy(o); for (const [geo, mat, name] of [[g.strang, M.strangT, 'bande-strang'], [g.road, M.road, 'fahrbahn']] as any) { const m = new THREE.Mesh(geo, mat); m.name = name; m.castShadow = m.receiveShadow = true; near.add(m); }
    track.add(near); chunks.push({ i0, i1, near }); }
  const lips = buildJ17Lips(pre); if (lips) { const m = new THREE.Mesh(lips, M.strang); m.castShadow = m.receiveShadow = true; track.add(m); }
  try { const MK: any = buildJ17Markings(td, 'track'); for (const [k, mat] of [['hell', M.markH], ['signal', M.markS]]) if (MK[k]) { const m = new THREE.Mesh(MK[k], mat); m.receiveShadow = true; track.add(m); } } catch (e: any) { B.errors.push('markings: ' + e.message); }
  // ---- table (track-look.v5.js l.296–301 1:1: rounded plate, top at GY −0.6)
  { const bb = new THREE.Box3(); S.forEach((x: any) => bb.expandByPoint(V3(x.p))); const ctr = bb.getCenter(new THREE.Vector3()), ext = bb.getSize(new THREE.Vector3()), GY = -0.6;
    const ww = ext.x + 420, d = ext.z + 420, r = 90, sh = new THREE.Shape(); sh.moveTo(-ww / 2 + r, -d / 2); sh.lineTo(ww / 2 - r, -d / 2); sh.quadraticCurveTo(ww / 2, -d / 2, ww / 2, -d / 2 + r); sh.lineTo(ww / 2, d / 2 - r);
    sh.quadraticCurveTo(ww / 2, d / 2, ww / 2 - r, d / 2); sh.lineTo(-ww / 2 + r, d / 2); sh.quadraticCurveTo(-ww / 2, d / 2, -ww / 2, d / 2 - r); sh.lineTo(-ww / 2, -d / 2 + r); sh.quadraticCurveTo(-ww / 2, -d / 2, -ww / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 4, bevelSize: 8, bevelSegments: 6, curveSegments: 28 }); g.rotateX(-Math.PI / 2); g.translate(ctr.x, GY - 10, ctr.z); C.seedGeometry(THREE, g, 77);
    if (HOST !== 'berg') { const m = new THREE.Mesh(g, M.table); m.name = 'tisch'; m.receiveShadow = true; scene.add(m); } sun.position.copy(ctr).add(new THREE.Vector3(260, 420, 160)); sun.target.position.copy(ctr); back.position.copy(ctr).add(new THREE.Vector3(-300, 200, -260)); }

  // ---- host field: TC1 Knethügel (moundLift 1:1) as a distance field in track metres
  note('Hügel-Feld …');
  const q0 = S[0], P0 = V3(q0.p), T = V3(q0.T), R = V3(q0.R), Uu = V3(q0.U), s0 = S[seg.i0].s, s1 = S[seg.i1].s;
  const ring: V2[] = td.tunnelRings[S[seg.i0].tunnel?.ringId ?? 0].map((p: number[]) => [p[0], p[1]] as V2), O = outline(ring), wall = S[seg.i0].tunnel?.wall ?? 1.2, half = O.half;
  const Oo = O.P.map((p, j) => [p[0] + O.N[j][0] * wall, p[1] + O.N[j][1] * wall]);
  const env = (lat: number) => { let y = -1e9; for (let k = 1; k < Oo.length; k++) { const a = Oo[k - 1], b = Oo[k]; if ((lat - a[0]) * (lat - b[0]) <= 0 && a[0] !== b[0]) y = Math.max(y, a[1] + (b[1] - a[1]) * (lat - a[0]) / (b[0] - a[0])); } return y; };
  const yB = -1.0, ramp = (s: number) => { const d = Math.min(s - s0, s1 - s), x = Math.max(0, Math.min(1, d / 34)); return x * x * (3 - 2 * x); };
  const WmAt = (s: number) => half + wall + 7 + ramp(s) * (16 + 6 * Math.sin(s * 0.041 + 1.3)), HtAt = (s: number) => O.top + wall + 3.0 + ramp(s) * (7 + 3 * Math.sin(s * 0.057 + 0.4));
  const moundLift = (lat: number, s: number) => { const Wm = WmAt(s), Ht = HtAt(s), u = Math.min(1, Math.abs(lat) / Wm), e = ramp(s), c = 0.38 * Wm * Math.sin(s * 0.027 + 0.8);
    let y = yB + (Ht - yB) * Math.pow(Math.max(0, 1 - u * u), 0.8) + e * 7.5 * Math.exp(-(((lat - c) / (0.28 * Wm)) ** 2)) * (1 - u) + (0.5 + 1.4 * e) * hn(lat * 0.17, 0, s * 0.07) * (1 - u);
    if (Math.abs(lat) < half + wall + 0.2) y = Math.max(y, env(lat) + 1.3); return y; };
  let WmMax = 0, HtMax = 0; for (let s = s0; s <= s1; s += 2) { WmMax = Math.max(WmMax, WmAt(s)); HtMax = Math.max(HtMax, HtAt(s) + 8); }
  // TC1 parts at both mouths (faces exactly at i0 / i1: the mound ends there) — the head plate and the stone / timber bases feed the field
  const tp: any = tunnelParts(td, { i0: seg.i0, i1: seg.i1 }, { style: LOOK, mouthIn: 0, mouthOut: 0 });
  const cl = roundFloorCorners(O.P, 0.8), cc = (O.top + Y_CUT) / 2, headLoop: V2[] = cl.map(([x, y]) => { const dy = y - cc, l = Math.hypot(x, dy) || 1; return [x + x / l * 4.2, y + dy / l * 4.2]; });
  const local = (x: number, y: number, z: number) => { const d = new THREE.Vector3(x, y, z).sub(P0); return [d.dot(R), d.dot(Uu), S[0].s + d.dot(T)]; };
  const blobs: { lo: number[]; hi: number[] }[] = [];
  for (const p of tp.parts) { if (!/^(stone|key|timber)$/.test(p.tag)) continue; const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    for (let k = 0; k < p.P.length; k += 3) { const l = local(p.P[k], p.P[k + 1], p.P[k + 2]); for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], l[a]); hi[a] = Math.max(hi[a], l[a]); } }
    if (Math.min(Math.abs(lo[2] - s0), Math.abs(hi[2] - s0), Math.abs(lo[2] - s1), Math.abs(hi[2] - s1)) > 4 && !(lo[2] < s0 + 4 && hi[2] > s0 - 4) && !(lo[2] < s1 + 4 && hi[2] > s1 - 4)) continue;   // interior frames stay boolean only
    const ins = [0, 1, 2].map((a) => Math.max(0.12, (hi[a] - lo[a]) * 0.22)); blobs.push({ lo: lo.map((v, a) => v + ins[a]), hi: hi.map((v, a) => v - ins[a]) }); }
  const sdBox = (l: number[], b: { lo: number[]; hi: number[] }) => { let o = 0, i = -1e9; for (let a = 0; a < 3; a++) { const c = (b.lo[a] + b.hi[a]) / 2, e = Math.max(0.01, (b.hi[a] - b.lo[a]) / 2), d = Math.abs(l[a] - c) - e; o += Math.max(d, 0) ** 2; i = Math.max(i, d); } return Math.sqrt(o) + Math.min(i, 0); };
  let G: FieldGrid, berg: ReturnType<typeof buildBergField> | null = null;
  if (HOST === 'berg') {
    note('Berg-Insel-Feld …');
    berg = buildBergField({ local, toWorld: (lat, up, s) => P0.clone().addScaledVector(T, s - S[0].s).addScaledVector(R, lat).addScaledVector(Uu, up), s0, s1, half, top: O.top, wall, H, headLoop, blobs, sdBox, size: SIZE }); G = berg.G; B.field = berg.info;
  } else {
    // grid (axis aligned: the straight runs along T)
    const corners: THREE.Vector3[] = []; for (const s of [s0 - 6, s1 + 6]) for (const l of [-(WmMax + 4), WmMax + 4]) for (const u of [-3.6, HtMax + 2]) corners.push(P0.clone().addScaledVector(T, s - S[0].s).addScaledVector(R, l).addScaledVector(Uu, u));
    const bb = new THREE.Box3().setFromPoints(corners), nx = Math.ceil((bb.max.x - bb.min.x) / H) + 1, ny = Math.ceil((bb.max.y - bb.min.y) / H) + 1, nz = Math.ceil((bb.max.z - bb.min.z) / H) + 1;
    G = { V: new Float32Array(nx * ny * nz), nx, ny, nz, o: [bb.min.x, bb.min.y, bb.min.z], h: H }; B.field = { nx, ny, nz, h: H, cells: nx * ny * nz };
    // the mound height and its slope depend on (lat, s) only: once per grid column (x, z), then the column is filled along up
    const colH = new Float32Array(nx * nz), colK = new Float32Array(nx * nz);
    for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) { const [lat, , s] = local(G.o[0] + i * H, 0, G.o[2] + k * H), sc = Math.min(s1, Math.max(s0, s));
      const h0 = moundLift(lat, sc), gl = (moundLift(lat + 0.3, sc) - moundLift(lat - 0.3, sc)) / 0.6, gs = (moundLift(lat, Math.min(s1, sc + 0.3)) - moundLift(lat, Math.max(s0, sc - 0.3))) / 0.6; colH[i + nx * k] = h0; colK[i + nx * k] = 1 / Math.sqrt(1 + gl * gl + gs * gs); }
    const nearEnd = (s: number) => Math.abs(s - s0) < 5 || Math.abs(s - s1) < 5;
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const [lat, up, s] = local(G.o[0] + i * H, G.o[1] + j * H, G.o[2] + k * H), sc = Math.min(s1, Math.max(s0, s));
      let v = (up - colH[i + nx * k]) * colK[i + nx * k];
      v = smax(v, yB - 1.9 - up, 0.4);   /* base 2 m below the mound foot (hidden under the table top at −0.6): a thin slab (≈ 1 cell) pinched in the levelSet */ v = smax(v, Math.abs(lat) - (WmAt(sc) + 2), 1.0); v = smax(v, Math.max(s0 - s, s - s1), 0.7);   // base under the table, sides, Stirn faces
      // Knet-Fuß: TC1 head plate (contour grown 4.2, 3 m deep at each mouth) + the stone / timber bases, soft union
      if (nearEnd(s)) for (const [fa, fb] of [[s0, s0 + 3], [s1 - 3, s1]]) { const dh = Math.max(sdPoly(headLoop, lat, up), Math.max(fa - s, s - fb)); if (dh < 1.2) v = smin(v, dh, 0.6); }
      if (nearEnd(s)) for (const b of blobs) { const db = sdBox([lat, up, s], b); if (db < 0.8) v = smin(v, db, 0.35); }
      G.V[i + nx * (j + ny * k)] = v; }
  }
  const { nx, ny, nz } = G!;
  // ---- tunnel cut in the field (exact Core ring, grow 0, rounded lip; the bench road lies on the table: no deck socket)
  note('Tunnel im Feld …');
  const I4 = new THREE.Matrix4(), ft = shapeFieldTunnels(G, I4, td, [{ i0: seg.i0, i1: seg.i1 }], { grow: 0, socket: false, lip: 0.6 });
  B.ft = ft.map((f) => ({ mouthIn: f.mouthIn, mouthOut: f.mouthOut, top: f.top }));
  // ---- mesher: manifold-3d levelSet (as the organ world: lsK 1, simplify 0.25 cell, refineToLength 1.5 cells, two Newton steps onto the field)
  note('levelSet …');
  const tL = performance.now(), go = G.o, inG = (x: number, y: number, z: number) => x >= go[0] && y >= go[1] && z >= go[2] && x <= go[0] + (nx - 1) * H && y <= go[1] + (ny - 1) * H && z <= go[2] + (nz - 1) * H;
  const m0 = w.Manifold.levelSet((p: number[]) => (inG(p[0], p[1], p[2]) ? -sampG(G, p[0], p[1], p[2]) : -H), { min: [go[0] - 2 * H, go[1] - 2 * H, go[2] - 2 * H], max: [go[0] + (nx + 1) * H, go[1] + (ny + 1) * H, go[2] + (nz + 1) * H] }, H, 0, -1);
  const comps = m0.decompose(), keep = comps.filter((c: any) => c.numTri() >= 24), m1 = keep.length === comps.length ? m0 : w.Manifold.compose(keep), mm = m1.simplify(H * 0.25).refineToLength(H * 1.5), mesh = mm.getMesh();
  const np = mesh.numProp, vp = mesh.vertProperties, nv = vp.length / np, Pp = new Float32Array(nv * 3), Nn = new Float32Array(nv * 3), Cc = new Float32Array(nv * 3).fill(1);
  const grad = (x: number, y: number, z: number, g: THREE.Vector3) => g.set(sampG(G, x + H * 0.5, y, z) - sampG(G, x - H * 0.5, y, z), sampG(G, x, y + H * 0.5, z) - sampG(G, x, y - H * 0.5, z), sampG(G, x, y, z + H * 0.5) - sampG(G, x, y, z - H * 0.5)).divideScalar(H);
  const gv = new THREE.Vector3(); for (let i = 0; i < nv; i++) { let x = vp[i * np], y = vp[i * np + 1], z = vp[i * np + 2];
    for (let it = 0; it < 2; it++) { const f = sampG(G, x, y, z); grad(x, y, z, gv); const g2 = gv.lengthSq(); if (g2 < 1e-10) break; let sx = f * gv.x / g2, sy = f * gv.y / g2, sz = f * gv.z / g2; const sl = Math.hypot(sx, sy, sz), cap = 0.5 * H; if (sl > cap) { sx *= cap / sl; sy *= cap / sl; sz *= cap / sl; } x -= sx; y -= sy; z -= sz; }
    Pp[i * 3] = x; Pp[i * 3 + 1] = y; Pp[i * 3 + 2] = z; grad(x, y, z, gv).normalize(); Nn[i * 3] = gv.x; Nn[i * 3 + 1] = gv.y; Nn[i * 3 + 2] = gv.z; }
  const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.BufferAttribute(Pp, 3)); bg.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); bg.setAttribute('color', new THREE.BufferAttribute(Cc, 3)); bg.setIndex(Array.from(mesh.triVerts as Uint32Array));
  // Bank B: the island body carries its colours as vertex colours (earth / rock / moss / grass / snow from the field channels) on ONE clay
  let bodyMat = M.hill0; if (berg) { const c = new THREE.Color(), nn = new THREE.Vector3(); for (let i = 0; i < nv; i++) { nn.set(Nn[i * 3], Nn[i * 3 + 1], Nn[i * 3 + 2]); berg.colourAt(Pp[i * 3], Pp[i * 3 + 1], Pp[i * 3 + 2], nn, c); Cc[i * 3] = c.r; Cc[i * 3 + 1] = c.g; Cc[i * 3 + 2] = c.b; }
    bodyMat = (C.makeClayMaterial as any)(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true }), profile: { ...C.PROFILES.terrainFg, print: 0, dent: 0, gouge: 0, crack: 0 } }); }
  const host = new THREE.Group(); host.name = HOST === 'berg' ? 'host-berg' : 'host-mound'; scene.add(host); const body = new THREE.Mesh(bg, bodyMat); body.name = 'body'; body.castShadow = body.receiveShadow = true; host.add(body);
  B.levelSetMs = Math.round(performance.now() - tL); B.bodyTris = mesh.triVerts.length / 3;
  // ---- TC1 portal + interior per look, joined (field mode: no shell / interior / head booleans — the field did them)
  note('Portale + Innenausbau …');
  const built = [{ parts: tp.parts.filter((p: any) => !/^(shell|interior|head)$/.test(p.tag)), lights: tp.lights, a: tp.a0, b: tp.a1, a0: tp.a0, a1: tp.a1, nMod: tp.nMod, mLen: tp.mLen, s0: tp.s0, style: LOOK, wallPoly: ft[0].grown, edge: 0.8 }];
  const r = insertTunnelsIntoBody(w, body, I4, td, [{ i0: seg.i0, i1: seg.i1 }], { style: LOOK }, M, lampMat, (g, s2) => C.seedGeometry(THREE, g, s2), 11, { built, mouths: [{ mouthIn: 0, mouthOut: 0, found: [true, true] }] } as any);
  B.report = r.report;
  // TC1 deco on the mound (boulders + bushes, tunnel-clay.tc1.js l.140–142 1:1) — mound host only
  if (HOST === 'mound') { let sd = (7 + seg.i0) >>> 0; const rr = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; }; const ids: number[] = []; for (let i = seg.i0; i <= seg.i1; i += 4) ids.push(i);
    for (let k = 0; k < 26; k++) { const i = ids[Math.floor(rr() * ids.length)], s = S[i].s, Wm = WmAt(s), lat = (rr() * 2 - 1) * Wm * 0.62, y = moundLift(lat, s), boulder = k % 3 === 0, rad = boulder ? 1.6 + rr() * 2.4 : 1.4 + rr() * 1.4;
      const g = new THREE.IcosahedronGeometry(rad, 1); g.scale(1, boulder ? 0.6 : 0.85, 1); const p = V3(S[i].p).addScaledVector(R, lat).addScaledVector(Uu, boulder ? y - 0.5 : y + 0.5); g.translate(p.x, p.y, p.z); C.seedGeometry(THREE, g, 900 + k);
      const m = new THREE.Mesh(g, boulder ? M.rock : M.leaf0); m.castShadow = m.receiveShadow = true; m.name = 'deko'; scene.add(m); } }
  // ---- checks: Q-checks (see-through, clearance), closedness of the drawn host meshes (welded 1e-5), triangles
  scene.updateMatrixWorld(true);   // the checks read world matrices before the first render
  const qc = tunnelQChecks({ td, K: 1, W: { built: [{ root: host }] }, chunks });
  const solid: THREE.Mesh[] = []; host.traverse((m: any) => { if (m.isMesh) solid.push(m); });
  const key = new Map<string, number>(), E = new Map<string, number>(); let V = 0, tris = 0; const vid = (x: number, y: number, z: number) => { const k = Math.round(x * 1e5) + ',' + Math.round(y * 1e5) + ',' + Math.round(z * 1e5); let i = key.get(k); if (i === undefined) { i = V++; key.set(k, i); } return i; };
  for (const m of solid) { m.updateMatrixWorld(true); const g = m.geometry, pos = g.attributes.position, idx = g.index ? g.index.array : null, n = idx ? idx.length : pos.count, v = new THREE.Vector3();
    for (let t = 0; t < n; t += 3) { const id = [0, 1, 2].map((e) => { v.fromBufferAttribute(pos as THREE.BufferAttribute, idx ? idx[t + e] : t + e).applyMatrix4(m.matrixWorld); return vid(v.x, v.y, v.z); }); if (id[0] === id[1] || id[1] === id[2] || id[0] === id[2]) continue; tris++;
      for (let e = 0; e < 3; e++) { const a = id[e], c = id[(e + 1) % 3], k = a < c ? a + ',' + c : c + ',' + a; E.set(k, (E.get(k) ?? 0) + 1); } } }
  const P3: number[][] = []; key.forEach((i, k) => { P3[i] = k.split(',').map((x) => +x / 1e5); });
  let open = 0, multi = 0; const multiAt: any[] = []; for (const [k, c] of E) { if (c === 1) open++; else if (c > 2) { multi++; if (multiAt.length < 30) { const [a, cc2] = k.split(',').map(Number), m = P3[a].map((v, j) => (v + P3[cc2][j]) / 2), l = local(m[0], m[1], m[2]); multiAt.push({ n: c, lat: +l[0].toFixed(2), up: +l[1].toFixed(2), s: +(l[2] - s0).toFixed(2), len: +Math.hypot(...P3[a].map((v, j) => v - P3[cc2][j])).toFixed(3) }); } } }
  Object.assign(B, { ready: true, buildMs: Math.round(performance.now() - t0), qcheck: qc, closed: { open, multi, tris, meshes: solid.map((m) => m.name), multiAt }, tc1: { modules: tp.nMod, moduleLen: tp.kit.module, profile: PROFILE, ring: { w: +(Math.max(...ring.map((p) => p[0])) - Math.min(...ring.map((p) => p[0]))).toFixed(2), h: +(Math.max(...ring.map((p) => p[1])) - Math.min(...ring.map((p) => p[1]))).toFixed(2) } } });
  note('');
  // ---- TC1 sheet cameras (lab-track/tc1-sheet.js)
  const pt = (i: number, rr: number, u: number, t: number) => { const s = S[i]; return new THREE.Vector3(s.p[0] + s.R[0] * rr + s.U[0] * u + s.T[0] * t, s.p[1] + s.R[1] * rr + s.U[1] * u + s.T[1] * t, s.p[2] + s.R[2] * rr + s.U[2] * u + s.T[2] * t); };
  const mid = (seg.i0 + seg.i1) >> 1, VIEWS: Record<string, [THREE.Vector3, THREE.Vector3]> = {
    portal_in: [pt(seg.i0, 1.5, 6, -46), pt(seg.i0, 0, 5.5, 0)], inside: [pt(seg.i0 + 60, -3, 3.0, 0), pt(seg.i0 + 120, 1, 2.8, 0)], portal_out: [pt(seg.i1, -2, 7, 48), pt(seg.i1, 0, 5.5, 0)], overview: [pt(mid, 150, 95, -40), pt(mid, 0, 4, 0)] };
  if (berg) { const v = berg.views, z = SIZE === 'L' ? 1.5 : 1, c = (la: number, up: number, ds: number) => pt(mid, la, up, ds);   // Bank B: island views for the sheet beside IB1–IB3 / CR3
    Object.assign(VIEWS, { island_34: [c(v.CL - 120 * z, 85 * z, -120 * z), c(v.CL, 2, 0)], under_34: [c(v.CL + 130 * z, -38 * z, -95 * z), c(v.CL, -18 * z, 0)], side: [c(v.CL + 170 * z, -10 * z, 0), c(v.CL, -12 * z, 0)], portal_face: [pt(seg.i0, 6, 9, -30 * z), pt(seg.i0, 0, 7, 0)], inside: [pt(seg.i0 + Math.round((seg.i1 - seg.i0) * 0.25), -3, 3.0, 0), pt(seg.i0 + Math.round((seg.i1 - seg.i0) * 0.75), 1, 2.8, 0)], overview: [c(v.CL + 150 * z, 95 * z, -40 * z), c(v.CL, 4, 0)] }); }
  B.viewNames = Object.keys(VIEWS);
  B.view = (k: string) => { const v = VIEWS[k]; if (!v) return false; camera.position.copy(v[0]); camera.lookAt(v[1]); camera.updateMatrixWorld(); return true; };
  B.view('portal_in');
  const loop = () => { requestAnimationFrame(loop); renderer.render(scene, camera); }; loop();
}
build().catch((e) => { B.ready = true; B.error = String(e?.stack || e); console.error(e); note('Fehler: ' + e); });
