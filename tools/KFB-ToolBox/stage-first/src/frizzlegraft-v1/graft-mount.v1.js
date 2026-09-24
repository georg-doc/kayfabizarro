/* FrizzleGraft v1 · graft-mount.v1 — EIN LESER FÜR DEN VERTRAG.
 *
 * Georg 14.09.: »json MUSS das alles sauber enthalten und in allen Tools funktionieren.« Bis hierher
 * gab es für einen `kfb.pets/1`-Eintrag mit `module:'Graft'` genau EINEN Leser: das Studio, mit
 * rund zehn Bauschritten inline in seinem Blatt. Das Animation Lab hatte einen Umweg mit festen
 * Zahlen — der »falsche Rig« (keine Manschetten-Korrektur, keine Materialzonen, keine Waffe, keine
 * Pose, Carls Braue fehlte). Dieses Modul ist der Bauweg des Studios als EIN Aufruf: Eintrag rein,
 * Figur raus. Dieselben Module, dieselbe Reihenfolge, dieselben Vorgaben — nichts nachgebaut.
 *
 * REIHENFOLGE (aus `KFB FrankenStein Studio v17` `_buildBiped`, Z. 1906–2055, wörtlich übernommen,
 * weil jede Umstellung dort schon einmal bezahlt wurde):
 *   1 GraftBiped init/mount/ready (Wirt, Kopf, Haut-Schnitt mit Textur-Probe, Rollen)
 *   2 Kenney-Augen des Spenders ausblenden
 *   3 EyeRig → Oval → Kopfzonen-Anhang → Braue (gezeichnet | Carl) → Nase (gezeichnet | Carl) → Bart
 *   4 Mund
 *   5 Pose (VOR dem ersten Bild — das Rig hält die Bindepose fest)
 *   6 Kopfzonen (Gesichtston aus der Hand) → Rollen → Materialzonen + Wortmarke (ZULETZT, sie
 *     hängen ihre Leinwände an die fertigen Materialien)
 *   7 Spenderaugen ausblenden → Waffe (Handbetrieb)
 *
 * WAS DER AUFRUFER MITBRINGT: THREE, einen GLTFLoader, einen Elternknoten, den Eintrag (`pet`), den
 * Vertrag (`lib`: eyeRig · face · mouth · actor) für die globalen Vorgaben. Sonst nichts.
 *
 * ANIMATION: `animation:'own'` — der Bewohner spielt sein Idle selbst (Studio-Weg, `handle.update`
 * treibt seinen Mixer). `animation:'host'` — der Aufrufer besitzt die Clips (Animation Lab): das
 * eigene Idle wird gestoppt, `handle.figure` ist die Wurzel für seinen Mixer, `handle.update` tut
 * alles AUSSER dem Mixer (Gesicht, Pose nach dem Clip, Wobble).
 *
 * EIGENTUM: dieses Modul besitzt nur die REIHENFOLGE. Jeder Wert gehört dem Eintrag, jede Form
 * ihrem Modul. Fällt ein optionales Modul aus, fehlt genau das eine Bauteil und steht im Bericht.
 */
export const SCHEMA = 'kfb.graft-mount/1';
export const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
const enc = (s) => s.split('/').map(encodeURIComponent).join('/');
const hexInt = (h) => (typeof h === 'number' ? h : parseInt(String(h).replace('#', ''), 16));

/* Vorgabe des Studios (Blatt Z. 372) — der Mund liest pet.mouth > lib.mouth > diese Zeile. */
const MOUTH_DEF = { size: 0.44, dy: -0.52, sx: 1, dx: 0, tilt: 0, rot: 0, bend: 0, set: 'male', lift: 0.03, wrap: 1, onTop: false,
  visemeMap: { closed: 'm', open: 'ah', wide: 'ee', round: 'oh', smile: 'smile' } };
/* Vorgabe der Waffe: Georgs Kalibrierung vom 13.09. (Studio `_weaponDefaults`).
   `anchor` (14.09., gemessen): KayKit ANIMIERT `handslot*` eigenständig — Jump_Full_Long 17°, Idle 1,6°,
   Walk/Run 0°, Ranged_1H_Aiming 68°, Ranged_2H_Aiming/Shoot 85° relativ zur Hand. In den Ranged-Clips
   IST der Slot die Zielrichtung (KayKits Absicht: Requisiten am Slot). `'slot'` folgt ihr; `'hand'`
   friert den Slot auf seine Bindepose und hängt die Waffe starr an die Faust — Georgs Kalibrierung
   bleibt in beiden Fällen dieselbe Weltlage in der Bindepose. */
/* WAFFENKLASSEN (14.09., aus dem Clip-Inventar gemessen: export/KAYKIT_CLIP_INVENTAR_MEDIUM_2026-09-14.md).
   Klasse und Phase stehen im KayKit-Clipnamen; `hand` ist die Slot-Seite aus der Drift der Slot-Spuren
   (Pistole/Gewehr: handslot.r dreht 68–85°, .l 0° → Waffe rechts; Bogen: Draw dreht nur .r 90° → Bogen
   LINKS, rechte Hand zieht die Sehne). `measured:false` = KayKit hat keine eigenen Clips für die Klasse,
   die Familie ist geliehen. Der Eintrag darf `hand` ausdrücklich überschreiben; der Bericht sagt es dann. */
export const WEAPON_CLASSES = {
  pistol:     { label: 'Pistole / Blaster', hand: 'right', support: false, clips: /^Ranged_1H_/, fx: 'muzzle', measured: true },
  rifle:      { label: 'Gewehr', hand: 'right', support: true, clips: /^Ranged_2H_|^Running_HoldingRifle$/, fx: 'muzzle', measured: true },
  launcher:   { label: 'Bazooka / Werfer', hand: 'right', support: true, clips: /^Ranged_2H_/, fx: 'muzzle', measured: false },
  bow:        { label: 'Bogen', hand: 'left', support: true, clips: /^Ranged_Bow_|^Running_HoldingBow$/, fx: 'tip', measured: true },
  crossbow:   { label: 'Armbrust', hand: 'right', support: true, clips: /^Ranged_2H_/, fx: 'tip', measured: false },
  'melee-1h': { label: 'Nahkampf einhändig', hand: 'right', support: false, clips: /^Melee_1H_|^Melee_Block/, fx: 'edge', measured: true },
  'melee-2h': { label: 'Nahkampf zweihändig', hand: 'right', support: true, clips: /^Melee_2H_/, fx: 'edge', measured: true },
};
/** Erste Klasse, deren Clip-Familie den Namen trifft (Reihenfolge der Tabelle), sonst null. */
export const clipClass = (name) => { for (const k in WEAPON_CLASSES) if (WEAPON_CLASSES[k].clips.test(name || '')) return k; return null; };
const WEAPON_DEF = { on: false, anchor: 'slot', class: 'pistol',
  url: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/11d7df978c63b9e375707bd8d9431b4c8358cda8/media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Character/glTF/Character_Gun.gltf',
  node: 'gun', hand: null, ex: -14, ey: 77, ez: 0, ox: 0, oy: -0.03, oz: 0, scale: 0.37, matColors: {} };

let _mods = null;
async function mods() {
  if (_mods) return _mods;
  const opt = async (p) => { try { return await import(new URL(p, import.meta.url).href); } catch (e) { console.warn('[graft-mount] optional fehlt: ' + p + ' — ' + (e && e.message)); return null; } };
  const [Graft, Rig, Mouth, Brow, Nose, Moust, Pose, Mat, Oval, Head, DonorEye, Mark, FaceGraft] = await Promise.all([
    import(new URL('./graft-biped.v1.js', import.meta.url).href),
    import(new URL('../petstudio-v9/studio-v12/pet-eye-rig.v6.js', import.meta.url).href),
    import(new URL('../petstudio-v9/studio-v3/pet-mouth.v1.js', import.meta.url).href),
    opt('../petstudio-v9/studio-v12/brow-rig.v2.js'),
    opt('../petstudio-v9/studio-v12/pet-nose.v2.js'),
    opt('../petstudio-v9/studio-v12/pet-moustache.v1.js'),
    opt('../petstudio-v9/studio-v13/pose-rig.v1.js'),
    opt('./matzones.v1.js'),
    opt('./eyeoval.v1.js'),
    opt('./headzones.v1.js'),
    opt('./donoreyes.v1.js'),
    opt('./wordmark.v1.js'),
    opt('../lab-v6/facegraft.v1.js'),
  ]);
  _mods = { Graft, Rig, Mouth, Brow, Nose, Moust, Pose, Mat, Oval, Head, DonorEye, Mark, FaceGraft };
  return _mods;
}

/** Die Gesichtsmodule in der Form, die `lab-v6/carlrig-mount.v1.js` erwartet (`mods.eye/brow/nose/stache/mouth`)
    — dieselben Dateien, die der Graft benutzt; ein zweiter Import wäre ab morgen die zweite Wahrheit. */
export async function faceMods() {
  const M = await mods();
  return { eye: M.Rig, brow: M.Brow, nose: M.Nose, stache: M.Moust, mouth: M.Mouth };
}

/** Findet im Vertrag den ersten Graft-Eintrag (oder den mit `id`). */
export function pickGraftPet(contract, id = null) {
  const pets = (contract && contract.pets) || [];
  if (id) return pets.find((p) => p.id === id) || null;
  return pets.find((p) => p.kind === 'biped' && p.module === 'Graft') || null;
}

let _carlFace = null;
async function carlFace(THREE, loader, G) {
  if (_carlFace) return _carlFace;
  _carlFace = await G.loadDonorFace({ THREE, loader, url: RAW + enc(G.DONOR_CARL.path) });
  return _carlFace;
}

export async function mountGraft({ THREE, loader, parent, pet, lib = {}, camera = null, animation = 'own', override = null, poseOverClip = 'auto', log = (s) => console.info('[graft-mount] ' + s) }) {
  if (!pet) throw new Error('kein Eintrag');
  const M = await mods();
  const notes = [];
  const note = (s) => { notes.push(s); log(s); };
  const p = JSON.parse(JSON.stringify(pet));   // eigene Kopie: der Leser schreibt nie in Georgs Eintrag
  /* `override`: Messvarianten des Aufrufers (z. B. Waffen-Anker im Lab) — nur auf der Kopie, nie im Eintrag. */
  if (override) { const deep = (a, b) => { for (const k of Object.keys(b)) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) { a[k] = a[k] && typeof a[k] === 'object' ? a[k] : {}; deep(a[k], b[k]); } else a[k] = b[k]; } }; deep(p, override); }
  const RigMod = M.Rig, MouthMod = M.Mouth;

  /* ── 1 · der Bewohner ─────────────────────────────────────────────────────────────────── */
  const root = new THREE.Group(); root.name = 'graft-root · ' + (p.id || 'graft');
  parent.add(root);
  let seed = 20260909;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const b = new M.Graft.default();
  await b.init({ three: THREE, rng, clock: { now: () => performance.now() / 1000 }, gltfLoader: loader,
    assets: { raw: (path) => RAW + enc(path) }, camera, log: (s) => log('[biped] ' + s) });
  b.variant = p.variant || 'driver';
  const g = p.graft || {};
  if (g.neck != null) b.neck = g.neck;
  if (g.size != null) b.headScale = g.size;
  if (g.skin != null) b.skinMode = g.skin;
  if (g.tone !== undefined && g.tone !== 'face') b.skinColor = g.tone;
  if (g.hands) b.handsAre = g.hands;   // vor dem ersten Färben, das läuft in `ready`
  b.mount(root);
  const report = await b.ready;
  b._groundKeep = () => null;   // der Aufrufer besitzt den Boden
  if (animation === 'host' && b.mixer) { b.mixer.stopAllAction(); b.action = null; }

  /* Waffen-Netze des Spenders (FrizzleBob mit Gewehr) nicht mitmessen — Studio-Befund 09.09. */
  b.figure.traverse((o) => {
    if (!o.isMesh && !o.isSkinnedMesh) return;
    let q = o.parent, isGun = /^gun/i.test(o.name); while (q && q !== b.figure) { if (/^gun/i.test(q.name || '')) isGun = true; q = q.parent; }
    if (isGun) o.userData.noMeasure = true;
  });

  /* ── 2 · Kenneys aufgemalte Augen (FrizzleBob-Spender) ─────────────────────────────────── */
  b.figure.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && o.parent && /^Head/.test(o.parent.name || '') && [].concat(o.material).some((mt) => mt && /^(EyeColor|White|Black)$/.test(mt.name || ''))) { o.visible = false; o.userData.noMeasure = true; } });

  /* ── 3 · das Gesicht: Augen ─────────────────────────────────────────────────────────────── */
  const SPEC = M.Graft.SPEC, E = SPEC.eyes;
  const er = lib.eyeRig || {}, face = lib.face || {};
  const eye = { anchor: { ...E.anchor }, pupilStyle: E.pupilStyle, pupilSize: E.pupilSize, inset: E.inset, gloss: E.gloss, lidFit: E.lidFit, converge: E.converge, ...(p.eye || {}) };
  const style = eye.pupilStyle || 'matte-cute';
  const color = p.color || '#f2c93c';
  const blink = { minGap: 2.5, maxGap: 6.5, dur: 0.12, ...((face.eye && face.eye.blink) || er.blink || {}) };
  const lashes = eye.lashes || (face.eye && face.eye.lashes) || { length: 0, density: 6, width: 1 };
  const fctx = b.faceCtx();
  const rig = new RigMod.EyeRig(fctx, {
    anchor: eye.anchor, pupilStyle: style, blink,
    pupilSize: eye.pupilSize != null ? eye.pupilSize : (er.pupilSize != null ? er.pupilSize : 0.4),
    inset: eye.inset != null ? eye.inset : (er.inset != null ? er.inset : 0),
    lidFit: eye.lidFit != null ? eye.lidFit : (er.lidFit != null ? er.lidFit : 0.9),
    gloss: (er.gloss && er.gloss[style]) != null ? er.gloss[style] : 0.85,
    converge: eye.converge != null ? eye.converge : (er.converge != null ? er.converge : 0),
    splay: eye.splay != null ? eye.splay : 0,
    lidSampler: null, baseColor: hexInt(color), lashes,
  });
  rig.build();
  if (M.Oval) { try { M.Oval.attach(rig, () => (p.eye && p.eye.oval) || M.Oval.DEFAULTS); } catch (e) { note('eyeoval: ' + e.message); } }
  if (M.Head) { try { M.Head.attach(rig, () => ({ sclera: p.eye && p.eye.sclera != null ? p.eye.sclera : null, pupil: p.eye && p.eye.pupil != null ? p.eye.pupil : null })); } catch (e) { note('headzones: ' + e.message); } }
  const neutral = face.emotes && face.emotes.neutral;
  if (neutral) rig.applyEmote(neutral);
  const leben = (lib.actor && lib.actor.leben) || {};
  rig.setLife({ on: (leben.life == null ? 1 : leben.life) > 0, wander: leben.wander != null ? leben.wander : 0.09, tremor: leben.tremor != null ? leben.tremor : 0.045 });
  const eyeFrame = () => rig.eyeFrame();

  /* Braue: gezeichnet (brow-rig.v2) — oder Carls eigene (facegraft), dann ist die gezeichnete aus. */
  let brow = null, browGraft = null;
  const bp = p.brow || {};
  if (M.Brow) {
    const D = M.Brow.DEFAULTS, expr = bp.expr || 'neutral';
    const points = Array.isArray(bp.points) ? bp.points : M.Brow.pointsFor(expr);
    const params = { ...D, points };
    for (const k of Object.keys(D)) if (bp[k] !== undefined) params[k] = bp[k];
    try { brow = new M.Brow.BrowRig({ THREE, getEyeFrame: eyeFrame, baseColor: hexInt(color), seed: 1001, params }); } catch (e) { note('brow: ' + e.message); }
  }
  if (bp.mod === 'carl-original') {
    if (!M.FaceGraft) note('Carls Braue gewünscht, facegraft.v1 fehlt');
    else {
      try {
        const cf = await carlFace(THREE, loader, M.FaceGraft);
        if (cf.ok && cf.brow) {
          const src = bp.graft || {}, params = { ...M.FaceGraft.BROW_DEFAULTS };
          for (const k of Object.keys(M.FaceGraft.BROW_DEFAULTS)) if (src[k] !== undefined) params[k] = src[k];
          params.enabled = bp.enabled !== false;
          browGraft = new M.FaceGraft.BrowGraft({ THREE, donor: cf.brow, getEyeFrame: eyeFrame, params });
          if (brow) brow.set({ enabled: false });
        } else note('Carl-Spender ohne Braue: ' + JSON.stringify(cf.report || {}));
      } catch (e) { note('browgraft: ' + e.message); }
    }
  } else if (brow) brow.set({ enabled: bp.enabled !== false });

  /* Nase: gezeichnet (pet-nose.v2, beim Zweibeiner AN) — oder Carls. */
  let nose = null, noseGraft = null;
  const np = p.nose || {};
  if (M.Nose) {
    const D = M.Nose.DEFAULTS, params = { ...D, enabled: true };
    for (const k of Object.keys(D)) if (np[k] !== undefined) params[k] = np[k];
    try { nose = new M.Nose.NoseRig({ THREE, getEyeFrame: eyeFrame, params }); } catch (e) { note('nose: ' + e.message); }
  }
  if (np.mod === 'carl-original') {
    if (!M.FaceGraft) note('Carls Nase gewünscht, facegraft.v1 fehlt');
    else {
      try {
        const cf = await carlFace(THREE, loader, M.FaceGraft);
        if (cf.ok && cf.nose) {
          const src = np.graft || {}, params = { ...M.FaceGraft.NOSE_DEFAULTS };
          for (const k of Object.keys(M.FaceGraft.NOSE_DEFAULTS)) if (src[k] !== undefined) params[k] = src[k];
          params.enabled = np.enabled !== false;
          noseGraft = new M.FaceGraft.NoseGraft({ THREE, donor: cf.nose, getEyeFrame: eyeFrame, params });
          if (nose) nose.set({ enabled: false });
        } else note('Carl-Spender ohne Nase');
      } catch (e) { note('nosegraft: ' + e.message); }
    }
  } else if (nose) nose.set({ enabled: np.enabled !== false });

  /* Schnurrbart: nur wenn der Eintrag ihn trägt — ein Bart ist eine Entscheidung. */
  let moust = null;
  const mp0 = p.moustache || {};
  if (M.Moust && mp0.enabled) {
    try {
      const D = M.Moust.DEFAULTS, styleName = mp0.style || 'walrus';
      const base = M.Moust.paramsForStyle(styleName) || { ...D };
      const params = { ...D, ...base };
      for (const k of Object.keys(D)) if (mp0[k] !== undefined) params[k] = mp0[k];
      params.enabled = true;
      moust = new M.Moust.MoustacheRig({ THREE, getEyeFrame: eyeFrame, getNose: () => (nose && nose.mesh.visible ? nose.frame : null), baseColor: hexInt(color), seed: 2002, params });
    } catch (e) { note('moustache: ' + e.message); }
  }

  /* ── 4 · Mund ───────────────────────────────────────────────────────────────────────────── */
  const mp = { ...MOUTH_DEF, ...SPEC.mouth, ...(lib.mouth || {}), ...(p.mouth || {}) };
  mp.visemeMap = { ...MOUTH_DEF.visemeMap, ...((lib.mouth && lib.mouth.visemeMap) || {}), ...((p.mouth && p.mouth.visemeMap) || {}) };
  let mouth = null;
  try {
    mouth = new MouthMod.PetMouth(fctx, { params: mp });
    if (mp.set && mouth.setId !== mp.set) mouth.setSet(mp.set);
    mouth.build();
    mouth.rest = 'neutral'; mouth.setTex('neutral');
  } catch (e) { note('mouth: ' + e.message); }

  /* ── 5 · Pose ───────────────────────────────────────────────────────────────────────────── */
  let pose = null;
  if (M.Pose) {
    try {
      pose = new M.Pose.PoseRig({ THREE, root, figure: b.figure, fb: b, log: (t) => log('[pose] ' + t) });
      const st = pose.build();
      if (st.status === 'OK') { if (p.pose && Object.keys(p.pose).length) pose.set(p.pose); pose.apply(); }
      else { note('pose: ' + JSON.stringify(st)); pose = null; }
    } catch (e) { note('pose: ' + e.message); pose = null; }
  }

  /* ── 6 · Kopfzonen → Rollen → Materialzonen ─────────────────────────────────────────────── */
  let zoneRep = null, roleRep = null, matZones = null, matRep = null, markRep = null;
  if (b.applyZones) {
    const z = g.zones || { face: 'hand', sat: 1.25 };
    const mode = z.face || 'hand', sat = z.sat != null ? z.sat : 1, hand = b.handTone;
    let faceTone = null, lightMix = 0.4;
    if (z.faceHex != null) faceTone = z.faceHex;
    else if (mode === 'hand' && hand != null) faceTone = hand;
    else if (mode === 'pale' && hand != null) { const r = (hand >> 16) & 255, g2 = (hand >> 8) & 255, bl = hand & 255, m = 0.35; faceTone = (Math.round(r + (255 - r) * m) << 16) | (Math.round(g2 + (255 - g2) * m) << 8) | Math.round(bl + (255 - bl) * m); }
    else if (mode === 'off') lightMix = 0;
    try {
      zoneRep = b.applyZones({ faceTone, bodyTone: z.bodyHex != null ? z.bodyHex : null, lightMix, sat, roots: [b._graft && b._graft.group].filter(Boolean) });
      if (g.tone === 'face' && zoneRep && zoneRep.face) b.setSkinColor(parseInt(zoneRep.face.slice(1), 16));
    } catch (e) { note('zones: ' + e.message); }
  }
  if (b.setRoles) {
    const R = g.roles || {};
    try {
      if (R.skin !== undefined) b.setSkinColor(R.skin == null ? null : R.skin);
      roleRep = b.setRoles({ cloth: R.cloth ?? null, accent: R.accent ?? null });
      if (rig.setBaseColor) rig.setBaseColor(R.eyes != null ? R.eyes : hexInt(color));
    } catch (e) { note('roles: ' + e.message); }
  }
  if (M.Mat && b.figure) {
    try {
      const z = M.Mat.buildMatZones({ THREE, figure: b.figure, headRoot: (b._graft && b._graft.group) || null, hostKey: b.hostKey || null, log: (t) => log('[matzones] ' + t) });
      if (z && z.status === 'OK') {
        matZones = z;
        z.apply(g.mat || {});
        if (M.Mark) {
          const w = { ...M.Mark.DEFAULTS, ...(g.wordmark || {}) };
          const touched = M.Mark.zonesTouched(z.grid);
          z.setStamp('kfb-wordmark', { zones: touched, draw: (cx, W, H) => M.Mark.drawWordmark(cx, W, H, w) });
          M.Mark.loadFont().then((ok) => { if (ok && matZones === z) z.setStamp('kfb-wordmark', { zones: touched, draw: (cx, W, H) => M.Mark.drawWordmark(cx, W, H, w) }); });
          markRep = z.stampReport('kfb-wordmark');
        }
        matRep = z.report();
      } else matRep = z || { status: 'KEIN_ATLAS' };
    } catch (e) { note('matzones: ' + e.message); }
  }

  /* ── 7 · Spenderaugen → Waffe ───────────────────────────────────────────────────────────── */
  let donorEyes = null;
  if (M.DonorEye && b._graft && b._graft.group && g.donorEyes !== 'keep') {
    try { const r = M.DonorEye.stripDonorEyes({ THREE, headRoot: b._graft.group, log: () => {} }); if (r.status === 'OK') donorEyes = r; } catch (e) { note('donoreyes: ' + e.message); }
  }
  let weapon = null, weaponRep = null;
  const wc = { ...WEAPON_DEF, ...(g.weapon || {}) };
  if (wc.on) {
    try { weapon = await mountWeapon({ THREE, loader, figure: b.figure, cfg: wc }); weaponRep = weapon.report; }
    catch (e) { weaponRep = { status: 'UNSUPPORTED', reason: e.message }; note('weapon: ' + e.message); }
  }

  const handle = {
    schema: SCHEMA, id: p.id, pet: p, biped: b, root, figure: b.figure, rig, brow, browGraft, nose, noseGraft, moust, mouth, pose, matZones, donorEyes, weapon,
    report: { biped: report, tint: b.tintReport || null, handTone: b.handTone != null ? '#' + b.handTone.toString(16).padStart(6, '0') : null,
      graft: b.graftReport ? b.graftReport() : null, zones: zoneRep, roles: roleRep, mat: matRep, wordmark: markRep,
      eye: { anchor: rig.anchor, pupilStyle: rig.pupilStyle, pupilSize: rig.pupilSize }, brow: browGraft ? 'carl-original' : (brow ? 'drawn' : 'none'),
      nose: noseGraft ? 'carl-original' : (nose ? 'drawn' : 'none'), pose: pose ? pose.report() : null, weapon: weaponRep, notes },
    /* Je Bild. `animation:'host'`: ohne Mixer — der Aufrufer hat seinen eigenen laufen lassen, die
       Pose rechnet DANACH über den Clip (Studio Z. 4737).
       14.09. GEMESSEN (Lab, Move): der Eintrag trägt `pose.on:true, preset:'stand'`; `pose.apply()` schrieb
       jedes Bild die Stand-Beine über den laufenden Walk-Clip — die Figur rutschte mit starren Beinen.
       Regel `poseOverClip`: 'auto' = die Pose gewinnt nur für Sitz-Voreinstellungen (nicht 'stand'),
       true = immer (Fahrzeug/Sessel), false = nie (Clip besitzt die Knochen). Umschaltbar per handle. */
    poseOverClip,
    poseWins() { const P = pose && pose.built && pose.p && pose.p.on; if (!P) return false; const m = handle.poseOverClip; return m === true || (m === 'auto' && pose.p.preset !== 'stand'); },
    update(dt, cam) {
      if (animation === 'own') b.update(dt, cam || camera);
      if (handle.poseWins()) pose.apply();
      rig.update(dt);
      if (brow) brow.sync();
      if (browGraft) browGraft.sync(dt);
      if (nose) nose.sync();
      if (noseGraft) noseGraft.sync(dt);
      if (moust) moust.sync();
      if (mouth) mouth.update(dt, cam || camera);
    },
    dispose() {
      const t = (f) => { try { f(); } catch (e) {} };
      if (weapon) t(() => weapon.dispose());
      if (donorEyes) t(() => donorEyes.restore());
      if (matZones) t(() => matZones.dispose());
      if (mouth) t(() => mouth.dispose());
      if (moust) t(() => moust.dispose());
      if (noseGraft) t(() => noseGraft.dispose());
      if (nose) t(() => nose.dispose());
      if (browGraft) t(() => browGraft.dispose());
      if (brow) t(() => brow.dispose());
      if (pose) t(() => pose.dispose());
      t(() => rig.dispose());
      t(() => b.dispose());
      if (root.parent) root.parent.remove(root);
    },
  };
  return handle;
}

/* Waffe im Handbetrieb — Studio `_weaponMountManual`/`_weaponPlaceManual`, ohne Oberfläche. */
const _weaponCache = new Map();
async function mountWeapon({ THREE: T, loader, figure, cfg: c }) {
  const all = [];
  figure.traverse((o) => { if (o.isBone && /handslot|hand|fist|wrist/i.test(o.name)) all.push(o); });
  if (!all.length) throw new Error('kein Hand-/Faust-/Handgelenkknochen in diesem Wirt');
  const sideOf = (n) => (/right/i.test(n) ? 'r' : /left/i.test(n) ? 'l' : (/r$/i.test(n) ? 'r' : /l$/i.test(n) ? 'l' : ''));
  const K = WEAPON_CLASSES[c.class] || WEAPON_CLASSES.pistol, klass = WEAPON_CLASSES[c.class] ? c.class : 'pistol';
  const hand = c.hand || K.hand;   // Eintrag ausdrücklich > Klassenvorgabe
  const want = hand === 'left' ? 'l' : 'r';
  const pool = all.filter((b) => sideOf(b.name) === want);
  const RANK = [/handslot/i, /^hand/i, /hand/i, /fist/i, /wrist/i];
  const src0 = pool.length ? pool : all;
  let bone = null; for (const re of RANK) { const hit = src0.find((b) => re.test(b.name)); if (hit) { bone = hit; break; } }
  bone = bone || src0[0];
  const key = c.url + '·' + c.node;
  let src = _weaponCache.get(key);
  if (!src) {
    const gltf = await loader.loadAsync(c.url);
    let scene = gltf.scene || gltf.scenes[0];
    if (c.node) {
      let picked = null; const re = new RegExp(c.node, 'i');
      scene.traverse((n) => { if (!picked && !n.isBone && re.test(n.name)) picked = n; });
      if (picked) { const gg = picked.clone(true); gg.position.set(0, 0, 0); gg.quaternion.identity(); gg.scale.set(1, 1, 1); const wrap = new T.Group(); wrap.name = picked.name; wrap.add(gg); scene = wrap; }
    }
    scene.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; } });
    _weaponCache.set(key, scene); src = scene;
  }
  const obj = src.clone(true);
  const mc = c.matColors || {};
  obj.traverse((n) => { if (!n.isMesh || !n.material) return; n.material = n.material.clone(); const hex = mc[n.material.name]; if (hex) n.material.color = new T.Color(hex); });
  const holder = new T.Group(); holder.name = 'KFB weapon · manual';
  holder.add(obj);
  /* Unterarm und Slot-Bindelage in der BINDEPOSE messen (Eichung vor Messung, wie facehost.v1): der
     Mixer kann schon ein Bild geschrieben haben. */
  const skels = new Set(); figure.traverse((n) => { if (n.isSkinnedMesh && n.skeleton) skels.add(n.skeleton); });
  const allBones = []; figure.traverse((n) => { if (n.isBone) allBones.push(n); });
  const saved = allBones.map((b) => ({ p: b.position.clone(), q: b.quaternion.clone(), s: b.scale.clone() }));
  skels.forEach((sk) => { try { sk.pose(); } catch (e) {} });
  figure.updateMatrixWorld(true);
  let elbow = bone.parent; while (elbow && (!elbow.isBone || /handslot|hand|fist|wrist/i.test(elbow.name))) elbow = elbow.parent;
  const fa = Math.max(1e-4, elbow && elbow.isBone ? bone.getWorldPosition(new T.Vector3()).distanceTo(elbow.getWorldPosition(new T.Vector3())) : 0);
  const isSlot = /handslot/i.test(bone.name), handBone = isSlot && bone.parent && bone.parent.isBone ? bone.parent : null;
  let mountAt = bone, fix = null, anchor = 'slot';
  if (c.anchor === 'hand' && handBone) {
    /* Der Slot als FESTE Zwischenstufe: seine Bindelage relativ zur Hand, danach Georgs Kalibrierung.
       Weltlage in der Bindepose identisch zu 'slot'; im Clip folgt nur noch die Hand. */
    fix = new T.Group(); fix.name = 'KFB weapon · slot fixiert (' + bone.name + ')';
    fix.position.copy(bone.position); fix.quaternion.copy(bone.quaternion); fix.scale.copy(bone.scale);
    handBone.add(fix); mountAt = fix; anchor = 'hand';
  }
  allBones.forEach((b, i) => { b.position.copy(saved[i].p); b.quaternion.copy(saved[i].q); b.scale.copy(saved[i].s); });
  figure.updateMatrixWorld(true);
  mountAt.add(holder);
  const D = Math.PI / 180;
  holder.quaternion.setFromEuler(new T.Euler(c.ex * D, c.ey * D, c.ez * D, 'YXZ'));
  holder.position.set(0, 0, 0);
  holder.translateX(c.ox * fa); holder.translateY(c.oy * fa); holder.translateZ(c.oz * fa);
  holder.scale.setScalar(c.scale);
  obj.traverse((n) => { n.userData.noMeasure = true; });
  /* MÜNDUNG — gemessen, nicht geraten: die längste Achse der Waffe im Halter ist der Lauf, das Ende
     weiter weg vom Handgelenk ist die Mündung. Ein Knoten am Halter, also folgt er der Waffe, egal
     welcher Anker gewählt ist. FX hängen sich HIER an, nie an einen Handknochen. */
  holder.updateWorldMatrix(true, true);
  const inv = new T.Matrix4().copy(holder.matrixWorld).invert();
  const lb = new T.Box3(); const v = new T.Vector3();
  obj.traverse((n) => { if (!n.isMesh || !n.geometry) return; if (!n.geometry.boundingBox) n.geometry.computeBoundingBox(); const bb = n.geometry.boundingBox; for (let i = 0; i < 8; i++) { v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(n.matrixWorld).applyMatrix4(inv); lb.expandByPoint(v); } });
  const size = lb.getSize(new T.Vector3()), ctr = lb.getCenter(new T.Vector3());
  const ax = size.x >= size.y && size.x >= size.z ? 'x' : size.y >= size.z ? 'y' : 'z';
  const endA = ctr.clone(), endB = ctr.clone(); endA[ax] = lb.min[ax]; endB[ax] = lb.max[ax];
  const wristW = (elbow || bone).getWorldPosition(new T.Vector3());
  const dA = holder.localToWorld(endA.clone()).distanceTo(wristW), dB = holder.localToWorld(endB.clone()).distanceTo(wristW);
  const muzzleLocal = dA > dB ? endA : endB;
  const muzzle = new T.Object3D(); muzzle.name = 'KFB muzzle'; muzzle.position.copy(muzzleLocal); holder.add(muzzle);
  const muzzleW = muzzle.getWorldPosition(new T.Vector3());
  return { holder, bone, mountBone: mountAt === fix ? handBone : bone, fix, muzzle, anchor,
    report: { status: 'OK', bone: bone.name, anchor, mountedOn: (mountAt === fix ? handBone : bone).name, forearm: +fa.toFixed(4), url: c.url, node: c.node,
      class: klass, classLabel: K.label, hand, classHand: K.hand, handOverride: !!(c.hand && c.hand !== K.hand), support: K.support, fx: K.fx, clipFamily: K.clips.source, classMeasured: K.measured,
      barrelAxis: ax, barrelLength: +size[ax].toFixed(4), muzzleLocal: muzzleLocal.toArray().map((x) => +x.toFixed(4)), muzzleWorld: muzzleW.toArray().map((x) => +x.toFixed(4)) },
    dispose() { holder.removeFromParent(); if (fix) fix.removeFromParent(); holder.traverse((n) => { if (n.isMesh && n.material) [].concat(n.material).forEach((m) => m.dispose()); }); } };
}
export default mountGraft;
