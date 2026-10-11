import * as THREE from 'three';
import {compileRecipe,runChecks} from './donors/j16/KFB_JOYRIDE_J16_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/lab-track/core/track-core.v012.mjs';
import {buildMarkings,buildTrack} from './donors/j16/KFB_JOYRIDE_J16_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/lab-track/core/stream-to-three.v5.mjs';
import fs from 'node:fs';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };


const recipe={schema:'kfb.route-recipe/0.1-draft',id:'PROTOPIA_MAKER_FLOATING_LINK_R1',ds:.5,closed:false,start:{p:[210,0,-20],headingDeg:90},defaults:{width:'STANDARD',markings:'TRACK',skin:'track'},pieces:[{id:'maker_dock',type:'STRAIGHT',length:42},{id:'maker_exit',type:'CURVE_EASE',turn:20,radius:100,ease:18,bankDeg:0},{id:'floating_span',type:'STRAIGHT',length:180},{id:'farm_entry',type:'CURVE_EASE',turn:-20,radius:100,ease:18,bankDeg:0},{id:'farm_dock',type:'STRAIGHT',length:42}]};

const full=JSON.parse(fs.readFileSync('work/track-maker-r1/original_p1b.stream.json')); const td={...full,closed:false,samples:full.samples.slice(1388,1802)};
const S=td.samples,N=S.length,ds=td.ds,AT={barrierT:()=>0,bio:()=>0,roadTrack:()=>1},FIX={strangCap:true},LEAN=null,info={},M={strangT:{},strang:{},road:{}},meshes=[];
const V=a=>new THREE.Vector3(...a),W3=(q,l,h)=>q.p.map((x,k)=>x+q.R[k]*l+q.U[k]*h);
const seedGeometry=()=>{},bake=()=>{},onNote=()=>{};
const addMesh=(g,m,opt)=>meshes.push({name:opt.name,positions:Array.from(g.attributes.position.array),indices:Array.from(g.index.array)});
  // Krümmung (vorzeichenbehaftet: > 0 = Rechtskurve, innen = rechts), geglättet über ±8 m
  const kr = new Float32Array(N), ks = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = S[Math.max(0, i - 4)], b = S[Math.min(N - 1, i + 4)], q = S[i];
    const d = (b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]; kr[i] = d / Math.max(0.5, b.s - a.s); }
  for (let i = 0; i < N; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; }

  // ---------- Querschnitt des Strangs je Seite (seitenlokal: x nach außen, y hoch) ----------
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } };
  const RIB = 3.5;   // Rippenabstand (m), eine Rippe = zwei Handbreiten
  const sideProfile = (q, i, sd) => {
    const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), H = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    // T4: bt 0 = Strang (T3) … 1 = Bordsteinlippe (Stadt, am Boden, rückt an die Fahrbahnkante) bzw. breite flache Wiesenlippe (Natur)
    const bt = AT.barrierT(q.s, sd, i), bn = AT.bio(q.s) === 1, Hx = lerp(H, bn ? 0.5 : 0.32, bt), rxK = bn ? 1 + 0.9 * bt : 1, ibx = bn ? ib : lerp(ib, e + 0.35, bt);
    const inner = sstep(0.008, 0.022, ks[i] * sd) * (1 - bt), outer = sstep(0.014, 0.04, -ks[i] * sd) * (1 - bt);
    const wave = 0.06 * (vnoise(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (Hx + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer), rX = r * rxK;
    const cx = Math.max(ibx, e + 0.4) + 0.85 * rX + 0.12 * outer, top = Hx + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]];
    const xa = cx - 0.94 * rX, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t);
      y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * rxK * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * rX + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * rX + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * rX, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts;
  };
  const ringOf = (q, i) => { const L = sideProfile(q, i, -1), R = sideProfile(q, i, 1);
    const pts = L.map(([x, y]) => W3(q, (q.prm.offset || 0) - x, y)); for (let n = R.length - 1; n >= 0; n--) pts.push(W3(q, (q.prm.offset || 0) + R[n][0], R[n][1])); return pts; };

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

  onNote('Strang wird gerollt …');
  const lips = [];
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
        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++) c[j] += sp[(base + k) * 3 + j] / nr;
        const ci = sp.length / 3; sp.push(...c); spw.push(0); spb.push(0); sps.push(S[i].s, 0); const T = S[i].T;
        for (let k = 0; k < nr - 1; k++) { const p0 = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)), p1 = V(sp.slice((base + k + 1) * 3, (base + k + 1) * 3 + 3));
          const nrm = p0.clone().sub(V(c)).cross(p1.clone().sub(V(c))); if (nrm.dot(V(T)) * dir > 0) si.push(ci, base + k, base + k + 1); else si.push(ci, base + k + 1, base + k); } }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of []) { if (joinSeam && ((ri0 === 0 && i === a) || (ri0 === runs.length - 1 && i === b))) continue; const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);
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


let m=buildMarkings(THREE,S,td.markings);meshes.push({name:'markings',positions:Array.from(m.attributes.position.array),indices:Array.from(m.index.array)});
fs.writeFileSync('work/track-maker-r1/source_p1b_drift_meshes.json',JSON.stringify(meshes));
