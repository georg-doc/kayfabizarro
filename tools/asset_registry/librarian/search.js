import { $, state } from './state.js';
import { ensureCatalog, ensureRigFacts, ensureProblems } from './registry.js';
import { classifyAsset, primaryRepresentations, representationPriority } from './asset-types.js';

function checkedValues(id) {
  const host=$(id);
  return host ? [...host.querySelectorAll('input[type="checkbox"]:checked')].map((input)=>input.value) : [];
}
export function readFilters() {
  return {
    query: $('searchInput').value.trim(), kind: $('kindFilter').value, pack: $('packFilter').value,
    collection: $('collectionFilter').value, formats: checkedValues('formatFilterOptions'), types: checkedValues('typeFilterOptions'),
    dependencyStatus: $('dependencyFilter').value, problemType: $('problemFilter').value,
    rigged: $('rigFilter').value, animated: $('animatedFilter').value,
    clip: $('clipFilter').value.trim(), joint: $('jointFilter').value.trim(), browseMode: state.browseMode,
  };
}
function rank(record, query) {
  if (!query) return 9;
  const q = query.toLowerCase();
  const fields = [record.name, record.collectionPath, record.packId, record.path].map((value) => String(value || '').toLowerCase());
  if (fields[0] === q) return 0;
  if (fields[0].startsWith(q)) return 1;
  if (fields[0].includes(q)) return 2;
  for (let i = 1; i < fields.length; i += 1) if (fields[i].includes(q)) return i + 2;
  return null;
}
function formatPriority(record) {
  if (record.kind === 'model-3d') return representationPriority(record);
  if (record.kind === 'image-2d') return 10;
  if (record.kind === 'audio') return 11;
  return 12;
}
function tri(value, wanted) {
  if (!wanted) return true;
  if (wanted === 'yes') return value === true;
  if (wanted === 'no') return value === false;
  return value !== true && value !== false;
}
export function applyFilters(records, filters, visibleLimit=state.resultVisibleLimit) {
  const scored = [];
  for (const record of records) {
    if (filters.kind && record.kind !== filters.kind || filters.pack && record.packId !== filters.pack || filters.collection && record.collectionPath !== filters.collection || filters.formats.length && !filters.formats.includes(record.format) || filters.dependencyStatus && record.dependencyStatus !== filters.dependencyStatus) continue;
    const type=classifyAsset(record); record.assetType=type;
    if (filters.types.length && !filters.types.includes(type)) continue;
    if (filters.problemType) {
      const rows = state.problemsByAsset.get(record.assetId) || [];
      if (filters.problemType === 'any' ? !rows.length : !rows.some((problem) => problem.type === filters.problemType)) continue;
    }
    const rig = record.rigFacts || {};
    const parsed = rig.parseStatus === 'ok' || rig.parseStatus === 'not-applicable';
    if (!tri(parsed ? Boolean(rig.hasSkin) : null, filters.rigged) || !tri(rig.parseStatus === 'ok' ? (rig.animationCount || 0) > 0 : null, filters.animated)) continue;
    if (filters.clip && !(rig.animationClips || []).some((clip) => String(clip.name || '').toLowerCase().includes(filters.clip.toLowerCase()))) continue;
    if (filters.joint && !(rig.jointNames || []).some((name) => String(name).toLowerCase().includes(filters.joint.toLowerCase()))) continue;
    const textRank = rank(record, filters.query);
    if (textRank == null) continue;
    scored.push([textRank, formatPriority(record), record]);
  }
  scored.sort((a, b) => a[0] - b[0] || a[1] - b[1] || String(a[2].name).localeCompare(String(b[2].name)) || a[2].path.localeCompare(b[2].path));
  const rawRows=scored.map((entry)=>entry[2]);
  const includeAnimationSources=filters.types.includes('animation-source');
  const displayRows=filters.browseMode==='all' ? rawRows : primaryRepresentations(rawRows,{includeAnimationSources});
  return { rawTotal:rawRows.length, total:displayRows.length, rows:displayRows.slice(0,visibleLimit), allRows:displayRows };
}
export async function searchRegistry() {
  const filters = readFilters();
  const catalog = await ensureCatalog();
  if (filters.rigged || filters.animated || filters.clip || filters.joint || filters.types.length) await ensureRigFacts();
  if (filters.problemType) await ensureProblems();
  return applyFilters(catalog, filters, state.resultVisibleLimit);
}
