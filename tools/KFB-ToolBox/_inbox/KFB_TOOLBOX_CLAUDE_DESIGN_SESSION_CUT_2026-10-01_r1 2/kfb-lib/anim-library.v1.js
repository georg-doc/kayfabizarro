/* kfb-lib/anim-library.v1.js · KFB Animation Library V1 (ToolBox Production-05 · Library tab)
   Pure data logic: catalog check, editorial patch (separate from source), gates, search, intake receipt, Fit & Motion offsets.
   The Motion Library catalog is read-only: nothing here writes into it. */

export const SCHEMA = 'kfb.animation-editorial-patch/1';
export const INTAKE_SCHEMA = 'kfb.animation-local-intake/0.1';
export const COMPAT = ['PROVEN', 'UNVERIFIED', 'INCOMPATIBLE', 'SOURCE_REQUIRED'];
/* Source facts. A patch record may never carry these; import drops them and says so. */
export const IMMUTABLE = ['id', 'label_de', 'group', 'rigs', 'frames', 'durationSec', 'fps', 'loop', 'loopPoseDiffDeg', 'rootMotion', 'rootBone',
  'travelMetersPerCycle', 'contacts', 'bestVariant', 'sourceFbx', 'sourcePack', 'facingYawDeg', 'library', 'notes_source', 'intake', 'events', 'pairedWith', 'duplicateOf', 'ledgeHeightM', 'endsOnTop'];
export const EDITABLE = ['displayName', 'tags', 'cluster', 'notes', 'exportEnabled', 'preview', 'actorVerdicts'];

/* Semantic roles a Resident asks for (HANDOVER_WSA_S40). Assignments point at immutable ids, never at labels. */
export const ROLES = [
  ['idle.default', 'Idle · default'], ['locomotion.walk', 'Walk'], ['locomotion.run', 'Run'],
  ['talk.explain', 'Talk · explain'], ['talk.chat', 'Talk · chat'], ['talk.phone', 'Talk · phone'],
  ['react.happy', 'React · happy'], ['react.hit', 'React · hit'], ['react.cheer', 'React · cheer'],
  ['signature.primary', 'Signature move'], ['signature.secondary', 'Signature move 2'],
  ['vehicle.seated', 'Seated / cockpit'], ['dance', 'Dance'], ['music.drums', 'Music · drums'],
];

export const GROUP_LABEL = { action: 'Action', climb: 'Climb', dance: 'Dance', gesture: 'Gesture', idle: 'Idle', interaction: 'Interaction · prop',
  locomotion: 'Locomotion', music: 'Music', reaction: 'Reaction', talk: 'Talk', throw: 'Throw' };

export function validateCatalog(cat) {
  const errors = [], clips = (cat && cat.clips) || [];
  if (!cat || cat.schema !== 'kfb.motion-catalog.v1') errors.push('schema ' + (cat && cat.schema));
  const ids = clips.map((c) => c.id), unique = new Set(ids).size;
  if (unique !== ids.length) errors.push('duplicate ids: ' + (ids.length - unique));
  if (cat && cat.clipCount != null && cat.clipCount !== ids.length) errors.push('clipCount ' + cat.clipCount + ' ≠ rows ' + ids.length);
  const rigs = (cat && cat.rigs) || [], unresolved = [], files = new Set();
  for (const c of clips) {
    const lib = c.library || {}, hit = rigs.filter((r) => typeof lib[r] === 'string' && lib[r]);
    hit.forEach((r) => files.add(lib[r]));
    if (!hit.length) unresolved.push(c.id);
  }
  if (unresolved.length) errors.push(unresolved.length + ' rows without a library path');
  const groups = {}; for (const c of clips) groups[c.group] = (groups[c.group] || 0) + 1;
  const bothRigs = clips.filter((c) => rigs.every((r) => c.library && c.library[r])).length;
  return { ok: !errors.length, errors, rows: ids.length, unique, groups, files: [...files].sort(), bothRigs, unresolved };
}

export async function sha256Hex(data) {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function deepFreeze(o) { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]); } return o; }
const clone = (o) => JSON.parse(JSON.stringify(o));

export function emptyPatch(meta) {
  return { schema: SCHEMA, catalog: { schema: meta.schema, version: meta.version, sourcePath: meta.sourcePath, pin: meta.pin, contentHash: meta.contentHash },
    characterProfiles: {}, motions: {} };
}

/* Import: keep what is editorial, drop what is a source fact, keep unknown ids (a later manifest may publish them). */
export function normalizePatch(obj, cat, meta) {
  const warnings = [], dropped = [], orphans = [];
  if (!obj || obj.schema !== SCHEMA) throw new Error('not a ' + SCHEMA + ' file (schema ' + (obj && obj.schema) + ')');
  const known = new Set(cat.clips.map((c) => c.id)), p = emptyPatch(meta);
  if (obj.catalog && obj.catalog.contentHash && meta.contentHash && obj.catalog.contentHash !== meta.contentHash && obj.catalog.contentHash !== 'RESOLVE_AT_IMPORT')
    warnings.push('patch was written against catalog ' + String(obj.catalog.contentHash).slice(0, 12) + ' · loaded ' + meta.contentHash.slice(0, 12) + ' · records keyed by id still apply');
  for (const [id, rec] of Object.entries(obj.motions || {})) {
    const r = {};
    for (const [k, v] of Object.entries(rec || {})) { if (EDITABLE.includes(k)) r[k] = clone(v); else { dropped.push(id + '.' + k); } }
    if (r.tags && !Array.isArray(r.tags)) r.tags = String(r.tags).split(/[,\s]+/).filter(Boolean);
    p.motions[id] = r; if (!known.has(id)) orphans.push(id);
  }
  for (const [aid, prof] of Object.entries(obj.characterProfiles || {})) {
    p.characterProfiles[aid] = { ...clone(prof), actorId: prof.actorId || aid, rigFamily: prof.rigFamily || null, renderPreset: prof.renderPreset || null,
      compatibility: prof.compatibility || 'UNVERIFIED', assignments: clone(prof.assignments || {}), fallbacks: clone(prof.fallbacks || {}) };
    for (const [role, id] of Object.entries(p.characterProfiles[aid].assignments)) if (id && !known.has(id)) orphans.push(aid + ' · ' + role + ' → ' + id);
  }
  if (dropped.length) warnings.push('dropped ' + dropped.length + ' immutable/unknown field(s): ' + dropped.slice(0, 6).join(', ') + (dropped.length > 6 ? '…' : ''));
  if (orphans.length) warnings.push(orphans.length + ' record(s) for ids not in this catalog · kept, not shown as cards');
  return { patch: p, warnings, dropped, orphans };
}

/* Only non-empty editorial records travel. */
export function exportPatch(patch) {
  const out = clone(patch);
  for (const [id, r] of Object.entries(out.motions)) {
    if (r.tags && !r.tags.length) delete r.tags;
    if (r.preview && r.preview.posterFrame == null) delete r.preview;
    if (r.actorVerdicts && !Object.keys(r.actorVerdicts).length) delete r.actorVerdicts;
    if (r.displayName === '') delete r.displayName; if (r.notes === '') delete r.notes; if (r.cluster === '') delete r.cluster;
    if (!Object.keys(r).length) delete out.motions[id];
  }
  out.exportedAt = new Date().toISOString();
  return out;
}

/* The editorial state compared in the roundtrip (exportedAt excluded). */
export function editorialFingerprint(patch) { const c = exportPatch(patch); delete c.exportedAt; return JSON.stringify(c, Object.keys(flatKeys(c)).sort()); }
function flatKeys(o, acc = {}) { if (o && typeof o === 'object') for (const k of Object.keys(o)) { acc[k] = 1; flatKeys(o[k], acc); } return acc; }

export function displayName(clip, patch) { const r = patch && patch.motions[clip.id]; return (r && r.displayName) || clip.label_de || clip.id; }
export function isExported(clip, patch) { const r = patch && patch.motions[clip.id]; return !(r && r.exportEnabled === false); }
export function tagsOf(clip, patch) { const r = patch && patch.motions[clip.id]; return (r && r.tags) || []; }

/* Gates: facts from the catalog that change how a clip may be used. Text is shown as-is in the UI. */
export function gates(clip, all) {
  const g = [], rel = clip.events && clip.events.release, paired = clip.pairedWith;
  if (/needs a seat|seated/i.test(clip.notes || '') || /sitz/i.test(clip.label_de || ''))
    g.push({ k: 'seat', chip: 'SEAT', label: 'SEAT REQUIRED', level: 'warn', text: 'Needs a seat · the pelvis stays at seat height. No seat on this stage: preview shows the pose floating at seat height.' });
  if (paired) {
    const partner = all ? all.find((c) => c.id === paired) : null;
    g.push({ k: 'paired', chip: 'PAIR', label: 'PAIRED · 2-ACTOR', level: 'warn', partner: paired, partnerLabel: partner ? partner.label_de : paired,
      text: 'Two-person grapple, not a prop throw. Play both clips in sync, aligned by root. This preview shows one half.' });
  }
  if (rel && !paired)
    g.push({ k: 'release', chip: 'REL f' + rel.frame, label: 'RUNTIME CONFIRMATION REQUIRED', level: 'warn', frame: rel.frame, hand: rel.hand,
      text: 'Release candidate frame ' + rel.frame + ' on ' + rel.hand + ' (' + (rel.hand === 'hand.l' ? 'left' : 'right') + ' hand) · peak hand speed, Rig_Medium bake. Candidate only.' });
  if (rel && paired)
    g.push({ k: 'release-ignored', chip: '', label: 'NO PROP RELEASE', level: 'info', text: 'Catalog measured a hand-speed peak at f' + rel.frame + ' (' + rel.hand + '). This is a grapple: not used as a prop release marker.' });
  const oneShot = gameplayOnce(clip);
  if (oneShot && clip.loop) g.push({ k: 'loop', chip: 'ONCE', label: 'SOURCE LOOP ≠ GAMEPLAY LOOP', level: 'info', text: 'Source loop: true only means first and last pose match (Δ ' + clip.loopPoseDiffDeg + '°). Gameplay plays this once.' });
  if (clip.duplicateOf) g.push({ k: 'dup', chip: 'DUP', label: 'DUPLICATE OF ' + clip.duplicateOf, level: 'info', text: 'Catalog marks this as a duplicate of ' + clip.duplicateOf + '.' });
  return g;
}
export function gameplayOnce(clip) {
  if (clip.pairedWith) return true;
  if (clip.group === 'throw' && clip.events && clip.events.release) return true;
  if (!clip.loop) return true;
  const t = clip.travelMetersPerCycle && clip.travelMetersPerCycle.Rig_Medium;
  return clip.group === 'throw' && t > 1;
}

export function searchText(clip, patch) {
  const r = (patch && patch.motions[clip.id]) || {};
  return [clip.id, clip.label_de, clip.group, GROUP_LABEL[clip.group], r.displayName, (r.tags || []).join(' '), r.cluster, r.notes, clip.sourcePack, clip.notes, clip.intake ? 'intake' + clip.intake : '']
    .filter(Boolean).join(' ').toLowerCase();
}

export function contactsAt(clip, rig, frame) {
  const f = clip.contacts && clip.contacts[rig] && clip.contacts[rig].feet; if (!f) return null;
  const on = (iv) => (iv || []).some(([a, b]) => frame >= a && frame <= b);
  return { l: on(f['foot.l']), r: on(f['foot.r']) };
}

/* ---------- local intake (Drop Zone) ---------- */
const norm = (n) => String(n || '').replace(/^mixamorig[:_]?/i, '').replace(/^.*:/, '').toLowerCase();
export function sideOf(n) {
  const s = norm(n); if (/left/.test(s)) return 'L'; if (/right/.test(s)) return 'R';
  const m = s.match(/(upper_?arm|lower_?arm|fore_?arm|arm|hand|wrist|shoulder|upper_?leg|lower_?leg|leg|foot|toe|thigh|shin)[._\s]?([lr])$/) || s.match(/[._\s]([lr])$/);
  return m ? (m[m.length - 1] === 'l' ? 'L' : 'R') : null;
}   // three.js sanitizes 'hand.l' to 'handl', so the separator is optional
export function boneRole(n) {
  const s = norm(n).replace(/left|right/, '').replace(/[._\s]?[lr]$/, '');
  if (/^(upper_?arm|arm)$/.test(s)) return 'upperArm';
  if (/^(lower_?arm|fore_?arm)$/.test(s)) return 'lowerArm';
  if (/^(wrist|hand)$/.test(s)) return 'wrist';
  if (/^(hips|pelvis)$/.test(s)) return 'hips';
  if (s === 'root') return 'root';
  return null;
}
export function boneMap(root) {
  const m = {}; root.traverse((o) => { if (!o.isBone) return; const r = boneRole(o.name); if (!r) return; const side = sideOf(o.name);
    const k = r + (side && r !== 'hips' && r !== 'root' ? side : ''); if (!m[k] || (r === 'wrist' && /wrist/i.test(o.name))) m[k] = o; });
  return m;
}
export function inspectLocal(THREE, obj, animations) {
  const bones = []; obj.traverse((o) => { if (o.isBone) bones.push(o.name); });
  const meshes = []; obj.traverse((o) => { if (o.isSkinnedMesh || o.isMesh) meshes.push(o.name); });
  const clips = animations.map((c) => {
    let dtMin = Infinity; for (const t of c.tracks) for (let i = 1; i < Math.min(t.times.length, 60); i++) { const d = t.times[i] - t.times[i - 1]; if (d > 1e-5 && d < dtMin) dtMin = d; }
    const fps = Number.isFinite(dtMin) ? Math.round(1 / dtMin) : null;
    const hipT = c.tracks.find((t) => /\.position$/.test(t.name) && /hips|pelvis|root/i.test(t.name));
    let travel = 0; if (hipT && hipT.values.length >= 6) { const v = hipT.values, n = v.length / 3; travel = Math.hypot(v[(n - 1) * 3] - v[0], v[(n - 1) * 3 + 2] - v[2]); }
    return { name: c.name, duration: +c.duration.toFixed(3), tracks: c.tracks.length, fps, frames: fps ? Math.round(c.duration * fps) + 1 : null, rootTravelRaw: +travel.toFixed(3) };
  });
  return { bones, boneCount: bones.length, meshCount: meshes.length, clips };
}
/* Rig family guess from bone names; compatibility itself is only the measured track binding on the actor. */
export function guessRig(bones) {
  const n = bones.map(norm);
  if (n.some((b) => /^upper_?arm[._]?l$/.test(b)) && n.includes('hips')) return 'KayKit-style (Rig_Medium / Rig_Large names)';
  if (n.some((b) => /^leftarm$/.test(b))) return 'Mixamo standard (mixamorig names)';
  return 'unknown';
}

export const FIT_FIELDS = [
  ['shoulderAbductionDeg', 'Arm spacing · shoulder', -30, 30, 1, true],
  ['upperArmTwistDeg', 'Upper-arm twist', -45, 45, 1, true],
  ['forearmTwistDeg', 'Forearm twist', -45, 45, 1, true],
  ['wristBendDeg', 'Wrist bend', -40, 40, 1, true],
  ['wristTwistDeg', 'Wrist twist', -40, 40, 1, true],
];
export function emptyFit() {
  const f = { rootOffsetY: 0, facingDeg: 0, rootMode: 'measured-travel', previewSpeed: 1 };
  for (const [k] of FIT_FIELDS) f[k] = { left: 0, right: 0 };
  return f;
}
/* Additive per-bone offsets applied AFTER the mixer (preview only, never baked). Bone-local axes: Y along the bone (glTF/Blender). */
export function applyFit(THREE, map, fit, rest) {
  const q = new THREE.Quaternion(), ax = { X: new THREE.Vector3(1, 0, 0), Y: new THREE.Vector3(0, 1, 0), Z: new THREE.Vector3(0, 0, 1) }, D = Math.PI / 180;
  const rot = (b, axis, deg) => { if (b && deg) b.quaternion.multiply(q.setFromAxisAngle(ax[axis], deg * D)); };
  for (const [side, k] of [['L', 'left'], ['R', 'right']]) {
    const sg = side === 'L' ? 1 : -1;
    rot(map['upperArm' + side], 'Z', sg * fit.shoulderAbductionDeg[k]);
    rot(map['upperArm' + side], 'Y', fit.upperArmTwistDeg[k]);
    rot(map['lowerArm' + side], 'Y', fit.forearmTwistDeg[k]);
    rot(map['wrist' + side], 'X', fit.wristBendDeg[k]);
    rot(map['wrist' + side], 'Y', fit.wristTwistDeg[k]);
  }
  const h = map.hips || map.root;
  if (h && fit.rootOffsetY) h.position.y += fit.rootOffsetY;
  const r = map.root || map.hips;
  if (r && fit.facingDeg) r.quaternion.premultiply(q.setFromAxisAngle(ax.Y, fit.facingDeg * D));
  if (fit.rootMode === 'preview-in-place' && rest) for (const b of [map.root, map.hips]) if (b && rest[b.uuid]) { b.position.x = rest[b.uuid].x; b.position.z = rest[b.uuid].z; }
}
export function fitIsZero(fit) { return FIT_FIELDS.every(([k]) => !fit[k].left && !fit[k].right) && !fit.rootOffsetY && !fit.facingDeg && fit.rootMode !== 'preview-in-place'; }

export function intakeReceipt({ hash, proposedMotionId, displayName, rigGuess, compat, bound, total, fit, license, roles, tags, clipName, facts }) {
  return {
    schema: INTAKE_SCHEMA, status: 'LOCAL_PREVIEW_NOT_REGISTERED', createdAt: new Date().toISOString(),
    sourceHash: hash, hashAlgorithm: 'SHA-256 (browser, local file bytes)', originalFilename: 'PRIVATE_LOCAL_ONLY',
    selectedClip: clipName, proposedMotionId, displayName, detectedRigFamily: rigGuess,
    compatibility: compat, trackBinding: total ? bound + '/' + total + ' on the selected KFB actor' : 'not measured',
    facts, correctionPatch: fit, license: license || { declared: false, text: '' }, intendedRoles: roles || [], tags: tags || [],
    validation: [
      ['source hash computed locally', !!hash], ['clip chosen', !!clipName], ['immutable id proposed', /^kfb_[a-z0-9_]+$/.test(proposedMotionId || '')],
      ['compatibility measured on a KFB actor', compat === 'PROVEN'], ['license/source declared', !!(license && license.declared)],
      ['baked GLB + catalog entry by Blender MCP / deterministic lane', false], ['contact data + preview sheet', false], ['human review of sheet', false],
    ].map(([check, ok]) => ({ check, ok })),
    promotion: { requested: true, autoPublish: false, rawFbxIncluded: false, requiredOutputs: ['runtime-glb', 'catalog-entry', 'contact-data', 'preview-sheet'], owner: 'Blender MCP / Motion Library pipeline' },
  };
}
