// AN-PROFILE-01 · read-only motion profile accessor.
// This module does not create mixers, own animation state, move actors or infer unknown markers.

export const MOTION_PROFILE_SCHEMA = 'kfb.motion-profile-catalog/1.0';
export const MOTION_PROFILE_FILE = './KFB_Motion_Library.profile-catalog.v1.json';

export function validateMotionProfileCatalog(data) {
  const errors = [];
  if (!data || typeof data !== 'object') errors.push('catalog must be an object');
  if (data?.schema !== MOTION_PROFILE_SCHEMA) errors.push(`schema must be ${MOTION_PROFILE_SCHEMA}`);
  if (!Number.isInteger(data?.clipCount) || data.clipCount < 1) errors.push('clipCount must be a positive integer');
  const profiles = data?.clipProfiles;
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) errors.push('clipProfiles must be an object');
  if (profiles && Object.keys(profiles).length !== data.clipCount) errors.push('clipCount must equal clipProfiles size');
  return { ok: errors.length === 0, errors };
}

export function getClipProfile(data, clipId) {
  if (!clipId) return null;
  return data?.clipProfiles?.[clipId] ?? null;
}

export function getReferenceSpeedMps(profile, rigFamily) {
  const ref = profile?.rootTravel?.referenceSpeed;
  if (ref?.status !== 'MEASURED_DERIVED') return null;
  const value = ref?.metersPerSecond?.[rigFamily];
  return Number.isFinite(value) ? value : null;
}

export function getPlantedIntervals(profile, rigFamily, foot) {
  const planted = profile?.plantedIntervals?.[rigFamily];
  if (!planted || planted.status === 'UNKNOWN_NOT_MEASURED') return null;
  const intervals = planted?.feet?.[foot];
  return Array.isArray(intervals) ? intervals : null;
}

export function getActionMarkers(profile) {
  const markers = profile?.actionMarkers?.markers;
  return Array.isArray(markers) ? markers : [];
}

export function hasMeasuredActionMarker(profile, name) {
  return getActionMarkers(profile).some(marker => marker?.name === name && marker?.status === 'CATALOGUE_EXPLICIT');
}

export function getKayKitReferenceProfile(data, rigFamily) {
  const refs = data?.referenceProfiles;
  if (!refs || refs.scope !== 'REFERENCE_ONLY_KAYKIT_STOCK_CLIPS_NOT_AUTOMATICALLY_APPLIED_TO_KFB_MOTION_LIBRARY') return null;
  return refs?.[rigFamily] ?? null;
}

export async function loadMotionProfileCatalog(url = new URL(MOTION_PROFILE_FILE, import.meta.url), fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new Error('fetch implementation required');
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`motion profile catalogue fetch failed: ${response.status}`);
  const data = await response.json();
  const check = validateMotionProfileCatalog(data);
  if (!check.ok) throw new Error(`invalid motion profile catalogue: ${check.errors.join('; ')}`);
  return data;
}
