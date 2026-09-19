const WIDTH_DEFAULTS = Object.freeze({
  motorway: 12, trunk: 11, primary: 10, secondary: 9, tertiary: 8,
  unclassified: 6.5, residential: 6, living_street: 5, service: 4,
  pedestrian: 5, cycleway: 2.5, footway: 1.8, path: 1.6, track: 3.5,
  steps: 1.8
});

const NON_DRIVE = new Set(['footway', 'cycleway', 'path', 'steps', 'pedestrian', 'corridor']);

export function parseNumber(value) {
  if (value == null) return null;
  const first = String(value).trim().replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return first ? Number(first[0]) : null;
}

export function roadWidthM(tags = {}) {
  const explicit = parseNumber(tags.width);
  if (explicit && explicit > 0.5 && explicit < 80) return explicit;
  const lanes = parseNumber(tags.lanes);
  if (lanes && lanes > 0 && lanes < 16 && !NON_DRIVE.has(tags.highway)) {
    return Math.max(WIDTH_DEFAULTS[tags.highway] || 5, lanes * 3.1);
  }
  return WIDTH_DEFAULTS[tags.highway] || 4.5;
}

export function roadClass(tags = {}) {
  return tags.highway || 'unknown';
}

export function isDriveable(tags = {}) {
  if (!tags.highway || NON_DRIVE.has(tags.highway)) return false;
  if (tags.motor_vehicle === 'no' || tags.vehicle === 'no') return false;
  return true;
}

export function sidewalkPolicy(tags = {}) {
  const s = tags.sidewalk;
  if (s === 'no' || s === 'none' || s === 'separate') return { left: false, right: false, source: s || 'none' };
  if (s === 'left') return { left: true, right: false, source: 'tag' };
  if (s === 'right') return { left: false, right: true, source: 'tag' };
  if (s === 'both' || tags.highway === 'residential' || tags.highway === 'living_street' ||
      ['primary','secondary','tertiary','unclassified'].includes(tags.highway)) {
    return { left: true, right: true, source: s ? 'tag' : 'class-default' };
  }
  return { left: false, right: false, source: 'none' };
}

export function buildingHeight(tags = {}, stable01 = 0.5) {
  const explicit = parseNumber(tags.height);
  if (explicit && explicit > 1 && explicit < 500) return { heightM: explicit, source: 'height' };
  const levels = parseNumber(tags['building:levels']);
  if (levels && levels > 0 && levels < 100) return { heightM: +(levels * 3.1).toFixed(2), source: 'levels*3.1' };
  const kind = tags.building || 'yes';
  if (['garage','garages','shed','hut'].includes(kind)) return { heightM: 3.2, source: 'class-default' };
  if (['industrial','warehouse'].includes(kind)) return { heightM: +(7.5 + stable01 * 3).toFixed(2), source: 'class-seeded' };
  if (['commercial','retail'].includes(kind)) return { heightM: +(10.5 + stable01 * 4).toFixed(2), source: 'class-seeded' };
  return { heightM: +(9.3 + stable01 * 5.2).toFixed(2), source: 'fallback-seeded' };
}

export function classifySurface(tags = {}) {
  if (tags.natural === 'water' || tags.water || tags.waterway === 'riverbank') return 'water';
  if (tags.leisure === 'park' || tags.leisure === 'garden' ||
      ['grass','meadow','forest','recreation_ground','village_green'].includes(tags.landuse) ||
      ['wood','scrub','grassland'].includes(tags.natural)) return 'green';
  if (tags.landuse === 'industrial' || tags.landuse === 'commercial') return 'urban-landuse';
  return 'other-landuse';
}

export function buildingMaterialClass(tags = {}, h = 0) {
  const kind = tags.building || '';
  if (['industrial','warehouse','garages'].includes(kind)) return 'building-industrial';
  if (['commercial','retail','office'].includes(kind)) return h % 2 ? 'building-warm' : 'building-pale';
  return h % 3 === 0 ? 'building-warm' : 'building-pale';
}
