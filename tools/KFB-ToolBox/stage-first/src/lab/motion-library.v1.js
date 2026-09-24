/* AN-PROFILE-02 · shared KFB Motion Library source adapter.
   Read-only bridge into the existing Animation Lab v3 / ToolBox Animation Studio.
   It pins AN-PROFILE-01 + Motion Library 01 by immutable commit and creates no mixer,
   movement owner, copied catalogue, persistence schema or inferred marker. */

export const SOURCE_REPO = 'georg-doc/kayfabizarro';
export const SOURCE_REVISION = '032c9d50cd5de6764fa37fec65cb203ed35fcb11';
export const SOURCE_PR = 206;
export const MOTION_LIBRARY_PR = 197;
export const CATALOG_SCHEMA = 'kfb.motion-catalog.v1';
export const PROFILE_SCHEMA = 'kfb.motion-profile-catalog/1.0';
export const PROFILE_FAMILY_PREFIX = 'motion:';
export const ROOT = 'media/3D_Assets/Animations/KFB_Motion_Library/';
export const BASE = 'https://cdn.jsdelivr.net/gh/' + SOURCE_REPO + '@' + SOURCE_REVISION + '/' + ROOT;

const file = (name) => BASE + name;
export const SOURCE = Object.freeze({
  repo: SOURCE_REPO,
  revision: SOURCE_REVISION,
  pr: SOURCE_PR,
  motionLibraryPr: MOTION_LIBRARY_PR,
  catalogue: file('KFB_Motion_Library.catalog.json'),
  profiles: file('KFB_Motion_Library.profile-catalog.v1.json'),
  reader: file('motion-profile-reader.v1.js'),
});

let promise = null;

async function json(url, fetchImpl) {
  const r = await fetchImpl(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' · ' + url.split('/').pop());
  return r.json();
}

function exactIdSet(catalogue, profiles) {
  const a = (catalogue.clips || []).map((c) => c.id).sort();
  const b = Object.keys(profiles.clipProfiles || {}).sort();
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export async function loadMotionLibrary(fetchImpl = globalThis.fetch) {
  if (promise) return promise;
  if (typeof fetchImpl !== 'function') throw new Error('fetch implementation required');
  promise = (async () => {
    const readerPromise = import(SOURCE.reader);
    const [catalogue, profiles, reader] = await Promise.all([
      json(SOURCE.catalogue, fetchImpl),
      json(SOURCE.profiles, fetchImpl),
      readerPromise,
    ]);
    if (catalogue.schema !== CATALOG_SCHEMA) throw new Error('wrong motion catalogue schema: ' + catalogue.schema);
    if ((catalogue.clips || []).length !== 33) throw new Error('expected 33 motion clips, got ' + ((catalogue.clips || []).length));
    const valid = reader.validateMotionProfileCatalog(profiles);
    if (!valid.ok) throw new Error('invalid motion profiles: ' + valid.errors.join('; '));
    if (profiles.schema !== PROFILE_SCHEMA) throw new Error('wrong profile schema: ' + profiles.schema);
    if (!exactIdSet(catalogue, profiles)) throw new Error('catalogue/profile clip ids differ');
    return Object.freeze({ catalogue, profiles, reader, source: SOURCE });
  })().catch((e) => { promise = null; throw e; });
  return promise;
}

export function rigKey(rig) {
  return 'Rig_' + (rig === 'Large' ? 'Large' : 'Medium');
}

export function libraryUrl(ctx, rig) {
  const name = ctx?.catalogue?.libraries?.[rigKey(rig)];
  if (!name) throw new Error('no KFB Motion Library for ' + rigKey(rig));
  return file(name);
}

export function profileOf(ctx, clipId) {
  return ctx?.reader?.getClipProfile(ctx.profiles, clipId) || null;
}

export function referenceSpeed(ctx, clipId, rig) {
  const p = profileOf(ctx, clipId);
  return p ? ctx.reader.getReferenceSpeedMps(p, rigKey(rig)) : null;
}

export function actionMarkers(ctx, clipId) {
  const p = profileOf(ctx, clipId);
  return p ? ctx.reader.getActionMarkers(p) : [];
}

export function semanticFamily(ctx, clipId) {
  return profileOf(ctx, clipId)?.semantics?.stateFamily || 'unknown';
}

export function filterFamily(ctx, clipId) {
  return PROFILE_FAMILY_PREFIX + semanticFamily(ctx, clipId);
}

export function semanticFamilies(ctx) {
  const out = new Map();
  for (const c of (ctx?.catalogue?.clips || [])) {
    const id = filterFamily(ctx, c.id);
    if (!out.has(id)) out.set(id, semanticFamily(ctx, c.id));
  }
  return [...out].map(([id, label]) => ({ id, label: 'Motion · ' + label }));
}

export function plantedSummary(ctx, clipId, rig) {
  const p = profileOf(ctx, clipId);
  const rk = rigKey(rig);
  if (!p) return 'unknown';
  const planted = p.plantedIntervals?.[rk];
  if (!planted || planted.status === 'UNKNOWN_NOT_MEASURED') return 'unknown · ' + (planted?.status || 'NOT_MEASURED');
  const feet = planted.feet || {};
  const l = Array.isArray(feet['foot.l']) ? feet['foot.l'].length : 0;
  const r = Array.isArray(feet['foot.r']) ? feet['foot.r'].length : 0;
  return 'measured · L ' + l + ' / R ' + r + ' planted interval' + ((l + r) === 1 ? '' : 's');
}
