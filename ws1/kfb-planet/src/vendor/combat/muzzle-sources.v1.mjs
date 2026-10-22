/** Private source references only. No asset payloads or public fetch URLs. */
const folder = '6 - December 2023 - Action Figure/assets/gltf/';
export const MUZZLE_SOURCES = Object.freeze({
  primary: Object.freeze({
    ref: `private:kaykit/${folder}Muzzleflash.gltf`,
    sha256: '6f772ef7fd26f35abe5cac844e31defdbe12e54c1feca463fee53b5408bc05cd',
    private: true, asIs: true
  }),
  secondary: Object.freeze({
    ref: `private:kaykit/${folder}Muzzleflash_Long.gltf`,
    sha256: 'b8232b68245ccc2261f22d8f9172b142bd5fc6b49cec7a1fe1b8396aac0616e8',
    private: true, asIs: true
  })
});
export const muzzleSourceFields = () => ({
  primary: { ...MUZZLE_SOURCES.primary }, secondary: { ...MUZZLE_SOURCES.secondary }, variants: []
});
const only = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).every(k => keys.includes(k));
/** Checks the R2 effects extension; physical axis/release stays in weapon-profile. */
export function auditMuzzleEffects(m) {
  const issues = [];
  if (m?.node !== 'KFB_Muzzle') issues.push('MUZZLE_FX_ANCHOR_REQUIRED');
  for (const slot of ['primary', 'secondary']) {
    const d = m?.[slot], source = MUZZLE_SOURCES[slot];
    if (!only(d, ['ref', 'sha256', 'private', 'asIs']) ||
        Object.entries(source).some(([k, v]) => d[k] !== v)) issues.push(`MUZZLE_${slot.toUpperCase()}_SOURCE_REQUIRED`);
  }
  if (!Array.isArray(m?.variants)) issues.push('MUZZLE_VARIANTS_ARRAY_REQUIRED');
  else {
    const ids = new Set();
    for (const v of m.variants) {
      const valid = only(v, ['id', 'source', 'color', 'vfx']) &&
        typeof v.id === 'string' && /^[a-z][a-z0-9_-]{0,63}$/.test(v.id) && !ids.has(v.id) &&
        ['primary', 'secondary'].includes(v.source) &&
        (v.color === undefined || /^#[0-9a-f]{6}$/i.test(v.color)) &&
        (v.vfx === undefined || (only(v.vfx, ['durationSeconds']) &&
          Number.isFinite(v.vfx.durationSeconds) && v.vfx.durationSeconds > 0 && v.vfx.durationSeconds <= 0.25));
      if (!valid) issues.push('MUZZLE_VARIANT_COLOR_OR_VFX_ONLY');
      if (v && typeof v === 'object') ids.add(v.id);
    }
  }
  return issues;
}
