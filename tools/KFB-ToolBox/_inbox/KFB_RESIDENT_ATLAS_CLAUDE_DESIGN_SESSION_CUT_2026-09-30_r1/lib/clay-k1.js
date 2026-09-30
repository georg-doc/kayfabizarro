/* KFB · S14 · Brief A-R · K1/H0-Knetform + AO für den Resident Atlas.
   Donor: K1/H0-Codepaket 2026-09-29 (tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt …):
     · clay-soften.v1 (unverändert kopiert) = Unterteilen, Verschweißen, Taubin, Beulen — nur statische Netze
     · Profile je Klasse aus clay-profiles.v2 (soften-Feld): house/prop {} · road {maxEdge .16, iters 4, lump .01} · nature {…}
     · AO wie clay-catalog.v5: GTAOPass im Composer, Werte × Figurenmaßstab
   EIGENE Ergänzung (kein Donor): softenSkinned — Taubin ohne Unterteilung auf Skin-Netzen, Index, UV und
   Gewichte bleiben; nur Lage und Normalen ändern sich. clay-soften.v1 fasst Skin-Netze bewusst nicht an.
   Reihenfolge wie K1: echter Donor → Form (hier) → K2-Material (lib/diorama.js) → Fußkontakt (Gate).
   Kontaktregel: die Unterkante (Requisiten) bzw. Oberkante (Boden/Weg) jedes Netzes bleibt auf dem Millimeter. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { softenGeometry } from './clay/clay-soften.v1.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const PROF = {  // clay-profiles.v2 · soften. S14-Abweichung nach A/B: Pfeiler lasen mit iters 8 / lump .018 als geschmolzene Kerzen
  /* S14b (Georg 30.09.): Gruft zu stark, Flächen fließen zusammen, Lücke über der Tür → house iters 3, lump .006, eine Stufe */
  prop: { iters: 4, lump: 0.01 }, house: { iters: 3, lump: 0.006, maxLevels: 1 }, road: { maxEdge: 0.16, iters: 4, lump: 0.01 },
  nature: { maxLevels: 0, iters: 1, lump: 0.06 }, flat: { maxEdge: 0.16, iters: 2, lump: 0 }
};
const yieldNow = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });

/* Budget (gemessen S14, Friedhof): mit 16k je Netz und Budget je Geometrie stiegen die gerenderten Dreiecke
   von 107k auf 1,13 Mio. (×10,6), weil geteilte Geometrie 238-mal gezeichnet wird. Jetzt: Budget je
   gezeichneter Instanz, höchstens zwei Unterteilungsstufen, große Stücke zuerst. */
export function makeK1(V, { figureH = 2.3, perMeshTris = 4000, maxLevels = 2, budgetTris = 160000 } = {}) {
  const S = { form: true, applied: 0, skinned: 0, skipped: 0, thin: 0, overBudget: 0, addedTris: 0, ms: 0, errors: [] };
  const swapped = new Map();          // mesh -> original geometry
  const cache = new Map();            // orig geom uuid|kind -> softened geometry
  const kindOf = (o, name) => {
    if (o.isSkinnedMesh) return 'skinned';
    if (/floor|path|tile|road|pav|ground|plate|step/.test(name)) return 'flat';
    /* S14b: kahle Bäume/Äste zeigten Artefakte (lump 6 % der Diagonale auf dünnen Zweigen) → dünne Stücke bleiben in Form, nur K2 */
    if (/dead|bare|branch|twig|trunk|stick|stump/.test(name)) return 'thin';
    if (/tree|bush|pine|leaf|plant|grass|mushroom|flower|pumpkin/.test(name)) return 'nature';
    if (/crypt|house|building|arch|wall|shrine|mausol|tower|church/.test(name)) return 'house';
    return 'prop';
  };
  const skipMat = (m) => !m || m.isShaderMaterial || m.isMeshBasicMaterial || m.isSpriteMaterial || m.isPointsMaterial || m.isLineBasicMaterial || m.isShadowMaterial;

  function keepEdge(src, out, top) {
    src.computeBoundingBox(); out.computeBoundingBox();
    const d = top ? src.boundingBox.max.y - out.boundingBox.max.y : src.boundingBox.min.y - out.boundingBox.min.y;
    if (Math.abs(d) > 1e-6) { out.translate(0, d, 0); out.computeBoundingBox(); }
    out.computeBoundingSphere();
  }
  function copySeed(src, out) {
    const a = src.attributes.claySeed; if (!a) return;
    const n = out.attributes.position.count, v = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { v[i * 3] = a.getX(0); v[i * 3 + 1] = a.getY(0); v[i * 3 + 2] = a.getZ(0); }
    out.setAttribute('claySeed', new THREE.BufferAttribute(v, 3));
  }

  /* Skin-Netz: gleiche Vertices, gleiche Indizes, gleiche Gewichte. Nur Taubin + Normalen je Lage. */
  function softenSkinned(geom, o = {}) {
    const opt = Object.assign({ iters: 3, lambda: 0.5, mu: -0.53 }, o);
    const g = geom.clone(), P = g.attributes.position, n = P.count;
    g.computeBoundingBox(); const diag = g.boundingBox.getSize(new THREE.Vector3()).length(), q = 1e4 / Math.max(diag, 1e-6);
    const map = new Map(), id = new Int32Array(n), U = [];
    for (let i = 0; i < n; i++) {
      const k = Math.round(P.getX(i) * q) + ',' + Math.round(P.getY(i) * q) + ',' + Math.round(P.getZ(i) * q);
      let j = map.get(k); if (j === undefined) { j = U.length / 3; map.set(k, j); U.push(P.getX(i), P.getY(i), P.getZ(i)); } id[i] = j;
    }
    const nu = U.length / 3, nb = Array.from({ length: nu }, () => new Set()), use = new Map();
    const idx = g.index ? g.index.array : null, tc = idx ? idx.length : n;
    const vi = (t) => (idx ? idx[t] : t);
    for (let t = 0; t < tc; t += 3) for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
      const i = id[vi(t + a)], j = id[vi(t + b)]; if (i === j) continue;
      nb[i].add(j); nb[j].add(i); const k = i < j ? i + '_' + j : j + '_' + i; use.set(k, (use.get(k) || 0) + 1);
    }
    const fixed = new Uint8Array(nu); for (const [k, c] of use) if (c === 1) { const [i, j] = k.split('_'); fixed[+i] = 1; fixed[+j] = 1; }
    const X = Float64Array.from(U), T = new Float64Array(nu * 3);
    const step = (f) => { for (let i = 0; i < nu; i++) { if (fixed[i] || !nb[i].size) { T[i * 3] = X[i * 3]; T[i * 3 + 1] = X[i * 3 + 1]; T[i * 3 + 2] = X[i * 3 + 2]; continue; } let sx = 0, sy = 0, sz = 0; for (const j of nb[i]) { sx += X[j * 3]; sy += X[j * 3 + 1]; sz += X[j * 3 + 2]; } const m = nb[i].size; T[i * 3] = X[i * 3] + f * (sx / m - X[i * 3]); T[i * 3 + 1] = X[i * 3 + 1] + f * (sy / m - X[i * 3 + 1]); T[i * 3 + 2] = X[i * 3 + 2] + f * (sz / m - X[i * 3 + 2]); } X.set(T); };
    for (let it = 0; it < opt.iters; it++) { step(opt.lambda); step(opt.mu); }
    const N = new Float64Array(nu * 3);
    for (let t = 0; t < tc; t += 3) {
      const a = id[vi(t)], b = id[vi(t + 1)], c = id[vi(t + 2)];
      const e1 = [X[b * 3] - X[a * 3], X[b * 3 + 1] - X[a * 3 + 1], X[b * 3 + 2] - X[a * 3 + 2]], e2 = [X[c * 3] - X[a * 3], X[c * 3 + 1] - X[a * 3 + 1], X[c * 3 + 2] - X[a * 3 + 2]];
      const nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
      for (const v of [a, b, c]) { N[v * 3] += nx; N[v * 3 + 1] += ny; N[v * 3 + 2] += nz; }
    }
    const nrm = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const j = id[i]; P.setXYZ(i, X[j * 3], X[j * 3 + 1], X[j * 3 + 2]); const l = Math.hypot(N[j * 3], N[j * 3 + 1], N[j * 3 + 2]) || 1; nrm[i * 3] = N[j * 3] / l; nrm[i * 3 + 1] = N[j * 3 + 1] / l; nrm[i * 3 + 2] = N[j * 3 + 2] / l; }
    P.needsUpdate = true; g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  }

  async function apply(root) {
    if (!S.form || !root) return 0;
    const t0 = performance.now(); let n = 0, tick = performance.now();
    const list = [];
    root.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && !o.isInstancedMesh && !swapped.has(o) && !o.userData.noClay && o.geometry && o.geometry.attributes.position) { const ms = [].concat(o.material); if (!ms.some(skipMat) && !ms.some((m) => m.transparent && (m.opacity ?? 1) < 0.98)) list.push(o); } });
    const diagOf = (o) => new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()).length();
    const sized = list.map((o) => [o, diagOf(o)]).sort((a, b) => b[1] - a[1]);
    const entryBox = new Map();
    const entryOf = (o) => { let e = o; for (let p = o; p && p !== root; p = p.parent) if (p.userData.entry) { e = p; break; } return e; };
    for (const [o] of sized) {
      let name = ''; for (let p = o; p && p !== root; p = p.parent) name += '/' + (p.userData.entry?.id || p.name || '');
      name = name.toLowerCase();
      let kind = kindOf(o, name);
      if (kind !== 'skinned' && kind !== 'flat') { const sz = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()), mx = Math.max(sz.x, sz.y, sz.z), mn = Math.min(sz.x, sz.y, sz.z); if (mx > 0 && mn / mx < 0.12) kind = 'thin'; }
      if (kind === 'thin') { S.thin++; continue; }
      /* S14b · Lauffläche bleibt in Form: gerundete Wegsteine wuchsen in die Fugen, zwei Skelette standen 11–14 cm höher
         auf Stein statt auf Erde (gemessen gegen den S13-Stand). Weg und Kacheln tragen nur das K2-Material. */
      if (kind === 'flat') { S.flat = (S.flat || 0) + 1; continue; }
      /* Unterkante nur halten, wenn das Netz selbst auf dem Boden des Eintrags steht — sonst verrutschen Teile
         gegeneinander (Sturz über der Gruft-Tür) */
      const er = entryOf(o); if (!entryBox.has(er)) entryBox.set(er, new THREE.Box3().setFromObject(er));
      const eb = entryBox.get(er), mb = new THREE.Box3().setFromObject(o);
      const touch = mb.min.y - eb.min.y < 0.03 * Math.max(0.1, eb.max.y - eb.min.y);
      const src = o.geometry, key = src.uuid + '|' + kind + '|' + (touch ? 1 : 0);
      let out = cache.get(key);
      if (!out) {
        try {
          if (kind === 'skinned') { out = softenSkinned(src); }
          else {
            const r = softenGeometry(THREE, src, Object.assign({ maxTris: perMeshTris, maxLevels, seed: (cache.size % 17) + 1 }, PROF[kind]));
            if (r.skipped) { S.skipped++; continue; }
            out = r.geometry;
            /* flach: keine Verschiebung — Oberkante = Kieselspitze hob ganze Kacheln um ~10 cm */
            if (touch && kind !== 'flat') keepEdge(src, out, false); else { out.computeBoundingBox(); out.computeBoundingSphere(); }
            out = mergeVertices(out, 1e-5); out.computeBoundingBox(); out.computeBoundingSphere();
          }
          copySeed(src, out);
          out.userData.k1 = kind;
          cache.set(key, out);
        } catch (e) { S.errors.push((o.name || '?') + ': ' + e.message); continue; }
      }
      const triOf = (g) => (g.index ? g.index.count : g.attributes.position.count) / 3;
      const add = Math.max(0, triOf(out) - triOf(src));
      if (S.addedTris + add > budgetTris) { S.overBudget++; continue; }
      S.addedTris += add; if (kind === 'skinned') S.skinned++;
      swapped.set(o, src); o.geometry = out; n++;
      if (performance.now() - tick > 30) { await yieldNow(); tick = performance.now(); }
    }
    S.applied = swapped.size; S.ms += Math.round(performance.now() - t0);
    return n;
  }
  function revert() { for (const [o, g] of swapped) o.geometry = g; swapped.clear(); S.applied = 0; S.addedTris = 0; S.overBudget = 0; S.skinned = 0; S.thin = 0; S.flat = 0; S.ms = 0; }

  /* ---------- AO (K1: GTAOPass, radius .45 / thickness 1.2 bei Figur 1,2 → × figureH/1.2) ---------- */
  const k = figureH / 1.2;
  const A = { on: false, composer: null, pass: null, w: 0, h: 0, pr: 0, buffer: false, ms: null, q: 'mittel' };
  /* S14b · Georg M1: Friedhof Diorama 10 fps. GTAO rendert die Szene ein zweites Mal (Normalen/Tiefe).
     hoch = volle Auflösung, 16 Proben, MSAA 4 · mittel = halbe AO-Auflösung, 8 Proben, MSAA 2 · niedrig = aus (Host) */
  const AOQ = { hoch: { scale: 1, samples: 16, pd: 16, rings: 2, msaa: 4 }, mittel: { scale: 0.5, samples: 8, pd: 8, rings: 1, msaa: 2 }, niedrig: { scale: 0.5, samples: 6, pd: 6, rings: 1, msaa: 0 } };
  function tuneAO() {
    if (!A.composer) return; const q = AOQ[A.q] || AOQ.mittel;
    A.pass.updateGtaoMaterial({ samples: q.samples }); A.pass.updatePdMaterial({ samples: q.pd, rings: q.rings });
    for (const rt of [A.composer.renderTarget1, A.composer.renderTarget2]) if (rt.samples !== q.msaa) { rt.samples = q.msaa; rt.dispose(); }
    A.w = 0;
  }
  function ensureAO() {
    if (A.composer) return;
    const r = V.renderer, sz = r.getSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(sz.x, sz.y, { type: THREE.HalfFloatType, samples: 2 });
    A.composer = new EffectComposer(r, rt);
    A.composer.addPass(new RenderPass(V.scene, V.camera));
    A.pass = new GTAOPass(V.scene, V.camera, sz.x, sz.y);
    A.pass.updateGtaoMaterial({ radius: 0.45 * k, distanceExponent: 1.4, thickness: 1.2 * k, scale: 1.0, samples: 16 });
    A.pass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    A.pass.blendIntensity = 0.9;
    A.composer.addPass(A.pass);
    A.composer.addPass(new OutputPass());
    tuneAO();
  }
  function render() {
    const r = V.renderer, sz = r.getSize(new THREE.Vector2()), pr = r.getPixelRatio();
    if (sz.x !== A.w || sz.y !== A.h || pr !== A.pr) { A.w = sz.x; A.h = sz.y; A.pr = pr; A.composer.setPixelRatio(pr); A.composer.setSize(sz.x, sz.y); const s = (AOQ[A.q] || AOQ.mittel).scale; if (s !== 1) A.pass.setSize(Math.round(sz.x * pr * s), Math.round(sz.y * pr * s)); }
    A.composer.render();
  }
  function setAO(on, buffer = false) {
    A.on = !!on; A.buffer = !!buffer;
    if (A.on) { ensureAO(); A.pass.output = A.buffer ? GTAOPass.OUTPUT.Denoise : GTAOPass.OUTPUT.Default; V.hooks.render = render; }
    else V.hooks.render = null;
  }
  /* Kosten: dieselbe Kamera, 12 Bilder je Zustand, gl.finish */
  function benchAO() {
    const gl = V.renderer.getContext(), run = (f) => { f(); gl.finish(); const t = performance.now(); for (let i = 0; i < 12; i++) f(); gl.finish(); return (performance.now() - t) / 12; };
    ensureAO(); const was = V.hooks.render;
    run(render); run(() => V.renderer.render(V.scene, V.camera));   // Aufwärmen beider Wege
    const ao = run(render), plain = run(() => V.renderer.render(V.scene, V.camera));
    V.hooks.render = was;
    A.ms = { plain: +plain.toFixed(2), ao: +ao.toFixed(2), plus: +(ao - plain).toFixed(2) };
    return A.ms;
  }

  return {
    apply, revert, setAO, benchAO,
    setAOQuality(q) { A.q = q; tuneAO(); },
    setForm(on) { S.form = !!on; if (!on) revert(); },
    get state() { return { form: S.form, meshes: swapped.size, skinned: S.skinned, cached: cache.size, skipped: S.skipped, thin: S.thin, flat: S.flat || 0, overBudget: S.overBudget, addedTris: S.addedTris, ms: S.ms, errors: S.errors.slice(-4), ao: A.on, aoBuffer: A.buffer, aoMs: A.ms }; }
  };
}
