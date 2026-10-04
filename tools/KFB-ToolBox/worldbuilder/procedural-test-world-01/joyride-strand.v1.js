/* Actual Joyride J14/T4 drawing blocks, rehomed onto the WB2-owned stream.
 * See JOYRIDE_SOURCE_MAP.json. No renderer, input, route, support or frame loop. */
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createStrandProfile} from './joyride-profile.v1.mjs';
import {createPresentationAtlas,patchify} from './joyride-source/transition-presentation.js';
import {buildRoadMarkingsM2} from './joyride-source/road-markings.m2.js';
import {KFB_BLEND_GLSL} from './joyride-source/road-markings.m1.js';
import {makeClayMaterial,seedGeometry,PROFILES} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-material.v10.js';
import {TOOLMIX} from '../../_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/clay-toolmix.v1.js';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };

const ROAD_V = `attribute float aW; attribute float aBio; attribute vec2 aSU; varying float vW; varying float vBio; varying vec2 vSU;\n`;
const ROAD_F = 'uniform vec3 uRoadA, uRoadB, uRoadC; varying float vW; varying float vBio; varying vec2 vSU;\n' + KFB_BLEND_GLSL;
// M1 Knetfleck-Regel: symmetrisch, kleine runde Tropfen in beide Richtungen, Deckung = w
const ROAD_APPLY = /* glsl */`
{ vec3 cO = vBio > 0.5 ? uRoadC : uRoadA; float rim; float sel = kfbBlend(vSU, 1.7, vW, rim); diffuseColor.rgb = mix(cO, uRoadB, sel) * (1.0 - 0.12 * rim); }
`;

export function buildClayStrand(THREE, td, {U,palette,TP,MR,M2,groundY,connected=true,atlas=null}) {
 const S=td.samples,N=S.length,ds=td.ds||S[1].s-S[0].s,V=a=>new THREE.Vector3(...a);
 const AT=atlas||createPresentationAtlas(S,TP,groundY);
 const {ringOf,W3}=createStrandProfile(td,AT);
 const root=new THREE.Group(),info={tris:0},FIX={strangCap:true},LEAN=null,lips=[],K=3,M={};
 const addMesh=(g,mat,{name='' }={})=>{const m=new THREE.Mesh(g,mat);m.name=name;m.castShadow=m.receiveShadow=true;root.add(m);info.tris+=(g.index?g.index.count:g.attributes.position.count)/3;return m};
 const bake=parts=>mergeGeometries(parts.map(g=>{const n=g.index?g.toNonIndexed():g;n.deleteAttribute('uv');return n}),false);
 const clay=(key,color,profile,mix='strang')=>M[key]=makeClayMaterial(THREE,U,{src:new THREE.MeshStandardMaterial({color}),profile:{...profile,tools:TOOLMIX[mix],legacy:0}});
 const RU={uRoadA:{value:new THREE.Color(palette.rock)},uRoadB:{value:new THREE.Color(palette.rock).multiplyScalar(.72)},uRoadC:{value:new THREE.Color(palette.sand)}};
  {
    const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...prof('road', 0.5, K), legacy: 1 } });
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, RU);
      sh.vertexShader = ROAD_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vBio = aBio; vSU = aSU;');
      sh.fragmentShader = ROAD_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + ROAD_APPLY); };
    m.customProgramCacheKey = () => 'kfb-clay-v10-road7'; M.road = m;
  }

 clay('strang',palette.rock,prof('house',.6,K,QUIET));
 clay('strangT',palette.rock,prof('house',.6,K,QUIET));
 const pu=patchify(M.strangT,'wb2-strand',1.7);pu.uPB.value.set(palette.sand);pu.uPC.value.set(palette.lip);
  // Läufe mit Fahrfläche (surface 1); Luft bleibt frei
  const runs = []; { let a = -1; for (let i = 0; i <= N; i++) { const on = i < N && (S[i].prm.surface ?? 1) > 0; if (on && a < 0) a = i; if (!on && a >= 0) { if (i - a > 2) runs.push([a, i - 1]); a = -1; } } }

  // Skin-Feld der Fahrbahn: 0 Straße, 1 Bahn (mag fährt auf Bahn); Fugen als Flecken über 24 m
  const skinW = S.map(q => q.skin === 'street' ? 0 : 1), wS = new Float32Array(N);
  { const ev = []; for (let i = 1; i < N; i++) if (skinW[i] !== skinW[i - 1]) ev.push({ s: S[i].s, a: skinW[i - 1], b: skinW[i] });
    for (let i = 0; i < N; i++) { const s = S[i].s; let w = skinW[i];
      for (const e of ev) if (Math.abs(s - e.s) < 14) w = lerp(e.a, e.b, sstep(e.s - 10, e.s + 14, s));
      wS[i] = w; } }
  for (let i = 0; i < N; i++) wS[i] = AT.roadTrack(S[i].s, S[i].skin);   // T4: Fahrbahnmasse aus dem Übergangsvertrag (ersetzt die 24-m-Fuge)
  const bS = S.map(q => (AT.bio(q.s) === 1 ? 1 : 0));



  { const sp = [], si = [], rp = [], rw = [], rsu = [], ri = [], spw = [], spb = [], sps = [], rbio = []; let sBase = 0, rBase = 0;
    /* J13 strangCap: geschlossener Stream → Anfang und Ende sind EINE Naht (Ringe verbinden, keine Kappen/Lippen). Kappen sonst als
       echte Profilfläche (Ohrenschnitt im R/U-Schnitt) statt Fächer vom Schwerpunkt: der Fächer spannte 8-m-Speichen über die Fahrbahn. */
    const joinSeam = !!(FIX.strangCap && td.closed && runs.length && runs[0][0] === 0 && runs[runs.length - 1][1] === N - 1);
    let seamFirst = -1, seamLast = -1, seamNr = -1;
    for (const [ri0, [a, b]] of runs.entries()) {
      let nr = 0;
      const STR = LEAN?.strangStride || 1, ids = []; for (let i = a; i < b; i += STR) ids.push(i); ids.push(b);
      for (let j = 0; j < ids.length; j++) { const i = ids[j], q = S[i], ring = ringOf(q, i); nr = ring.length; let arc = 0;   // M1: Fleckenkoordinate = Bogenlänge ums Profil (runde Flecken statt gestreckter)
        ring.forEach((p, k) => { if (k) arc += Math.hypot(p[0] - ring[k - 1][0], p[1] - ring[k - 1][1], p[2] - ring[k - 1][2]); sp.push(...p); const sd = k < nr / 2 ? -1 : 1; spw.push(AT.barrierT(q.s, sd, i)); spb.push(bS[i]); sps.push(q.s, arc); });
        const L = q.slots[6], Rr = q.slots[7];
        for (let n = 0; n <= 6; n++) { const lat = lerp(L[0], Rr[0], n / 6), h = lerp(L[1], Rr[1], n / 6); rp.push(...W3(q, lat, h)); rw.push(wS[i]); rbio.push(bS[i]); rsu.push(q.s, lat); }
        if (j > 0) { const A = sBase + (j - 1) * nr, B = sBase + j * nr; for (let k = 0; k < nr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1);
          const C = rBase + (j - 1) * 7, E = rBase + j * 7; for (let k = 0; k < 6; k++) ri.push(C + k, C + k + 1, E + k, C + k + 1, E + k + 1, E + k); } }
      // Kappen an den Laufenden (flach, der Stream verjüngt dort ohnehin)
      if (joinSeam && ri0 === 0) { seamFirst = sBase; seamNr = nr; }
      if (joinSeam && ri0 === runs.length - 1) seamLast = sBase + (ids.length - 1) * nr;
      for (const [i, dir, jj] of [[a, -1, 0], [b, 1, ids.length - 1]]) { const base = sBase + jj * nr, c = [0, 0, 0];
        if (joinSeam && ((ri0 === 0 && dir < 0) || (ri0 === runs.length - 1 && dir > 0))) continue;
        if (FIX.strangCap) { const q = S[i], R3 = V(q.R), U3 = V(q.U), T3 = V(q.T), c2 = [], P0 = V(sp.slice(base * 3, base * 3 + 3));
          for (let k = 0; k < nr; k++) { const pk = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)).sub(P0); c2.push(new THREE.Vector2(pk.dot(R3), pk.dot(U3))); }
          const tris = THREE.ShapeUtils.triangulateShape(c2, []);
          if (tris.length >= nr - 3) { for (const [x0, x1, x2] of tris) { const p0 = V(sp.slice((base + x0) * 3, (base + x0) * 3 + 3)), p1 = V(sp.slice((base + x1) * 3, (base + x1) * 3 + 3)), p2 = V(sp.slice((base + x2) * 3, (base + x2) * 3 + 3));
              const nrm = p1.clone().sub(p0).cross(p2.clone().sub(p0)); if (nrm.dot(T3) * dir > 0) si.push(base + x0, base + x1, base + x2); else si.push(base + x0, base + x2, base + x1); }
            continue; } }
        throw Error('Joyride profile cap triangulation failed'); }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of (connected ? [] : [a, b])) { if (joinSeam && ((ri0 === 0 && i === a) || (ri0 === runs.length - 1 && i === b))) continue; const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);
        g.rotateZ(Math.PI / 2); g.applyMatrix4(new THREE.Matrix4().makeBasis(V(q.R), V(q.U), V(q.T).negate()));
        const c = W3(q, (q.slots[0][0] + q.slots[13][0]) / 2, -0.5); g.translate(c[0], c[1], c[2]); seedGeometry(THREE, g, 700 + i); lips.push(g); }
    }
    if (joinSeam && seamFirst >= 0 && seamLast >= 0) { const A = seamLast, B = seamFirst; for (let k = 0; k < seamNr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1); info.strangSeam = 'joined'; }
    const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    gs.setAttribute('aPW', new THREE.Float32BufferAttribute(spw, 1)); gs.setAttribute('aPBio', new THREE.Float32BufferAttribute(spb, 1)); gs.setAttribute('aPS', new THREE.Float32BufferAttribute(sps, 2)); gs.setIndex(si); gs.computeVertexNormals(); seedGeometry(THREE, gs, 11);
    addMesh(gs, M.strangT, { name: 'strang' }); if(lips.length) addMesh(bake(lips), M.strang, { name: 'lippen' });
    const gr = new THREE.BufferGeometry(); gr.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); gr.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1)); gr.setAttribute('aBio', new THREE.Float32BufferAttribute(rbio, 1));
    gr.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); gr.setIndex(ri); gr.computeVertexNormals(); seedGeometry(THREE, gr, 5);
    addMesh(gr, M.road, { name: 'fahrbahn' });
    // Mittellinie gegen p (Prüfung Bedingung 1): Mitte der Fahrbahnreihe = p + R·offset
    let err = 0; for (let i = 0; i < N; i += 25) { const q = S[i], m = W3(q, (q.slots[6][0] + q.slots[7][0]) / 2, 0), c = W3(q, q.prm.offset || 0, 0); err = Math.max(err, Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2])); }
    info.centreErr = err;
  }


 const markings=buildRoadMarkingsM2({THREE,S,N,ds,A:AT,M2,MR1:MR,seedGeometry,connected});
 clay('markH',palette.paved,prof('water',.9,K,{print:.2,dent:0}),null);
 clay('markS',palette.sand,prof('water',.9,K,{print:.2,dent:0}),null);
 if(markings.hell)addMesh(markings.hell,M.markH,{name:'M2 · native lane markings'});
 if(markings.signal)addMesh(markings.signal,M.markS,{name:'M2 · native signal markings'});
 root.userData.joyride={donor:'927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f',samples:N,centreErr:info.centreErr,markings:markings.pieces,triangles:info.tris,connected};
 root.userData.sourceRecord={assetId:'Joyride J14 / T4 strand',packId:'KFB Joyride J14',source:{commit:'927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f',path:'lab-track/track-look.v5.js',blobSha:'7c0d248391c3eaf1887a0afc97ee02b25f6dec85'}};
 return root;
}
