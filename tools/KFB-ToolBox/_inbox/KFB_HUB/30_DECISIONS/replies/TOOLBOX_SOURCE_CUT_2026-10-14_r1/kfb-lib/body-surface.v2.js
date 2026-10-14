/* KFB body-surface.v2 · BODY-02 + Knete (Studio › Body) — v1 plus the family »Knete · K2«.
 * Still the ONE owner of actor material slots. v1 families (Original, Matte clay) unchanged.
 * Knete = the accepted K2 base (clay-material.v10 + clay-relief.v4 tools + clay-relief.v2 hand strokes, 28.09.,
 *   CLAY_BUILDING_FACADE_ROUTER: »K2 v10 for new stages«). Profile `figure`, tool mix per part, Handmaß scaled to the
 *   actor's real height (H0 reference: figure 1.2 units ↔ hand 0.5).
 * Georg 30.09.: brows (esp. the thick block brows), nose, moustache and ears get Knet-Rillen too. Eyes, lids, pupils,
 *   mouth decals, teeth stay clean. Face parts come from the face owner (opt.faceParts getter, face-mount.v1) and are
 *   re-checked by sync(), because brow/nose owners rebuild their geometry. Face parts read the relief from a rest copy
 *   of their vertices (attribute clayRest), so brow life/expressions do not make the Rillen swim.
 * Relief is object-space (rest pose) → it sticks to skinned meshes. dispose() restores every original material. */
import * as CM from './clay/clay-material.v10.js';
import { makeClayRelief } from './clay/clay-relief.v2.js';
import { makeToolReliefs } from './clay/clay-relief.v4.js';

export const SCHEMA = 'kfb.body-surface/0.2';
export const FAMILIES = [['original', 'Original'], ['clay', 'Matte clay'], ['knete', 'Knete · K2']];
export const SCALES = [['character', 'Character'], ['mid', 'Midground'], ['large', 'Large object']];
export const ZONES = [['skin', 'Skin / fur'], ['cloth', 'Clothing'], ['hair', 'Hair'], ['ears', 'Ears'], ['acc', 'Accessories']];
export const KNETE_DEF = Object.freeze({ strength: 1, size: 1, face: true, prints: true, hand: false });   // hand = H0 stroke map: gives cross-ribs on small round parts (nose), same finding as K2 → off like K2
export const DEFAULTS = Object.freeze({ family: 'original', scale: 'character', colors: {}, knete: { ...KNETE_DEF } });
/* k strength · s size (× hand tile) · c coverage of the tool zone — set by eye on FB / Carl, not measured */
export const KNETE_MIX = {
  figure: { thumb: { k: 0.55, s: 0.35, c: 0.5 }, fan: { k: 0.5, s: 0.3, c: 0.45 }, smear: { k: 0.35, s: 0.5, c: 0.3 }, dent: { k: 0.3, s: 0.4, c: 0.35 } },
  face: { thumb: { k: 0.85, s: 0.16, c: 0.75 }, fan: { k: 0.65, s: 0.14, c: 0.6 }, crease: { k: 0.45, s: 0.14, c: 0.45 }, dent: { k: 0.3, s: 0.18, c: 0.35 } },
};
export const LIGHTS = {
  neutral: { label: 'Neutral', hemi: [0xfff4e0, 0x3a3226, 1.25], sun: [0xffffff, 1.8], dir: [6, 11, 7] },
  day: { label: 'Day', hemi: [0xe4eeff, 0x4d4a3c, 1.4], sun: [0xfff6e6, 2.5], dir: [4, 13, 5] },
  evening: { label: 'Evening', hemi: [0xffd6b8, 0x2c2230, 0.8], sun: [0xffad6b, 1.8], dir: [-9, 3.6, 6] },
  night: { label: 'Night work', hemi: [0x33426e, 0x0a0c14, 0.42], sun: [0xffdcae, 1.5], dir: [2.5, 9, 4.5] },
};
const SCALE_K = { character: { sheen: 0.5, rough: 0, aniso: 0, knete: 1 }, mid: { sheen: 0.22, rough: 0.03, aniso: 4, knete: 1.8 }, large: { sheen: 0, rough: 0.08, aniso: -1, knete: 3 } };
const FACE = /eye|brow|nose|mouth|moust|pupil|iris|(^|[^a-z])lid|teeth|tongue|lash/i;
const SKIP_UP = /pose-jig|faceHost|kfb-lid|clay-lid|eyerig/i;
const EAR = /(^|[^a-z])ear/i;
const RULES = {
  pet: [['skin', 'mesh', /./]],
  graft: [['ears', 'mesh', EAR], ['acc', 'mesh', /glass|hat|cap|helmet|bag|belt/i], ['skin', 'mat', /skin/i], ['skin', 'mesh', /head/i], ['cloth', 'mesh', /body|leg|arm/i]],
  earfb: [['ears', 'mesh', EAR], ['skin', 'mat', /yellow|skin|fur/i]],
  kaykit: [['acc', 'mesh', /armor|shoulder|pad|belt|helmet|strap/i], ['skin', 'mesh', /head|arm(left|right)?$/i], ['cloth', 'mesh', /body|leg/i]],
  legacy: [['-', 'matUp', /head.*\|(black|white|red)$/i], ['skin', 'mat', /green/i], ['acc', 'mat', /metal|wood|gold|silver|iron|steel/i], ['cloth', 'mat', /./]],
  generic: [['ears', 'mesh', EAR], ['acc', 'mesh', /glass|hat|cap|helmet|armor|shoulder|belt|bag/i], ['skin', 'mat', /skin|fur|yellow|green/i], ['cloth', 'mat', /cloth|shirt|pant|jacket|leather|fabric/i], ['skin', 'mesh', /head|arm|body|leg|tail/i]],
};
const hexOf = (c) => '#' + c.getHexString();

/* K2 textures: built once per page (≈ 1–3 s CPU), shared by every actor */
let TEX = null;
function clayTextures(THREE, maxAniso) {
  if (TEX) return TEX;
  TEX = (async () => {
    const t0 = performance.now();
    const tex = (d, n) => { const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = maxAniso; t.needsUpdate = true; return t; };
    await new Promise((r) => setTimeout(r, 0));
    const rel = makeClayRelief({ size: 1024, seed: 31 });
    const tools = await makeToolReliefs({ size: 1024, seed: 41 });
    let print = null, printErr = null;
    try { print = await CM.makePrintTexture(THREE, new URL('./clay/Fingerprints01_3K.png', import.meta.url).href, 2048); } catch (e) { printErr = String(e && e.message || e); }
    return { relT: tex(rel.data, 1024), tools: tools.maps.map((m) => tex(m, tools.size)), print, printErr, ms: Math.round(performance.now() - t0) };
  })();
  return TEX;
}

export function makeSurface(THREE, root, opt = {}) {
  const kind = RULES[opt.kind] ? opt.kind : 'generic', rules = RULES[kind];
  const faceParts = typeof opt.faceParts === 'function' ? opt.faceParts : () => [];
  const onChange = typeof opt.onChange === 'function' ? opt.onChange : () => {};
  const slots = [], skipped = { face: 0, overlay: 0, other: 0 };
  const visible = (o) => { for (let n = o; n; n = n.parent) { if (!n.visible) return false; if (n === root) break; } return true; };
  const upName = (o) => { const a = []; for (let n = o.parent; n && n !== root; n = n.parent) a.push(n.name || ''); return a.join('/'); };
  root.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    const up = upName(o), mats = [].concat(o.material);
    mats.forEach((m, idx) => {
      if (!visible(o)) return;
      if (o.userData.petOverlay) { skipped.overlay++; return; }
      if (!m || !m.isMeshStandardMaterial || m.transparent || SKIP_UP.test(up)) { skipped.other++; return; }
      if (FACE.test(o.name) || FACE.test(m.name || '') || FACE.test(up.split('/')[0] || '')) { skipped.face++; return; }
      const f = { mesh: o.name || '', mat: m.name || '', up, matUp: up + '|' + (m.name || '') };
      const hit = rules.find(([, k, re]) => re.test(f[k]));
      if (!hit || hit[0] === '-') { skipped.face += hit ? 1 : 0; skipped.other += hit ? 0 : 1; return; }
      slots.push({ o, idx, arr: Array.isArray(o.material), orig: m, zone: hit[0] });
    });
  });
  const pairs = new Map();
  for (const s of slots) {
    const key = s.zone + '|' + s.orig.uuid;
    if (!pairs.has(key)) pairs.set(key, { zone: s.zone, orig: s.orig, std: null, phys: null, knete: null, slots: [] });
    pairs.get(key).slots.push(s);
  }
  const texOrig = new Map();
  for (const p of pairs.values()) if (p.orig.map && !texOrig.has(p.orig.map)) { const t = p.orig.map; texOrig.set(t, { mag: t.magFilter, min: t.minFilter, an: t.anisotropy }); }
  const zoneList = ZONES.filter(([id]) => id !== 'hair').map(([id, label]) => {
    const ps = [...pairs.values()].filter((p) => p.zone === id); if (!ps.length) return null;
    const plain = ps.find((p) => !p.orig.map), ref = plain ? plain.orig.color.clone() : new THREE.Color(1, 1, 1);
    const meshes = [...new Set(ps.flatMap((p) => p.slots.map((s) => s.o.name || '(unnamed)')))];
    return { id, label, parts: ps.reduce((n, p) => n + p.slots.length, 0), textured: ps.some((p) => !!p.orig.map), tint: !plain, ref, refHex: hexOf(ref), meshes };
  }).filter(Boolean);
  const zoneById = Object.fromEntries(zoneList.map((z) => [z.id, z]));
  const maxAniso = Math.max(1, opt.maxAnisotropy || 8);
  let params = { ...DEFAULTS, colors: {}, knete: { ...KNETE_DEF } };

  /* ---------- Knete state ---------- */
  const height = (() => { try { const b = new THREE.Box3().setFromObject(root); const h = b.max.y - b.min.y; return isFinite(h) && h > 0.05 ? h : 1.2; } catch (e) { return 1.2; } })();
  const K0 = height / 1.2;
  const KN = { status: 'idle', tex: null, U: null, ms: 0, err: null, face: new Map(), faceMats: new Map(), seeded: new WeakSet(), seedN: 1 };
  const kneteOn = () => params.family === 'knete' && KN.status === 'ready';
  const kK = () => K0 * (+params.knete.size || 1) * ((SCALE_K[params.scale] || SCALE_K.character).knete || 1);
  const prof = (mixKey, over = {}) => { const P = { ...CM.PROFILES.figure, ...over }, k = kK(); P.scale *= k; P.gougeSize *= k; P.crackSize *= k; P.dentSize *= k; P.tools = KNETE_MIX[mixKey]; return P; };
  const seed = (g) => { if (g && !KN.seeded.has(g)) { if (!g.attributes.claySeed) CM.seedGeometry(THREE, g, KN.seedN++); KN.seeded.add(g); } };
  function kneteUniforms() {
    const U = KN.U, q = params.knete, k = kK(), s = Math.max(0, +q.strength);
    U.uClayHand.value = 0.5 * k; U.uClayTile.value = 1.6 * k; U.uClayPrintTile.value = 4.5 * k;
    U.uClayStroke.value = 0.7 * s; U.uClayGrain.value = 0.16 * Math.min(1.5, s); U.uClayFacet.value = 0.14 * Math.min(1.5, s);
    U.uClayToolGain.value = U.uClayToolGain.value.map(() => s);
    U.uClayLegacyStroke.value = q.hand ? 1 : 0;
    U.uClayPrintOn.value = q.prints && KN.tex.print ? 1 : 0;
  }
  function ensureKnete() {
    if (KN.status !== 'idle') return;
    KN.status = 'loading';
    clayTextures(THREE, maxAniso).then((T) => {
      KN.tex = T; KN.ms = T.ms; KN.err = T.printErr;
      const U = KN.U = CM.makeClayUniforms(THREE, T.relT);
      [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = T.tools;
      U.uClayToolOn.value = 1; U.uClayPrint.value = T.print || T.relT; U.uClayMottle.value = 0.04; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6;
      KN.status = 'ready'; apply(); onChange();
    }).catch((e) => { KN.status = 'error'; KN.err = String(e && e.message || e); onChange(); });
  }
  const restPatch = (m) => {
    const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, r) => { ob(sh, r); sh.vertexShader = 'attribute vec3 clayRest;\n' + sh.vertexShader.replace('vClayP = position;', 'vClayP = clayRest;'); };
    m.customProgramCacheKey = () => ck() + '-rest';
    return m;
  };
  const restOf = (g) => { const P = g.attributes.position, a = g.attributes.clayRest; if (!a || a.count !== P.count) g.setAttribute('clayRest', new THREE.BufferAttribute(Float32Array.from(P.array.length === P.count * 3 ? P.array : Array.from({ length: P.count * 3 }, (_, i) => P.getComponent(Math.floor(i / 3), i % 3))), 3)); };
  function faceMat(orig) {
    let m = KN.faceMats.get(orig.uuid);
    if (!m) { m = restPatch(CM.makeClayMaterial(THREE, KN.U, { src: orig, profile: prof('face', { dent: 0.2, print: 0.8 }) })); m.userData = { ...orig.userData, clay: m.userData.clay, kfbSurface: 'knete-face', kfbOrig: orig }; KN.faceMats.set(orig.uuid, m); }
    return m;
  }
  const faceOk = (o, m) => o.isMesh && m && m.color && !m.isShaderMaterial && !m.isMeshBasicMaterial && !(m.transparent && (m.opacity == null || m.opacity < 0.98)) && !(m.userData && m.userData.kfbOwnMap) && !/eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash/i.test(o.name || '');
  function restoreFace() { for (const r of KN.face.values()) { try { const cur = [].concat(r.o.material); r.origs.forEach((om, i) => { if (om && cur[i] && cur[i].userData && cur[i].userData.kfbSurface === 'knete-face') cur[i] = om; }); r.o.material = r.arr ? cur : cur[0]; } catch (e) {} } KN.face.clear(); }
  /** Face parts: brows, nose, moustache from the face owner. Cheap — safe to call every few frames. */
  function sync() {
    if (!(kneteOn() && params.knete.face)) { if (KN.face.size) restoreFace(); return 0; }
    let n = 0; const seen = new Set();
    for (const o of faceParts() || []) {
      if (!o || !o.isMesh || !o.geometry || !o.geometry.attributes.position || !visible(o)) continue;
      seen.add(o); const arr = Array.isArray(o.material), cur = [].concat(o.material);
      let r = KN.face.get(o); if (!r) { r = { o, arr, origs: [], geom: null }; KN.face.set(o, r); }
      if (r.geom !== o.geometry) { restOf(o.geometry); seed(o.geometry); r.geom = o.geometry; }
      let changed = false;
      cur.forEach((m, i) => { if (!m || (m.userData && m.userData.kfbSurface === 'knete-face')) return; if (!faceOk(o, m)) return; r.origs[i] = m; cur[i] = faceMat(m); changed = true; });
      if (changed) { o.material = arr ? cur : cur[0]; n++; }
    }
    for (const [o, r] of KN.face) if (!seen.has(o)) { KN.face.delete(o); }
    return n;
  }

  const mk = (p, fam) => {
    if (fam === 'knete') { if (!p.knete) { const m = CM.makeClayMaterial(THREE, KN.U, { src: p.orig, profile: prof('figure') }); m.userData = { ...p.orig.userData, clay: m.userData.clay, kfbSurface: 'knete' }; p.knete = m; } return p.knete; }
    if (fam === 'clay') { if (!p.phys) { const m = new THREE.MeshPhysicalMaterial(); THREE.MeshStandardMaterial.prototype.copy.call(m, p.orig); m.defines = { STANDARD: '', PHYSICAL: '' }; m.name = p.orig.name; m.userData = { ...p.orig.userData, kfbSurface: 'clay' }; p.phys = m; } return p.phys; }
    if (!p.std) { p.std = p.orig.clone(); p.std.userData = { ...p.orig.userData, kfbSurface: 'original' }; } return p.std;
  };
  function apply() {
    if (params.family === 'knete') ensureKnete();
    const fam = params.family === 'knete' ? (KN.status === 'ready' ? 'knete' : 'original') : params.family;
    const clay = fam === 'clay', K = SCALE_K[params.scale] || SCALE_K.character;
    if (fam === 'knete') kneteUniforms();
    for (const p of pairs.values()) {
      const m = mk(p, fam), o = p.orig, z = zoneById[p.zone], hex = params.colors && params.colors[p.zone];
      m.color.copy(o.color);
      if (hex && z) { const c = new THREE.Color(hex), r = z.ref; m.color.setRGB(Math.min(1.5, o.color.r * c.r / Math.max(r.r, 0.02)), Math.min(1.5, o.color.g * c.g / Math.max(r.g, 0.02)), Math.min(1.5, o.color.b * c.b / Math.max(r.b, 0.02))); }
      if (fam === 'knete') { m.userData.clay.setProfile(prof('figure')); for (const s of p.slots) seed(s.o.geometry); }
      else {
        m.roughness = Math.min(1, (clay ? Math.max(o.roughness, 0.9) : o.roughness) + K.rough);
        m.metalness = clay ? 0 : o.metalness;
        if (clay) { m.sheen = K.sheen; m.sheenRoughness = 0.75; m.sheenColor.copy(m.color).lerp(new THREE.Color(1, 1, 1), 0.55); m.specularIntensity = 0.35; m.clearcoat = 0; }
        m.needsUpdate = true;
      }
      for (const s of p.slots) { if (s.arr) { const a = s.o.material.slice(); a[s.idx] = m; s.o.material = a; } else s.o.material = m; }
    }
    if (fam === 'knete') for (const m of KN.faceMats.values()) m.userData.clay.setProfile(prof('face', { dent: 0.2, print: 0.8 }));
    for (const [t, v] of texOrig) {
      const src = params.scale === 'character';
      const mag = src ? v.mag : THREE.LinearFilter, min = src ? v.min : THREE.LinearMipmapLinearFilter, an = src ? v.an : (K.aniso < 0 ? maxAniso : Math.min(K.aniso, maxAniso));
      if (t.magFilter !== mag || t.minFilter !== min || t.anisotropy !== an) { t.magFilter = mag; t.minFilter = min; t.anisotropy = an; t.needsUpdate = true; }
    }
    sync();
  }
  const api = {
    schema: SCHEMA, kind, status: zoneList.length ? 'OK' : 'NO_ZONES', zones: zoneList, skipped, height,
    get params() { return JSON.parse(JSON.stringify(params)); },
    get scaleActive() { return texOrig.size > 0 || params.family !== 'original'; },
    get textures() { return texOrig.size; },
    get knete() { return { status: KN.status, ms: KN.ms, err: KN.err, prints: !!(KN.tex && KN.tex.print), faceParts: KN.face.size, handK: +(0.5 * kK()).toFixed(3) }; },
    set(p) {
      const n = { ...params, ...(p || {}) };
      if (!FAMILIES.some(([k]) => k === n.family)) n.family = 'original';
      if (!SCALES.some(([k]) => k === n.scale)) n.scale = 'character';
      const col = {}; for (const [k, v] of Object.entries(n.colors || {})) if (zoneById[k] && /^#[0-9a-f]{6}$/i.test(v || '')) col[k] = v.toLowerCase();
      const kn = { ...KNETE_DEF, ...(params.knete || {}), ...((p && p.knete) || {}) };
      kn.strength = Math.max(0, Math.min(2, +kn.strength || 0)); kn.size = Math.max(0.3, Math.min(3, +kn.size || 1)); kn.face = kn.face !== false; kn.prints = kn.prints !== false; kn.hand = kn.hand === true;
      params = { family: n.family, scale: n.scale, colors: col, knete: kn }; apply(); return api.params;
    },
    sync,
    zoneColor(id) { const p = [...pairs.values()].find((x) => x.zone === id && !x.orig.map) || [...pairs.values()].find((x) => x.zone === id); if (!p) return null; const m = p.slots[0].arr ? p.slots[0].o.material[p.slots[0].idx] : p.slots[0].o.material; return hexOf(m.color); },
    probe() { return slots.map((s) => { const m = s.arr ? s.o.material[s.idx] : s.o.material, P = pairs.get(s.zone + '|' + s.orig.uuid); return { mesh: s.o.name, zone: s.zone, type: m.type, surface: (m.userData && m.userData.kfbSurface) || 'source', own: m === s.orig || m === P.std || m === P.phys || m === P.knete, color: hexOf(m.color), orig: hexOf(s.orig.color), rough: +m.roughness.toFixed(3), cast: s.o.castShadow }; }).concat([...KN.face.values()].map((r) => ({ mesh: r.o.name || '(face part)', zone: 'face', type: [].concat(r.o.material)[0].type, surface: 'knete-face' }))); },
    report() { return { schema: SCHEMA, kind, height: +height.toFixed(3), zones: zoneList.map((z) => ({ id: z.id, parts: z.parts, tint: z.tint, meshes: z.meshes })), skipped, textures: texOrig.size, params: api.params, knete: api.knete }; },
    dispose() {
      restoreFace();
      for (const s of slots) { if (s.arr) { const a = s.o.material.slice(); a[s.idx] = s.orig; s.o.material = a; } else s.o.material = s.orig; }
      for (const [t, v] of texOrig) { t.magFilter = v.mag; t.minFilter = v.min; t.anisotropy = v.an; t.needsUpdate = true; }
      for (const p of pairs.values()) { if (p.std) p.std.dispose(); if (p.phys) p.phys.dispose(); if (p.knete) p.knete.dispose(); }
      for (const m of KN.faceMats.values()) m.dispose(); KN.faceMats.clear();
    },
  };
  return api;
}

export function applyLight(THREE, hemi, sun, id) {
  const L = LIGHTS[id] || LIGHTS.neutral;
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2];
  sun.color.setHex(L.sun[0]); sun.intensity = L.sun[1];
  return new THREE.Vector3().fromArray(L.dir);
}
