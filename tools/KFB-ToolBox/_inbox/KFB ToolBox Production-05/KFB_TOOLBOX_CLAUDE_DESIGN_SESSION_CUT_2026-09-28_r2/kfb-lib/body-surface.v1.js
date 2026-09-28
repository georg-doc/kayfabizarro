/* KFB body-surface.v1 · BODY-02 (Studio › Body)
 * Owner for material family, surface scale, colour zones and the test-light moods.
 * - Works on MeshStandardMaterial slots only. Face parts (eyes, lids, brows, nose, mouth, moustache),
 *   thin overlays (userData.petOverlay), transparent decals, pose jigs and hidden meshes are never touched.
 * - Per actor family a zone map decides which slots are Skin/Fur · Clothing · Ears · Accessories. A zone only
 *   exists when the loaded figure really has slots for it. Hair tufts keep their own owner (hair-tufts.v1).
 * - Mesh and rig identity stay: the mesh keeps geometry, skeleton, name and shadow flags; only the material
 *   slot points at a per-zone clone. dispose() puts every original material and texture filter back.
 * - No texture is invented. Surface scale acts on the real texture sampling and on the material response. */
export const SCHEMA = 'kfb.body-surface/0.1';
export const FAMILIES = [['original', 'Original'], ['clay', 'Clay']];   // craft families append here
export const SCALES = [['character', 'Character'], ['mid', 'Midground'], ['large', 'Large object']];
export const ZONES = [['skin', 'Skin / fur'], ['cloth', 'Clothing'], ['hair', 'Hair'], ['ears', 'Ears'], ['acc', 'Accessories']];
export const DEFAULTS = Object.freeze({ family: 'original', scale: 'character', colors: {} });
export const LIGHTS = {
  neutral: { label: 'Neutral', hemi: [0xfff4e0, 0x3a3226, 1.25], sun: [0xffffff, 1.8], dir: [6, 11, 7] },   // = ToolBox boot light
  day: { label: 'Day', hemi: [0xe4eeff, 0x4d4a3c, 1.4], sun: [0xfff6e6, 2.5], dir: [4, 13, 5] },
  evening: { label: 'Evening', hemi: [0xffd6b8, 0x2c2230, 0.8], sun: [0xffad6b, 1.8], dir: [-9, 3.6, 6] },
  night: { label: 'Night work', hemi: [0x33426e, 0x0a0c14, 0.42], sun: [0xffdcae, 1.5], dir: [2.5, 9, 4.5] },
};
const SCALE_K = { character: { sheen: 0.5, rough: 0, aniso: 0 }, mid: { sheen: 0.22, rough: 0.03, aniso: 4 }, large: { sheen: 0, rough: 0.08, aniso: -1 } };
const FACE = /eye|brow|nose|mouth|moust|pupil|iris|(^|[^a-z])lid|teeth|tongue|lash/i;
const SKIP_UP = /pose-jig|faceHost|kfb-lid|clay-lid|eyerig/i;
const EAR = /(^|[^a-z])ear/i;
/* [zone, field, regex] · first hit wins · field: mesh | mat | up (ancestor names) */
const RULES = {
  pet: [['skin', 'mesh', /./]],   // Cube Pets: one atlas over body, legs, tail
  graft: [['ears', 'mesh', EAR], ['acc', 'mesh', /glass|hat|cap|helmet|bag|belt/i], ['skin', 'mat', /skin/i], ['skin', 'mesh', /head/i], ['cloth', 'mesh', /body|leg|arm/i]],
  earfb: [['ears', 'mesh', EAR], ['skin', 'mat', /yellow|skin|fur/i]],
  kaykit: [['acc', 'mesh', /armor|shoulder|pad|belt|helmet|strap/i], ['skin', 'mesh', /head|arm(left|right)?$/i], ['cloth', 'mesh', /body|leg/i]],
  legacy: [['-', 'matUp', /head.*\|(black|white|red)$/i], ['skin', 'mat', /green/i], ['acc', 'mat', /metal|wood|gold|silver|iron|steel/i], ['cloth', 'mat', /./]],
  generic: [['ears', 'mesh', EAR], ['acc', 'mesh', /glass|hat|cap|helmet|armor|shoulder|belt|bag/i], ['skin', 'mat', /skin|fur|yellow|green/i], ['cloth', 'mat', /cloth|shirt|pant|jacket|leather|fabric/i], ['skin', 'mesh', /head|arm|body|leg|tail/i]],
};
const hexOf = (c) => '#' + c.getHexString();

export function makeSurface(THREE, root, opt = {}) {
  const kind = RULES[opt.kind] ? opt.kind : 'generic', rules = RULES[kind];
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
  /* one clone per (zone, original material) — zones stop sharing, a zone keeps sharing inside itself */
  const pairs = new Map();
  for (const s of slots) {
    const key = s.zone + '|' + s.orig.uuid;
    if (!pairs.has(key)) pairs.set(key, { zone: s.zone, orig: s.orig, std: null, phys: null, slots: [] });
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
  let params = { ...DEFAULTS, colors: {} };

  const mk = (p, phys) => {
    if (phys) { if (!p.phys) { const m = new THREE.MeshPhysicalMaterial(); THREE.MeshStandardMaterial.prototype.copy.call(m, p.orig); m.defines = { STANDARD: '', PHYSICAL: '' }; m.name = p.orig.name; m.userData = { ...p.orig.userData, kfbSurface: 'clay' }; p.phys = m; } return p.phys; }
    if (!p.std) { p.std = p.orig.clone(); p.std.userData = { ...p.orig.userData, kfbSurface: 'original' }; } return p.std;
  };
  function apply() {
    const clay = params.family === 'clay', K = SCALE_K[params.scale] || SCALE_K.character;
    for (const p of pairs.values()) {
      const m = mk(p, clay), o = p.orig, z = zoneById[p.zone], hex = params.colors && params.colors[p.zone];
      m.color.copy(o.color);
      if (hex && z) { const c = new THREE.Color(hex), r = z.ref; m.color.setRGB(Math.min(1.5, o.color.r * c.r / Math.max(r.r, 0.02)), Math.min(1.5, o.color.g * c.g / Math.max(r.g, 0.02)), Math.min(1.5, o.color.b * c.b / Math.max(r.b, 0.02))); }
      m.roughness = Math.min(1, (clay ? Math.max(o.roughness, 0.9) : o.roughness) + K.rough);
      m.metalness = clay ? 0 : o.metalness;
      if (clay) { m.sheen = K.sheen; m.sheenRoughness = 0.75; m.sheenColor.copy(m.color).lerp(new THREE.Color(1, 1, 1), 0.55); m.specularIntensity = 0.35; m.clearcoat = 0; }
      m.needsUpdate = true;
      for (const s of p.slots) { if (s.arr) { const a = s.o.material.slice(); a[s.idx] = m; s.o.material = a; } else s.o.material = m; }
    }
    for (const [t, v] of texOrig) {
      const src = params.scale === 'character';
      const mag = src ? v.mag : THREE.LinearFilter, min = src ? v.min : THREE.LinearMipmapLinearFilter, an = src ? v.an : (K.aniso < 0 ? maxAniso : Math.min(K.aniso, maxAniso));
      if (t.magFilter !== mag || t.minFilter !== min || t.anisotropy !== an) { t.magFilter = mag; t.minFilter = min; t.anisotropy = an; t.needsUpdate = true; }
    }
  }
  const api = {
    schema: SCHEMA, kind, status: zoneList.length ? 'OK' : 'NO_ZONES', zones: zoneList, skipped,
    get params() { return JSON.parse(JSON.stringify(params)); },
    /** Scale only acts where it can: on real textures or on the clay response. */
    get scaleActive() { return texOrig.size > 0 || params.family === 'clay'; },
    get textures() { return texOrig.size; },
    set(p) {
      const n = { ...params, ...(p || {}) };
      if (!FAMILIES.some(([k]) => k === n.family)) n.family = 'original';
      if (!SCALES.some(([k]) => k === n.scale)) n.scale = 'character';
      const col = {}; for (const [k, v] of Object.entries(n.colors || {})) if (zoneById[k] && /^#[0-9a-f]{6}$/i.test(v || '')) col[k] = v.toLowerCase();
      params = { family: n.family, scale: n.scale, colors: col }; apply(); return api.params;
    },
    zoneColor(id) { const p = [...pairs.values()].find((x) => x.zone === id && !x.orig.map) || [...pairs.values()].find((x) => x.zone === id); if (!p) return null; const m = p.slots[0].arr ? p.slots[0].o.material[p.slots[0].idx] : p.slots[0].o.material; return hexOf(m.color); },
    /** Per-slot live state for tests: which material is on the mesh now, and what it came from. */
    probe() { return slots.map((s) => { const m = s.arr ? s.o.material[s.idx] : s.o.material; return { mesh: s.o.name, zone: s.zone, type: m.type, own: m === s.orig || m === pairs.get(s.zone + '|' + s.orig.uuid).std || m === pairs.get(s.zone + '|' + s.orig.uuid).phys, color: hexOf(m.color), orig: hexOf(s.orig.color), rough: +m.roughness.toFixed(3), cast: s.o.castShadow }; }); },
    report() { return { schema: SCHEMA, kind, zones: zoneList.map((z) => ({ id: z.id, parts: z.parts, tint: z.tint, meshes: z.meshes })), skipped, textures: texOrig.size, params: api.params }; },
    dispose() {
      for (const s of slots) { if (s.arr) { const a = s.o.material.slice(); a[s.idx] = s.orig; s.o.material = a; } else s.o.material = s.orig; }
      for (const [t, v] of texOrig) { t.magFilter = v.mag; t.minFilter = v.min; t.anisotropy = v.an; t.needsUpdate = true; }
      for (const p of pairs.values()) { if (p.std) p.std.dispose(); if (p.phys) p.phys.dispose(); }
    },
  };
  return api;
}

/** Test light · stage-level, never part of an actor. Returns the key-light direction for the fitted shadow frustum. */
export function applyLight(THREE, hemi, sun, id) {
  const L = LIGHTS[id] || LIGHTS.neutral;
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2];
  sun.color.setHex(L.sun[0]); sun.intensity = L.sun[1];
  return new THREE.Vector3().fromArray(L.dir);
}
